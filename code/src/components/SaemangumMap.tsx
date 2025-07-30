import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInvestmentData, useInvestmentLoading } from "@/stores";
import { useDatasets, useLandData } from "@/hooks/use-data";
import type { InvestmentData, LandData, ReclaimData } from "@/lib/data-service";
import { Map, Building2, Zap, Droplets, Wind, Factory, Loader2, MapPin } from "lucide-react";
import { KakaoMap } from "@/components/KakaoMap";
import { DataSourceInfo } from "@/components/DataSourceInfo";
import { DataMethodology } from "@/components/DataMethodology";

interface DistrictData {
  id: string;
  name: string;
  salesRate: number;
  companies: number;
  industry: string;
  status: 'completed' | 'in-progress' | 'planned';
  area: number;
  investment: number;
  employees: number;
  projects: {
    major: string[];
    upcoming: string[];
  };
  facilities: {
    infrastructure: string[];
    renewable: string[];
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  details: {
    landType: string;
    completionDate?: string;
    plannedDate?: string;
    keyInvestors: string[];
  };
}

const districts: DistrictData[] = [
  { 
    id: "1", 
    name: "1공구 (산업·연구단지)", 
    salesRate: 85, 
    companies: 12, 
    industry: "이차전지", 
    status: "completed", 
    area: 450,
    investment: 2500,
    employees: 850,
    projects: {
      major: ["LG에너지솔루션 배터리 공장", "SK이노베이션 연구센터", "삼성SDI 생산라인"],
      upcoming: ["현대자동차 배터리팩 조립", "포스코케미칼 양극재 공장"]
    },
    facilities: {
      infrastructure: ["첨단 물류센터", "연구개발센터", "기술교육원"],
      renewable: ["태양광 발전소 50MW", "풍력 발전기 10기"]
    },
    coordinates: { lat: 35.7850, lng: 126.6800 },
    details: {
      landType: "산업용지",
      completionDate: "2023-12",
      keyInvestors: ["LG그룹", "SK그룹", "삼성그룹"]
    }
  },
  { 
    id: "2", 
    name: "2공구 (재생에너지)", 
    salesRate: 92, 
    companies: 8, 
    industry: "재생에너지", 
    status: "completed", 
    area: 380,
    investment: 1800,
    employees: 420,
    projects: {
      major: ["새만금 태양광 발전단지", "해상풍력 단지", "ESS 저장시설"],
      upcoming: ["수소연료전지 발전소", "바이오매스 발전시설"]
    },
    facilities: {
      infrastructure: ["변전소", "송전선로", "제어센터"],
      renewable: ["태양광 300MW", "풍력 200MW", "ESS 100MWh"]
    },
    coordinates: { lat: 35.7750, lng: 126.6600 },
    details: {
      landType: "에너지용지",
      completionDate: "2024-03",
      keyInvestors: ["한화에너지", "두산에너빌리티", "GS에너지"]
    }
  },
  { 
    id: "3", 
    name: "3공구 (스마트농업)", 
    salesRate: 67, 
    companies: 15, 
    industry: "스마트팜", 
    status: "in-progress", 
    area: 520,
    investment: 950,
    employees: 320,
    projects: {
      major: ["첨단온실단지", "AI 농업시스템", "수직농장"],
      upcoming: ["아쿠아포닉스 시설", "드론 방제센터", "농산물 가공단지"]
    },
    facilities: {
      infrastructure: ["스마트 온실", "농업연구소", "유통센터"],
      renewable: ["농업용 태양광 20MW", "지열시스템"]
    },
    coordinates: { lat: 35.7650, lng: 126.6400 },
    details: {
      landType: "농업용지",
      plannedDate: "2025-06",
      keyInvestors: ["LG CNS", "네이버 클라우드", "롯데"]
    }
  },
  { 
    id: "4", 
    name: "4공구 (IT융합)", 
    salesRate: 34, 
    companies: 3, 
    industry: "IT융합", 
    status: "in-progress", 
    area: 410,
    investment: 650,
    employees: 180,
    projects: {
      major: ["데이터센터", "5G 테스트베드", "IoT 플랫폼"],
      upcoming: ["AI 개발센터", "블록체인 연구소", "메타버스 스튜디오"]
    },
    facilities: {
      infrastructure: ["대용량 데이터센터", "통신기지국", "연구단지"],
      renewable: ["태양광 30MW", "연료전지 10MW"]
    },
    coordinates: { lat: 35.7550, lng: 126.6200 },
    details: {
      landType: "정보통신용지",
      plannedDate: "2025-12",
      keyInvestors: ["네이버", "카카오", "NHN"]
    }
  },
  { 
    id: "5", 
    name: "5공구 (바이오)", 
    salesRate: 12, 
    companies: 1, 
    industry: "바이오", 
    status: "planned", 
    area: 330,
    investment: 280,
    employees: 50,
    projects: {
      major: ["바이오의약품 생산기지"],
      upcoming: ["줄기세포 연구소", "유전자치료제 개발", "바이오시밀러 생산라인", "펩타이드 신약개발센터"]
    },
    facilities: {
      infrastructure: ["GMP 생산시설", "연구동", "품질관리센터"],
      renewable: ["청정 에너지 공급시설"]
    },
    coordinates: { lat: 35.7450, lng: 126.6000 },
    details: {
      landType: "의료생명용지",
      plannedDate: "2026-09",
      keyInvestors: ["셀트리온", "삼성바이오로직스"]
    }
  },
  { 
    id: "6", 
    name: "6공구 (항공우주)", 
    salesRate: 0, 
    companies: 0, 
    industry: "항공우주", 
    status: "planned", 
    area: 290,
    investment: 150,
    employees: 0,
    projects: {
      major: ["항공우주 연구단지"],
      upcoming: ["드론 테스트센터", "위성개발센터", "항공정비단지", "우주발사체 연구소"]
    },
    facilities: {
      infrastructure: ["활주로", "격납고", "관제센터"],
      renewable: ["태양광 15MW"]
    },
    coordinates: { lat: 35.7350, lng: 126.5800 },
    details: {
      landType: "항공우주용지",
      plannedDate: "2027-12",
      keyInvestors: ["한국항공우주산업", "LIG넥스원"]
    }
  }
];

export function SaemangumMap() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null);
  const [viewMode, setViewMode] = useState<'sales' | 'companies' | 'development' | 'investment' | 'employment'>('sales');
  const investmentData = useInvestmentData();
  const investmentLoading = useInvestmentLoading();
  const { datasets, loading: datasetsLoading } = useDatasets();
  const { data: landData, loading: landLoading } = useLandData();

  const loading = investmentLoading || datasetsLoading || landLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">공간정보 데이터를 불러오는 중...</span>
      </div>
    );
  }

  // 실제 데이터를 기반으로 공구별 정보 업데이트
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success';
      case 'in-progress': return 'bg-warning';
      case 'planned': return 'bg-muted';
      default: return 'bg-muted';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return '완료';
      case 'in-progress': return '진행중';
      case 'planned': return '계획';
      default: return '미정';
    }
  };

  const getIndustryIcon = (industry: string) => {
    switch (industry) {
      case '이차전지': return <Zap className="h-4 w-4" />;
      case '재생에너지': return <Wind className="h-4 w-4" />;
      case '스마트팜': return <Droplets className="h-4 w-4" />;
      case 'IT융합': return <Building2 className="h-4 w-4" />;
      case '바이오': return <Factory className="h-4 w-4" />;
      case '항공우주': return <Building2 className="h-4 w-4" />;
      default: return <Building2 className="h-4 w-4" />;
    }
  };

  const updatedDistricts = districts.map(district => {
    // 해당 지역(김제시, 부안군)과 관련된 투자 데이터 필터링
    const relatedInvestments = investmentData.filter((inv: InvestmentData) => 
      inv.location && (
        (district.name.includes('1') || district.name.includes('2')) && inv.location.includes('김제') ||
        (district.name.includes('3') || district.name.includes('4')) && inv.location.includes('부안') ||
        (district.name.includes('5') || district.name.includes('6')) && inv.location.includes('전라북도')
      )
    );
    
    if (relatedInvestments.length > 0) {
      return {
        ...district,
        companies: relatedInvestments.length,
        salesRate: Math.round(relatedInvestments.reduce((avg: number, inv: InvestmentData) => avg + inv.progress, 0) / relatedInvestments.length)
      };
    }
    
    return district;
  });

  const getDistrictColor = (district: DistrictData) => {
    switch (viewMode) {
      case 'sales':
        if (district.salesRate >= 80) return 'bg-green-500';
        if (district.salesRate >= 50) return 'bg-yellow-500';
        if (district.salesRate >= 20) return 'bg-orange-500';
        return 'bg-red-400';
      case 'companies':
        if (district.companies >= 10) return 'bg-blue-600';
        if (district.companies >= 5) return 'bg-blue-400';
        if (district.companies >= 1) return 'bg-blue-200';
        return 'bg-gray-300';
      case 'investment':
        if (district.investment >= 2000) return 'bg-purple-600';
        if (district.investment >= 1000) return 'bg-purple-400';
        if (district.investment >= 500) return 'bg-purple-200';
        return 'bg-gray-300';
      case 'employment':
        if (district.employees >= 500) return 'bg-emerald-600';
        if (district.employees >= 200) return 'bg-emerald-400';
        if (district.employees >= 50) return 'bg-emerald-200';
        return 'bg-gray-300';
      case 'development':
        return getStatusColor(district.status);
      default:
        return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Map className="h-5 w-5 text-primary" />
            <span>새만금 공간정보 시스템</span>
            {datasets && (
              <Badge variant="outline">
                {datasets.summary.total_datasets}개 데이터셋 연동
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <DataSourceInfo dataType="land" compact />
            <DataSourceInfo dataType="investment" compact />
            <DataSourceInfo dataType="renewable" compact />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sales" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="sales">분양률</TabsTrigger>
            <TabsTrigger value="companies">입주기업</TabsTrigger>
            <TabsTrigger value="investment">투자금액</TabsTrigger>
            <TabsTrigger value="employment">고용현황</TabsTrigger>
            <TabsTrigger value="development">개발현황</TabsTrigger>
            <TabsTrigger value="map">지도뷰</TabsTrigger>
          </TabsList>
          
          {/* 분양률 탭 */}
          <TabsContent value="sales" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {updatedDistricts.map((district) => (
                <Card key={district.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{district.name.split('(')[0].trim()}</h3>
                    <div className={`w-4 h-4 rounded-full ${
                      district.salesRate >= 80 ? 'bg-green-500' :
                      district.salesRate >= 50 ? 'bg-yellow-500' :
                      district.salesRate >= 20 ? 'bg-orange-500' : 'bg-red-400'
                    }`}></div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">분양률</span>
                      <span className="font-bold text-2xl text-blue-600">{district.salesRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all" 
                        style={{ width: `${district.salesRate}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      전체 면적: {district.area.toLocaleString()}평 | 상태: {getStatusText(district.status)}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 입주기업 탭 */}
          <TabsContent value="companies" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {updatedDistricts.map((district) => (
                <Card key={district.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{district.name.split('(')[0].trim()}</h3>
                    <div className={`w-4 h-4 rounded-full ${
                      district.companies >= 10 ? 'bg-blue-600' :
                      district.companies >= 5 ? 'bg-blue-400' :
                      district.companies >= 1 ? 'bg-blue-200' : 'bg-gray-300'
                    }`}></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">입주기업 수</span>
                      <span className="font-bold text-2xl text-green-600">{district.companies}개</span>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium mb-1">주요 산업:</div>
                      <Badge variant="outline">{district.industry}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      예상 고용: {district.employees.toLocaleString()}명
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 투자금액 탭 */}
          <TabsContent value="investment" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {updatedDistricts.map((district) => (
                <Card key={district.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{district.name.split('(')[0].trim()}</h3>
                    <div className={`w-4 h-4 rounded-full ${
                      district.investment >= 2000 ? 'bg-purple-600' :
                      district.investment >= 1000 ? 'bg-purple-400' :
                      district.investment >= 500 ? 'bg-purple-200' : 'bg-gray-300'
                    }`}></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">투자금액</span>
                      <span className="font-bold text-2xl text-purple-600">{district.investment.toLocaleString()}억원</span>
                    </div>
                    <div className="text-sm">
                      <div className="font-medium mb-1">주요 투자자:</div>
                      <div className="flex flex-wrap gap-1">
                        {district.details.keyInvestors.slice(0, 2).map((investor, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">{investor}</Badge>
                        ))}
                        {district.details.keyInvestors.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{district.details.keyInvestors.length - 2}</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 고용현황 탭 */}
          <TabsContent value="employment" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {updatedDistricts.map((district) => (
                <Card key={district.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{district.name.split('(')[0].trim()}</h3>
                    <div className={`w-4 h-4 rounded-full ${
                      district.employees >= 500 ? 'bg-emerald-600' :
                      district.employees >= 200 ? 'bg-emerald-400' :
                      district.employees >= 50 ? 'bg-emerald-200' : 'bg-gray-300'
                    }`}></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">고용인원</span>
                      <span className="font-bold text-2xl text-emerald-600">{district.employees.toLocaleString()}명</span>
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">기업당 평균:</span>
                        <span className="font-medium">{Math.round(district.employees / Math.max(district.companies, 1))}명</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">산업분야:</span>
                        <span className="font-medium">{district.industry}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 개발현황 탭 */}
          <TabsContent value="development" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {updatedDistricts.map((district) => (
                <Card key={district.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-lg">{district.name.split('(')[0].trim()}</h3>
                    <Badge variant={district.status === 'completed' ? 'default' : district.status === 'in-progress' ? 'secondary' : 'outline'}>
                      {getStatusText(district.status)}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <div className="font-medium mb-1">주요 프로젝트:</div>
                      <div className="space-y-1">
                        {district.projects.major.slice(0, 3).map((project, idx) => (
                          <div key={idx} className="text-xs bg-muted p-2 rounded">{project}</div>
                        ))}
                        {district.projects.major.length > 3 && (
                          <div className="text-xs text-muted-foreground">+{district.projects.major.length - 3}개 더 보기</div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {district.details.completionDate ? `완공: ${district.details.completionDate}` : 
                       district.details.plannedDate ? `예정: ${district.details.plannedDate}` : '일정 미정'}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* 지도뷰 탭 */}
          <TabsContent value="map" className="space-y-4">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={viewMode === 'sales' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('sales')}
                >
                  📊 분양률
                </Button>
                <Button
                  variant={viewMode === 'companies' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('companies')}
                >
                  🏢 입주기업
                </Button>
                <Button
                  variant={viewMode === 'investment' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('investment')}
                >
                  💰 투자금액
                </Button>
                <Button
                  variant={viewMode === 'employment' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('employment')}
                >
                  👥 고용현황
                </Button>
                <Button
                  variant={viewMode === 'development' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('development')}
                >
                  🏭 개발현황
                </Button>
              </div>

              {/* 범례 */}
              <Card className="p-3 bg-white/80">
                <div className="text-sm">
                  <div className="font-medium mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {viewMode === 'sales' && '분양률 색상 범례'}
                    {viewMode === 'companies' && '입주기업 수 범례'}
                    {viewMode === 'investment' && '투자금액 범례'}
                    {viewMode === 'employment' && '고용인원 범례'}
                    {viewMode === 'development' && '개발현황 범례'}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs">
                    {viewMode === 'sales' && (
                      <>
                        <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded mr-1"></div>80% 이상</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div>50-79%</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-orange-500 rounded mr-1"></div>20-49%</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-red-400 rounded mr-1"></div>20% 미만</div>
                      </>
                    )}
                    {viewMode === 'companies' && (
                      <>
                        <div className="flex items-center"><div className="w-3 h-3 bg-blue-600 rounded mr-1"></div>10개 이상</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-blue-400 rounded mr-1"></div>5-9개</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-blue-200 rounded mr-1"></div>1-4개</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-gray-300 rounded mr-1"></div>0개</div>
                      </>
                    )}
                    {viewMode === 'investment' && (
                      <>
                        <div className="flex items-center"><div className="w-3 h-3 bg-purple-600 rounded mr-1"></div>2,000억 이상</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-purple-400 rounded mr-1"></div>1,000-1,999억</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-purple-200 rounded mr-1"></div>500-999억</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-gray-300 rounded mr-1"></div>500억 미만</div>
                      </>
                    )}
                    {viewMode === 'employment' && (
                      <>
                        <div className="flex items-center"><div className="w-3 h-3 bg-emerald-600 rounded mr-1"></div>500명 이상</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-emerald-400 rounded mr-1"></div>200-499명</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-emerald-200 rounded mr-1"></div>50-199명</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-gray-300 rounded mr-1"></div>50명 미만</div>
                      </>
                    )}
                    {viewMode === 'development' && (
                      <>
                        <div className="flex items-center"><div className="w-3 h-3 bg-success rounded mr-1"></div>완료</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-warning rounded mr-1"></div>진행중</div>
                        <div className="flex items-center"><div className="w-3 h-3 bg-muted rounded mr-1"></div>계획</div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* 카카오맵 지도 */}
            <div className="space-y-4">
              <KakaoMap 
                data={[
                  // 공구별 상세 데이터를 지도 데이터로 변환
                  ...updatedDistricts.map((district) => ({
                    id: district.id,
                    name: district.name,
                    lat: district.coordinates.lat,
                    lng: district.coordinates.lng,
                    type: 'investment' as const,
                    description: `${district.industry} 전문단지 | ${district.status === 'completed' ? '운영중' : district.status === 'in-progress' ? '개발중' : '계획중'}`,
                    value: viewMode === 'sales' ? `${district.salesRate}%` :
                           viewMode === 'companies' ? `${district.companies}개 기업` :
                           viewMode === 'investment' ? `${district.investment}억원` :
                           viewMode === 'employment' ? `${district.employees}명` :
                           district.industry
                  })),
                  // 추가 인프라 데이터
                  {
                    id: 'infra-1',
                    name: '새만금 신항만',
                    lat: 35.7900,
                    lng: 126.6900,
                    type: 'infrastructure' as const,
                    description: '국제 물류 허브 항만 | 2025년 완공 예정',
                    value: '20만TEU/년'
                  },
                  {
                    id: 'infra-2',
                    name: '새만금 국제공항',
                    lat: 35.7400,
                    lng: 126.7100,
                    type: 'infrastructure' as const,
                    description: '동북아 항공 허브 | 2027년 개항 예정',
                    value: '여객 1,000만명/년'
                  },
                  {
                    id: 'renewable-1',
                    name: '새만금 해상풍력단지',
                    lat: 35.7200,
                    lng: 126.6200,
                    type: 'renewable' as const,
                    description: '세계 최대 단일 해상풍력단지',
                    value: '2.4GW'
                  }
                ]}
                height="500px"
              />
            </div>

            {/* 선택된 공구 상세 정보 */}
            {selectedDistrict && (
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-xl mb-2">{selectedDistrict.name}</h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="font-medium">
                          {selectedDistrict.industry}
                        </Badge>
                        <Badge variant={selectedDistrict.status === 'completed' ? 'default' : 'secondary'}>
                          {getStatusText(selectedDistrict.status)}
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedDistrict(null)}
                    >
                      ✕
                    </Button>
                  </div>
                  
                  {/* 주요 지표 */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <div className="text-center p-3 bg-white/60 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedDistrict.salesRate}%</div>
                      <div className="text-sm text-muted-foreground">분양률</div>
                    </div>
                    <div className="text-center p-3 bg-white/60 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{selectedDistrict.companies}개</div>
                      <div className="text-sm text-muted-foreground">입주기업</div>
                    </div>
                    <div className="text-center p-3 bg-white/60 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{selectedDistrict.investment}억</div>
                      <div className="text-sm text-muted-foreground">투자금액</div>
                    </div>
                    <div className="text-center p-3 bg-white/60 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600">{selectedDistrict.employees}명</div>
                      <div className="text-sm text-muted-foreground">고용인원</div>
                    </div>
                    <div className="text-center p-3 bg-white/60 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{selectedDistrict.area}만㎡</div>
                      <div className="text-sm text-muted-foreground">면적</div>
                    </div>
                  </div>

                  {/* 주요 프로젝트 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        🏗️ 주요 프로젝트
                      </h4>
                      <ul className="text-sm space-y-1">
                        {selectedDistrict.projects.major.map((project, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            {project}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        🚀 예정 프로젝트
                      </h4>
                      <ul className="text-sm space-y-1">
                        {selectedDistrict.projects.upcoming.slice(0, 3).map((project, index) => (
                          <li key={index} className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            {project}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* 추가 정보 */}
                  <div className="border-t pt-4 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground">지목: </span>
                        <span className="font-medium">{selectedDistrict.details.landType}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">
                          {selectedDistrict.details.completionDate ? '완공일자: ' : '예정일자: '}
                        </span>
                        <span className="font-medium">
                          {selectedDistrict.details.completionDate || selectedDistrict.details.plannedDate}
                        </span>
                      </div>
                    </div>
                    {selectedDistrict.details.keyInvestors.length > 0 && (
                      <div className="mt-2">
                        <span className="text-muted-foreground">주요 투자기업: </span>
                        <span className="font-medium">{selectedDistrict.details.keyInvestors.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            {/* 실시간 통계 대시보드 */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 bg-blue-50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {updatedDistricts.reduce((sum, d) => sum + d.companies, 0)}개
                  </div>
                  <div className="text-sm text-muted-foreground">총 입주기업</div>
                </div>
              </Card>
              <Card className="p-4 bg-green-50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {updatedDistricts.reduce((sum, d) => sum + d.investment, 0).toLocaleString()}억
                  </div>
                  <div className="text-sm text-muted-foreground">총 투자금액</div>
                </div>
              </Card>
              <Card className="p-4 bg-purple-50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {updatedDistricts.reduce((sum, d) => sum + d.employees, 0).toLocaleString()}명
                  </div>
                  <div className="text-sm text-muted-foreground">총 고용인원</div>
                </div>
              </Card>
              <Card className="p-4 bg-orange-50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.round(updatedDistricts.reduce((sum, d) => sum + d.salesRate, 0) / updatedDistricts.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">평균 분양률</div>
                </div>
              </Card>
            </div>

            <div className="space-y-3">
              {landData.length > 0 && (
                <Card className="p-4 mb-4 bg-primary/5">
                  <div className="text-sm">
                    <Badge variant="outline" className="mb-2">📊 실제 지적 데이터</Badge>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">소재지: </span>
                        <span className="font-medium">
                          {'location' in landData[0] ? (landData[0] as LandData).location : (landData[0] as ReclaimData).region}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">지목: </span>
                        <span className="font-medium">
                          {'landType' in landData[0] ? (landData[0] as LandData).landType : '간체지'}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">면적: </span>
                        <span className="font-medium">{landData[0].area.toLocaleString()}㎡</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">소유자: </span>
                        <span className="font-medium">새만금개발청</span>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
              
              {updatedDistricts.map((district) => (
                <Card 
                  key={district.id} 
                  className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedDistrict?.id === district.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedDistrict(district)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getDistrictColor(district)}`}></div>
                        <Badge variant="outline">{district.name.split('(')[0].trim()}</Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{district.industry}</span>
                        {getIndustryIcon(district.industry)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className="text-muted-foreground text-xs">분양률</div>
                        <div className="font-bold text-blue-600">{district.salesRate}%</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground text-xs">기업수</div>
                        <div className="font-bold text-green-600">{district.companies}개</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground text-xs">투자금</div>
                        <div className="font-bold text-purple-600">{district.investment}억</div>
                      </div>
                      <div className="text-center">
                        <div className="text-muted-foreground text-xs">고용</div>
                        <div className="font-bold text-emerald-600">{district.employees}명</div>
                      </div>
                      <Badge variant={district.status === 'completed' ? 'default' : 'secondary'}>
                        {getStatusText(district.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* 프로젝트 미리보기 */}
                  <div className="mt-3 pt-3 border-t text-xs">
                    <div className="text-muted-foreground mb-1">주요 프로젝트:</div>
                    <div className="flex flex-wrap gap-1">
                      {district.projects.major.slice(0, 2).map((project, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {project.length > 15 ? project.substring(0, 15) + '...' : project}
                        </Badge>
                      ))}
                      {district.projects.major.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{district.projects.major.length - 2}개
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      </Card>
      
      {/* 데이터 출처 및 계산 방법론 */}
      <DataMethodology
      title="새만금 공간정보"
      dataSources={[
        {
          name: "새만금개발청 토지이용현황",
          description: "새만금 지역 공구별 토지 이용 및 개발 현황 데이터",
          endpoint: "/land-usage/v1/saemangeum-districts",
          updateFrequency: "월 1회",
          lastUpdated: new Date().toLocaleDateString('ko-KR'),
          recordCount: updatedDistricts.length,
          dataQuality: 95
        },
        {
          name: "새만금개발청 투자인센티브보조금지원현황",
          description: "공구별 기업 투자 및 보조금 지원 현황",
          endpoint: "/15121622/v1/uddi:d8e95b9d-7808-4643-b2f5-c1fa1a649ede",
          updateFrequency: "월 1회",
          lastUpdated: new Date().toLocaleDateString('ko-KR'),
          recordCount: investmentData.length,
          dataQuality: Math.round((investmentData.filter(item => item.company && item.investment > 0).length / Math.max(investmentData.length, 1)) * 100)
        },
        {
          name: "새만금개발청 재생에너지사업정보",
          description: "공구별 재생에너지 발전소 및 사업 현황",
          endpoint: "/15121623/v1/uddi:renewable-energy-data",
          updateFrequency: "주 1회",
          lastUpdated: new Date().toLocaleDateString('ko-KR'),
          recordCount: landData.length,
          dataQuality: Math.round((landData.filter(item => item.area > 0).length / Math.max(landData.length, 1)) * 100)
        }
      ]}
      calculations={[
        {
          name: "분양률 계산",
          formula: "(분양된 면적 / 전체 개발 면적) × 100",
          description: "각 공구의 전체 개발 면적 대비 분양된 면적의 비율",
          variables: [
            { name: "분양면적", description: "실제 분양된 토지 면적", unit: "㎡" },
            { name: "전체면적", description: "공구의 전체 개발 가능 면적", unit: "㎡" }
          ],
          example: "분양면적 850㎡ / 전체면적 1000㎡ × 100 = 85%"
        },
        {
          name: "공구별 투자밀도",
          formula: "총 투자금액 / 공구 면적",
          description: "단위 면적당 투자금액을 계산하여 투자 밀도 측정",
          variables: [
            { name: "투자금액", description: "공구 내 총 투자금액", unit: "억원" },
            { name: "공구면적", description: "공구의 전체 면적", unit: "㎡" }
          ]
        },
        {
          name: "고용밀도",
          formula: "총 고용인원 / 공구 면적",
          description: "단위 면적당 고용인원을 계산하여 고용 창출 효과 측정",
          variables: [
            { name: "고용인원", description: "공구 내 총 고용인원", unit: "명" },
            { name: "공구면적", description: "공구의 전체 면적", unit: "㎡" }
          ]
        },
        {
          name: "개발진행률",
          formula: "(완료된 프로젝트 수 / 전체 프로젝트 수) × 100",
          description: "공구별 개발 프로젝트의 진행 상황을 백분율로 표시",
          variables: [
            { name: "완료프로젝트", description: "완료된 개발 프로젝트 수", unit: "개" },
            { name: "전체프로젝트", description: "계획된 전체 프로젝트 수", unit: "개" }
          ]
        }
      ]}
      limitations={[
        "공구별 데이터는 계획 단계의 정보도 포함되어 실제 개발 현황과 차이가 있을 수 있습니다.",
        "분양률은 계약 체결 기준이며, 실제 입주 완료와는 다를 수 있습니다.",
        "투자 및 고용 데이터는 예상 수치로 실제 성과와 다를 수 있습니다.",
        "지도 좌표는 근사치로 정확한 위치와 다를 수 있습니다."
      ]}
      notes={[
        "모든 면적 데이터는 공식 측량 결과를 기반으로 합니다.",
        "공구별 개발 상황은 인허가 진행 상황에 따라 변동될 수 있습니다.",
        "색상 코딩은 각 지표의 상대적 수준을 나타내며, 절대적 기준이 아닙니다.",
        "실시간 업데이트를 위해 캐시 기능을 사용하며, 최대 1시간간 이전 데이터가 표시될 수 있습니다."
      ]}
      />
    </div>
  );
}