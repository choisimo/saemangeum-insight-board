/**
 * 실제 API 기반 데이터 훅
 * KOSIS, KEPCO 등 실제 API를 활용한 데이터 페칭
 * 기존 훅들과 호환성 유지
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { enhancedApiService } from '../services/enhanced-api-service';
import { ProcessedInvestmentData, ProcessedRenewableData, ProcessedEnvironmentData } from '../services/real-api-service';

// 통합 데이터 타입 정의
export interface EnhancedDataState {
  // 실제 API 데이터
  airQuality: ProcessedEnvironmentData[];
  renewableEnergy: ProcessedRenewableData[];
  spatialData: any[];
  oceanQuality: any[];
  industrialData: any[];
  
  // 기존 API 데이터
  investment: ProcessedInvestmentData[];
  weather: any;
  
  // 로딩 상태
  loading: {
    airQuality: boolean;
    renewable: boolean;
    spatial: boolean;
    ocean: boolean;
    industrial: boolean;
    overall: boolean;
  };
  
  // 오류 상태
  errors: {
    airQuality: string | null;
    renewable: string | null;
    spatial: string | null;
    ocean: string | null;
    industrial: string | null;
  };
  
  // 데이터 품질
  quality: {
    airQuality: number;
    renewable: number;
    spatial: number;
    ocean: number;
    industrial: number;
    overall: number;
  };
  
  // 마지막 업데이트 시간
  lastUpdated: Date | null;
}

// 초기 상태
const initialState: EnhancedDataState = {
  airQuality: [],
  renewableEnergy: [],
  spatialData: [],
  oceanQuality: [],
  industrialData: [],
  investment: [],
  weather: null,
  loading: {
    airQuality: false,
    renewable: false,
    spatial: false,
    ocean: false,
    industrial: false,
    overall: false
  },
  errors: {
    airQuality: null,
    renewable: null,
    spatial: null,
    ocean: null,
    industrial: null
  },
  quality: {
    airQuality: 0,
    renewable: 0,
    spatial: 0,
    ocean: 0,
    industrial: 0,
    overall: 0
  },
  lastUpdated: null
};

/**
 * 실제 API 기반 통합 데이터 훅
 */
