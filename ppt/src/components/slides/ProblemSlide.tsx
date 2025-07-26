import { AlertTriangle, Users } from "lucide-react";

export const ProblemSlide = () => {
  return (
    <div className="h-full bg-gradient-to-br from-red-50 to-orange-50 p-12">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-red-600 mb-4">
            문제 제기: 우리가 풀어야 할 과제
          </h1>
          <p className="text-2xl text-red-700 font-semibold">
            의약품 공급 불안, 더는 지켜볼 수 없는 현실입니다.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 flex-1">
          {/* ADHD 치료제 품절 대란 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-red-500">
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                ADHD 치료제 품절 대란
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-red-100 p-4 rounded-lg">
                <p className="text-lg font-semibold text-red-800 mb-2">
                  2024년 하반기 발생
                </p>
                <p className="text-red-700">
                  데이터 기반 수요 예측 시스템의 부재로
                </p>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <Users className="h-16 w-16 text-red-500 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-red-600">33만 명</p>
                  <p className="text-lg text-gray-700">ADHD 환자</p>
                  <p className="text-lg font-semibold text-red-600">치료 중단 위기</p>
                </div>
              </div>
            </div>
          </div>

          {/* 고가·희귀의약품 공급난 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center mb-6">
              <AlertTriangle className="h-8 w-8 text-orange-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">
                고가·희귀의약품 공급난
              </h2>
            </div>
            
            <div className="space-y-4">
              <div className="bg-orange-100 p-4 rounded-lg">
                <p className="text-lg font-semibold text-orange-800 mb-2">
                  최근 5년간 지속적 문제
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">71개</p>
                  <p className="text-sm text-gray-700">희귀의약품 품목</p>
                  <p className="text-sm font-semibold text-orange-600">수급 불안정</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="text-2xl font-bold text-red-600">48개</p>
                  <p className="text-sm text-gray-700">품목 중</p>
                  <p className="text-sm font-semibold text-red-600">여전히 불안정</p>
                </div>
              </div>
              
              <p className="text-center text-gray-700 italic">
                복잡한 공급망 관리의 어려움을 보여줍니다
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};