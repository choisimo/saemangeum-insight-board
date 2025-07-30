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
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
      return cached.data;
    }

    try {
      const params = buildApiParams({ perPage: 100 });
      const response = await withRetry(() => 
        httpClient.get<ApiResponse<ApiInvestmentData>>(API_ENDPOINTS.INVESTMENT_INCENTIVES, params)
      );

      // 실제 API 데이터만 변환 (필수 필드만 포함)
      const transformedData: InvestmentData[] = response.data
        .filter(item => item.대상기업 && item.제도) // 필수 필드가 있는 데이터만
        .map((item, index) => ({
          id: item.번호 || index + 1,
          company: item.대상기업!,
          sector: item.제도!,
          investment: 0,
          stage: '',
          progress: 0,
          location: parseString(item.지역),
          contractDate: new Date().toISOString().split('T')[0],
          expectedJobs: 0,
          status: '',
          dataSource: '새만금 투자 인센티브 보조금지원 현황'
        }));

      this.cache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now()
      });

      return transformedData;
    } catch (error) {
      console.error('Error loading investment data:', error);
      // 에러 시 빈 배열 반환
      return [];
    }
  }

  async getTrafficData(): Promise<TrafficData[]> {
    const cacheKey = 'traffic_data';
    const cached = this.cache.get(cacheKey) as CacheEntry<TrafficData[]> | undefined;
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const params = buildApiParams({ perPage: 100 });
      const response = await withRetry(() => 
        httpClient.get<ApiResponse<ApiTrafficData>>(API_ENDPOINTS.TRAFFIC_DATA, params)
      );

      const transformedData: TrafficData[] = response.data
        .filter(item => item.출발 && item.도착지) // 필수 필드가 있는 데이터만
        .map(item => ({
          date: `${item['조사일 년'] || new Date().getFullYear()}-${String(item.조사월 || 1).padStart(2, '0')}-01`,
          departure: item.출발!,
          destination: item.도착지!,
          largeVehicles: item['대형 차량'] || 0,
          smallVehicles: item['소형 차량'] || 0,
          totalTraffic: (item['대형 차량'] || 0) + (item['소형 차량'] || 0),
          timeStatistics: {},
          dataSource: '새만금 방조제 교통량'
        }));

      this.cache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now()
      });

      return transformedData;
    } catch (error) {
      console.error('Error loading traffic data:', error);
      return [];
    }
  }

  async getRenewableEnergyData(): Promise<RenewableEnergyData[]> {
    const cacheKey = 'renewable_energy_data';
    const cached = this.cache.get(cacheKey) as CacheEntry<RenewableEnergyData[]> | undefined;
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const params = buildApiParams({ perPage: 100 });
      const response = await withRetry(() => 
        httpClient.get<ApiResponse<ApiRenewableEnergyData>>(API_ENDPOINTS.RENEWABLE_ENERGY, params)
      );

      const transformedData: RenewableEnergyData[] = response.data
        .filter(item => item.위치 && item.발전유형 && item['용량(기가와트)']) // 필수 필드가 있는 데이터만
        .map(item => ({
          region: item.위치!,
          generationType: item.발전유형!,
          capacity: parseNumber(item['용량(기가와트)']) * 1000, // GW를 MW로 변환
          area: parseNumber(item['면적(제곱킬로미터)']) * 1000000, // km²를 m²로 변환
          operator: '',
          status: '',
          expectedCompletion: '',
          coordinates: {
            lat: 0,
            lng: 0
          },
          dataSource: '새만금 재생에너지 사업 정보'
        }));

      this.cache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now()
      });

      return transformedData;
    } catch (error) {
      console.error('Error loading renewable energy data:', error);
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
      // 현재 날짜와 시간으로 날씨 데이터 요청
      const now = new Date();
      const baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
      const baseTime = now.getHours().toString().padStart(2, '0') + '00';
      
      const params = buildApiParams({ 
        perPage: 50,
        base_date: baseDate,
        base_time: baseTime,
        nx: '244',
        ny: '526'
      });
      
      const response = await withRetry(() => 
        httpClient.get<ApiResponse<ApiWeatherData>>(API_ENDPOINTS.WEATHER_CURRENT, params)
      );

      if (response.data.length === 0) {
        return null;
      }

      const weatherData: WeatherData = {
        baseDate: parseString(response.data[0]?.발표일자, baseDate),
        baseTime: baseTime,
        observations: response.data.map(item => ({
          category: parseString(item.자료구분코드, 'T1H'),
          obsrValue: parseString(item['실황 값'] || item['예보 값'], '0'),
          nx: item['예보지점 X 좌표'] || 244,
          ny: item['예보지점 Y 좌표'] || 526
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
      return null;
    }
  }

  async getLandData(): Promise<Array<LandData | ReclaimData>> {
    const cacheKey = 'land_data';
    const cached = this.cache.get(cacheKey) as CacheEntry<Array<LandData | ReclaimData>> | undefined;
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const [landResponse, reclaimResponse] = await Promise.all([
        withRetry(() => 
          httpClient.get<ApiResponse<ApiLandData>>(API_ENDPOINTS.LAND_REGISTRY, buildApiParams({ perPage: 50 }))
        ),
        withRetry(() => 
          httpClient.get<ApiResponse<ApiReclaimData>>(API_ENDPOINTS.RECLAMATION_INFO, buildApiParams({ perPage: 50 }))
        )
      ]);

      const landData: LandData[] = landResponse.data
        .filter(item => item.지역 && item.지목) // 필수 필드가 있는 데이터만
        .map(item => ({
          location: `${item.지역!} ${parseString(item.토지소재)}`.trim(),
          mainNumber: String(item.본번 || 0),
          subNumber: String(item.부번 || 0),
          landCategory: item.지목!,
          area: parseNumber(item['면적(제곱미터)']),
          owner: '',
          registrationDate: '',
          dataSource: '새만금사업지역 지적공부'
        }));

      const reclaimData: ReclaimData[] = reclaimResponse.data
        .filter(item => item.권역 && item.용지) // 필수 필드가 있는 데이터만
        .map(item => ({
          region: item.권역!,
          landType: item.용지!,
          plannedArea: parseNumber(item['계획면적(제곱킬로미터)']) * 1000000, // km²를 m²로 변환
          completedArea: parseNumber(item['매립완료(제곱킬로미터)']) * 1000000,
          inProgressArea: parseNumber(item['매립중(제곱킬로미터)']) * 1000000,
          scheduledArea: parseNumber(item['매립예정(제곱킬로미터)']) * 1000000,
          progressRate: Math.round((parseNumber(item['매립완료(제곱킬로미터)']) + parseNumber(item['매립중(제곱킬로미터)'])) / parseNumber(item['계획면적(제곱킬로미터)']) * 100) || 0,
          completionDate: '',
          dataSource: '새만금사업 매립 정보'
        }));

      const combinedData = [...landData, ...reclaimData];

      this.cache.set(cacheKey, {
        data: combinedData,
        timestamp: Date.now()
      });

      return combinedData;
    } catch (error) {
      console.error('Error loading land data:', error);
      return [];
    }
  }

  async getBuildingPermitData(): Promise<BuildingPermitData[]> {
    const cacheKey = 'building_permit_data';
    const cached = this.cache.get(cacheKey) as CacheEntry<BuildingPermitData[]> | undefined;
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const params = buildApiParams({ perPage: 100 });
      const response = await withRetry(() => 
        httpClient.get<ApiResponse<ApiBuildingPermitData>>(API_ENDPOINTS.BUILDING_PERMITS, params)
      );

      const transformedData: BuildingPermitData[] = response.data
        .filter(item => item.건축주명 && item.대지위치) // 필수 필드가 있는 데이터만
        .map(item => ({
          permitDate: parseDate(item.허가일),
          builderName: item.건축주명!,
          siteLocation: item.대지위치!,
          buildingType: parseString(item.건축구분),
          buildingArea: parseNumber(item['건축면적(제곱미터)']),
          totalFloorArea: parseNumber(item['연면적(제곱미터)']),
          constructionStartDate: parseDate(item.착공처리일),
          permitNumber: '',
          usage: parseString(item.주용도),
          dataSource: '새만금사업지역 건축물 허가현황'
        }));

      this.cache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now()
      });

      return transformedData;
    } catch (error) {
      console.error('Error loading building permit data:', error);
      return [];
    }
  }

  async getUtilityData(): Promise<UtilityData[]> {
    const cacheKey = 'utility_data';
    const cached = this.cache.get(cacheKey) as CacheEntry<UtilityData[]> | undefined;
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.data;
    }

    try {
      const params = buildApiParams({ perPage: 100 });
      const response = await withRetry(() => 
        httpClient.get<ApiResponse<ApiUtilityData>>(API_ENDPOINTS.UTILITY_STATUS, params)
      );

      const transformedData: UtilityData[] = response.data
        .filter(item => item.구분 && item.공급자) // 필수 필드가 있는 데이터만
        .map(item => ({
          utilityType: item.구분!,
          supplier: item.공급자!,
          supplyCapacity: parseString(item.규모),
          availableCapacity: String(item.여유량 || 0),
          supplyAbility: '',
          location: '',
          remarks: parseString(item.비고),
          dataSource: '새만금지역 산업단지 유틸리티 현황'
        }));

      this.cache.set(cacheKey, {
        data: transformedData,
        timestamp: Date.now()
      });

      return transformedData;
    } catch (error) {
      console.error('Error loading utility data:', error);
      return [];
    }
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