export function useEnhancedData() {
  const [state, setState] = useState<EnhancedDataState>(initialState);

  // 개별 API 호출 함수들
  const fetchAirQualityData = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, airQuality: true },
      errors: { ...prev.errors, airQuality: null }
    }));

    try {
      console.log('🌬️ KOSIS 대기질 데이터 페칭 중...');
      const data = await enhancedApiService.getKOSISAirQualityData();
      
      setState(prev => ({
        ...prev,
        airQuality: data,
        loading: { ...prev.loading, airQuality: false },
        quality: {
          ...prev.quality,
          airQuality: data.length > 0 ? 95 : 0
        }
      }));
      
      console.log('✅ KOSIS 대기질 데이터 로드 완료:', data.length, '건');
    } catch (error) {
      console.error('❌ KOSIS 대기질 데이터 로드 실패:', error);
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, airQuality: false },
        errors: { ...prev.errors, airQuality: error instanceof Error ? error.message : '알 수 없는 오류' }
      }));
    }
  }, []);

  const fetchRenewableData = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, renewable: true },
      errors: { ...prev.errors, renewable: null }
    }));

    try {
      console.log('⚡ KEPCO 재생에너지 데이터 페칭 중...');
      const data = await enhancedApiService.getKEPCORenewableData();
      
      setState(prev => ({
        ...prev,
        renewableEnergy: data,
        loading: { ...prev.loading, renewable: false },
        quality: {
          ...prev.quality,
          renewable: data.length > 0 ? 90 : 0
        }
      }));
      
      console.log('✅ KEPCO 재생에너지 데이터 로드 완료:', data.length, '건');
    } catch (error) {
      console.error('❌ KEPCO 재생에너지 데이터 로드 실패:', error);
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, renewable: false },
        errors: { ...prev.errors, renewable: error instanceof Error ? error.message : '알 수 없는 오류' }
      }));
    }
  }, []);

  const fetchSpatialData = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, spatial: true },
      errors: { ...prev.errors, spatial: null }
    }));

    try {
      console.log('🗺️ VWorld 공간정보 데이터 페칭 중...');
      const data = await enhancedApiService.getVWorldSpatialData('새만금');
      
      setState(prev => ({
        ...prev,
        spatialData: data,
        loading: { ...prev.loading, spatial: false },
        quality: {
          ...prev.quality,
          spatial: data.length > 0 ? 85 : 0
        }
      }));
      
      console.log('✅ VWorld 공간정보 데이터 로드 완료:', data.length, '건');
    } catch (error) {
      console.error('❌ VWorld 공간정보 데이터 로드 실패:', error);
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, spatial: false },
        errors: { ...prev.errors, spatial: error instanceof Error ? error.message : '알 수 없는 오류' }
      }));
    }
  }, []);

  const fetchOceanData = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, ocean: true },
      errors: { ...prev.errors, ocean: null }
    }));

    try {
      console.log('🌊 해양수산부 해양수질 데이터 페칭 중...');
      const data = await enhancedApiService.getOceanQualityData();
      
      setState(prev => ({
        ...prev,
        oceanQuality: data,
        loading: { ...prev.loading, ocean: false },
        quality: {
          ...prev.quality,
          ocean: data.length > 0 ? 80 : 0
        }
      }));
      
      console.log('✅ 해양수산부 해양수질 데이터 로드 완료:', data.length, '건');
    } catch (error) {
      console.error('❌ 해양수산부 해양수질 데이터 로드 실패:', error);
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, ocean: false },
        errors: { ...prev.errors, ocean: error instanceof Error ? error.message : '알 수 없는 오류' }
      }));
    }
  }, []);

  const fetchIndustrialData = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, industrial: true },
      errors: { ...prev.errors, industrial: null }
    }));

    try {
      console.log('🏭 전북 군산 산업단지 데이터 페칭 중...');
      const data = await enhancedApiService.getGunsanIndustrialData();
      
      setState(prev => ({
        ...prev,
        industrialData: data,
        loading: { ...prev.loading, industrial: false },
        quality: {
          ...prev.quality,
          industrial: data.length > 0 ? 75 : 0
        }
      }));
      
      console.log('✅ 전북 군산 산업단지 데이터 로드 완료:', data.length, '건');
    } catch (error) {
      console.error('❌ 전북 군산 산업단지 데이터 로드 실패:', error);
      setState(prev => ({
        ...prev,
        loading: { ...prev.loading, industrial: false },
        errors: { ...prev.errors, industrial: error instanceof Error ? error.message : '알 수 없는 오류' }
      }));
    }
  }, []);

  // 통합 데이터 페칭
  const fetchAllData = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: { ...prev.loading, overall: true }
    }));

    try {
      console.log('🚀 실제 API 기반 통합 데이터 페칭 시작');
      
      const results = await enhancedApiService.getAllEnhancedData();
      
      setState(prev => {
        const newQuality = {
          airQuality: results.airQuality.length > 0 ? 95 : 0,
          renewable: results.renewable.length > 0 ? 90 : 0,
          spatial: results.spatial.length > 0 ? 85 : 0,
          ocean: results.ocean.length > 0 ? 80 : 0,
          industrial: results.industrial.length > 0 ? 75 : 0,
          overall: 0
        };
        
        // 전체 품질 점수 계산
        const qualityValues = Object.values(newQuality).filter(q => q > 0);
        newQuality.overall = qualityValues.length > 0 
          ? Math.round(qualityValues.reduce((sum, q) => sum + q, 0) / qualityValues.length)
          : 0;

        return {
          ...prev,
          airQuality: results.airQuality,
          renewableEnergy: results.renewable,
          spatialData: results.spatial,
          oceanQuality: results.ocean,
          industrialData: results.industrial,
          investment: results.investment,
          weather: results.weather,
          loading: {
            airQuality: false,
            renewable: false,
            spatial: false,
            ocean: false,
            industrial: false,
            overall: false
          },
          quality: newQuality,
          lastUpdated: new Date()
        };
      });
      
      console.log('✅ 실제 API 기반 통합 데이터 페칭 완료');
    } catch (error) {
      console.error('❌ 통합 데이터 페칭 실패:', error);
      setState(prev => ({
        ...prev,
        loading: {
          airQuality: false,
          renewable: false,
          spatial: false,
          ocean: false,
          industrial: false,
          overall: false
        }
      }));
    }
  }, []);

  // 데이터 새로고침
  const refreshData = useCallback(() => {
    console.log('🔄 실제 API 데이터 새로고침');
    fetchAllData();
  }, [fetchAllData]);

  // 초기 데이터 로드
  useEffect(() => {
    console.log('🎯 실제 API 기반 데이터 훅 초기화');
    fetchAllData();
  }, [fetchAllData]);

  // 자동 새로고침 (10분마다)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('⏰ 자동 데이터 새로고침 (10분)');
      fetchAllData();
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchAllData]);

  // 메모이제이션된 계산 값들
  const computedValues = useMemo(() => {
    const totalAirQualityStations = state.airQuality.length;
    const totalRenewableCapacity = state.renewableEnergy.reduce((sum, item) => sum + item.capacity, 0);
    const averageAirQuality = state.airQuality.length > 0 
      ? state.airQuality.reduce((sum, item) => sum + item.airQualityIndex, 0) / state.airQuality.length
      : 0;

    return {
      totalAirQualityStations,
      totalRenewableCapacity,
      averageAirQuality,
      isDataAvailable: state.airQuality.length > 0 || state.renewableEnergy.length > 0,
      overallDataQuality: state.quality.overall
    };
  }, [state.airQuality, state.renewableEnergy, state.quality.overall]);

  return {
    // 데이터
    ...state,
    
    // 계산된 값들
    ...computedValues,
    
    // 액션 함수들
    fetchAllData,
    fetchAirQualityData,
    fetchRenewableData,
    fetchSpatialData,
    fetchOceanData,
    fetchIndustrialData,
    refreshData,
    
    // 유틸리티
    isLoading: Object.values(state.loading).some(loading => loading),
    hasErrors: Object.values(state.errors).some(error => error !== null),
    errorMessages: Object.values(state.errors).filter(error => error !== null)
  };
}

/**
 * 대기질 데이터만 사용하는 경량 훅
 */
export function useAirQualityData() {
  const [airQuality, setAirQuality] = useState<ProcessedEnvironmentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await enhancedApiService.getKOSISAirQualityData();
      setAirQuality(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { airQuality, loading, error, refetch: fetchData };
}

/**
 * 재생에너지 데이터만 사용하는 경량 훅
 */
export function useRenewableEnergyData() {
  const [renewableEnergy, setRenewableEnergy] = useState<ProcessedRenewableData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await enhancedApiService.getKEPCORenewableData();
      setRenewableEnergy(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { renewableEnergy, loading, error, refetch: fetchData };
}

export default useEnhancedData;
