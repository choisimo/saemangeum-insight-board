/**
 * 스토어 통합 export
 */

// 투자 데이터 스토어
export {
  useInvestmentStore,
  useInvestmentData,
  useInvestmentLoading,
  useInvestmentError,
  useInvestmentActions
} from './investment-store';

// 재생에너지 데이터 스토어
export {
  useRenewableStore,
  useRenewableData,
  useRenewableLoading,
  useRenewableError,
  useRenewableActions
} from './renewable-store';

// 기상 데이터 스토어
export {
  useWeatherStore,
  useWeatherData,
  useWeatherLoading,
  useWeatherError,
  useWeatherActions
} from './weather-store';

// 교통량 데이터 스토어
export {
  useTrafficStore,
  useTrafficData,
  useTrafficLoading,
  useTrafficError,
  useTrafficActions
} from './traffic-store';

// 환경 모니터링 데이터 스토어
export {
  useEnvironmentStore,
  useEnvironmentData,
  useEnvironmentLoading,
  useEnvironmentError,
  useEnvironmentActions
} from './environment-store';

// 에너지 생산 데이터 스토어
export {
  useEnergyStore,
  useEnergyData,
  useEnergyLoading,
  useEnergyError,
  useEnergyActions
} from './energy-store';

// 알림 데이터 스토어
export {
  useAlertStore,
  useAlerts,
  useUnreadCount,
  useAlertLoading,
  useAlertError,
  useAlertActions
} from './alert-store';

// UI 상태 스토어
export {
  useUIStore,
  useActiveTab,
  useSidebarOpen,
  useTheme,
  useRefreshInterval,
  useUIActions
} from './ui-store';

// 통합 데이터 페칭 훅
export const useInitializeStores = () => {
  const initializeAll = async () => {
    try {
      console.log('스토어 초기화 시작...');
      // 데이터 로딩은 각 컴포넌트에서 개별적으로 처리
      // 여기서는 스토어 초기화만 수행
      console.log('스토어 초기화 완료');
    } catch (error) {
      console.error('스토어 초기화 실패:', error);
    }
  };

  return { initializeAll };
};