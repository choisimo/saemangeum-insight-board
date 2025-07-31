import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary, NetworkStatus } from "@/components/ErrorBoundary";
import { ApiTest } from "@/components/ApiTest";
import { DataValidation } from "@/components/DataValidation";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { 
  useInvestmentActions,
  useRenewableActions,
  useWeatherActions,
  useTrafficActions,
  useEnvironmentActions,
  useEnergyActions
} from "@/stores";

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분 (cacheTime 대신 gcTime 사용)
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // 네트워크 에러인 경우 3회까지 재시도
        if (error instanceof Error && error.message.includes('fetch')) {
          return failureCount < 3;
        }
        // 다른 에러는 1회만 재시도
        return failureCount < 1;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// 데이터 초기화 컴포넌트
const DataInitializer = () => {
  const investmentActions = useInvestmentActions();
  const renewableActions = useRenewableActions();
  const weatherActions = useWeatherActions();
  const trafficActions = useTrafficActions();
  const environmentActions = useEnvironmentActions();
  const energyActions = useEnergyActions();

  useEffect(() => {
    const initializeData = async () => {
      console.log('데이터 초기화 시작...');
      
      try {
        // 병렬로 모든 데이터 로드
        await Promise.all([
          investmentActions.fetchData(),
          renewableActions.fetchData(),
          weatherActions.fetchData(),
          trafficActions.fetchData(),
          environmentActions.fetchData(),
          energyActions.fetchData()
        ]);
        
        console.log('모든 데이터 초기화 완료');
      } catch (error) {
        console.error('데이터 초기화 실패:', error);
      }
    };

    initializeData();
    
    // 5분마다 데이터 새로고침
    const interval = setInterval(initializeData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []); // 빈 의존성 배열로 변경하여 마운트 시에만 실행

  return null;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DataInitializer />
        <NetworkStatus />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/api-test" element={<ApiTest />} />
            <Route path="/data-validation" element={<DataValidation />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
