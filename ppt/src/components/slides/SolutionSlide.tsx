import { Brain, Package, TrendingUp, Shield } from "lucide-react";

export const SolutionSlide = () => {
  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 p-12">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            우리의 해결책: AI 혁신 플랫폼
          </h1>
          <p className="text-2xl text-blue-700 font-semibold">
            데이터로 재고를 최적화하고, 환자의 안정적인 치료를 보장합니다.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 flex-1">
          {/* 솔루션 개요 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-t-4 border-blue-500 col-span-3">
            <div className="flex items-center justify-center mb-6">
              <Brain className="h-12 w-12 text-blue-500 mr-4" />
              <h2 className="text-3xl font-bold text-gray-800">
                AI 수요 예측 및 영업 지원 플랫폼 PoC 개발
              </h2>
            </div>
          </div>

          {/* 핵심 기능 1: 재고 최적화 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center mb-6">
              <Package className="h-8 w-8 text-green-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-800">재고 최적화</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-green-800 font-semibold mb-2">AI 수요 예측</p>
                <p className="text-green-700 text-sm">
                  의약품 수요를 정확히 예측하여
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between bg-red-100 p-2 rounded">
                  <span className="text-red-700">품절 최소화</span>
                  <span className="text-red-600 font-bold">↓</span>
                </div>
                <div className="flex items-center justify-between bg-orange-100 p-2 rounded">
                  <span className="text-orange-700">폐기 최소화</span>
                  <span className="text-orange-600 font-bold">↓</span>
                </div>
              </div>
            </div>
          </div>

          {/* 핵심 기능 2: 영업 지원 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-8 w-8 text-purple-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-800">영업 지원</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-purple-800 font-semibold mb-2">Next Best Action</p>
                <p className="text-purple-700 text-sm">
                  데이터 기반 최적 활동 추천
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="bg-blue-100 p-2 rounded text-center">
                  <span className="text-blue-700 text-sm">📊 데이터 분석</span>
                </div>
                <div className="bg-indigo-100 p-2 rounded text-center">
                  <span className="text-indigo-700 text-sm">🎯 맞춤 추천</span>
                </div>
                <div className="bg-violet-100 p-2 rounded text-center">
                  <span className="text-violet-700 text-sm">📈 성과 향상</span>
                </div>
              </div>
            </div>
          </div>

          {/* 기대 효과 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-emerald-500">
            <div className="flex items-center mb-6">
              <Shield className="h-8 w-8 text-emerald-500 mr-3" />
              <h3 className="text-xl font-bold text-gray-800">기대 효과</h3>
            </div>
            
            <div className="space-y-4">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <p className="text-emerald-800 font-semibold mb-2">안정적 공급망</p>
                <p className="text-emerald-700 text-sm">
                  의약품 공급 부족 사태 예방
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="bg-green-100 p-2 rounded text-center">
                  <span className="text-green-700 text-sm">🏥 환자 치료 연속성</span>
                </div>
                <div className="bg-blue-100 p-2 rounded text-center">
                  <span className="text-blue-700 text-sm">🌐 지역 기반 네트워크</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};