import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Building2, Zap, Droplets, Wind, Factory } from "lucide-react";

interface DistrictData {
  id: string;
  name: string;
  salesRate: number;
  companies: number;
  industry: string;
  status: 'completed' | 'in-progress' | 'planned';
  area: number;
}

const districts: DistrictData[] = [
  { id: "1", name: "1공구", salesRate: 85, companies: 12, industry: "이차전지", status: "completed", area: 450 },
  { id: "2", name: "2공구", salesRate: 92, companies: 8, industry: "재생에너지", status: "completed", area: 380 },
  { id: "3", name: "3공구", salesRate: 67, companies: 15, industry: "스마트팜", status: "in-progress", area: 520 },
  { id: "4", name: "4공구", salesRate: 34, companies: 3, industry: "IT융합", status: "in-progress", area: 410 },
  { id: "5", name: "5공구", salesRate: 12, companies: 1, industry: "바이오", status: "planned", area: 330 },
  { id: "6", name: "6공구", salesRate: 0, companies: 0, industry: "항공우주", status: "planned", area: 290 }
];

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
    case '이차전지': return <Factory className="h-4 w-4" />;
    case '재생에너지': return <Zap className="h-4 w-4" />;
    case '스마트팜': return <Droplets className="h-4 w-4" />;
    case 'IT융합': return <Building2 className="h-4 w-4" />;
    case '바이오': return <Wind className="h-4 w-4" />;
    default: return <Building2 className="h-4 w-4" />;
  }
};

export function SaemangumMap() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null);
  const [viewMode, setViewMode] = useState<'sales' | 'companies' | 'industry'>('sales');

  const getDistrictColor = (district: DistrictData) => {
    switch (viewMode) {
      case 'sales':
        if (district.salesRate >= 80) return 'bg-success';
        if (district.salesRate >= 50) return 'bg-warning';
        return 'bg-destructive/60';
      case 'companies':
        if (district.companies >= 10) return 'bg-primary';
        if (district.companies >= 5) return 'bg-secondary';
        return 'bg-muted';
      case 'industry':
        return getStatusColor(district.status);
      default:
        return 'bg-muted';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Map className="h-5 w-5 text-primary" />
          <span>새만금 공간정보 시스템</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="map">지도 뷰</TabsTrigger>
            <TabsTrigger value="data">데이터 뷰</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="space-y-4">
            {/* 뷰 모드 선택 */}
            <div className="flex space-x-2">
              <Button
                variant={viewMode === 'sales' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('sales')}
              >
                분양률
              </Button>
              <Button
                variant={viewMode === 'companies' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('companies')}
              >
                입주기업
              </Button>
              <Button
                variant={viewMode === 'industry' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('industry')}
              >
                개발현황
              </Button>
            </div>

            {/* 지도 영역 (시각적 표현) */}
            <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-6 min-h-[400px] border-2 border-dashed border-primary/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg" />
              
              {/* 새만금 로고/제목 */}
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="secondary" className="text-sm font-semibold">
                  새만금 개발 현황
                </Badge>
              </div>

              {/* 공구 표시 (격자 형태로 배치) */}
              <div className="relative grid grid-cols-3 gap-4 h-full pt-12">
                {districts.map((district, index) => (
                  <div
                    key={district.id}
                    className={`
                      relative cursor-pointer transition-all duration-300 rounded-lg p-4 border-2 border-white/50
                      hover:scale-105 hover:shadow-lg hover:z-20
                      ${getDistrictColor(district)}
                      ${selectedDistrict?.id === district.id ? 'ring-4 ring-primary/50 shadow-xl scale-105' : ''}
                    `}
                    onClick={() => setSelectedDistrict(district)}
                  >
                    <div className="text-white font-bold text-center">
                      <div className="text-sm">{district.name}</div>
                      {viewMode === 'sales' && (
                        <div className="text-lg">{district.salesRate}%</div>
                      )}
                      {viewMode === 'companies' && (
                        <div className="text-lg">{district.companies}개</div>
                      )}
                      {viewMode === 'industry' && (
                        <div className="flex items-center justify-center mt-1">
                          {getIndustryIcon(district.industry)}
                        </div>
                      )}
                    </div>
                    
                    {/* 상태 표시 */}
                    <div className="absolute top-1 right-1">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(district.status)}`} />
                    </div>
                  </div>
                ))}
              </div>

              {/* 범례 */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 space-y-2">
                <div className="text-xs font-semibold text-foreground">범례</div>
                {viewMode === 'sales' && (
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-success rounded" />
                      <span>80% 이상</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-warning rounded" />
                      <span>50-79%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-destructive/60 rounded" />
                      <span>50% 미만</span>
                    </div>
                  </div>
                )}
                {viewMode === 'industry' && (
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-success rounded" />
                      <span>완료</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-warning rounded" />
                      <span>진행중</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-muted rounded" />
                      <span>계획</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 선택된 공구 상세 정보 */}
            {selectedDistrict && (
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedDistrict.name} 상세 정보</h3>
                      <Badge variant="outline" className="mt-1">
                        {selectedDistrict.industry}
                      </Badge>
                    </div>
                    <Badge variant="secondary">
                      {getStatusText(selectedDistrict.status)}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">분양률</div>
                      <div className="font-semibold text-lg">{selectedDistrict.salesRate}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">입주기업</div>
                      <div className="font-semibold text-lg">{selectedDistrict.companies}개</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">면적</div>
                      <div className="font-semibold text-lg">{selectedDistrict.area}만㎡</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">업종</div>
                      <div className="font-semibold text-lg flex items-center space-x-1">
                        {getIndustryIcon(selectedDistrict.industry)}
                        <span className="text-sm">{selectedDistrict.industry}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div className="space-y-3">
              {districts.map((district) => (
                <Card key={district.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">{district.name}</Badge>
                      <span className="font-medium">{district.industry}</span>
                      <div className="flex items-center space-x-1">
                        {getIndustryIcon(district.industry)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">분양률: </span>
                        <span className="font-medium">{district.salesRate}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">기업: </span>
                        <span className="font-medium">{district.companies}개</span>
                      </div>
                      <Badge variant={district.status === 'completed' ? 'default' : 'secondary'}>
                        {getStatusText(district.status)}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}