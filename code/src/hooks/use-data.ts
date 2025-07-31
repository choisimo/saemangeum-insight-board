import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { realApiService } from '@/services/real-api-service';
import type { 
  ProcessedInvestmentData, 
  ProcessedRenewableData, 
  ProcessedWeatherData, 
  ProcessedTrafficData
} from '@/services/real-api-service';

// React Query 설정 - 실제 API 호출용
const QUERY_OPTIONS = {
  staleTime: 2 * 60 * 1000, // 2분 (실제 데이터이므로 더 자주 갱신)
  gcTime: 5 * 60 * 1000, // 5분
  refetchOnWindowFocus: true, // 포커스 시 실제 데이터 갱신
  retry: 2, // API 실패 시 2번만 재시도
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 10000),
} as const;

// 데이터 품질 검증 훅
export function useDataQuality(): {
  quality: any;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const query = useQuery({
    queryKey: ['data-quality'],
    queryFn: () => realApiService.validateAllData(),
    ...QUERY_OPTIONS,
    staleTime: 5 * 60 * 1000, // 데이터 품질은 5분 캐시
  });

  return {
    quality: query.data || null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// 투자 데이터 훅 - 실제 API만 사용
export function useInvestmentData(): {
  data: ProcessedInvestmentData[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const query: UseQueryResult<ProcessedInvestmentData[], Error> = useQuery({
    queryKey: ['real-investment-data'],
    queryFn: () => realApiService.getInvestmentData(),
    ...QUERY_OPTIONS,
  });

  return {
    data: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// 교통량 데이터 훅 - 실제 API만 사용 (현재 API 없음)
export function useTrafficData(): {
  data: ProcessedTrafficData[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const query: UseQueryResult<ProcessedTrafficData[], Error> = useQuery({
    queryKey: ['real-traffic-data'],
    queryFn: () => realApiService.getTrafficData(),
    ...QUERY_OPTIONS,
  });

  return {
    data: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// 재생에너지 데이터 훅 - 실제 API만 사용
export function useRenewableEnergyData(): {
  data: ProcessedRenewableData[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const query: UseQueryResult<ProcessedRenewableData[], Error> = useQuery({
    queryKey: ['real-renewable-energy-data'],
    queryFn: () => realApiService.getRenewableEnergyData(),
    ...QUERY_OPTIONS,
  });

  return {
    data: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// 날씨 데이터 훅 - 실제 API만 사용
export function useWeatherData(): {
  data: ProcessedWeatherData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const query: UseQueryResult<ProcessedWeatherData | null, Error> = useQuery({
    queryKey: ['real-weather-data'],
    queryFn: () => realApiService.getWeatherData(),
    ...QUERY_OPTIONS,
    staleTime: 1 * 60 * 1000, // 실제 기상 데이터는 1분마다 갱신
  });

  return {
    data: query.data || null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// 토지 데이터 훅 - 실제 API 없음
export function useLandData(): {
  data: any[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  return {
    data: [], // 실제 API가 없으므로 빈 배열
    loading: false,
    error: new Error('토지 데이터 API가 설정되지 않았습니다.'),
    refetch: () => {},
  };
}

// 건축 허가 데이터 훅 - 실제 API 없음
export function useBuildingPermitData(): {
  data: any[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  return {
    data: [], // 실제 API가 없으므로 빈 배열
    loading: false,
    error: new Error('건축 허가 데이터 API가 설정되지 않았습니다.'),
    refetch: () => {},
  };
}

// 유틸리티 데이터 훅 - 실제 API 없음
export function useUtilityData(): {
  data: any[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  return {
    data: [], // 실제 API가 없으므로 빈 배열
    loading: false,
    error: new Error('유틸리티 데이터 API가 설정되지 않았습니다.'),
    refetch: () => {},
  };
}

// 실제 API 데이터만 가져오는 훅
export function useAllData() {
  const investment = useInvestmentData();
  const renewable = useRenewableEnergyData();
  const weather = useWeatherData();
  const traffic = useTrafficData();
  const quality = useDataQuality();

  const loading = investment.loading || renewable.loading || weather.loading || 
                 traffic.loading || quality.loading;

  const error = investment.error || renewable.error || weather.error || 
               traffic.error || quality.error;

  const refetchAll = () => {
    investment.refetch();
    renewable.refetch();
    weather.refetch();
    traffic.refetch();
    quality.refetch();
  };

  return {
    data: {
      investment: investment.data,
      renewable: renewable.data,
      weather: weather.data,
      traffic: traffic.data,
      quality: quality.quality,
    },
    loading,
    error,
    refetchAll,
  };
}

// 실제 API 데이터 품질 검증 훅 (위에서 이미 정의됨)