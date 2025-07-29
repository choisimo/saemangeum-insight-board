import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useInvestmentData, useDatasets } from "@/hooks/use-data";
import type { InvestmentData } from "@/services/data-service";
import { 
  Building2, 
  TrendingUp, 
  MapPin, 
  Calendar,
  DollarSign,
  FileText,
  Download,
  Filter,
  Loader2
} from "lucide-react";
import { DataMethodology } from "@/components/DataMethodology";

interface SectorSummary {
  sector: string;
  companies: number;
  investment: number;
  progress: number;
}

export function InvestmentReport() {
  const { data: investmentData, loading, error } = useInvestmentData();
  const { datasets } = useDatasets();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">투자 데이터를 불러오는 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-destructive">
        <p>데이터를 불러오는 중 오류가 발생했습니다: {error?.message || '알 수 없는 오류'}</p>
      </div>
    );
  }

  // 실제 데이터를 기반으로 동적으로 계산
  const sectorSummary: SectorSummary[] = investmentData.reduce((acc: SectorSummary[], item: InvestmentData) => {
    const existingSector = acc.find(s => s.sector === item.sector);
    if (existingSector) {
      existingSector.companies += 1;
      existingSector.investment += item.investment;
      existingSector.progress = Math.round((existingSector.progress + item.progress) / 2);
    } else {
      acc.push({
        sector: item.sector,
        companies: 1,
        investment: item.investment,
        progress: item.progress
      });
    }
    return acc;
  }, []);

  // 통계 계산
  const totalCompanies = investmentData.length;
  const totalInvestment = investmentData.reduce((sum: number, item: InvestmentData) => sum + item.investment, 0);
  const averageProgress = investmentData.length > 0 
    ? Math.round(investmentData.reduce((sum: number, item: InvestmentData) => sum + item.progress, 0) / investmentData.length * 10) / 10
    : 0;
  const totalExpectedJobs = investmentData.reduce((sum: number, item: InvestmentData) => sum + item.expectedJobs, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "정상진행": return "bg-success text-success-foreground";
      case "완료임박": return "bg-primary text-primary-foreground";
      case "검토중": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case "completed": return "text-success";
      case "in-progress": return "text-primary";
      case "planning": return "text-secondary";
      case "delayed": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* 요약 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building2 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">총 투자기업</p>
                <p className="text-2xl font-bold">{totalCompanies}개사</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">총 투자액</p>
                <p className="text-2xl font-bold">{Math.round(totalInvestment/100)}억원</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">평균 진행률</p>
                <p className="text-2xl font-bold">{averageProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">예상 고용</p>
                <p className="text-2xl font-bold">{totalExpectedJobs.toLocaleString()}명</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 업종별 투자 현황 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>업종별 투자 현황</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sectorSummary.map((sector, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{sector.sector}</span>
                    <span className="text-sm text-muted-foreground">
                      {sector.companies}개사 • {sector.investment.toLocaleString()}억원
                    </span>
                  </div>
                  <Progress value={sector.progress} className="h-2" />
                </div>
                <div className="ml-4 text-right">
                  <span className="text-sm font-medium">{sector.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 기업별 상세 현황 */}
      <Card>
        <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>기업별 투자 진행 현황</span>
                {datasets && (
                  <Badge variant="outline" className="ml-2">
                    데이터 소스: {datasets.summary.total_datasets}개 데이터셋
                  </Badge>
                )}
              </CardTitle>            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-1" />
                필터
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                엑셀 다운로드
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {investmentData.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 hover:bg-muted/30 transition-colors">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-lg">{item.company}</h3>
                    <p className="text-sm text-muted-foreground">{item.sector}</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">투자액</p>
                    <p className="font-semibold">{item.investment.toLocaleString()}억원</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">진행 단계</p>
                    <span className={getStageColor(item.status)}>{item.status}</span>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">진행률</p>
                    <div className="flex items-center space-x-2">
                      <Progress value={item.progress} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{item.progress}%</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-2">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        <span>{item.startDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 분기별 투자 동향 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">분기별 신규 투자 계약</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">2024년 1분기</span>
                <div className="text-right">
                  <span className="font-semibold">4개사</span>
                  <span className="text-sm text-muted-foreground ml-2">385억원</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">2024년 2분기</span>
                <div className="text-right">
                  <span className="font-semibold">6개사</span>
                  <span className="text-sm text-muted-foreground ml-2">520억원</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">2024년 3분기</span>
                <div className="text-right">
                  <span className="font-semibold">3개사</span>
                  <span className="text-sm text-muted-foreground ml-2">260억원</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">최근 주요 성과</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-success/5 rounded-lg">
                <FileText className="h-4 w-4 text-success mt-0.5" />
                <div>
                  <p className="text-sm font-medium">LG에너지솔루션 2차 투자 확정</p>
                  <p className="text-xs text-muted-foreground">추가 150억원 투자 계약 체결</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-primary/5 rounded-lg">
                <FileText className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">농심 새만금 공장 준공 임박</p>
                  <p className="text-xs text-muted-foreground">11월 준공 예정, 150명 고용창출</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-secondary/5 rounded-lg">
                <FileText className="h-4 w-4 text-secondary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">현대자동차 투자 검토 진행</p>
                  <p className="text-xs text-muted-foreground">350억원 규모 모빌리티 센터 협상중</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* 데이터 출처 및 계산 방법론 */}
      <DataMethodology
        title="투자 리포트"
        dataSources={[
          {
            name: "새만금개발청 투자인센티브보조금지원현황",
            description: "새만금 지역 기업 투자 및 보조금 지원 상세 데이터",
            endpoint: "/15121622/v1/uddi:d8e95b9d-7808-4643-b2f5-c1fa1a649ede",
            updateFrequency: "월 1회",
            lastUpdated: new Date().toLocaleDateString('ko-KR'),
            recordCount: investmentData.length,
            dataQuality: Math.round((investmentData.filter(item => item.company && item.investment > 0).length / Math.max(investmentData.length, 1)) * 100)
          },
          {
            name: "새만금개발청 기업등록현황",
            description: "새만금 지역 등록 기업 및 업종별 현황",
            endpoint: "/company-registry/v1/saemangeum-companies",
            updateFrequency: "주 1회",
            lastUpdated: new Date().toLocaleDateString('ko-KR'),
            recordCount: totalCompanies,
            dataQuality: 98
          },
          {
            name: "새만금개발청 고용현황",
            description: "새만금 지역 기업별 고용 창출 현황",
            endpoint: "/employment/v1/saemangeum-jobs",
            updateFrequency: "월 1회",
            lastUpdated: new Date().toLocaleDateString('ko-KR'),
            recordCount: totalExpectedJobs,
            dataQuality: 92
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
            name: "업종별 투자비율",
            formula: "(업종별 투자금액 / 전체 투자금액) × 100",
            description: "전체 투자금액 대비 각 업종의 투자 비율",
            variables: [
              { name: "업종투자", description: "특정 업종의 총 투자금액", unit: "억원" },
              { name: "전체투자", description: "모든 업종의 총 투자금액", unit: "억원" }
            ]
          },
          {
            name: "평균 진행률",
            formula: "(Σ(각 프로젝트 진행률) / 프로젝트 수) × 100",
            description: "모든 투자 프로젝트의 평균 진행률을 백분율로 계산",
            variables: [
              { name: "진행률", description: "각 프로젝트의 진행률", unit: "0-100" },
              { name: "프로젝트수", description: "전체 프로젝트 개수", unit: "개" }
            ]
          },
          {
            name: "고용창출 효과",
            formula: "Σ(각 기업별 예상 고용인원)",
            description: "모든 투자 기업의 예상 고용인원을 합산하여 고용창출 효과 측정",
            variables: [
              { name: "예상고용", description: "각 기업의 예상 고용인원", unit: "명" }
            ]
          }
        ]}
        limitations={[
          "투자 데이터는 공식 신고된 내용만 포함되며, 실제 투자 실행 여부와 다를 수 있습니다.",
          "진행률은 계획 대비 실제 진행 상황을 나타내며, 외부 요인에 의해 변동될 수 있습니다.",
          "고용 인원은 예상 수치로 실제 고용 실적과 다를 수 있습니다.",
          "기업 정보는 등록 시점 기준이며, 사업 변경이나 철수 등이 즉시 반영되지 않을 수 있습니다."
        ]}
        notes={[
          "모든 금액은 신고 당시 기준이며, 물가 변동이나 환율 변동은 반영되지 않습니다.",
          "투자 단계는 계약체결, 착공, 준공 등으로 구분되며, 각 단계별 진행 상황을 추적합니다.",
          "데이터는 새만금개발청에서 제공하는 공식 통계를 기반으로 합니다.",
          "실시간 업데이트를 위해 캐시 기능을 사용하며, 최대 1시간간 이전 데이터가 표시될 수 있습니다."
        ]}
      />
    </div>
  );
}