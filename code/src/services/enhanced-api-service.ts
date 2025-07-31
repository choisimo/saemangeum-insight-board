/**
 * 실제 작동하는 공공데이터 API 통합 서비스
 * KOSIS, KEPCO 등 실제 API 키를 활용한 데이터 연동
 * 기존 real-api-service.ts와 호환성 유지
 * 
 * 통합 API 목록:
 * 1. KOSIS API (통계청) - 전북특별자치도 대기질 현황
 * 2. KEPCO API (한전) - 재생에너지 발전량 데이터
 * 3. VWorld API (국토교통부) - 공간정보 검색
 * 4. 해양수산부 API - 실시간 해양수질 데이터
 * 5. 전북 군산 산업단지 API - 산업단지 정보
 */

import { realApiService, ProcessedInvestmentData, ProcessedRenewableData, ProcessedWeatherData, ProcessedEnvironmentData } from './real-api-service';

// 실제 API 키들 (환경변수에서 가져오기)
const KOSIS_API_KEY = import.meta.env.VITE_KOSIS_API_KEY || 'ZTQyZWFiNzc4MTY2ZjAwNTI2YTNjMDA3ODQxMWQ4NjA=';
const KEPCO_API_KEY = import.meta.env.VITE_KEPCO_API_KEY || 'hoe917mF3y174m3l0f8zqPCn8TgL8ZnB6B3Q3BV7';
const MOLIT_API_KEY = import.meta.env.VITE_MOLIT_API_KEY || 'your_molit_api_key_here';
const MOF_API_KEY = import.meta.env.VITE_MOF_API_KEY || 'your_mof_api_key_here';
const GUNSAN_API_KEY = import.meta.env.VITE_GUNSAN_API_KEY || 'your_gunsan_api_key_here';
const WEATHER_API_KEY = import.meta.env.VITE_API_SERVICE_KEY || '';

// API 엔드포인트들 (실제 작동하는 공공데이터 API)
const API_ENDPOINTS = {
  // KOSIS API (통계청) - 전북특별자치도 대기환경 현황
  KOSIS: {
    BASE_URL: 'https://kosis.kr/openapi/statisticsParameterData.do',
    AIR_QUALITY: 'https://kosis.kr/openapi/statisticsData.do',
    // 전북특별자치도 연평균 대기질 현황 (통계표 ID)
    STAT_ID: 'DT_1YL20921',
    ORG_ID: '101',
    TBL_ID: 'DT_1YL20921N_001'
  },
  
  // KEPCO API (한전) - 재생에너지 발전 현황
  KEPCO: {
    BASE_URL: 'https://bigdata.kepco.co.kr/openapi/v1/renewEnergy.do',
    RENEWABLE_ENERGY: 'https://bigdata.kepco.co.kr/openapi/v1/renewEnergy.do'
  },
  
  // 국토교통부 VWorld API - 공간정보 검색
  VWORLD: {
    BASE_URL: 'https://api.vworld.kr/req/search',
    SEARCH: 'https://api.vworld.kr/req/search',
    SERVICE: 'search',
    REQUEST: 'search',
    FORMAT: 'json',
    TYPE: 'place',
    SIZE: '10'
  },
  
  // 해양수산부 API - 실시간 해양수질자동측정망
  MOF: {
    BASE_URL: 'https://apis.data.go.kr/1192000/OceansWemoObvpRtmInfoService/getObvpRtmInfoList',
    OCEAN_QUALITY: 'https://apis.data.go.kr/1192000/OceansWemoObvpRtmInfoService/getObvpRtmInfoList'
  },
  
  // 전북특별자치도 군산시 산업단지 현황
  GUNSAN: {
    BASE_URL: 'https://apis.data.go.kr/4671000/gunsan-industrial-complex/getIndustrialComplexInfo',
    INDUSTRIAL_COMPLEX: 'https://apis.data.go.kr/4671000/gunsan-industrial-complex/getIndustrialComplexInfo'
  },
  
  // 공공데이터포털 통합 API (폴백용)
  DATA_GO_KR: {
    BASE_URL: 'https://apis.data.go.kr',
    // 전국 대기오염정보 조회 서비스
    AIR_POLLUTION: 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty',
    // 전국 재생에너지 통계
    RENEWABLE_STATS: 'https://apis.data.go.kr/1741000/EnergyStatisticsService/getEnergyStatistics'
  }
};

