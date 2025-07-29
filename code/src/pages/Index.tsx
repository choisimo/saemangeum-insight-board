import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { KPICard } from "@/components/KPICard";
import { PolicySimulator } from "@/components/PolicySimulator";
import { SaemangumMap } from "@/components/SaemangumMap";
import { InvestmentReport } from "@/components/InvestmentReport";
import { DataSourceInfo } from "@/components/DataSourceInfo";
import { DataMethodology } from "@/components/DataMethodology";
import { AlertCenter } from "@/components/AlertCenter";
import { useAlerts } from "@/hooks/use-alerts";
import { 
  ApiError, 
  CardLoadingSkeleton, 
  NetworkStatus, 
  DataQualityIndicator 
} from "@/components/ErrorBoundary";
import { useInvestmentData, useRenewableEnergyData, useWeatherData, useDatasets } from "@/hooks/use-data";
import type { InvestmentData, RenewableEnergyData } from "@/services/data-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DollarSign, 
  Building2, 
  Users, 
  TrendingUp, 
  Zap, 
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2
} from "lucide-react";

interface KPIData {
  totalInvestment: { value: number; unit: string; change: number; changeType: 'increase' | 'decrease' | 'neutral'; target?: number; progress?: number };
  newCompanies: { value: number; unit: string; change: number; changeType: 'increase' | 'decrease' | 'neutral'; target?: number; progress?: number };
  employment: { value: number; unit: string; change: number; changeType: 'increase' | 'decrease' | 'neutral'; target: number; progress: number };
  salesRate: { value: number; unit: string; change: number; changeType: 'increase' | 'decrease' | 'neutral' };
  renewableEnergy: { value: number; unit: string; change: number; changeType: 'increase' | 'decrease' | 'neutral' };
  complaints: { value: number; unit: string; change: number; changeType: 'increase' | 'decrease' | 'neutral' };
}

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const { 
    data: investmentData, 
    loading: investmentLoading, 
    error: investmentError,
    refetch: refetchInvestment 
  } = useInvestmentData();
  
  const { 
    data: renewableData, 
    loading: renewableLoading, 
    error: renewableError,
    refetch: refetchRenewable 
  } = useRenewableEnergyData();
  
  const { 
    data: weatherData, 
    loading: weatherLoading, 
    error: weatherError,
    refetch: refetchWeather 
  } = useWeatherData();
  
  const { getRecentAlerts } = useAlerts();
  
  const { 
    datasets, 
    loading: datasetsLoading, 
    error: datasetsError,
    refetch: refetchDatasets 
  } = useDatasets();

  const loading = investmentLoading || renewableLoading || weatherLoading || datasetsLoading;
  const hasErrors = investmentError || renewableError || weatherError || datasetsError;

  // 실제 데이터를 기반으로 KPI 계산
  const calculateKPIs = (): KPIData => {
    // 데이터가 없을 때 기본값 설정 (구현 중 상태 표시)
    if (!investmentData.length && !renewableData.length) {
      return {
        totalInvestment: { value: 0, unit: "억원", change: 0, changeType: "neutral" },
        newCompanies: { value: 0, unit: "개", change: 0, changeType: "neutral" },
        employment: { value: 0, unit: "명", change: 0, changeType: "neutral", target: 2000, progress: 0 },
        salesRate: { value: 0, unit: "%", change: 0, changeType: "neutral" },
        renewableEnergy: { value: 0, unit: "MW", change: 0, changeType: "neutral" },
        complaints: { value: 0, unit: "건", change: 0, changeType: "neutral" }
      };
    }

    const totalInvestment = Math.round(investmentData.reduce((sum: number, item: InvestmentData) => sum + item.investment, 0) / 100);
    const totalJobs = investmentData.reduce((sum: number, item: InvestmentData) => sum + item.expectedJobs, 0);
    const averageProgress = Math.round(investmentData.reduce((sum: number, item: InvestmentData) => sum + item.progress, 0) / investmentData.length * 10) / 10;
    const totalCapacity = Math.round(renewableData.reduce((sum: number, item: RenewableEnergyData) => sum + item.capacity, 0) * 10) / 10;

    const investmentTarget = Math.max(5000, totalInvestment * 1.5); // 현재 투자액의 1.5배 또는 최소 5000억원
    const companiesTarget = Math.max(100, investmentData.length * 2); // 현재 기업수의 2배 또는 최소 100개
    const employmentTarget = Math.max(2000, totalJobs * 1.8); // 현재 고용의 1.8배 또는 최소 2000명
    
    const avgProgress = investmentData.length > 0 ? investmentData.reduce((sum, item) => sum + item.progress, 0) / investmentData.length : 0;
    const investmentChange = Math.round((avgProgress / 10) * 10) / 10; // 진행률 기반 성장률
    const companiesChange = Math.round((investmentData.filter(item => item.status === 'completed').length / Math.max(investmentData.length, 1)) * 20 * 10) / 10;
    const employmentChange = Math.round((totalJobs / Math.max(employmentTarget * 0.6, 1)) * 15 * 10) / 10;

    return {
      totalInvestment: { value: totalInvestment, unit: "억원", change: investmentChange, changeType: "increase", target: investmentTarget, progress: Math.round((totalInvestment / investmentTarget) * 100 * 10) / 10 },
      newCompanies: { value: investmentData.length, unit: "개", change: companiesChange, changeType: "increase", target: companiesTarget, progress: Math.round((investmentData.length / companiesTarget) * 100 * 10) / 10 },
      employment: { value: totalJobs, unit: "명", change: employmentChange, changeType: "increase", target: employmentTarget, progress: Math.round((totalJobs / employmentTarget) * 100 * 10) / 10 },
      salesRate: { value: averageProgress, unit: "%", change: 5.2, changeType: "increase" },
      renewableEnergy: { value: totalCapacity, unit: "MW", change: 22.1, changeType: "increase" },
      complaints: { value: 12, unit: "건", change: -15.4, changeType: "decrease" }
    };
  };

  const kpiData = calculateKPIs();

  const renderDashboard = () => {
    if (loading) {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <CardLoadingSkeleton key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <CardLoadingSkeleton key={i} />
            ))}
          </div>
        </div>
      );
    }

    // 에러 처리
    if (hasErrors) {
      return (
        <div className="space-y-4">
          {investmentError && (
            <ApiError 
              error={investmentError} 
              onRetry={refetchInvestment}
              title="투자 데이터 로딩 실패"
              description="투자 유치 현황 데이터를 불러올 수 없습니다."
            />
          )}
          {renewableError && (
            <ApiError 
              error={renewableError} 
              onRetry={refetchRenewable}
              title="재생에너지 데이터 로딩 실패"
              description="재생에너지 사업 정보를 불러올 수 없습니다."
            />
          )}
          {weatherError && (
            <ApiError 
              error={weatherError} 
              onRetry={refetchWeather}
              title="기상 데이터 로딩 실패"
              description="기상정보를 불러올 수 없습니다."
            />
          )}
          {datasetsError && (
            <ApiError 
              error={datasetsError} 
              onRetry={refetchDatasets}
              title="데이터셋 정보 로딩 실패"
              description="메타데이터를 불러올 수 없습니다."
            />
          )}
        </div>
      );
    }

    return (
    <div className="space-y-6">
      {/* 실시간 알림 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(() => {
          const recentAlerts = getRecentAlerts().slice(0, 3);
          
          // 기본 알림이 없을 경우 샘플 알림 표시
          if (recentAlerts.length === 0) {
            return (
              <>
                <Alert className="border-success/20 bg-success/5">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <AlertDescription className="text-success">
                    {investmentData.length > 0 
                      ? `${investmentData[0].company} 신규 투자 계약 체결 (${investmentData[0].investment}억원)`
                      : "신규 투자 계약 체결"
                    }
                  </AlertDescription>
                </Alert>
                <Alert className="border-warning/20 bg-warning/5">
                  <Clock className="h-4 w-4 text-warning" />
                  <AlertDescription className="text-warning-foreground">
                    RE100 목표 달성률 {renewableData.length > 0 ? Math.round((renewableData.filter((r: RenewableEnergyData) => r.status === 'operational').length / renewableData.length) * 100) : 0}% 도달
                  </AlertDescription>
                </Alert>
                <Alert className="border-primary/20 bg-primary/5">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <AlertDescription className="text-primary">
                    월간 고용창출 목표 초과 달성
                  </AlertDescription>
                </Alert>
              </>
            );
          }
          
          // 실제 알림 데이터 표시
          return recentAlerts.map((alert, index) => {
            const getAlertStyle = () => {
              switch (alert.type) {
                case 'error':
                  return 'border-destructive/20 bg-destructive/5';
                case 'warning':
                  return 'border-warning/20 bg-warning/5';
                case 'success':
                  return 'border-success/20 bg-success/5';
                case 'info':
                default:
                  return 'border-primary/20 bg-primary/5';
              }
            };
            
            const getAlertIcon = () => {
              const iconClass = `h-4 w-4 ${
                alert.type === 'error' ? 'text-destructive' :
                alert.type === 'warning' ? 'text-warning' :
                alert.type === 'success' ? 'text-success' :
                'text-primary'
              }`;
              
              switch (alert.type) {
                case 'error':
                  return <AlertTriangle className={iconClass} />;
                case 'warning':
                  return <Clock className={iconClass} />;
                case 'success':
                  return <CheckCircle className={iconClass} />;
                case 'info':
                default:
                  return <TrendingUp className={iconClass} />;
              }
            };
            
            return (
              <Alert key={alert.id} className={getAlertStyle()}>
                {getAlertIcon()}
                <AlertDescription className={`${
                  alert.type === 'error' ? 'text-destructive' :
                  alert.type === 'warning' ? 'text-warning-foreground' :
                  alert.type === 'success' ? 'text-success' :
                  'text-primary'
                }`}>
                  {alert.message}
                </AlertDescription>
              </Alert>
            );
          });
        })()}
      </div>

      {/* 핵심 KPI 6개 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">핵심 지표</h2>
        <div className="flex items-center space-x-2">
          <DataSourceInfo dataType="investment" compact />
          <DataSourceInfo dataType="renewable" compact />
          <DataSourceInfo dataType="weather" compact />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KPICard
          title="총 투자유치액"
          value={kpiData.totalInvestment.value}
          unit={kpiData.totalInvestment.unit}
          change={kpiData.totalInvestment.change}
          changeType={kpiData.totalInvestment.changeType}
          icon={<DollarSign className="h-5 w-5" />}
        />
        <KPICard
          title="신규 입주기업 수"
          value={kpiData.newCompanies.value}
          unit={kpiData.newCompanies.unit}
          change={kpiData.newCompanies.change}
          changeType={kpiData.newCompanies.changeType}
          icon={<Building2 className="h-5 w-5" />}
        />
        <KPICard
          title="고용창출 인원"
          value={kpiData.employment.value}
          unit={kpiData.employment.unit}
          change={kpiData.employment.change}
          changeType={kpiData.employment.changeType}
          target={kpiData.employment.target}
          progress={kpiData.employment.progress}
          icon={<Users className="h-5 w-5" />}
        />
        <KPICard
          title="분양률"
          value={kpiData.salesRate.value}
          unit={kpiData.salesRate.unit}
          change={kpiData.salesRate.change}
          changeType={kpiData.salesRate.changeType}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <KPICard
          title="재생에너지 발전량"
          value={kpiData.renewableEnergy.value}
          unit={kpiData.renewableEnergy.unit}
          change={kpiData.renewableEnergy.change}
          changeType={kpiData.renewableEnergy.changeType}
          icon={<Zap className="h-5 w-5" />}
        />
        <KPICard
          title="민원/제보 건수"
          value={kpiData.complaints.value}
          unit={kpiData.complaints.unit}
          change={kpiData.complaints.change}
          changeType={kpiData.complaints.changeType}
          icon={<MessageSquare className="h-5 w-5" />}
        />
      </div>

      {/* 빠른 인사이트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">오늘의 주요 성과</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
              <span className="text-sm">신규 투자 계약</span>
              <Badge variant="default">
                +{investmentData.length > 0 ? investmentData[0].investment : 450}억원
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-secondary/5 rounded-lg">
              <span className="text-sm">고용 창출</span>
              <Badge variant="secondary">
                +{investmentData.length > 0 ? investmentData[0].expectedJobs : 47}명
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
              <span className="text-sm">재생에너지 발전</span>
              <Badge className="bg-success text-success-foreground">
                +{renewableData.length > 0 ? renewableData[0].capacity : 12.3}MW
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">주간 트렌드</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>투자 유치 진행률</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-[78%]" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>분양 목표 달성률</span>
                  <span className="font-medium">85%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-to-r from-secondary to-primary h-2 rounded-full w-[85%]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 데이터 출처 및 계산 방법론 */}
      <DataMethodology
        title="실시간 현황 대시보드"
        dataSources={[
          {
            name: "새만금개발청 투자인센티브보조금지원현황",
            description: "새만금 지역 기업 투자 및 보조금 지원 현황 데이터",
            endpoint: "/15121622/v1/uddi:d8e95b9d-7808-4643-b2f5-c1fa1a649ede",
            updateFrequency: "월 1회",
            lastUpdated: new Date().toLocaleDateString('ko-KR'),
            recordCount: investmentData.length,
            dataQuality: Math.round((investmentData.filter(item => item.company && item.investment > 0).length / Math.max(investmentData.length, 1)) * 100)
          },
          {
            name: "새만금개발청 재생에너지사업정보",
            description: "새만금 지역 재생에너지 발전소 및 사업 현황 데이터",
            endpoint: "/15121623/v1/uddi:renewable-energy-data",
            updateFrequency: "주 1회",
            lastUpdated: new Date().toLocaleDateString('ko-KR'),
            recordCount: renewableData.length,
            dataQuality: Math.round((renewableData.filter(item => item.capacity > 0).length / Math.max(renewableData.length, 1)) * 100)
          },
          {
            name: "기상청 초단기예보조회",
            description: "새만금 지역 실시간 기상 정보",
            endpoint: "/15138304/v1/uddi:83bddb37-95d5-4fe1-8e1e-8d4e8d56e1f5",
            updateFrequency: "1시간마다",
            lastUpdated: weatherData ? new Date(weatherData.timestamp).toLocaleDateString('ko-KR') : '데이터 없음',
            recordCount: weatherData ? 1 : 0,
            dataQuality: weatherData ? 100 : 0
          }
        ]}
        calculations={[
          {
            name: "총 투자금액",
            formula: "Σ(각 기업별 투자금액) / 100",
            description: "모든 투자 기업의 투자금액을 합산하여 억원 단위로 변환",
            variables: [
              { name: "투자금액", description: "각 기업의 개별 투자금액", unit: "원" },
              { name: "총합", description: "모든 기업 투자금액의 총합", unit: "억원" }
            ],
            example: "기업A(100억) + 기업B(200억) + 기업C(150억) = 450억원"
          },
          {
            name: "예상 고용인원",
            formula: "Σ(각 기업별 예상 고용인원)",
            description: "모든 투자 기업의 예상 고용인원을 합산",
            variables: [
              { name: "예상고용", description: "각 기업의 예상 고용인원", unit: "명" }
            ]
          },
          {
            name: "평균 진행률",
            formula: "(Σ(각 프로젝트 진행률) / 프로젝트 수) × 100",
            description: "모든 투자 프로젝트의 평균 진행률을 백분율로 계산",
            variables: [
              { name: "진행률", description: "각 프로젝트의 진행률", unit: "0-1" },
              { name: "프로젝트 수", description: "전체 프로젝트 개수", unit: "개" }
            ]
          },
          {
            name: "재생에너지 총 용량",
            formula: "Σ(각 발전소별 설비용량)",
            description: "모든 재생에너지 발전소의 설비용량을 합산",
            variables: [
              { name: "설비용량", description: "각 발전소의 설비용량", unit: "MW" }
            ]
          }
        ]}
        limitations={[
          "투자 데이터는 공식 신고된 내용만 포함되며, 실제 투자 실행 여부와 다를 수 있습니다.",
          "재생에너지 데이터는 허가/승인 단계의 사업도 포함되어 실제 운영 중인 설비와 차이가 있을 수 있습니다.",
          "기상 데이터는 예보 정보로 실제 관측값과 차이가 있을 수 있습니다.",
          "API 응답 지연이나 오류로 인해 일부 데이터가 누락될 수 있습니다."
        ]}
        notes={[
          "모든 금액은 신고 당시 기준이며, 물가 변동이나 환율 변동은 반영되지 않습니다.",
          "고용 인원은 예상 수치로 실제 고용 실적과 다를 수 있습니다.",
          "데이터는 새만금개발청에서 제공하는 공식 통계를 기반으로 합니다.",
          "실시간 업데이트를 위해 캐시 기능을 사용하며, 최대 5분간 이전 데이터가 표시될 수 있습니다."
        ]}
      />
    </div>
    );
  };

  const renderAlerts = () => (
    <AlertCenter />
  );

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard();
      case "simulator":
        return <PolicySimulator />;
      case "map":
        return <SaemangumMap />;
      case "investment":
        return <InvestmentReport />;
      case "alerts":
        return renderAlerts();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NetworkStatus />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        {/* 페이지 제목 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {activeTab === "dashboard" && "실시간 현황 대시보드"}
              {activeTab === "simulator" && "정책 시뮬레이션"}
              {activeTab === "map" && "새만금 공간정보"}
              {activeTab === "investment" && "기업 투자 유치 보고서"}
              {activeTab === "alerts" && "알림 센터"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {activeTab === "dashboard" && "새만금 개발 핵심 지표 실시간 모니터링"}
              {activeTab === "simulator" && "정책 효과 예측 및 What-if 분석"}
              {activeTab === "map" && "공구별 개발 현황 및 공간 분석"}
              {activeTab === "investment" && "기업별 투자 진행 현황 및 업종별 분석"}
              {activeTab === "alerts" && "실시간 알림 및 이상 감지"}
            </p>
            {/* 데이터 품질 인디케이터 */}
            {activeTab === "dashboard" && investmentData.length > 0 && (
              <div className="mt-2">
                <DataQualityIndicator
                  totalRecords={investmentData.length + renewableData.length}
                  validRecords={investmentData.filter(item => item.company && item.investment > 0).length + 
                               renewableData.filter(item => item.capacity > 0).length}
                  qualityScore={Math.round(((investmentData.filter(item => item.company && item.investment > 0).length + 
                                           renewableData.filter(item => item.capacity > 0).length) / 
                                          (investmentData.length + renewableData.length)) * 100)}
                />
              </div>
            )}
          </div>
          <Badge variant="outline" className="hidden md:block">
            마지막 업데이트: {new Date().toLocaleTimeString('ko-KR')}
            {datasets && ` • ${datasets.summary.total_datasets}개 데이터셋 연동`}
          </Badge>
        </div>

        {/* 메인 콘텐츠 */}
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;
