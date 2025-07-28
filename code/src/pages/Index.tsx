import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { KPICard } from "@/components/KPICard";
import { PolicySimulator } from "@/components/PolicySimulator";
import { SaemangumMap } from "@/components/SaemangumMap";
import { InvestmentReport } from "@/components/InvestmentReport";
import { 
  ApiError, 
  CardLoadingSkeleton, 
  NetworkStatus, 
  DataQualityIndicator 
} from "@/components/ErrorBoundary";
import { useInvestmentData, useRenewableEnergyData, useWeatherData, useDatasets } from "@/hooks/use-data";
import type { InvestmentData, RenewableEnergyData } from "@/lib/data-service";
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
  totalInvestment: { value: number; unit: string; change: number; changeType: 'increase' | 'decrease' | 'neutral' };
  newCompanies: { value: number; unit: string; change: number; changeType: 'increase' | 'decrease' | 'neutral' };
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
    if (!investmentData.length || !renewableData.length) {
      return {
        totalInvestment: { value: 0, unit: "억원", change: 0, changeType: "neutral" },
        newCompanies: { value: 0, unit: "개", change: 0, changeType: "neutral" },
        employment: { value: 0, unit: "명", change: 0, changeType: "neutral", target: 2000, progress: 0 },
        salesRate: { value: 0, unit: "%", change: 0, changeType: "neutral" },
        renewableEnergy: { value: 0, unit: "MW", change: 0, changeType: "neutral" },
        complaints: { value: 12, unit: "건", change: -15.4, changeType: "decrease" }
      };
    }

    const totalInvestment = Math.round(investmentData.reduce((sum: number, item: InvestmentData) => sum + item.investment, 0) / 100);
    const totalJobs = investmentData.reduce((sum: number, item: InvestmentData) => sum + item.expectedJobs, 0);
    const averageProgress = Math.round(investmentData.reduce((sum: number, item: InvestmentData) => sum + item.progress, 0) / investmentData.length * 10) / 10;
    const totalCapacity = Math.round(renewableData.reduce((sum: number, item: RenewableEnergyData) => sum + item.capacity, 0) * 10) / 10;

    return {
      totalInvestment: { value: totalInvestment, unit: "억원", change: 15.8, changeType: "increase" },
      newCompanies: { value: investmentData.length, unit: "개", change: 8.3, changeType: "increase" },
      employment: { value: totalJobs, unit: "명", change: 12.5, changeType: "increase", target: 2000, progress: Math.round((totalJobs / 2000) * 100 * 10) / 10 },
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
            RE100 목표 달성률 {renewableData.length > 0 ? Math.round((renewableData.filter((r: RenewableEnergyData) => r.status === '운영중').length / renewableData.length) * 100) : 85}% 도달
          </AlertDescription>
        </Alert>
        <Alert className="border-primary/20 bg-primary/5">
          <TrendingUp className="h-4 w-4 text-primary" />
          <AlertDescription className="text-primary">
            월간 고용창출 목표 초과 달성
          </AlertDescription>
        </Alert>
      </div>

      {/* 핵심 KPI 6개 */}
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
    </div>
    );
  };

  const renderAlerts = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>실시간 알림 센터</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-destructive/20 bg-destructive/5">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              4공구 투자 진행 지연 - 인허가 검토 필요
            </AlertDescription>
          </Alert>
          <Alert className="border-warning/20 bg-warning/5">
            <Clock className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning-foreground">
              민원 증가 추세 감지 - 대응 방안 검토 권장
            </AlertDescription>
          </Alert>
          <Alert className="border-success/20 bg-success/5">
            <CheckCircle className="h-4 w-4 text-success" />
            <AlertDescription className="text-success">
              RE100 목표 달성률 90% 돌파
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
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
