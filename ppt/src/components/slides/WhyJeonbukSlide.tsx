import { MapPin, Lightbulb, Network } from "lucide-react";

export const WhyJeonbukSlide = () => {
  return (
    <div className="h-full bg-gradient-to-br from-green-50 to-emerald-50 p-12">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-green-600 mb-4">
            왜 '전북'이 최적의 기회인가?
          </h1>
          <p className="text-2xl text-green-700 font-semibold">
            전북은 AI 헬스케어 혁신을 선도할 최적의 테스트베드입니다.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 flex-1">
          {/* 정책적 기회 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center mb-6">
              <Lightbulb className="h-8 w-8 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">정책적 기회</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">
                  2025년 핵심 정책 변화
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <p className="text-blue-700">의약품 RFID 시스템 도입 의무화</p>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <p className="text-blue-700">정부의 고가약 사후관리 강화</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center p-4 bg-yellow-100 rounded-lg">
                <p className="text-lg font-semibold text-yellow-800">
                  ⚡ 도내 제약사들의 디지털 전환이 시급한 상황
                </p>
              </div>
            </div>
          </div>

          {/* 구조적 이점 */}
          <div className="bg-white rounded-lg p-8 shadow-lg border-l-4 border-green-500">
            <div className="flex items-center mb-6">
              <Network className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">구조적 이점</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-green-800 mb-3">
                  완벽한 테스트베드 환경
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-green-700">전북 지역 제약사 네트워크</p>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-green-600 mr-2" />
                    <p className="text-green-700">밀집된 약국 네트워크</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-100 p-4 rounded-lg text-center">
                  <p className="text-xl font-bold text-green-700">빠른 적용</p>
                  <p className="text-sm text-green-600">신규 플랫폼의</p>
                </div>
                <div className="bg-emerald-100 p-4 rounded-lg text-center">
                  <p className="text-xl font-bold text-emerald-700">효과 검증</p>
                  <p className="text-sm text-emerald-600">유리한 환경</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};