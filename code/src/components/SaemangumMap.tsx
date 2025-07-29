import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useInvestmentData, useDatasets, useLandData } from "@/hooks/use-data";
import type { InvestmentData, LandData, ReclaimData } from "@/services/data-service";
import { Map, Building2, Zap, Droplets, Wind, Factory, Loader2 } from "lucide-react";
import { KakaoMap } from "@/components/KakaoMap";
import { DataSourceInfo } from "@/components/DataSourceInfo";

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

export function SaemangumMap() {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData | null>(null);
  const [viewMode, setViewMode] = useState<'sales' | 'companies' | 'industry'>('sales');
  const { data: investmentData, loading: investmentLoading } = useInvestmentData();
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

            {/* 카카오맵 지도 */}
            <div className="space-y-4">
              <KakaoMap 
                data={[
                  // 투자 데이터를 지도 데이터로 변환
                  ...investmentData.slice(0, 5).map((item, index) => ({
                    id: item.id,
                    name: item.company,
                    lat: 35.7661 + (Math.random() - 0.5) * 0.02, // 새만금 주변 랜덤 좌표
                    lng: 126.5572 + (Math.random() - 0.5) * 0.02,
                    type: 'investment' as const,
                    description: `${item.sector} 분야 투자`,
                    value: `${item.investment}억원`
                  })),
                  // 재생에너지 데이터 추가 (데이터가 있는 경우)
                  // ...renewableData.slice(0, 3).map((item, index) => ({
                  //   id: item.id,
                  //   name: `${item.type} 발전소`,
                  //   lat: 35.7661 + (Math.random() - 0.5) * 0.02,
                  //   lng: 126.5572 + (Math.random() - 0.5) * 0.02,
                  //   type: 'renewable' as const,
                  //   description: `${item.capacity}MW 발전 시설`,
                  //   value: `${item.capacity}MW`
                  // }))
                ]}
                height="500px"
              />
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
              {landData.length > 0 && (
                <Card className="p-4 mb-4 bg-primary/5">
                  <div className="text-sm">
                    <Badge variant="outline" className="mb-2">실제 지적 데이터</Badge>
                    <p><strong>소재지:</strong> {'location' in landData[0] ? (landData[0] as LandData).location : (landData[0] as ReclaimData).region}</p>
                    <p><strong>지목:</strong> {'landType' in landData[0] ? (landData[0] as LandData).landType : '간체지'}</p>
                    <p><strong>면적:</strong> {landData[0].area.toLocaleString()}㎡</p>
                    <p><strong>소유자:</strong> 새만금개발청</p>
                  </div>
                </Card>
              )}
              {updatedDistricts.map((district) => (
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