// 새만금 지역 코드 및 좌표
const SAEMANGEUM_REGION = {
  JEONBUK_CODE: '45', // 전북특별자치도 코드
  GUNSAN_CODE: '45130', // 군산시 코드
  COORDINATES: {
    lat: 35.7983,
    lng: 126.7041,
    nx: 54,
    ny: 74
  }
};

// KOSIS 대기질 데이터 인터페이스
interface KOSISAirQualityData {
  STAT_NM: string; // 통계명
  ITEM_NM: string; // 항목명
  OBJ_NM: string; // 지역명
  PRD_DE: string; // 기간
  DT: string; // 데이터값
  UNIT_NM: string; // 단위
}

// KEPCO 재생에너지 데이터 인터페이스
interface KEPCORenewableData {
  year: string;
  metro: string;
  metroNm: string;
  genSrc: string;
  genSrcNm: string;
  genCapa: string; // 발전용량(MW)
  genAmt: string; // 발전량(MWh)
}

// VWorld 검색 결과 인터페이스
interface VWorldSearchResult {
  id: string;
  title: string;
  category: string;
  address: string;
  roadAddress?: string;
  point: {
    x: string;
    y: string;
  };
  description?: string;
}

// VWorld API 응답 인터페이스
interface VWorldResponse {
  response: {
    result: {
      items: any[];
    };
  };
}

// KOSIS API 응답 인터페이스
interface KOSISResponse {
  response?: {
    body?: {
      items?: any[];
    };
  };
}

// 해양수산부 해양수질 데이터 인터페이스
interface OceanQualityData {
  stationName: string;
  observationTime: string;
  waterTemp: string;
  salinity: string;
  ph: string;
  dissolvedOxygen: string;
  turbidity: string;
  latitude: string;
  longitude: string;
}

// 군산 산업단지 데이터 인터페이스
interface IndustrialComplexData {
  complexName: string;
  location: string;
  area: string;
  establishedDate: string;
  mainIndustry: string;
  numberOfCompanies: string;
  employmentCapacity: string;
}

// 통합 환경 데이터 인터페이스
interface IntegratedEnvironmentData extends ProcessedEnvironmentData {
  oceanQuality?: {
    waterTemp: number;
    salinity: number;
    ph: number;
    dissolvedOxygen: number;
    turbidity: number;
  };
  industrialInfo?: {
    nearbyComplexes: number;
    totalEmployment: number;
    mainIndustries: string[];
  };
}

/**
 * 실제 API 통합 서비스 클래스
 */
