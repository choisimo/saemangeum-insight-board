import { MessageCircle, Mail, Phone } from "lucide-react";

export const ThankYouSlide = () => {
  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-slate-100 flex items-center justify-center p-12">
      <div className="text-center max-w-4xl">
        <div className="mb-12">
          <h1 className="text-7xl font-bold text-gray-800 mb-8">감사합니다</h1>
          <p className="text-3xl text-gray-600 mb-6">
            2025년 JB선도산업 육성방안 탐구지원사업
          </p>
          <p className="text-2xl font-semibold text-primary">
            AI 기반 수요 예측을 통한 전북 제약산업 혁신 플랫폼 제안
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            <MessageCircle className="inline-block h-8 w-8 mr-3 text-primary" />
            질의응답
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            궁금한 점이 있으시면 언제든 문의해 주세요
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-800 mb-4">팀 삼인성호 연락처</h3>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-blue-800">정우주 (팀장)</p>
              <p className="text-xs text-blue-600">project@saminseongho.team</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <Phone className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-green-800">김경민</p>
              <p className="text-xs text-green-600">strategy@saminseongho.team</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-purple-800">최시몬</p>
              <p className="text-xs text-purple-600">tech@saminseongho.team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};