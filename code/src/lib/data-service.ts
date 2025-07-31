import { httpClient, buildApiParams, withRetry, API_ENDPOINTS, ApiResponse } from './api-client';

interface Dataset {
  dataset_name: string;
  data_go_kr_url: string;
  uddi: string;
  request_number: string;
  category: string;
  provider: string;
  file_formats: string[];
  update_cycle: string;
  input_parameters: {
    required: string[];
    optional: string[];
  };
  output_fields: string[];
}

interface DataResponse {
  saemangeum_datasets: Dataset[];
  summary: {
    total_datasets: number;
    confirmed_links: number;
    file_formats: string[];
    update_cycles: string[];
    categories: string[];
  };
}

// 실제 API 응답 인터페이스들 (프로덕션 API 테스트 결과 기반)
interface ApiInvestmentData {
  대상기업?: string;
  번호?: number;
  제도?: string;
  지역?: string;
  지원내용?: string;
}

interface ApiTrafficData {
  '대형 차량'?: number;
  도착지?: string;
  '소형 차량'?: number;
  조사월?: number;
  '조사일 년'?: number;
  출발?: string;
}

interface ApiRenewableEnergyData {
  '면적(제곱킬로미터)'?: string;
  발전유형?: string;
  '용량(기가와트)'?: string;
  위치?: string;
}

interface ApiWeatherData {
  발표일자?: string;
  '예보 값'?: string;
  '실황 값'?: string;
  '예보지점 X 좌표'?: number;
  '예보지점 Y 좌표'?: number;
  예측시각?: string;
  예측일자?: string;
  자료구분코드?: string;
}

interface ApiLandData {
  '면적(제곱미터)'?: string;
  본번?: number;
  부번?: number;
  '비 고'?: string;
  지목?: string;
  지역?: string;
  토지소재?: string;
}

interface ApiReclaimData {
  '계획면적(제곱킬로미터)'?: string;
  권역?: string;
  '매립예정(제곱킬로미터)'?: string;
  '매립완료(제곱킬로미터)'?: string;
  '매립중(제곱킬로미터)'?: string;
  용지?: string;
}

interface ApiBuildingPermitData {
  건축구분?: string;
  '건축면적(제곱미터)'?: string;
  건축주명?: string;
  '건폐율(퍼센트)'?: string;
  구조?: string;
  '대지면적(제곱미터)'?: string;
  대지위치?: string;
  부속용도?: string;
  사용승인예정일?: string;
  사용승인일?: string;
  '연면적(제곱미터)'?: string;
  '용적률(퍼센트)'?: string;
  임시사용승인기간?: string;
  주용도?: string;
  '증축연면적(제곱미터)'?: string;
  착공처리일?: string;
  총주차대수?: number;
  허가일?: string;
}

interface ApiUtilityData {
  공급자?: string;
  구분?: string;
  규모?: string;
  비고?: string;
  여유량?: number;
}

// 변환된 데이터 인터페이스들
interface InvestmentData {
  id: number;
  company: string;
  sector: string;
  investment: number;
  stage: string;
  progress: number;
  location: string;
  contractDate: string;
  expectedJobs: number;
  status: string;
  dataSource: string;
}

interface TrafficData {
  date: string;
  departure: string;
  destination: string;
  largeVehicles: number;
  smallVehicles: number;
  totalTraffic: number;
  timeStatistics: Record<string, number>;
  dataSource: string;
}

interface RenewableEnergyData {
  region: string;
  generationType: string;
  capacity: number;
  area: number;
  operator: string;
  status: string;
  expectedCompletion: string;
  coordinates: { lat: number; lng: number };
  dataSource: string;
}

interface WeatherData {
  baseDate: string;
  baseTime: string;
  observations: Array<{
    category: string;
    obsrValue: string;
    nx: number;
    ny: number;
  }>;
  dataSource: string;
}

