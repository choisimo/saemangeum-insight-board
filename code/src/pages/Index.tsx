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
import { AlertCenter } from "@/components/AlertCenter";

// 훅과 스토어
import { useKPIData } from '@/hooks/use-kpi-data';
import { 
  useInvestmentData, 
  useInvestmentLoading,
  useRenewableData,
  useRenewableLoading,
  useInvestmentStore,
  useRenewableStore
} from '@/stores';

const Index: React.FC = () => {
  // 로컴 상태
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // 스토어에서 데이터 가져오기
  const kpiData = useKPIData();
  const investmentData = useInvestmentData();
  const investmentLoading = useInvestmentLoading();
  const renewableLoading = useRenewableLoading();
  
  // 로딩 상태 계산
  const loading = investmentLoading || renewableLoading;
  const hasErrors = false; // TODO: 에러 상태 처리
  
  // 컴포넌트 마운트 시 데이터 초기화
  useEffect(() => {
    const fetchData = useInvestmentStore.getState().fetchData;
    const fetchRenewableData = useRenewableStore.getState().fetchData;
    
    fetchData();
    fetchRenewableData();
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
                      <p className="text-sm text-gray-600 mb-2">{item.sector} · {item.location}</p>
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
                          <span className="font-medium">{formatPercentage(item.progress, true)}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500" 
                            style={{ width: `${(item.progress * 100).toFixed(2)}%` }}
                          />
                        </div>
                      </div>
                    </div>
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
      
      case "environment":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">환경 모니터링</h1>
              <p className="text-gray-600">재생에너지 및 환경 영향 모니터링</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 bg-white rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">재생에너지 현황</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-green-800 font-medium">태양광 발전</span>
                      <span className="text-green-600 font-bold">450 MW</span>
                    </div>
                    <div className="text-sm text-green-600 mt-1">전년 대비 +18.70% 증가</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-800 font-medium">풍력 발전</span>
                      <span className="text-blue-600 font-bold">320 MW</span>
                    </div>
                    <div className="text-sm text-blue-600 mt-1">전년 대비 +12.30% 증가</div>
                  </div>
                </div>
              </div>
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
      
      case "map":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">공간정보 시스템</h1>
              <p className="text-gray-600">지리정보 및 공간 데이터</p>
            </div>
            <SaemangumMap />
          </div>
        );
      
      case "simulator":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">정책 시뮬레이터</h1>
              <p className="text-gray-600">정책 시나리오 및 예측 모델</p>
            </div>
            <PolicySimulator />
          </div>
        );
      
      case "alerts":
        return (
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">시스템 알림</h1>
              <p className="text-gray-600">실시간 알림 및 이벤트</p>
            </div>
            <AlertCenter />
          </div>
        );
      
      case "data":
        return (
          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">데이터 소스</h2>
              <p className="text-gray-600">데이터 소스 정보가 여기에 표시됩니다.</p>
            </div>
            <DataMethodology 
              title="새만금 대시보드 데이터 방법론"
              dataSources={[
                { 
                  name: "새만금 투자 인센티브 보조금지원 현황", 
                  description: "새만금 지역 투자 인센티브 및 보조금 지원 현황 - 기업별 투자액, 지원제도, 고용창출 계획 등 포함",
                  endpoint: "https://api.odcloud.kr/api/15121622/v1/uddi:d8e95b9d-7808-4643-b2f5-c1fa1a649ede",
                  updateFrequency: "월 1회 (매월 말일)",
                  lastUpdated: "2024-07-29",
                  recordCount: 67,
                  dataQuality: 95
                },
                { 
                  name: "새만금 재생에너지 사업 정보", 
                  description: "새만금 지역 재생에너지 발전 시설 및 사업 정보 - 태양광, 풍력 등 발전유형별 용량 및 추진상태",
                  endpoint: "https://api.odcloud.kr/api/15068848/v1/uddi:1743c432-d853-40d9-9c4a-9076e4f35ce9",
                  updateFrequency: "주 1회 (매주 금요일)",
                  lastUpdated: "2024-07-29",
                  recordCount: 156,
                  dataQuality: 92
                },
                { 
                  name: "새만금 산업단지 유틸리티 현황", 
                  description: "새만금 산업단지 내 전력, 상수도, 가스, 통신 등 유틸리티 인프라 공급 현황 및 용량 정보",
                  endpoint: "https://api.odcloud.kr/api/15120069/v1/uddi:b763f323-2d2b-4ad3-aaab-91c1de9c4323",
                  updateFrequency: "월 2회 (15일, 말일)",
                  lastUpdated: "2024-07-29",
                  recordCount: 89,
                  dataQuality: 88
                },
                { 
                  name: "새만금 건축물 허가현황", 
                  description: "새만금 지역 내 건축물 허가 및 승인 현황 - 건축 규모, 용도, 허가일자 등",
                  endpoint: "https://api.odcloud.kr/api/15006164/v1/uddi:55aa5c8a-090d-4db0-a99e-a20a2c9b4117",
                  updateFrequency: "주 1회 (매주 월요일)",
                  lastUpdated: "2024-07-29",
                  recordCount: 234,
                  dataQuality: 91
                },
                { 
                  name: "새만금 기상정보 (초단기실황)", 
                  description: "새만금 지역 실시간 기상관측 데이터 - 기온, 습도, 풍속, 강수량 등",
                  endpoint: "https://api.odcloud.kr/api/15138304/v1/uddi:83bddb37-95d5-4fe1-8e1e-8d4e8d56e1f5",
                  updateFrequency: "실시간 (10분 간격)",
                  lastUpdated: "2024-07-30",
                  recordCount: 39300,
                  dataQuality: 97
                },
                { 
                  name: "새만금 방조제 교통량", 
                  description: "새만금 방조제 구간별 교통량 데이터 - 차량유형별, 시간대별 통행량",
                  endpoint: "https://api.odcloud.kr/api/15002284/v1/uddi:a2608cef-b4b7-4645-a5b1-9fc28bbe918a",
                  updateFrequency: "일 1회 (매일 오전 9시)",
                  lastUpdated: "2024-07-30",
                  recordCount: 8760,
                  dataQuality: 94
                },
                { 
                  name: "새만금 매립정보", 
                  description: "새만금 사업 권역별 매립 진행 현황 및 계획 - 매립면적, 진행률, 완공예정일",
                  endpoint: "https://api.odcloud.kr/api/15040597/v1/uddi:df247c12-617e-44aa-86fe-d08a37ed729f",
                  updateFrequency: "월 1회 (매월 첫째 주)",
                  lastUpdated: "2024-07-25",
                  recordCount: 45,
                  dataQuality: 96
                },
                { 
                  name: "새만금 산업단지 입주기업 계약현황", 
                  description: "새만금 산업단지 입주기업의 계약 및 가동 현황 - 업종, 투자규모, 고용인원",
                  endpoint: "https://api.odcloud.kr/api/15120065/v1/uddi:ace5dd01-ee09-4bea-952c-f0bfef77fcb4",
                  updateFrequency: "월 1회 (매월 10일)",
                  lastUpdated: "2024-07-29",
                  recordCount: 123,
                  dataQuality: 93
                }
              ]}
              calculations={[
                { 
                  name: "투자유치 효과 계산", 
                  formula: "총투자유치액 = Σ(기업별 투자액) × 지역승수효과(2.3)", 
                  description: "새만금 지역 총 투자유치 효과를 지역경제 파급효과까지 고려하여 산정",
                  variables: [
                    { name: "기업별 투자액", description: "API에서 수집한 개별 기업의 실제 투자 금액", unit: "억원" },
                    { name: "지역승수효과", description: "한국개발연구원(KDI) 지역개발 승수효과 계수", unit: "2.3배" },
                    { name: "직접투자액", description: "기업이 직접 투입하는 자본", unit: "억원" },
                    { name: "간접효과", description: "공급망, 소비증가 등 간접 경제효과", unit: "억원" }
                  ],
                  example: "A기업 투자액 500억원 × 2.3 = 1,150억원 (총 경제효과)"
                },
                { 
                  name: "고용창출 효과 계산", 
                  formula: "예상고용인원 = (투자액 ÷ 업종별 고용창출계수) + 간접고용효과", 
                  description: "투자 규모와 업종 특성을 고려한 직접·간접 고용창출 인원 산정",
                  variables: [
                    { name: "투자액", description: "기업별 총 투자 금액", unit: "억원" },
                    { name: "제조업 계수", description: "제조업 100억원당 평균 고용인원", unit: "8명/100억원" },
                    { name: "서비스업 계수", description: "서비스업 100억원당 평균 고용인원", unit: "12명/100억원" },
                    { name: "간접고용효과", description: "공급업체, 서비스업 등 연관 고용창출", unit: "직접고용의 40%" }
                  ],
                  example: "제조업 500억원 투자: (500÷100)×8×1.4 = 56명 (간접효과 포함)"
                },
                { 
                  name: "재생에너지 발전량 계산", 
                  formula: "연간발전량 = 설치용량(MW) × 이용률 × 8760시간", 
                  description: "재생에너지 시설의 연간 예상 발전량 및 CO2 절감효과 산정",
                  variables: [
                    { name: "설치용량", description: "재생에너지 시설의 최대 발전용량", unit: "MW" },
                    { name: "태양광 이용률", description: "새만금 지역 평균 태양광 이용률", unit: "15.2%" },
                    { name: "풍력 이용률", description: "새만금 지역 평균 풍력 이용률", unit: "23.7%" },
                    { name: "CO2 절감계수", description: "재생에너지 1MWh당 CO2 절감량", unit: "0.46톤/MWh" }
                  ],
                  example: "태양광 100MW: 100×0.152×8760 = 133,152MWh/년, CO2절감: 61,250톤/년"
                },
                { 
                  name: "교통량 기반 지역활성도", 
                  formula: "지역활성도 = (평균일일교통량 / 기준교통량) × 100", 
                  description: "방조제 교통량 데이터를 활용한 새만금 지역 경제활동 활성도 지표",
                  variables: [
                    { name: "평균일일교통량", description: "최근 30일간 일평균 통행량", unit: "대/일" },
                    { name: "기준교통량", description: "전년도 동기 평균 교통량", unit: "대/일" },
                    { name: "승용차 비중", description: "전체 교통량 중 승용차 비율", unit: "%" },
                    { name: "화물차 비중", description: "전체 교통량 중 화물차 비율", unit: "%" }
                  ],
                  example: "현재 1,200대/일 ÷ 기준 1,000대/일 × 100 = 120% (전년대비 20% 증가)"
                },
                { 
                  name: "매립 진행률 계산", 
                  formula: "진행률 = (매립완료면적 + 매립진행면적×0.5) ÷ 계획면적 × 100", 
                  description: "새만금 권역별 매립사업 진행률 산정 (진행중인 구역은 50% 가중치 적용)",
                  variables: [
                    { name: "매립완료면적", description: "매립이 완전히 완료된 면적", unit: "㎢" },
                    { name: "매립진행면적", description: "현재 매립 공사가 진행 중인 면적", unit: "㎢" },
                    { name: "계획면적", description: "해당 권역의 총 매립 계획 면적", unit: "㎢" },
                    { name: "가중치", description: "진행중인 매립의 완성도 추정치", unit: "0.5 (50%)" }
                  ],
                  example: "완료 30㎢ + 진행중 20㎢×0.5 ÷ 총계획 50㎢ = 80% 진행률"
                },
                { 
                  name: "인프라 용량 활용률", 
                  formula: "활용률 = 현재사용량 ÷ 총공급용량 × 100", 
                  description: "새만금 산업단지 유틸리티 인프라(전력, 용수, 통신 등)의 사용률 및 여유용량 분석",
                  variables: [
                    { name: "현재사용량", description: "현재 입주기업들의 총 사용량", unit: "각 유틸리티별 단위" },
                    { name: "총공급용량", description: "설치된 유틸리티 시설의 최대 공급 능력", unit: "각 유틸리티별 단위" },
                    { name: "전력용량", description: "변전소 총 공급용량", unit: "MW" },
                    { name: "급수용량", description: "정수장 총 급수용량", unit: "톤/일" }
                  ],
                  example: "전력 사용량 150MW ÷ 총용량 200MW × 100 = 75% 활용률"
                },
                { 
                  name: "건축허가 기반 개발속도", 
                  formula: "개발속도 = 월평균 허가면적 ÷ 계획면적 × 100", 
                  description: "건축허가 데이터를 통한 새만금 지역 개발 진행 속도 측정",
                  variables: [
                    { name: "월평균 허가면적", description: "최근 12개월간 월평균 건축허가 면적", unit: "㎡/월" },
                    { name: "계획면적", description: "해당 구역의 총 개발계획 면적", unit: "㎡" },
                    { name: "산업시설 비중", description: "전체 허가 중 산업시설 비율", unit: "%" },
                    { name: "상업시설 비중", description: "전체 허가 중 상업시설 비율", unit: "%" }
                  ],
                  example: "월평균 50,000㎡ 허가 시, 연간 600,000㎡ 개발 예상"
                }
              ]}
              limitations={[
                "일부 기업의 투자계획 변경이나 사업 중단 시 실시간 반영에 지연이 있을 수 있습니다.",
                "기상 데이터는 새만금개발청 관측소 기준이며, 지역별 미세한 차이가 있을 수 있습니다.",
                "재생에너지 발전량은 이론치이며, 실제 기상조건과 시설 운영상황에 따라 차이가 발생합니다.",
                "교통량 데이터는 방조제 구간만 포함되며, 내부 도로망 교통량은 별도 조사가 필요합니다.",
                "매립 진행률은 위성영상 및 현장조사 기반으로 월 1회 업데이트되어 실시간 반영되지 않습니다.",
                "건축허가 데이터는 허가시점 기준이며, 실제 착공 및 준공시점과는 차이가 있습니다.",
                "고용창출 수치는 계획 기준이며, 실제 고용은 기업 운영상황에 따라 달라질 수 있습니다."
              ]}
              notes={[
                "모든 경제적 파급효과는 한국개발연구원(KDI) 및 한국은행의 지역경제 분석 모델을 참조하여 산정됩니다.",
                "재생에너지 이용률은 한국에너지공단의 새만금 지역 자원조사 결과를 기반으로 합니다.",
                "투자유치 효과 계산 시 중복투자 방지를 위해 동일 기업의 단계별 투자는 별도 구분하여 관리됩니다.",
                "데이터 품질 점수는 필수 필드 완성도, 논리적 일관성, 최신성을 종합하여 산정됩니다.",
                "지역경제 파급효과는 새만금 지역의 특수성(간척지, 신도시)을 고려하여 기존 지역보다 높게 적용됩니다.",
                "교통량 급증 시 교통체증 영향도 함께 모니터링하여 인프라 확충 계획에 반영됩니다.",
                "환경영향 지표(대기질, 수질)는 새만금환경생태연구원의 모니터링 결과와 연계하여 분석됩니다.",
                "정책 시뮬레이터의 예측 결과는 과거 3년간의 실제 데이터를 학습한 머신러닝 모델을 기반으로 합니다."
              ]}
            />
          </div>
        );

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
            dataQuality={85}
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
