import { Code, TestTube, Users } from "lucide-react";

export const Strategy2Slide = () => {
  return (
    <div className="h-full bg-gradient-to-br from-emerald-50 to-teal-50 p-12">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-emerald-600 mb-4">
            추진 전략 2: 플랫폼 개발 및 현장 검증
          </h1>
          <p className="text-2xl text-emerald-700 font-semibold">
            현장에서 작동하는 솔루션을 만듭니다.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 flex-1">
          {/* 플랫폼 기능 개발 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center mb-6">
              <Code className="h-8 w-8 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">플랫폼 기능 개발</h2>
            </div>
            
            <div className="space-y-6">
              {/* 재고 최적화 모듈 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  재고 최적화 모듈
                </h3>
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">수요 예측 대시보드</span>
                      <span className="text-blue-600 text-sm">📊</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">자동 발주 알림</span>
                      <span className="text-blue-600 text-sm">🔔</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">재고 최적화 추천</span>
                      <span className="text-blue-600 text-sm">💡</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 영업 지원 모듈 */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  영업 지원 (Next Best Action) 모듈
                </h3>
                <div className="space-y-2">
                  <div className="bg-white p-3 rounded border-l-4 border-green-400">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">고객별 맞춤 추천</span>
                      <span className="text-green-600 text-sm">🎯</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-green-400">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">최적 방문 일정</span>
                      <span className="text-green-600 text-sm">📅</span>
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded border-l-4 border-green-400">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">성과 분석 리포트</span>
                      <span className="text-green-600 text-sm">📈</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 현장 검증 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-emerald-500">
            <div className="flex items-center mb-6">
              <TestTube className="h-8 w-8 text-emerald-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">현장 검증</h2>
            </div>
            
            <div className="space-y-6">
              {/* 파트너십 */}
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-4">
                  검증 파트너십
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-white p-4 rounded-lg text-center border-2 border-emerald-200">
                    <Users className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-emerald-600">1~2개</div>
                    <div className="text-sm text-emerald-700">도내 제약사</div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg text-center border-2 border-teal-200">
                    <Users className="h-8 w-8 text-teal-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-teal-600">50여 개</div>
                    <div className="text-sm text-teal-700">협력 약국</div>
                  </div>
                </div>
              </div>

              {/* 검증 프로세스 */}
              <div className="bg-teal-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-teal-800 mb-3">
                  검증 프로세스
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-center p-2 bg-white rounded">
                    <div className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</div>
                    <span className="text-gray-700">실제 데이터 기반 테스트</span>
                  </div>
                  
                  <div className="flex items-center p-2 bg-white rounded">
                    <div className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</div>
                    <span className="text-gray-700">플랫폼 효과 측정</span>
                  </div>
                  
                  <div className="flex items-center p-2 bg-white rounded">
                    <div className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</div>
                    <span className="text-gray-700">현장 피드백 반영</span>
                  </div>
                  
                  <div className="flex items-center p-2 bg-white rounded">
                    <div className="w-6 h-6 bg-teal-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</div>
                    <span className="text-gray-700">최적화 및 개선</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};