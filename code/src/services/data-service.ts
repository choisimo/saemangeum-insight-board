// 새만금 데이터 서비스
// API 클라이언트 및 데이터 변환 로직

const SERVICE_KEY = '4DynfiNb5l3cgZ34kFi2mqrHawIruUhNLUP+Gx93TiB1zPg1K3rmvc7lftSco4h5iSprU05i3OEuzklaPckFBA==';
const BASE_URL = 'https://api.odcloud.kr/api';

// 타입 정의
export interface InvestmentData {
  id: string;
  company: string;
  sector: string;
  investment: number; // 억원
  expectedJobs: number;
  progress: number; // 0-1
  location: string;
  startDate: string;
  status: 'planning' | 'in-progress' | 'completed' | 'delayed';
}

export interface RenewableEnergyData {
  id: string;
  region: string;
  type: 'solar' | 'wind' | 'hydro' | 'other';
  capacity: number; // MW
  status: 'operational' | 'under-construction' | 'planned';
  operator: string;
  installDate?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  visibility: number;
  timestamp: string;
}

export interface TrafficData {
  id: string;
  location: string;
  totalTraffic: number;
  timestamp: string;
  vehicleTypes: {
    passenger: number;
    truck: number;
    bus: number;
  };
}

export interface LandData {
  id: string;
  location: string;
  area: number; // 평방미터
  landType: string;
  usage: string;
  price: number;
}

export interface ReclaimData {
  id: string;
  region: string;
  area: number;
  completionRate: number;
  purpose: string;
  startDate: string;
}

export interface BuildingPermitData {
  id: string;
  location: string;
  buildingType: string;
  area: number;
  permitDate: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface UtilityData {
  id: string;
  type: 'electricity' | 'water' | 'gas' | 'telecommunications';
  capacity: number;
  usage: number;
  region: string;
}

export interface DataResponse {
  summary: {
    total_datasets: number;
    last_updated: string;
    data_quality_score: number;
  };
  datasets: Array<{
    name: string;
    description: string;
    record_count: number;
    last_updated: string;
  }>;
}

// API 클라이언트 클래스
class ApiClient {
  private baseUrl: string;
  private serviceKey: string;

  constructor(baseUrl: string, serviceKey: string) {
    this.baseUrl = baseUrl;
    this.serviceKey = serviceKey;
  }

  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    // 공통 파라미터 추가
    const allParams = {
      serviceKey: this.serviceKey,
      page: 1,
      perPage: 100,
      ...params
    };

