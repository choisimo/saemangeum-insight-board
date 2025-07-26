import { DollarSign, Heart, Award } from "lucide-react";

export const ExpectedEffectsSlide = () => {
  return (
    <div className="h-full bg-gradient-to-br from-rose-50 to-pink-50 p-12">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-rose-600 mb-4">
            기대 효과: 경제, 사회, 정책적 가치 창출
          </h1>
          <p className="text-2xl text-rose-700 font-semibold">
            전북의 성장을 이끄는 혁신 모델을 제시합니다.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 flex-1">
          {/* 경제적 효과 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-t-4 border-green-500">
            <div className="flex items-center mb-6">
              <DollarSign className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">경제적 효과</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  도내 제약사 비용 절감
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700">재고 관리 비용</span>
                    <span className="text-green-600 font-bold">↓ 30%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-green-700">폐기 손실</span>
                    <span className="text-green-600 font-bold">↓ 50%</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  매출 증대
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700">데이터 기반 영업</span>
                    <span className="text-blue-600 font-bold">📈</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-700">고객 만족도</span>
                    <span className="text-blue-600 font-bold">⬆️</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center p-3 bg-green-100 rounded-lg">
                <p className="text-lg font-bold text-green-800">
                  💰 ROI 200% 이상 예상
                </p>
              </div>
            </div>
          </div>

          {/* 사회적 효과 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-t-4 border-blue-500">
            <div className="flex items-center mb-6">
              <Heart className="h-8 w-8 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">사회적 효과</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  환자 치료 연속성 보장
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-blue-700">희귀·필수 의약품 안정 공급</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-blue-700">치료 중단 위험 최소화</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">
                  도민 의료 접근성 향상
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-purple-700">지역 약국 네트워크 강화</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-purple-700">의약품 접근성 개선</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center p-3 bg-blue-100 rounded-lg">
                <p className="text-lg font-bold text-blue-800">
                  🏥 도민 건강 증진
                </p>
              </div>
            </div>
          </div>

          {/* 정책적 효과 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-t-4 border-purple-500">
            <div className="flex items-center mb-6">
              <Award className="h-8 w-8 text-purple-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">정책적 효과</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">
                  디지털 헬스케어 선도
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-purple-700">AI-헬스케어 모델 구축</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-purple-700">디지털 보건경제 기반</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-orange-800 mb-3">
                  정책 선제 대응
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-orange-700">2025년 RFID 의무화 대비</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                    <span className="text-orange-700">고가약 관리 체계 구축</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center p-3 bg-purple-100 rounded-lg">
                <p className="text-lg font-bold text-purple-800">
                  🏆 전북 혁신 브랜딩
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};