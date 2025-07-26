import { User, Crown, TrendingUp, Code } from "lucide-react";

export const TeamSlide = () => {
  return (
    <div className="h-full bg-gradient-to-br from-violet-50 to-indigo-50 p-12">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-violet-600 mb-4">
            팀 소개: 최고의 시너지를 낼 '삼인성호'
          </h1>
          <p className="text-2xl text-violet-700 font-semibold">
            三人成虎 - 세 사람이 모이면 호랑이도 만든다
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8 flex-1">
          {/* 정우주 (팀장) */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-t-4 border-blue-500">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Crown className="h-12 w-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">정우주</h2>
              <p className="text-lg font-semibold text-blue-600">팀장</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">학교/전공</h3>
                <p className="text-blue-700">인하대학교 철학/통계학</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">역할</h3>
                <p className="text-blue-700 font-medium">기획/영업 총괄</p>
              </div>
              
              <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">강점 및 담당 업무</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">희귀질환 경험 기반 문제 공감대 형성</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">사업 기획 및 대외 협력</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">프로젝트 총괄</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 김경민 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-t-4 border-green-500">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">김경민</h2>
              <p className="text-lg font-semibold text-green-600">전략 기획</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">학교/전공</h3>
                <p className="text-green-700">전북대학교 무역학과</p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-2">역할</h3>
                <p className="text-green-700 font-medium">시장분석/전략</p>
              </div>
              
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">강점 및 담당 업무</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">공급망 관리(SCM) 전문성</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">시장 분석 및 데이터 전처리</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">상업화 전략 수립</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 최시몬 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-t-4 border-purple-500">
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-purple-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Code className="h-12 w-12 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">최시몬</h2>
              <p className="text-lg font-semibold text-purple-600">기술 총괄</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">학교/전공</h3>
                <p className="text-purple-700">전북대학교 컴퓨터공학과</p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">역할</h3>
                <p className="text-purple-700 font-medium">AI개발/기술 총괄</p>
              </div>
              
              <div className="bg-gradient-to-r from-purple-100 to-violet-100 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">강점 및 담당 업무</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">AI 모델 최적화 (RAG)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">서버 및 보안 인프라 구축</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                    <span className="text-gray-700">기술 개발 전반 리드</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 팀 시너지 */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-lg border-2 border-violet-200">
          <div className="text-center">
            <h3 className="text-xl font-bold text-violet-800 mb-3">팀 시너지</h3>
            <p className="text-violet-700">
              <span className="font-semibold">철학적 사고</span> + <span className="font-semibold">비즈니스 전략</span> + <span className="font-semibold">기술적 구현</span> = 
              <span className="text-xl font-bold text-violet-600"> 완벽한 솔루션</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};