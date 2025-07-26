import { Target, TrendingDown, RotateCcw } from "lucide-react";

export const GoalsSlide = () => {
  return (
    <div className="h-full bg-gradient-to-br from-amber-50 to-yellow-50 p-12">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-amber-600 mb-4">
            프로젝트 목표: 명확한 성과를 약속합니다
          </h1>
        </div>

        {/* 최종 목표 */}
        <div className="bg-white rounded-lg p-8 shadow-lg border-t-4 border-amber-500 mb-8">
          <div className="flex items-center justify-center mb-4">
            <Target className="h-12 w-12 text-amber-500 mr-4" />
            <h2 className="text-3xl font-bold text-gray-800">최종 목표</h2>
          </div>
          <p className="text-2xl text-center text-gray-700 font-semibold">
            AI 수요 예측 플랫폼 PoC를 통해 전북 제약 산업의 재고 최적화 모델 제시
          </p>
        </div>

        {/* 정량 목표 */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            정량 목표 (PoC 참여 제약사 기준)
          </h3>
          
          <div className="grid grid-cols-3 gap-8">
            {/* 품절률 감소 */}
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-4">
                <TrendingDown className="h-16 w-16 text-red-600" />
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">의약품 품절률</h4>
                <div className="text-4xl font-bold text-red-600 mb-2">60%</div>
                <p className="text-lg text-red-700 font-semibold">감소</p>
                <p className="text-sm text-gray-600 mt-2">
                  AI 예측으로 품절 사태 예방
                </p>
              </div>
            </div>

            {/* 폐기율 감소 */}
            <div className="text-center">
              <div className="bg-orange-100 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-4">
                <TrendingDown className="h-16 w-16 text-orange-600" />
              </div>
              <div className="bg-orange-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">의약품 폐기율</h4>
                <div className="text-4xl font-bold text-orange-600 mb-2">50%</div>
                <p className="text-lg text-orange-700 font-semibold">감소</p>
                <p className="text-sm text-gray-600 mt-2">
                  정확한 수요 예측으로 과재고 방지
                </p>
              </div>
            </div>

            {/* 재고 회전일 단축 */}
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-32 h-32 mx-auto flex items-center justify-center mb-4">
                <RotateCcw className="h-16 w-16 text-green-600" />
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">재고 회전일</h4>
                <div className="text-4xl font-bold text-green-600 mb-2">30%</div>
                <p className="text-lg text-green-700 font-semibold">단축</p>
                <p className="text-sm text-gray-600 mt-2">
                  효율적 재고 관리로 자금 효율성 향상
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};