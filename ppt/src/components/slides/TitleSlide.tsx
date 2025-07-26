export const TitleSlide = () => {
  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-8">
      <div className="text-center max-w-4xl">
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-primary mb-6 leading-tight">
            AI 기반 수요 예측을 통한
            <br />
            전북 제약산업 혁신 플랫폼 제안
          </h1>
          <p className="text-2xl text-muted-foreground mb-8">
            2025년 JB선도산업 육성방안 탐구지원사업 발표자료
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg p-8 shadow-lg">
          <div className="grid grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">탐구 주제</h3>
              <p className="text-foreground">
                AI 기반 수요 예측 시스템을 통한 도내 제약회사 재고 관리 및 영업 지원 플랫폼 제안
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">팀명</h3>
              <p className="text-2xl font-bold text-accent">삼인성호(三人成虎)</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">팀원</h3>
              <div className="space-y-1">
                <p className="text-foreground">정우주 (팀장)</p>
                <p className="text-foreground">김경민</p>
                <p className="text-foreground">최시몬</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};