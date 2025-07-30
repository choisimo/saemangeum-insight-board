import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { dataService } from '@/lib/data-service';
import type { 
  InvestmentData, 
  RenewableEnergyData, 
  WeatherData, 
  TrafficData,
  LandData,
  ReclaimData,
  BuildingPermitData,
  UtilityData,
  DataResponse
} from '@/lib/data-service';

// React Query 설정
const QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5분
  gcTime: 10 * 60 * 1000, // 10분
  refetchOnWindowFocus: false,
  retry: 3,
  retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
} as const;

// 데이터셋 메타데이터 훅
export function useDatasets(): {
  datasets: DataResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const query: UseQueryResult<DataResponse, Error> = useQuery({
    queryKey: ['datasets'],
    queryFn: () => dataService.loadDatasets(),
    ...QUERY_OPTIONS,
    staleTime: 30 * 60 * 1000, // 메타데이터는 30분 캐시
  });

  return {
    datasets: query.data || null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// 투자 데이터 훅
export function useInvestmentData(): {
  data: InvestmentData[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const query: UseQueryResult<InvestmentData[], Error> = useQuery({
    queryKey: ['investment-data'],
    queryFn: () => dataService.getInvestmentData(),
    ...QUERY_OPTIONS,
  });

  return {
    data: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// 교통량 데이터 훅
export function useTrafficData(): {
  data: TrafficData[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const query: UseQueryResult<TrafficData[], Error> = useQuery({
    queryKey: ['traffic-data'],
    queryFn: () => dataService.getTrafficData(),
    ...QUERY_OPTIONS,
  });

  return {
    data: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// 재생에너지 데이터 훅
export function useRenewableEnergyData(): {
  data: RenewableEnergyData[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const query: UseQueryResult<RenewableEnergyData[], Error> = useQuery({
    queryKey: ['renewable-energy-data'],
    queryFn: () => dataService.getRenewableEnergyData(),
    ...QUERY_OPTIONS,
  });

  return {
    data: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// 날씨 데이터 훅
export function useWeatherData(): {
  data: WeatherData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const query: UseQueryResult<WeatherData | null, Error> = useQuery({
    queryKey: ['weather-data'],
    queryFn: () => dataService.getWeatherData(),
    ...QUERY_OPTIONS,
    staleTime: 2 * 60 * 1000, // 날씨는 2분마다 갱신
  });

  return {
    data: query.data || null,
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// 토지 데이터 훅
export function useLandData(): {
  data: Array<LandData | ReclaimData>;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const query: UseQueryResult<Array<LandData | ReclaimData>, Error> = useQuery({
    queryKey: ['land-data'],
    queryFn: () => dataService.getLandData(),
    ...QUERY_OPTIONS,
  });

  return {
    data: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// 건축 허가 데이터 훅
export function useBuildingPermitData(): {
  data: BuildingPermitData[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const query: UseQueryResult<BuildingPermitData[], Error> = useQuery({
    queryKey: ['building-permit-data'],
    queryFn: () => dataService.getBuildingPermitData(),
    ...QUERY_OPTIONS,
  });

  return {
    data: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// 유틸리티 데이터 훅
export function useUtilityData(): {
  data: UtilityData[];
  loading: boolean;
  error: Error | null;
  refetch: () => void;
} {
  const query: UseQueryResult<UtilityData[], Error> = useQuery({
    queryKey: ['utility-data'],
    queryFn: () => dataService.getUtilityData(),
    ...QUERY_OPTIONS,
  });

  return {
    data: query.data || [],
    loading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

// 모든 데이터를 한번에 가져오는 훅
export function useAllData() {
  const investment = useInvestmentData();
  const renewable = useRenewableEnergyData();
  const weather = useWeatherData();
  const traffic = useTrafficData();
  const land = useLandData();
  const building = useBuildingPermitData();
  const utility = useUtilityData();
  const datasets = useDatasets();

  const loading = investment.loading || renewable.loading || weather.loading || 
                 traffic.loading || land.loading || building.loading || 
                 utility.loading || datasets.loading;

  const error = investment.error || renewable.error || weather.error || 
               traffic.error || land.error || building.error || 
               utility.error || datasets.error;

  const refetchAll = () => {
    investment.refetch();
    renewable.refetch();
    weather.refetch();
    traffic.refetch();
    land.refetch();
    building.refetch();
    utility.refetch();
    datasets.refetch();
  };

  return {
    data: {
      investment: investment.data,
      renewable: renewable.data,
      weather: weather.data,
      traffic: traffic.data,
      land: land.data,
      building: building.data,
      utility: utility.data,
      datasets: datasets.datasets,
    },
    loading,
    error,
    refetchAll,
  };
}

// 데이터 품질 검증 훅
export function useDataQuality() {
  const allData = useAllData();

  const quality = {
    investment: {
      total: allData.data.investment.length,
      valid: allData.data.investment.filter(item => item.company && item.investment > 0).length,
    },
    renewable: {
      total: allData.data.renewable.length,
      valid: allData.data.renewable.filter(item => item.region && item.capacity > 0).length,
    },
    traffic: {
      total: allData.data.traffic.length,
      valid: allData.data.traffic.filter(item => item.totalTraffic > 0).length,
    },
    land: {
      total: allData.data.land.length,
      valid: allData.data.land.filter(item => 
        ('location' in item && item.location) || ('region' in item && item.region)
      ).length,
    },
  };

  const overallQuality = {
    totalRecords: Object.values(quality).reduce((sum, q) => sum + q.total, 0),
    validRecords: Object.values(quality).reduce((sum, q) => sum + q.valid, 0),
    qualityScore: Object.values(quality).reduce((sum, q) => sum + q.total, 0) > 0 
      ? Math.round((Object.values(quality).reduce((sum, q) => sum + q.valid, 0) / 
         Object.values(quality).reduce((sum, q) => sum + q.total, 0)) * 100)
      : 0,
  };

  return {
    quality,
    overallQuality,
    loading: allData.loading,
    error: allData.error,
  };
}