import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, BarChart3, TrendingUp, RefreshCw, Download, Save, Copy, Target, Building2, Zap, Users } from "lucide-react";
import { useInvestmentData, useRenewableData } from "@/stores";
import { useRenewableEnergyData } from "@/hooks/use-data";
import { formatPercentage, formatChangeRate } from '@/utils/formatters';

interface SimulationResult {
  investmentAttraction: number;
  employmentCreation: number;
  gdpContribution: number;
  carbonReduction: number;
  taxBenefit: number;
  governmentCost: number;
  roi: number;
}

interface Scenario {
  id: string;
  name: string;
  corporateTaxReduction: number;
  rentalDiscount: number;
  re100Incentive: number;
  subsidyAmount: number;
  results: SimulationResult;
}

interface InvestmentSimulationInputs {
  industry: string;
  investmentAmount: number;
  employmentCount: number;
  landArea: number;
}

export function PolicySimulator() {
  const [corporateTaxReduction, setCorporateTaxReduction] = useState([5]);
  const [rentalDiscount, setRentalDiscount] = useState([20]);
  const [re100Incentive, setRe100Incentive] = useState([10]);
  
  const investmentData = useInvestmentData() || [];
  const { data: renewableData = [] } = useRenewableEnergyData();

  // 정책 시뮬레이션 계산 로직
  const calculateEffects = (): SimulationResult => {
    // 실제 데이터 기반 기준값 계산
    const baseInvestment = investmentData.length > 0 
      ? Math.round(investmentData.reduce((sum, item) => sum + item.investment, 0) / 100)
      : 1000; // 기준 투자액 (억원)
    
    const baseEmployment = investmentData.length > 0
      ? investmentData.reduce((sum, item) => sum + item.expectedJobs, 0)
      : 500; // 기준 고용 (명)
    
    const baseGDP = Math.round(baseInvestment * 0.2); // GDP 기여도는 투자액의 20%로 추정
    
    const baseCarbon = renewableData.length > 0
      ? Math.round(renewableData.reduce((sum, item) => sum + item.capacity, 0) * 2.5) // MW당 2.5톤 CO2 절감 추정
      : 100; // 기준 탄소 절감 (톤)

    const taxMultiplier = 1 + (corporateTaxReduction[0] * 0.08); // 세금 감면 효과
    const rentalMultiplier = 1 + (rentalDiscount[0] * 0.05); // 임대료 할인 효과
    const incentiveMultiplier = 1 + (re100Incentive[0] * 0.06); // RE100 인센티브 효과

    return {
      investmentAttraction: Math.round(baseInvestment * taxMultiplier * rentalMultiplier),
      employmentCreation: Math.round(baseEmployment * taxMultiplier * 0.8),
      gdpContribution: Math.round(baseGDP * taxMultiplier * rentalMultiplier * 0.9),
      carbonReduction: Math.round(baseCarbon * incentiveMultiplier * 1.2),
      taxBenefit: Math.round(baseInvestment * corporateTaxReduction[0] * 0.08),
      governmentCost: Math.round(baseInvestment * (rentalDiscount[0] * 0.05 + re100Incentive[0] * 0.06)),
      roi: Number((((baseInvestment * taxMultiplier * rentalMultiplier) / (baseInvestment + (baseInvestment * (rentalDiscount[0] * 0.05 + re100Incentive[0] * 0.06)))) * 100).toFixed(2))
    };
  };

  const results = calculateEffects();
  
  // 실제 데이터 기반 기준선 계산
  const baseline = {
    investmentAttraction: investmentData.length > 0 
      ? Math.round(investmentData.reduce((sum, item) => sum + item.investment, 0) / 100)
      : 1000,
    employmentCreation: investmentData.length > 0
      ? investmentData.reduce((sum, item) => sum + item.expectedJobs, 0)
      : 500,
    gdpContribution: investmentData.length > 0
      ? Math.round(investmentData.reduce((sum, item) => sum + item.investment, 0) / 100 * 0.2)
      : 200,
    carbonReduction: renewableData.length > 0
      ? Math.round(renewableData.reduce((sum, item) => sum + item.capacity, 0) * 2.5)
      : 100
  };

  const resetPolicies = () => {
    setCorporateTaxReduction([5]);
    setRentalDiscount([20]);
    setRe100Incentive([10]);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-primary" />
          <span>정책 시뮬레이션 도구</span>
          <Badge variant="secondary" className="ml-auto">
            What-if 분석
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="simulator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simulator">정책 조정</TabsTrigger>
            <TabsTrigger value="results">효과 분석</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simulator" className="space-y-6">
            <div className="space-y-6">
              {/* 법인세 감면율 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">법인세 감면율</label>
                  <Badge variant="outline">{corporateTaxReduction[0].toFixed(2)}%</Badge>
                </div>
                <Slider
                  value={corporateTaxReduction}
                  onValueChange={setCorporateTaxReduction}
                  max={15}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>15%</span>
                </div>
              </div>

              {/* 장기임대료 할인율 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">장기임대료 할인율</label>
                  <Badge variant="outline">{rentalDiscount[0].toFixed(2)}%</Badge>
                </div>
                <Slider
                  value={rentalDiscount}
                  onValueChange={setRentalDiscount}
                  max={50}
                  min={0}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                </div>
              </div>

              {/* RE100 인센티브 */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">RE100 인센티브 수준</label>
                  <Badge variant="outline">{re100Incentive[0].toFixed(2)}%</Badge>
                </div>
                <Slider
                  value={re100Incentive}
                  onValueChange={setRe100Incentive}
                  max={30}
                  min={0}
                  step={2}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>30%</span>
                </div>
              </div>

              <Button 
                onClick={resetPolicies} 
                variant="outline" 
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                초기화
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 투자유치액 변화 */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">예상 투자유치액</span>
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                <div className="text-2xl font-bold text-primary">
                  {results.investmentAttraction.toLocaleString()}억원
                </div>
                <div className="text-xs text-muted-foreground">
                  기준 대비 {formatChangeRate((results.investmentAttraction - baseline.investmentAttraction) / baseline.investmentAttraction)}
                </div>
              </Card>

              {/* 고용창출 효과 */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">고용창출 효과</span>
                  <BarChart3 className="h-4 w-4 text-secondary" />
                </div>
                <div className="text-2xl font-bold text-secondary">
                  {results.employmentCreation.toLocaleString()}명
                </div>
                <div className="text-xs text-muted-foreground">
                  기준 대비 {formatChangeRate((results.employmentCreation - baseline.employmentCreation) / baseline.employmentCreation)}
                </div>
              </Card>

              {/* GDP 기여도 */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">지역 GDP 기여</span>
                  <TrendingUp className="h-4 w-4 text-accent" />
                </div>
                <div className="text-2xl font-bold text-accent-foreground">
                  {results.gdpContribution.toLocaleString()}억원
                </div>
                <div className="text-xs text-muted-foreground">
                  기준 대비 {formatChangeRate((results.gdpContribution - baseline.gdpContribution) / baseline.gdpContribution)}
                </div>
              </Card>

              {/* 탄소 절감 효과 */}
              <Card className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">탄소 절감 효과</span>
                  <span className="text-success">♻</span>
                </div>
                <div className="text-2xl font-bold text-success">
                  {results.carbonReduction.toLocaleString()}톤
                </div>
                <div className="text-xs text-muted-foreground">
                  기준 대비 {formatChangeRate((results.carbonReduction - baseline.carbonReduction) / baseline.carbonReduction)}
                </div>
              </Card>
            </div>

            {/* 시나리오 비교 */}
            <Card className="p-4">
              <h4 className="font-medium mb-3">시나리오별 비교 분석</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">현재 설정:</span>
                  <span className="font-medium">투자유치 {results.investmentAttraction.toLocaleString()}억원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">최대 인센티브:</span>
                  <span className="font-medium text-success">투자유치 {Math.round(baseline.investmentAttraction * 1.85).toLocaleString()}억원 (예상)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">현재 정책 유지:</span>
                  <span className="font-medium text-muted-foreground">투자유치 {baseline.investmentAttraction.toLocaleString()}억원</span>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}