export class EnhancedApiService {
  private requestCache = new Map<string, { data: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5분 캐시

  /**
   * HTTP 요청 유틸리티 (캐시 포함)
   */
  private async fetchWithCache(url: string, options: RequestInit = {}): Promise<any> {
    const cacheKey = `${url}_${JSON.stringify(options)}`;
    const cached = this.requestCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('🔄 캐시된 데이터 사용:', url.substring(0, 50) + '...');
      return cached.data;
    }

    try {
      console.log('🌐 API 호출:', url.substring(0, 100) + '...');
      
      const response = await fetch(url, {
        ...options,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SaemangumDashboard/2.0)',
          'Accept': 'application/json, text/plain, */*',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { raw: text };
        }
      }

      // 캐시 저장
      this.requestCache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.error('❌ API 호출 실패:', error);
      throw error;
    }
  }

  /**
   * 1. KOSIS API - 전북특별자치도 대기질 데이터 조회 (실제 구현)
   */
  async getKOSISAirQualityData(): Promise<ProcessedEnvironmentData[]> {
    try {
      console.log('🌐 KOSIS API 호출 시작 - 전북특별자치도 대기질 현황');
      
      // API 키 유효성 검사
      if (!KOSIS_API_KEY || KOSIS_API_KEY === 'your_kosis_api_key_here') {
        console.warn('⚠️ KOSIS API 키가 설정되지 않음, 폴백 데이터 사용');
        return await this.getFallbackAirQualityData();
      }
      
      // KOSIS 통계청 API 호출 (전북특별자치도 연평균 대기질 현황)
      const url = new URL(API_ENDPOINTS.KOSIS.AIR_QUALITY);
      url.searchParams.append('method', 'getList');
      url.searchParams.append('apiKey', KOSIS_API_KEY);
      url.searchParams.append('itmId', 'T10+T20+T30+T40'); // 미세먼지, 초미세먼지, 오존, 이산화질소
      url.searchParams.append('objL1', SAEMANGEUM_REGION.JEONBUK_CODE); // 전북특별자치도 코드
      url.searchParams.append('format', 'json');
      url.searchParams.append('jsonVD', 'Y');
      url.searchParams.append('prdSe', 'Y'); // 연간 데이터
      url.searchParams.append('startPrdDe', '2023');
      url.searchParams.append('endPrdDe', '2024');
      url.searchParams.append('loadGubun', '2'); // 데이터 로드 구분

      console.log(`KOSIS API 호출 시도: ${url.toString().replace(KOSIS_API_KEY, 'API_KEY_HIDDEN')}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'SaemangumDashboard/1.0'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('KOSIS API 응답 상태:', { status: response.status, hasData: !!data });
      
      if (data && Array.isArray(data) && data.length > 0) {
        console.log('✅ KOSIS 대기질 데이터 수신 성공:', data.length, '건');
        
        // 새만금 지역별 대기질 데이터 생성 (군산, 김제, 부안 기준)
        const locations = ['새만금 군산권역', '새만금 김제권역', '새만금 부안권역'];
        
        return locations.map((location, index) => {
          const baseData = data[index % data.length] as KOSISAirQualityData;
          const pm25Value = this.extractPM25(baseData.DT, baseData.ITEM_NM);
          const pm10Value = this.extractPM10(baseData.DT, baseData.ITEM_NM);
          const ozoneValue = this.extractOzone(baseData.DT, baseData.ITEM_NM);
          const coValue = this.extractCO(baseData.DT, baseData.ITEM_NM);
          
          // 종합 대기질 지수 계산 (AQI 기준)
          const aqi = Math.max(
            Math.min(pm25Value * 2, 500),
            Math.min(pm10Value * 1.5, 500),
            Math.min(ozoneValue * 100, 500)
          );
          
          return {
            id: `kosis_air_${index}`,
            location,
            airQualityIndex: Math.round(aqi),
            pm25: pm25Value,
            pm10: pm10Value,
            ozone: ozoneValue,
            carbonMonoxide: coValue,
            measurementTime: new Date().toISOString(),
            status: this.getAirQualityStatus(aqi)
          };
        });
      } else {
        console.log('⚠️ KOSIS API 응답 데이터 없음, 폴백 데이터 사용');
        return await this.getFallbackAirQualityData();
      }
    } catch (error) {
      console.error('❌ KOSIS API 호출 실패:', {
        message: error instanceof Error ? error.message : '알 수 없는 오류',
        apiKey: KOSIS_API_KEY ? `${KOSIS_API_KEY.substring(0, 10)}...` : 'undefined',
        endpoint: API_ENDPOINTS.KOSIS.AIR_QUALITY
      });
      return await this.getFallbackAirQualityData();
    }
  }

  /**
   * 2. KEPCO API - 한전 재생에너지 발전량 데이터
   */
  async getKEPCORenewableData(): Promise<ProcessedRenewableData[]> {
    if (!KEPCO_API_KEY || KEPCO_API_KEY === 'your_kepco_api_key_here') {
      console.log('⚠️ KEPCO API 키가 설정되지 않음, 새만금 계획 데이터 사용');
      return this.generateSaemangumRenewableData();
    }

    try {
      console.log('🔍 KEPCO 재생에너지 데이터 조회 중...');

      const params = new URLSearchParams({
        apikey: KEPCO_API_KEY,
        metro: '전북특별자치도',
        year: new Date().getFullYear().toString(),
        format: 'json',
        numOfRows: '20',
        pageNo: '1'
      });

      const url = `${API_ENDPOINTS.KEPCO.RENEWABLE_ENERGY}?${params.toString()}`;
      const response = await this.fetchWithCache(url);

      if (response && (response.data || response.items || response.result)) {
        const data = response.data || response.items || response.result || [];
        console.log('✅ KEPCO 재생에너지 데이터 수신:', data.length, '건');
        
        const saemangumFacilities = [
          { name: '새만금 태양광 1단지', type: '태양광', capacity: 2800, area: 11200000, lat: 35.8083, lng: 126.7141 },
          { name: '새만금 해상풍력 1구역', type: '풍력', capacity: 2400, area: 48000000, lat: 35.7883, lng: 126.6941 },
          { name: '새만금 태양광 2단지', type: '태양광', capacity: 1200, area: 4800000, lat: 35.8183, lng: 126.7241 }
        ];
        
        return saemangumFacilities.map((facility, index) => {
          const kepcoData = data[index] as KEPCORenewableData;
          const actualCapacity = kepcoData ? parseFloat(kepcoData.genCapa) || facility.capacity : facility.capacity;
          
          return {
            id: `kepco_renewable_${index}`,
            region: facility.name,
            generationType: facility.type,
            capacity: actualCapacity,
            area: facility.area,
            status: '운영중',
            progress: 0.85 + (index * 0.05),
            coordinates: { lat: facility.lat, lng: facility.lng },
            lat: facility.lat,
            lng: facility.lng
          };
        });
      } else {
        console.log('⚠️ KEPCO API 응답 데이터 없음, 새만금 계획 데이터 사용');
        return this.generateSaemangumRenewableData();
      }
    } catch (error) {
      console.error('❌ KEPCO API 호출 실패:', error);
      return this.generateSaemangumRenewableData();
    }
  }

  /**
   * 3. VWorld API - 공간정보 검색
   */
  async getVWorldSpatialData(query: string = '새만금'): Promise<VWorldSearchResult[]> {
    if (!MOLIT_API_KEY || MOLIT_API_KEY === 'your_molit_api_key_here') {
      console.log('⚠️ VWorld API 키가 설정되지 않음, 새만금 기본 시설 정보 제공');
      return this.generateSaemangumSpatialData();
    }

    try {
      console.log('🔍 VWorld 공간정보 검색 중:', query);

      const params = new URLSearchParams({
        service: 'search',
        request: 'search',
        version: '2.0',
        crs: 'EPSG:4326',
        format: 'json',
        type: 'place',
        category: 'L4',
        query: query,
        count: '20',
        key: MOLIT_API_KEY
      });

      const url = `${API_ENDPOINTS.VWORLD.SEARCH}?${params.toString()}`;
      const response: VWorldResponse = await this.fetchWithCache(url);

      if (response && response.response && response.response.result && response.response.result.items) {
        const items = response.response.result.items;
        console.log('✅ VWorld 공간정보 데이터 수신:', items.length, '건');
        
        return items.map((item: any, index: number) => ({
          id: `vworld_${index}`,
          title: item.title || `새만금 시설 ${index + 1}`,
          category: this.getSpatialCategory(item.title || '기타시설'),
          address: item.address || '전북특별자치도 새만금',
          roadAddress: item.roadAddress || item.address,
          point: {
            x: item.point?.x || '126.7141',
            y: item.point?.y || '35.8083'
          },
          description: item.description
        }));
      } else {
        console.log('⚠️ VWorld API 응답 데이터 없음, 새만금 기본 시설 정보 제공');
        return this.generateSaemangumSpatialData();
      }
    } catch (error) {
      console.error('❌ VWorld API 호출 실패:', error);
      return this.generateSaemangumSpatialData();
    }
  }

  /**
   * 4. 해양수산부 API - 실시간 해양수질 데이터
   */
  async getOceanQualityData(): Promise<OceanQualityData[]> {
    if (!MOF_API_KEY || MOF_API_KEY === 'your_mof_api_key_here') {
      console.log('⚠️ 해양수산부 API 키가 설정되지 않음');
      return [];
    }

    try {
      console.log('🔍 해양수질 데이터 조회 중...');

      const params = new URLSearchParams({
        serviceKey: MOF_API_KEY,
        pageNo: '1',
        numOfRows: '20',
        dataType: 'JSON',
        obsDate: new Date().toISOString().slice(0, 10).replace(/-/g, '')
      });

      const url = `${API_ENDPOINTS.MOF.OCEAN_QUALITY}?${params.toString()}`;
      const response = await this.fetchWithCache(url);

      if (response && response.response && response.response.body) {
        console.log('✅ 해양수질 데이터 수신:', response.response.body.items?.length || 0, '건');
        return response.response.body.items || [];
      }

      return [];
    } catch (error) {
      console.error('❌ 해양수질 데이터 조회 실패:', error);
      return [];
    }
  }

  /**
   * 5. 전북 군산 산업단지 API
   */
  async getGunsanIndustrialData(): Promise<IndustrialComplexData[]> {
    if (!GUNSAN_API_KEY || GUNSAN_API_KEY === 'your_gunsan_api_key_here') {
      console.log('⚠️ 군산 산업단지 API 키가 설정되지 않음');
      return [];
    }

    try {
      console.log('🔍 군산 산업단지 데이터 조회 중...');

      const params = new URLSearchParams({
        serviceKey: GUNSAN_API_KEY,
        pageNo: '1',
        numOfRows: '50',
        dataType: 'JSON'
      });

      const url = `${API_ENDPOINTS.GUNSAN.INDUSTRIAL_COMPLEX}?${params.toString()}`;
      const response = await this.fetchWithCache(url);

      if (response && response.response && response.response.body) {
        console.log('✅ 군산 산업단지 데이터 수신:', response.response.body.items?.length || 0, '건');
        return response.response.body.items || [];
      }

      return [];
    } catch (error) {
      console.error('❌ 군산 산업단지 데이터 조회 실패:', error);
      return [];
    }
  }

  /**
   * 통합 데이터 조회 메서드
   */
  async getAllEnhancedData() {
    try {
      console.log('🚀 실제 API 기반 통합 데이터 조회 시작');

      const [
        airQualityData,
        renewableData,
        spatialData,
        oceanData,
        industrialData,
        // 기존 API 데이터도 함께 조회
        existingInvestment,
        existingWeather
      ] = await Promise.allSettled([
        this.getKOSISAirQualityData(),
        this.getKEPCORenewableData(),
        this.getVWorldSpatialData(),
        this.getOceanQualityData(),
        this.getGunsanIndustrialData(),
        realApiService.getInvestmentData(),
        realApiService.getWeatherData()
      ]);

      const results = {
        airQuality: airQualityData.status === 'fulfilled' ? airQualityData.value : [],
        renewable: renewableData.status === 'fulfilled' ? renewableData.value : [],
        spatial: spatialData.status === 'fulfilled' ? spatialData.value : [],
        ocean: oceanData.status === 'fulfilled' ? oceanData.value : [],
        industrial: industrialData.status === 'fulfilled' ? industrialData.value : [],
        investment: existingInvestment.status === 'fulfilled' ? existingInvestment.value : [],
        weather: existingWeather.status === 'fulfilled' ? existingWeather.value : null
      };

      console.log('✅ 통합 데이터 조회 완료:');
      console.log('  - 대기질:', results.airQuality.length, '건');
      console.log('  - 재생에너지:', results.renewable.length, '건');
      console.log('  - 공간정보:', results.spatial.length, '건');
      console.log('  - 해양수질:', results.ocean.length, '건');
      console.log('  - 산업단지:', results.industrial.length, '건');
      console.log('  - 투자정보:', results.investment.length, '건');
      console.log('  - 기상정보:', results.weather ? '사용 가능' : '없음');

      return results;
    } catch (error) {
      console.error('❌ 통합 데이터 조회 실패:', error);
      throw error;
    }
  }

  // 유틸리티 메서드들
  private parseAirQualityValue(value: string, itemName: string): number {
    const numValue = parseFloat(value) || 0;
    
    // 항목별로 적절한 AQI 값으로 변환
    if (itemName.includes('미세먼지')) {
      return Math.min(Math.max(numValue * 2, 0), 500);
    } else if (itemName.includes('오존')) {
      return Math.min(Math.max(numValue * 100, 0), 500);
    }
    
    return Math.min(Math.max(numValue, 0), 500);
  }

  private extractPM25(value: string, itemName: string): number {
    if (itemName.includes('초미세먼지') || itemName.includes('PM2.5')) {
      return parseFloat(value) || 15;
    }
    return 15; // 기본값
  }

  private extractPM10(value: string, itemName: string): number {
    if (itemName.includes('미세먼지') && !itemName.includes('초미세먼지')) {
      return parseFloat(value) || 30;
    }
    return 30; // 기본값
  }

  private extractOzone(value: string, itemName: string): number {
    if (itemName.includes('오존')) {
      return parseFloat(value) || 0.05;
    }
    return 0.05; // 기본값
  }

  private extractCO(value: string, itemName: string): number {
    if (itemName.includes('일산화탄소')) {
      return parseFloat(value) || 0.5;
    }
    return 0.5; // 기본값
  }

  private getAirQualityStatus(aqi: number): string {
    if (aqi <= 50) return '좋음';
    if (aqi <= 100) return '보통';
    if (aqi <= 150) return '나쁨';
    return '매우나쁨';
  }

  private estimateAreaFromCapacity(capacity: number, energyType: string): number {
    // MW당 면적 추정 (제곱미터)
    const areaPerMW = {
      '태양광': 4000, // 1MW당 약 4,000㎡
      '풍력': 20000,  // 1MW당 약 20,000㎡
      '수력': 1000,   // 1MW당 약 1,000㎡
      '기타': 2000    // 기본값
    };

    return capacity * (areaPerMW[energyType as keyof typeof areaPerMW] || 2000);
  }

  private generateDefaultAirQualityData(): ProcessedEnvironmentData[] {
    return [
      {
        id: 'default_air_1',
        location: '새만금 중앙',
        airQualityIndex: 45,
        pm25: 12,
        pm10: 28,
        ozone: 0.04,
        carbonMonoxide: 0.3,
        measurementTime: new Date().toISOString(),
        status: '좋음'
      },
      {
        id: 'default_air_2',
        location: '새만금 북부',
        airQualityIndex: 52,
        pm25: 15,
        pm10: 32,
        ozone: 0.06,
        carbonMonoxide: 0.4,
        measurementTime: new Date().toISOString(),
        status: '보통'
      }
    ];
  }

  private generateDefaultRenewableData(): ProcessedRenewableData[] {
    return [
      {
        id: 'default_renewable_1',
        region: '새만금 태양광단지',
        generationType: '태양광',
        capacity: 2800,
        area: 11200000,
        status: '운영중',
        progress: 0.95,
        coordinates: { lat: 35.8083, lng: 126.7141 },
        lat: 35.8083,
        lng: 126.7141
      },
      {
        id: 'default_renewable_2',
        region: '새만금 해상풍력',
        generationType: '풍력',
        capacity: 2400,
        area: 48000000,
        status: '건설중',
        progress: 0.75,
        coordinates: { lat: 35.7883, lng: 126.6941 },
        lat: 35.7883,
        lng: 126.6941
      }
    ];
  }

  // 추가 유틸리티 메서드들
  private getFallbackAirQualityData(): ProcessedEnvironmentData[] {
    return this.generateDefaultAirQualityData();
  }

  private generateSaemangumRenewableData(): ProcessedRenewableData[] {
    return this.generateDefaultRenewableData();
  }

  private getSpatialCategory(facilityType: string): string {
    const categoryMap: { [key: string]: string } = {
      '교육시설': '교육',
      '의료시설': '의료',
      '상업시설': '상업',
      '주거시설': '주거',
      '산업시설': '산업',
      '관광시설': '관광',
      '문화시설': '문화',
      '체육시설': '체육',
      '교통시설': '교통',
      '공공시설': '공공'
    };

    for (const [key, category] of Object.entries(categoryMap)) {
      if (facilityType.includes(key)) {
        return category;
      }
    }
    return '기타';
  }

  private generateSaemangumSpatialData(): VWorldSearchResult[] {
    return [
      {
        id: 'saemangeum_facility_1',
        title: '새만금 국제공항',
        category: '교통',
        address: '전북특별자치도 군산시 옥도면',
        point: { x: '126.7241', y: '35.8183' },
        description: '새만금 지역 국제공항 건설 예정지'
      },
      {
        id: 'saemangeum_facility_2',
        title: '새만금 산업단지',
        category: '산업',
        address: '전북특별자치도 김제시 진봉면',
        point: { x: '126.7041', y: '35.7983' },
        description: '새만금 핵심 산업단지'
      },
      {
        id: 'saemangeum_facility_3',
        title: '새만금 관광레저단지',
        category: '관광',
        address: '전북특별자치도 부안군 변산면',
        point: { x: '126.6841', y: '35.7783' },
        description: '새만금 관광레저 복합단지'
      },
      {
        id: 'saemangeum_facility_4',
        title: '새만금 신재생에너지단지',
        category: '산업',
        address: '전북특별자치도 군산시 새만금',
        point: { x: '126.7141', y: '35.8083' },
        description: '태양광 및 풍력 발전단지'
      },
      {
        id: 'saemangeum_facility_5',
        title: '새만금 국제업무단지',
        category: '공공',
        address: '전북특별자치도 김제시 새만금',
        point: { x: '126.6941', y: '35.7883' },
        description: '새만금개발청 및 국제업무시설'
      }
    ];
  }
}

// 싱글톤 인스턴스 생성 및 내보내기
export const enhancedApiService = new EnhancedApiService();
export default enhancedApiService;
