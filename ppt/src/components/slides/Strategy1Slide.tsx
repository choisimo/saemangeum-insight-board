import { Database, Brain, Cloud } from "lucide-react";

export const Strategy1Slide = () => {
  return (
    <div className="h-full bg-gradient-to-br from-indigo-50 to-purple-50 p-12">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-600 mb-4">
            추진 전략 1: 데이터 통합 및 AI 모델링
          </h1>
          <p className="text-2xl text-indigo-700 font-semibold">
            정확한 예측을 위한 데이터 기반 설계
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 flex-1">
          {/* 데이터 확보 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center mb-6">
              <Database className="h-8 w-8 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">데이터 확보</h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  통합 데이터 레이크 구축
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center p-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg">
                  <Cloud className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-semibold text-blue-800">HIRA 처방 데이터</p>
                    <p className="text-sm text-blue-600">건강보험심사평가원</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gradient-to-r from-green-100 to-green-50 rounded-lg">
                  <Cloud className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="font-semibold text-green-800">제약사 RFID 재고 데이터</p>
                    <p className="text-sm text-green-600">실시간 재고 추적</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gradient-to-r from-purple-100 to-purple-50 rounded-lg">
                  <Cloud className="h-5 w-5 text-purple-600 mr-3" />
                  <div>
                    <p className="font-semibold text-purple-800">영업사원 CRM 로그</p>
                    <p className="text-sm text-purple-600">고객 활동 데이터</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gradient-to-r from-orange-100 to-orange-50 rounded-lg">
                  <Cloud className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <p className="font-semibold text-orange-800">외부 환경 데이터</p>
                    <p className="text-sm text-orange-600">계절성, 트렌드 등</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI 수요예측 모델링 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center mb-6">
              <Brain className="h-8 w-8 text-purple-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">AI 수요예측 모델링</h2>
            </div>
            
            <div className="space-y-6">
              {/* 주요 의약품 모델 */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">
                  주요 의약품
                </h3>
                <div className="bg-white p-3 rounded border-l-4 border-purple-400">
                  <p className="font-semibold text-gray-800 mb-2">앙상블 모델</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Prophet</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">LSTM</span>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">XGBoost</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">시계열 + 머신러닝 결합</p>
                </div>
              </div>

              {/* 희귀의약품 모델 */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-800 mb-3">
                  희귀의약품
                </h3>
                <div className="bg-white p-3 rounded border-l-4 border-indigo-400">
                  <p className="font-semibold text-gray-800 mb-2">베이지안 통계 모델</p>
                  <p className="text-sm text-gray-600">
                    데이터가 적은 경우를 고려한 불확실성 모델링
                  </p>
                </div>
              </div>

              {/* 모델 특징 */}
              <div className="bg-gradient-to-r from-purple-100 to-indigo-100 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">95%+</div>
                    <div className="text-sm text-purple-700">예측 정확도 목표</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">실시간</div>
                    <div className="text-sm text-indigo-700">수요 예측 업데이트</div>
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