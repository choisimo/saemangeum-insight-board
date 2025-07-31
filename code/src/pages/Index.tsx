/**
 * 새만금 인사이트 대시보드 메인 페이지
 * 리팩토링된 구조: Zustand 스토어 사용, 컴포넌트 분할, 타입 안전성, 성능 최적화
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

// 유틸리티
import { formatPercentage } from '@/utils/formatters';

// 컴포넌트들
import { Navigation } from "@/components/Navigation";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { TabNavigation } from "@/components/dashboard/TabNavigation";
import { KPISection } from "@/components/dashboard/KPISection";
import { InvestmentOverview } from "@/components/InvestmentOverview";
import { PolicySimulator } from "@/components/PolicySimulator";
import { SaemangumMap } from "@/components/SaemangumMap";
import { DataMethodology } from "@/components/DataMethodology";
import { DataValidation } from "@/components/DataValidation";
import { AlertCenter } from "@/components/AlertCenter";
import EnvironmentMonitoring from "@/components/EnvironmentMonitoring";

// 훅과 스토어
import { useKPIData } from '@/hooks/use-kpi-data';
import { 
  useInvestmentData, 
  useInvestmentLoading,
  useRenewableData,
  useRenewableLoading,
  useInvestmentStore,
  useRenewableStore,
  useEnvironmentStore,
  useEnergyStore
} from '@/stores';

const Index: React.FC = () => {
  // 로컴 상태
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 스토어에서 데이터 가져오기
  const investmentData = useInvestmentData();
  const investmentLoading = useInvestmentLoading();
  const renewableLoading = useRenewableLoading();
  
  // KPI 데이터는 나중에 추가
  const kpiData = {
    totalInvestment: { value: 0, unit: '억원', change: 0, changeType: 'neutral' as const },
    newCompanies: { value: 0, unit: '개', change: 0, changeType: 'neutral' as const },
    employment: { value: 0, unit: '명', change: 0, changeType: 'neutral' as const, target: 1000, progress: 0 },
    salesRate: { value: 0, unit: '%', change: 0, changeType: 'neutral' as const },
    renewableEnergy: { value: 0, unit: 'MW', change: 0, changeType: 'neutral' as const },
    complaints: { value: 0, unit: '건', change: 0, changeType: 'neutral' as const }
  };
  
  // 환경 및 에너지 데이터 스토어
  const environmentStore = useEnvironmentStore();
  const energyStore = useEnergyStore();
  
  // 로딩 상태 계산
  const loading = investmentLoading || renewableLoading || environmentStore.loading || energyStore.loading;
  const hasErrors = !!(environmentStore.error || energyStore.error);
  
  // 데이터 품질 계산 (임시로 85% 고정값 사용)
  const overallDataQuality = 85;
  
  // 컴포넌트 마운트 시 데이터 초기화
  useEffect(() => {
    const fetchInvestmentData = useInvestmentStore.getState().fetchData;
    const fetchRenewableData = useRenewableStore.getState().fetchData;
    const fetchEnvironmentData = useEnvironmentStore.getState().fetchData;
    const fetchEnergyData = useEnergyStore.getState().fetchData;
    
    fetchInvestmentData();
    fetchRenewableData();
    fetchEnvironmentData();
    fetchEnergyData();
  }, []); // 빈 의존성 배열로 무한 루프 방지
  
  // 탭 변경 핸들러
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);
  
  // KPI 카드 클릭 핸들러
  const handleKPICardClick = useCallback((targetTab: string) => {
    setActiveTab(targetTab);
  }, []);

  // 렌더링 함수들
  const renderLoadingState = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-gray-600">데이터를 불러오는 중...</p>
      </div>
    </div>
  );

  const renderErrorState = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="text-red-600 mb-4">
          <p>데이터 로딩 중 오류가 발생했습니다.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          새로고침
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <KPISection 
              kpiData={kpiData} 
              loading={loading} 
              onCardClick={handleKPICardClick}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PolicySimulator />
              <SaemangumMap />
            </div>
          </div>
        );
      
      // 보고서 섹션 - 상세 분석 보고서
      case "reports":
      case "investment":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">투자유치 보고서</h1>
              <p className="text-gray-600">상세 투자 분석 및 전망</p>
            </div>
            <InvestmentOverview data={investmentData} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">투자 현황 상세</h3>
                <div className="space-y-4">
                  {investmentData.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <h4 className="font-medium text-lg">{item.company}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.sector} · {item.region}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">투자액:</span>
                          <span className="font-medium ml-2">{item.investment}억원</span>
                        </div>
                        <div>
                          <span className="text-gray-500">고용창출:</span>
                          <span className="font-medium ml-2">{item.expectedJobs}명</span>
                        </div>
                      </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">진행률</span>
                            <span className="font-medium">{item.progress.toFixed(2)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">지역별 투자 현황</h3>
                <SaemangumMap />
              </div>
            </div>
          </div>
        );
      
      // 모니터링 섹션 - 실시간 모니터링
      case "monitoring":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">실시간 모니터링</h1>
              <p className="text-gray-600">종합 현황 및 실시간 데이터 모니터링</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PolicySimulator />
              <SaemangumMap />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-lg shadow">
                <h4 className="font-semibold mb-3">대기질 지수</h4>
                <div className="text-2xl font-bold text-green-600">42 AQI</div>
                <div className="text-sm text-gray-500">좋음</div>
              </div>
              <div className="p-6 bg-white rounded-lg shadow">
                <h4 className="font-semibold mb-3">수질 지수</h4>
                <div className="text-2xl font-bold text-blue-600">1급</div>
                <div className="text-sm text-gray-500">매우 좋음</div>
              </div>
              <div className="p-6 bg-white rounded-lg shadow">
                <h4 className="font-semibold mb-3">소음 수준</h4>
                <div className="text-2xl font-bold text-yellow-600">45 dB</div>
                <div className="text-sm text-gray-500">양호</div>
              </div>
            </div>
          </div>
        );
      
      // 데이터 검증 섹션 - 품질 관리 및 검증
      case "validation":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">데이터 품질 관리</h1>
              <p className="text-gray-600">데이터 검증 및 품질 관리 현황</p>
            </div>
            <DataValidation />
          </div>
        );
      
      // 정책 시뮬레이션 섹션
      case "policy":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">정책 시뮬레이션</h1>
              <p className="text-gray-600">데이터 기반 정책 효과 분석</p>
            </div>
            <PolicySimulator />
          </div>
        );

      case "environment":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">환경 모니터링</h1>
              <p className="text-gray-600">실제 API 기반 새만금 지역 환경 현황</p>
              <div className="mt-2 text-sm text-gray-500">
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full mr-2">
                  KOSIS API 연동
                </span>
                <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  KEPCO API 연동
                </span>
              </div>
            </div>
            <EnvironmentMonitoring />
          </div>
        );

      case "data-validation":
        return <DataValidation />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <DashboardHeader 
            hasErrors={hasErrors}
            dataQuality={overallDataQuality || 85}
            lastUpdated={new Date()}
          />
          
          <TabNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          {loading && renderLoadingState()}
          {hasErrors && !loading && renderErrorState()}
          {!loading && !hasErrors && renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
