import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  TrendingUp, 
  MapPin, 
  Calendar,
  DollarSign,
  FileText,
  Download,
  Filter
} from "lucide-react";

export function InvestmentReport() {
  // 투자 유치 데이터 (실제로는 API에서 가져옴)
  const investmentData = [
    {
      id: 1,
      company: "LG에너지솔루션",
      sector: "이차전지",
      investment: 28000,
      stage: "착공",
      progress: 65,
      location: "3공구",
      contractDate: "2024.03.15",
      expectedJobs: 450,
      status: "정상진행"
    },
    {
      id: 2,
      company: "한화큐셀",
      sector: "태양광",
      investment: 15000,
      stage: "계약체결",
      progress: 30,
      location: "4공구",
      contractDate: "2024.05.20",
      expectedJobs: 280,
      status: "정상진행"
    },
    {
      id: 3,
      company: "농심",
      sector: "식품가공",
      investment: 5500,
      stage: "준공",
      progress: 95,
      location: "1공구",
      contractDate: "2023.08.10",
      expectedJobs: 150,
      status: "완료임박"
    },
    {
      id: 4,
      company: "현대자동차",
      sector: "모빌리티",
      investment: 35000,
      stage: "협상중",
      progress: 15,
      location: "미정",
      contractDate: "협상중",
      expectedJobs: 600,
      status: "검토중"
    },
    {
      id: 5,
      company: "KT",
      sector: "ICT",
      investment: 8000,
      stage: "착공",
      progress: 40,
      location: "2공구",
      contractDate: "2024.01.25",
      expectedJobs: 120,
      status: "정상진행"
    }
  ];

  const sectorSummary = [
    { sector: "이차전지", companies: 3, investment: 45000, progress: 52 },
    { sector: "재생에너지", companies: 5, investment: 32000, progress: 67 },
    { sector: "스마트팜", companies: 2, investment: 12000, progress: 80 },
    { sector: "ICT", companies: 4, investment: 18000, progress: 45 },
    { sector: "식품가공", companies: 3, investment: 9500, progress: 75 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "정상진행": return "bg-success text-success-foreground";
      case "완료임박": return "bg-primary text-primary-foreground";
      case "검토중": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "준공": return "text-success";
      case "착공": return "text-primary";
      case "계약체결": return "text-secondary";
      case "협상중": return "text-warning";
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
                <p className="text-2xl font-bold">17개사</p>
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
                <p className="text-2xl font-bold">1,165억원</p>
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
                <p className="text-2xl font-bold">51.4%</p>
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
                <p className="text-2xl font-bold">1,600명</p>
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
            </CardTitle>
            <div className="flex space-x-2">
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
                    <p className={`font-medium ${getStageColor(item.stage)}`}>{item.stage}</p>
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
                        <span>{item.contractDate}</span>
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
    </div>
  );
}