    Object.entries(allParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    console.log(`API 요청: ${url.toString()}`);

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API 오류 응답 (${response.status}):`, errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`API 응답 성공 (${endpoint}):`, {
        dataCount: data.data?.length || 0,
        totalCount: data.totalCount || data.matchCount || 0,
        sampleData: data.data?.slice(0, 2) || []
      });
      return data;
    } catch (error) {
      console.error(`API 요청 실패 (${endpoint}):`, error);
      throw error;
    }
  }

  // 기상 데이터 조회
  async getWeatherData(): Promise<WeatherData | null> {
    try {
      const response = await this.makeRequest('/15138304/v1/uddi:83bddb37-95d5-4fe1-8e1e-8d4e8d56e1f5', {
        base_date: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
        base_time: '1400',
        nx: '244',
        ny: '526'
      });

      if (response.data && response.data.length > 0) {
        const weatherItem = response.data[0];
        const groupedData = this.groupWeatherByLocation(response.data);
        const firstLocation = Object.keys(groupedData)[0];
        const locationData = groupedData[firstLocation] || [];
        
        return {
          temperature: this.extractTemperature(locationData),
          humidity: this.extractHumidity(locationData),
          windSpeed: this.extractWindSpeed(locationData),
          windDirection: this.extractWindDirection(locationData),
          precipitation: this.extractPrecipitation(locationData),
          visibility: this.extractVisibility(locationData),
          timestamp: new Date().toISOString()
        };
      }

      return null;
    } catch (error) {
      console.error('기상 데이터 조회 실패:', error);
      return null;
    }
  }

  // 재생에너지 데이터 조회
  async getRenewableEnergyData(): Promise<RenewableEnergyData[]> {
    try {
      const response = await this.makeRequest('/15068848/v1/uddi:1743c432-d853-40d9-9c4a-9076e4f35ce9');
      
      if (response.data && Array.isArray(response.data)) {
        return response.data.map((item: any, index: number) => ({
          id: item['ID'] || `renewable-${index}`,
          region: item['위치'],
          type: this.mapEnergyType(item['발전유형']),
          capacity: parseFloat(item['용량(기가와트)']) * 1000, // GW를 MW로 변환
          status: this.mapEnergyStatus(item['상태']),
          operator: item['운영자'],
          installDate: item['설치일']
        })).filter(item => item.region && item.type && item.capacity > 0);
      }

      return [];
    } catch (error) {
      console.error('재생에너지 데이터 조회 실패:', error);
      return [];
    }
  }

  // 유틸리티 데이터 조회
  async getUtilityData(): Promise<UtilityData[]> {
    try {
      const response = await this.makeRequest('/15120069/v1/uddi:b763f323-2d2b-4ad3-aaab-91c1de9c4323');
      
      if (response.data && Array.isArray(response.data)) {
        return response.data.map((item: any, index: number) => ({
          id: item['ID'] || `utility-${index}`,
          type: this.mapUtilityType(item['유틸리티종류']),
          capacity: parseFloat(item['용량'] || item['설비용량']),
          usage: parseFloat(item['사용량'] || item['이용량']),
          region: item['지역'] || item['공구']
        })).filter(item => item.type && item.capacity && item.usage && item.region);
      }

      return [];
    } catch (error) {
      console.error('유틸리티 데이터 조회 실패:', error);
      return [];
    }
  }

  // 건축허가 데이터 조회
  async getBuildingPermitData(): Promise<BuildingPermitData[]> {
    try {
      const response = await this.makeRequest('/15006164/v1/uddi:55aa5c8a-090d-4db0-a99e-a20a2c9b4117');
      
      if (response.data && Array.isArray(response.data)) {
        return response.data.map((item: any, index: number) => ({
          id: item['ID'] || `permit-${index}`,
          location: item['위치'] || item['지역'],
          buildingType: item['건축물종류'] || item['용도'],
          area: parseFloat(item['면적'] || item['건축면적']),
          permitDate: item['허가일자'] || item['승인일자'],
          status: this.mapPermitStatus(item['상태'])
        })).filter(item => item.location && item.buildingType && item.area && item.permitDate);
      }

      return [];
    } catch (error) {
      console.error('건축허가 데이터 조회 실패:', error);
      return [];
    }
  }

  // 투자 데이터 조회 (보조금 지원 현황 기반)
  async getInvestmentData(): Promise<InvestmentData[]> {
    try {
      const response = await this.makeRequest('/15121622/v1/uddi:d8e95b9d-7808-4643-b2f5-c1fa1a649ede');
      
      if (response.data && Array.isArray(response.data)) {
        return response.data.map((item: any, index: number) => ({
          id: item['ID'] || `investment-${index}`,
          company: item['대상기업'],
          sector: item['제도'],
          investment: this.extractInvestmentAmount(item['지원내용']),
          expectedJobs: this.calculateExpectedJobs(item['지원내용'], item['예상고용']),
          progress: this.calculateProgress(item['진행상태'], item['시작일']),
          location: item['지역'],
          startDate: item['시작일'],
          status: this.mapInvestmentStatus(item['상태'])
        })).filter(item => item.company && item.sector && item.investment > 0);
      }

      return [];
    } catch (error) {
      console.error('투자 데이터 조회 실패:', error);
      return [];
    }
  }

  // 교통량 데이터 조회
  async getTrafficData(): Promise<TrafficData[]> {
    try {
      const response = await this.makeRequest('/15138304/v1/uddi:traffic-data-endpoint');
      
      if (response.data && Array.isArray(response.data)) {
        return response.data.map((item: any, index: number) => ({
          id: item['ID'] || `traffic-${index}`,
          location: item['위치'],
          totalTraffic: parseInt(item['총교통량']),
          timestamp: item['측정시간'] || new Date().toISOString(),
          vehicleTypes: {
            passenger: parseInt(item['승용차']) || 0,
            truck: parseInt(item['화물차']) || 0,
            bus: parseInt(item['버스']) || 0
          }
        })).filter(item => item.location && item.totalTraffic > 0);
      }

      return [];
    } catch (error) {
      console.error('교통량 데이터 조회 실패:', error);
      return [];
    }
  }

  // 토지 데이터 조회
  async getLandData(): Promise<Array<LandData | ReclaimData>> {
    try {
      const [landResponse, reclaimResponse] = await Promise.all([
        this.makeRequest('/15138304/v1/uddi:land-data-endpoint'),
        this.makeRequest('/15138304/v1/uddi:reclaim-data-endpoint')
      ]);
      
      const landData: Array<LandData | ReclaimData> = [];
      
      // 토지 데이터 처리
      if (landResponse.data && Array.isArray(landResponse.data)) {
        const lands = landResponse.data.map((item: any, index: number) => ({
          id: item['ID'] || `land-${index}`,
          location: item['위치'],
          area: parseFloat(item['면적']),
          landType: item['토지종류'],
          usage: item['용도'],
          price: parseFloat(item['가격'])
        } as LandData)).filter(item => item.location && item.area > 0);
        
        landData.push(...lands);
      }
      
      // 간척 데이터 처리
      if (reclaimResponse.data && Array.isArray(reclaimResponse.data)) {
        const reclaims = reclaimResponse.data.map((item: any, index: number) => ({
          id: item['ID'] || `reclaim-${index}`,
          region: item['지역'],
          area: parseFloat(item['면적']),
          completionRate: parseFloat(item['완성률']),
          purpose: item['목적'],
          startDate: item['시작일']
        } as ReclaimData)).filter(item => item.region && item.area > 0);
        
        landData.push(...reclaims);
      }
      
      return landData;
    } catch (error) {
      console.error('토지 데이터 조회 실패:', error);
      return [];
    }
  }

  // 데이터셋 메타데이터 조회
  async loadDatasets(): Promise<DataResponse> {
    try {
      const metaResponse = await this.makeRequest('/metadata/summary');
      
      if (metaResponse.summary && metaResponse.datasets) {
        return {
          summary: {
            total_datasets: metaResponse.summary.total_datasets,
            last_updated: metaResponse.summary.last_updated,
            data_quality_score: metaResponse.summary.data_quality_score
          },
          datasets: metaResponse.datasets
        };
      }

      return {
        summary: {
          total_datasets: 0,
          last_updated: new Date().toISOString(),
          data_quality_score: 0
        },
        datasets: []
      };
    } catch (error) {
      console.error('데이터셋 메타데이터 조회 실패:', error);
      throw error;
    }
  }

  // 유틸리티 메서드들
  private mapEnergyType(type: string): 'solar' | 'wind' | 'hydro' | 'other' {
    if (!type) return 'other';
    
    const typeMap: Record<string, 'solar' | 'wind' | 'hydro' | 'other'> = {
      '태양광': 'solar',
      '풍력': 'wind',
      '수력': 'hydro',
      'solar': 'solar',
      'wind': 'wind',
      'hydro': 'hydro'
    };
    return typeMap[type] || 'other';
  }

  private mapEnergyStatus(status: string): 'operational' | 'under-construction' | 'planned' {
    if (!status) return 'operational';
    
    const statusMap: Record<string, 'operational' | 'under-construction' | 'planned'> = {
      '운영중': 'operational',
      '건설중': 'under-construction',
      '계획중': 'planned',
      'operational': 'operational',
      'under-construction': 'under-construction',
      'planned': 'planned'
    };
    return statusMap[status] || 'operational';
  }

  private mapUtilityType(type: string): 'electricity' | 'water' | 'gas' | 'telecommunications' {
    if (!type) return 'electricity';
    
    const typeMap: Record<string, 'electricity' | 'water' | 'gas' | 'telecommunications'> = {
      '전력': 'electricity',
      '상수도': 'water',
      '가스': 'gas',
      '통신': 'telecommunications'
    };
    return typeMap[type] || 'electricity';
  }

  private mapPermitStatus(status: string): 'approved' | 'pending' | 'rejected' {
    if (!status) return 'approved';
    
    const statusMap: Record<string, 'approved' | 'pending' | 'rejected'> = {
      '승인': 'approved',
      '대기': 'pending',
      '반려': 'rejected'
    };
    return statusMap[status] || 'approved';
  }

  private mapInvestmentStatus(status: string): 'planning' | 'in-progress' | 'completed' | 'delayed' {
    if (!status) return 'planning';
    
    const statusMap: Record<string, 'planning' | 'in-progress' | 'completed' | 'delayed'> = {
      '계획': 'planning',
      '진행중': 'in-progress',
      '완료': 'completed',
      '지연': 'delayed'
    };
    return statusMap[status] || 'planning';
  }

  private extractInvestmentAmount(supportContent: string): number {
    if (!supportContent) return 0;
    
    const match = supportContent.match(/(\d+(?:\.\d+)?)[억만원]/);
    if (match) {
      const amount = parseFloat(match[1]);
      if (supportContent.includes('억')) {
        return amount;
      } else if (supportContent.includes('만')) {
        return amount / 10000;
      }
    }
    return 0;
  }

  private calculateExpectedJobs(supportContent: string, jobsField?: string): number {
    if (jobsField && !isNaN(parseInt(jobsField))) {
      return parseInt(jobsField);
    }
    
    const investment = this.extractInvestmentAmount(supportContent);
    if (investment > 0) {
      return Math.floor(investment / 10); // 10억당 1명 추정
    }
    
    return 0;
  }

  private calculateProgress(status: string, startDate?: string): number {
    if (!status && !startDate) return 0;
    
    if (status === '완료') return 1;
    if (status === '진행중' && startDate) {
      const start = new Date(startDate);
      const now = new Date();
      const monthsElapsed = (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return Math.min(0.9, monthsElapsed / 24); // 24개월 기준
    }
    
    return 0;
  }

  private extractWindDirection(data: any[]): string {
    const windDirData = data.find(item => item['자료구분코드'] === 'VEC');
    if (windDirData && windDirData['예보 값']) {
      const degree = parseFloat(windDirData['예보 값']);
      if (degree >= 0 && degree < 45) return 'N';
      if (degree >= 45 && degree < 90) return 'NE';
      if (degree >= 90 && degree < 135) return 'E';
      if (degree >= 135 && degree < 180) return 'SE';
      if (degree >= 180 && degree < 225) return 'S';
      if (degree >= 225 && degree < 270) return 'SW';
      if (degree >= 270 && degree < 315) return 'W';
      if (degree >= 315 && degree < 360) return 'NW';
    }
    return '';
  }

  private extractPrecipitation(data: any[]): number {
    const precipData = data.find(item => item['자료구분코드'] === 'PCP');
    return precipData ? parseFloat(precipData['예보 값'] || '0') : 0;
  }

  private extractVisibility(data: any[]): number {
    const visData = data.find(item => item['자료구분코드'] === 'VIS');
    return visData ? parseFloat(visData['예보 값'] || '0') : 0;
  }

  private groupWeatherByLocation(data: any[]): Record<string, any[]> {
    const grouped: Record<string, any[]> = {};
    data.forEach(item => {
      const x = item['예보지점 X 좌표'] || 0;
      const y = item['예보지점 Y 좌표'] || 0;
      const key = `좌표(${x},${y})`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(item);
    });
    return grouped;
  }

  private extractTemperature(data: any[]): number {
    const tempData = data.find(item => item['자료구분코드'] === 'TMP');
    return tempData ? parseFloat(tempData['예보 값'] || '0') : 0;
  }

  private extractHumidity(data: any[]): number {
    const humData = data.find(item => item['자료구분코드'] === 'REH');
    return humData ? parseFloat(humData['예보 값'] || '0') : 0;
  }

  private extractWindSpeed(data: any[]): number {
    const windData = data.find(item => item['자료구분코드'] === 'VVV');
    return windData ? parseFloat(windData['예보 값'] || '0') : 0;
  }


}

// 데이터 서비스 인스턴스
export const dataService = new ApiClient(BASE_URL, SERVICE_KEY);