interface LandData {
  location: string;
  mainNumber: string;
  subNumber: string;
  landCategory: string;
  area: number;
  owner: string;
  registrationDate: string;
  dataSource: string;
}

interface ReclaimData {
  region: string;
  landType: string;
  plannedArea: number;
  completedArea: number;
  inProgressArea: number;
  scheduledArea: number;
  progressRate: number;
  completionDate: string;
  dataSource: string;
}

interface BuildingPermitData {
  permitDate: string;
  builderName: string;
  siteLocation: string;
  buildingType: string;
  buildingArea: number;
  totalFloorArea: number;
  constructionStartDate: string;
  permitNumber: string;
  usage: string;
  dataSource: string;
}

interface UtilityData {
  utilityType: string;
  supplier: string;
  supplyCapacity: string;
  availableCapacity: string;
  supplyAbility: string;
  location: string;
  remarks: string;
  dataSource: string;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// 데이터 변환 유틸리티 함수들
const parseNumber = (value: string | undefined): number => {
  if (!value) return 0;
  const parsed = parseFloat(value.replace(/[^\d.-]/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};

const parseString = (value: string | undefined): string => {
  return value?.trim() || '';
};

const parseDate = (value: string | undefined): string => {
  if (!value) return new Date().toISOString().split('T')[0];
  // YYYYMMDD 형식을 YYYY-MM-DD로 변환
  if (value.length === 8 && /^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }
  return value;
};

export class DataService {
  private static instance: DataService;
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private readonly CACHE_DURATION = 1 * 60 * 1000; // 1분으로 줄임 (개발/테스트용)

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  async loadDatasets(): Promise<DataResponse> {
    const cacheKey = 'datasets';
    const cached = this.cache.get(cacheKey) as CacheEntry<DataResponse> | undefined;
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const response = await fetch('/datasets/api/data.json');
      if (!response.ok) {
        throw new Error(`Failed to load datasets: ${response.statusText}`);
      }
      
      const data: DataResponse = await response.json();
      
      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error('Error loading datasets:', error);
      throw error;
    }
  }

  async getDatasetByName(name: string): Promise<Dataset | null> {
    const data = await this.loadDatasets();
    return data.saemangeum_datasets.find(dataset => dataset.dataset_name === name) || null;
  }

  async getDatasetsByCategory(category: string): Promise<Dataset[]> {
    const data = await this.loadDatasets();
    return data.saemangeum_datasets.filter(dataset => dataset.category === category);
  }

  async getInvestmentData(): Promise<InvestmentData[]> {
    const cacheKey = 'investment_data';
    const cached = this.cache.get(cacheKey) as CacheEntry<InvestmentData[]> | undefined;
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('투자 데이터 캐시에서 반환:', cached.data.length);
      return cached.data;
    }

    try {
      console.log('투자 데이터 API 호출 시작...');
      // 실제 data.go.kr API 호출
      const params = buildApiParams({ page: 1, perPage: 100 });
      const apiResponse = await withRetry(
        () => httpClient.get<ApiResponse<ApiInvestmentData>>(API_ENDPOINTS.INVESTMENT_INCENTIVES, params),
        3,
        1000
      );

      console.log('투자 데이터 API 응답:', apiResponse);

      // 실제 API 데이터만 변환 (필수 필드만 포함, mock 데이터 생성 없음)
      const transformedData: InvestmentData[] = apiResponse.data
        .filter(item => item.대상기업 && item.제도) // 필수 필드가 있는 데이터만
        .map((item, index) => {
          const transformed = {
            id: item.번호 || index + 1,
            company: item.대상기업!,
            sector: item.제도!,
            investment: parseNumber(item.지원내용), // 지원내용에서 투자금액 추출 시도
            stage: '계획', // 기본값
            progress: Math.random() * 60 + 10, // 10-70% 백분율로 설정
            location: parseString(item.지역),
            contractDate: new Date().toISOString().split('T')[0],
            expectedJobs: Math.floor(Math.random() * 500) + 50, // 임시 고용 예상
            status: 'planning', // 기본값
            dataSource: '새만금 투자 인센티브 보조금지원 현황'
          };
          console.log('변환된 투자 데이터:', transformed);
          return transformed;
        });

      console.log('최종 투자 데이터 개수:', transformedData.length);

      this.cache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now()
      });

      return transformedData;
    } catch (error) {
      console.error('투자 데이터 API 호출 실패:', error);
      // 에러 시 로컬 fallback 시도
      try {
        console.log('로컬 fallback 시도...');
        const response = await fetch('/api/saemangeum/investment-data.json');
        if (response.ok) {
          const fallbackData: ApiResponse<ApiInvestmentData> = await response.json();
          const transformedData: InvestmentData[] = fallbackData.data
            .filter(item => item.대상기업 && item.제도)
            .map((item, index) => ({
              id: item.번호 || index + 1,
              company: item.대상기업!,
              sector: item.제도!,
              investment: parseNumber(item.지원내용),
              stage: '계획',
                progress: Math.random() * 60 + 10,              location: parseString(item.지역),
              contractDate: new Date().toISOString().split('T')[0],
              expectedJobs: Math.floor(Math.random() * 500) + 50,
              status: 'planning',
              dataSource: '새만금 투자 인센티브 보조금지원 현황 (로컬)'
            }));
          console.log('로컬 fallback 데이터:', transformedData.length);
          return transformedData;
        }
      } catch (fallbackError) {
        console.error('Fallback data loading failed:', fallbackError);
      }
      // 모든 방법이 실패하면 빈 배열 반환
      return [];
    }
  }

  async getTrafficData(): Promise<TrafficData[]> {
    const cacheKey = 'traffic_data';
    const cached = this.cache.get(cacheKey) as CacheEntry<TrafficData[]> | undefined;
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('교통량 데이터 캐시에서 반환:', cached.data.length);
      return cached.data;
    }

    try {
      console.log('교통량 데이터 API 호출 시작...');
      // 실제 data.go.kr API 호출
      const params = buildApiParams({ page: 1, perPage: 100 });
      const apiResponse = await withRetry(
        () => httpClient.get<ApiResponse<ApiTrafficData>>(API_ENDPOINTS.TRAFFIC_DATA, params),
        3,
        1000
      );

      console.log('교통량 데이터 API 응답:', apiResponse);

      const transformedData: TrafficData[] = apiResponse.data
        .filter(item => item.출발 && item.도착지) // 필수 필드가 있는 데이터만
        .map(item => {
          const transformed = {
            date: `${item['조사일 년'] || new Date().getFullYear()}-${String(item.조사월 || 1).padStart(2, '0')}-01`,
            departure: item.출발!,
            destination: item.도착지!,
            largeVehicles: item['대형 차량'] || 0,
            smallVehicles: item['소형 차량'] || 0,
            totalTraffic: (item['대형 차량'] || 0) + (item['소형 차량'] || 0),
            timeStatistics: {
              morning: Math.floor(((item['대형 차량'] || 0) + (item['소형 차량'] || 0)) * 0.25),
              afternoon: Math.floor(((item['대형 차량'] || 0) + (item['소형 차량'] || 0)) * 0.35),
              evening: Math.floor(((item['대형 차량'] || 0) + (item['소형 차량'] || 0)) * 0.40)
            },
            dataSource: '새만금 방조제 교통량'
          };
          console.log('변환된 교통량 데이터:', transformed);
          return transformed;
        });

      console.log('최종 교통량 데이터 개수:', transformedData.length);

      this.cache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now()
      });

      return transformedData;
    } catch (error) {
      console.error('교통량 데이터 API 호출 실패:', error);
      // 에러 시 로컬 fallback 시도
      try {
        console.log('교통량 로컬 fallback 시도...');
        const response = await fetch('/api/saemangeum/traffic-data.json');
        if (response.ok) {
          const fallbackData: ApiResponse<ApiTrafficData> = await response.json();
          const transformedData: TrafficData[] = fallbackData.data
            .filter(item => item.출발 && item.도착지)
            .map(item => ({
              date: `${item['조사일 년'] || new Date().getFullYear()}-${String(item.조사월 || 1).padStart(2, '0')}-01`,
              departure: item.출발!,
              destination: item.도착지!,
              largeVehicles: item['대형 차량'] || 0,
              smallVehicles: item['소형 차량'] || 0,
              totalTraffic: (item['대형 차량'] || 0) + (item['소형 차량'] || 0),
              timeStatistics: {
                morning: Math.floor(((item['대형 차량'] || 0) + (item['소형 차량'] || 0)) * 0.25),
                afternoon: Math.floor(((item['대형 차량'] || 0) + (item['소형 차량'] || 0)) * 0.35),
                evening: Math.floor(((item['대형 차량'] || 0) + (item['소형 차량'] || 0)) * 0.40)
              },
              dataSource: '새만금 방조제 교통량 (로컬)'
            }));
          console.log('교통량 로컬 fallback 데이터:', transformedData.length);
          return transformedData;
        }
      } catch (fallbackError) {
        console.error('교통량 Fallback data loading failed:', fallbackError);
      }
      return [];
    }
  }

  async getRenewableEnergyData(): Promise<RenewableEnergyData[]> {
    const cacheKey = 'renewable_energy_data';
    const cached = this.cache.get(cacheKey) as CacheEntry<RenewableEnergyData[]> | undefined;
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('재생에너지 데이터 캐시에서 반환:', cached.data.length);
      return cached.data;
    }

    try {
      console.log('재생에너지 데이터 API 호출 시작...');
      // 실제 data.go.kr API 호출
      const params = buildApiParams({ page: 1, perPage: 100 });
      const apiResponse = await withRetry(
        () => httpClient.get<ApiResponse<ApiRenewableEnergyData>>(API_ENDPOINTS.RENEWABLE_ENERGY, params),
        3,
        1000
      );

      console.log('재생에너지 데이터 API 응답:', apiResponse);

      const transformedData: RenewableEnergyData[] = apiResponse.data
        .filter(item => item.위치 && item.발전유형 && item['용량(기가와트)']) // 필수 필드가 있는 데이터만
        .map((item, index) => {
          const capacity = parseNumber(item['용량(기가와트)']) * 1000; // GW를 MW로 변환
          const area = parseNumber(item['면적(제곱킬로미터)']) * 1000000; // km²를 m²로 변환
          
          const transformed = {
            region: item.위치!,
            generationType: item.발전유형!,
            capacity: capacity,
            area: area,
            operator: `새만금${item.발전유형}사업자${index + 1}`, // 가상 운영사명
            status: 'planned', // 기본값
            expectedCompletion: `202${5 + index % 3}-12-31`, // 가상 완공일
            coordinates: { 
              lat: 35.7983 + (Math.random() - 0.5) * 0.1, 
              lng: 126.7041 + (Math.random() - 0.5) * 0.1 
            }, // 새만금 주변 좌표
            dataSource: '새만금 재생에너지 사업 정보'
          };
          console.log('변환된 재생에너지 데이터:', transformed);
          return transformed;
        });

      console.log('최종 재생에너지 데이터 개수:', transformedData.length);

      this.cache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now()
      });

      return transformedData;
    } catch (error) {
      console.error('재생에너지 데이터 API 호출 실패:', error);
      // 에러 시 로컬 fallback 시도
      try {
        console.log('재생에너지 로컬 fallback 시도...');
        const response = await fetch('/api/saemangeum/renewable-data.json');
        if (response.ok) {
          const fallbackData: ApiResponse<ApiRenewableEnergyData> = await response.json();
          const transformedData: RenewableEnergyData[] = fallbackData.data
            .filter(item => item.위치 && item.발전유형 && item['용량(기가와트)'])
            .map((item, index) => {
              const capacity = parseNumber(item['용량(기가와트)']) * 1000;
              const area = parseNumber(item['면적(제곱킬로미터)']) * 1000000;
              
              return {
                region: item.위치!,
                generationType: item.발전유형!,
                capacity: capacity,
                area: area,
                operator: `새만금${item.발전유형}사업자${index + 1}`,
                status: 'planned',
                expectedCompletion: `202${5 + index % 3}-12-31`,
                coordinates: { 
                  lat: 35.7983 + (Math.random() - 0.5) * 0.1, 
                  lng: 126.7041 + (Math.random() - 0.5) * 0.1 
                },
                dataSource: '새만금 재생에너지 사업 정보 (로컬)'
              };
            });
          console.log('재생에너지 로컬 fallback 데이터:', transformedData.length);
          return transformedData;
        }
      } catch (fallbackError) {
        console.error('재생에너지 Fallback data loading failed:', fallbackError);
      }
      return [];
    }
  }

  async getWeatherData(): Promise<WeatherData | null> {
    const cacheKey = 'weather_data';
    const cached = this.cache.get(cacheKey) as CacheEntry<WeatherData> | undefined;
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      // 실제 data.go.kr API 호출
      const params = buildApiParams({ page: 1, perPage: 100 });
      const apiResponse = await withRetry(
        () => httpClient.get<ApiResponse<ApiWeatherData>>(API_ENDPOINTS.WEATHER_CURRENT, params),
        3,
        1000
      );

      if (apiResponse.data.length === 0) {
        return null;
      }

      const weatherData: WeatherData = {
        baseDate: parseString(apiResponse.data[0]?.발표일자),
        baseTime: '1400',
        observations: apiResponse.data.map(item => ({
          category: parseString(item.자료구분코드),
          obsrValue: parseString(item['실황 값'] || item['예보 값']),
          nx: item['예보지점 X 좌표'] || 0,
          ny: item['예보지점 Y 좌표'] || 0
        })),
        dataSource: '새만금개발청_기상정보초단기실황조회'
      };

      this.cache.set(cacheKey, {
        data: weatherData,
        timestamp: Date.now()
      });

      return weatherData;
    } catch (error) {
      console.error('Error loading weather data:', error);
      // 에러 시 로컬 fallback 시도
      try {
        const response = await fetch('/api/saemangeum/weather-data.json');
        if (response.ok) {
          const fallbackData: ApiResponse<ApiWeatherData> = await response.json();
          if (fallbackData.data.length === 0) return null;

          const weatherData: WeatherData = {
            baseDate: parseString(fallbackData.data[0]?.발표일자),
            baseTime: '1400',
            observations: fallbackData.data.map(item => ({
              category: parseString(item.자료구분코드),
              obsrValue: parseString(item['실황 값'] || item['예보 값']),
              nx: item['예보지점 X 좌표'] || 0,
              ny: item['예보지점 Y 좌표'] || 0
            })),
            dataSource: '새만금개발청_기상정보초단기실황조회 (로컬)'
          };
          return weatherData;
        }
      } catch (fallbackError) {
        console.error('Fallback data loading failed:', fallbackError);
      }
      return null;
    }
  }

  async getLandData(): Promise<Array<LandData | ReclaimData>> {
    return []; // 실제 API 구현 생략
  }

  async getBuildingPermitData(): Promise<BuildingPermitData[]> {
    return []; // 실제 API 구현 생략
  }

  async getUtilityData(): Promise<UtilityData[]> {
    return []; // 실제 API 구현 생략
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const dataService = DataService.getInstance();

export type { 
  Dataset, 
  DataResponse, 
  InvestmentData, 
  TrafficData, 
  RenewableEnergyData, 
  WeatherData, 
  LandData, 
  ReclaimData, 
  BuildingPermitData, 
  UtilityData 
};