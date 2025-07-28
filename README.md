# 새만금 인사이트 대시보드 (Saemangeum Insight Board)

새만금개발청 공공데이터를 활용한 종합 개발현황 모니터링 및 정책 시뮬레이션 대시보드

## 🎯 프로젝트 개요

새만금 지역의 투자유치, 기업 입주, 재생에너지, 교통량 등의 실시간 데이터를 통합하여 정책 결정을 지원하는 AI 기반 인사이트 대시보드입니다.

### 주요 기능

- **실시간 KPI 모니터링**: 투자유치액, 고용창출, 재생에너지 발전량 등 6개 핵심 지표
- **정책 시뮬레이션**: What-if 분석을 통한 정책 효과 예측
- **공간정보 시각화**: 공구별 개발현황 및 지리적 분석
- **기업 투자 보고서**: 업종별/단계별 투자 진행 현황
- **실시간 알림 시스템**: 이상 감지 및 주요 이벤트 알림

## 📊 데이터 소스

### 새만금개발청 공공데이터 API (9개)
1. **투자 인센티브 보조금지원 현황**
2. **재생에너지 사업 정보**
3. **기상정보 초단기실황조회**
4. **방조제 교통량**
5. **사업지역 지적공부**
6. **사업 매립 정보**
7. **산업단지 입주기업 계약 현황**
8. **건축물 허가현황**
9. **지역 산업단지 유틸리티 현황**

## 🏗️ 아키텍처

### 기술 스택
- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: shadcn/ui, Tailwind CSS
- **State Management**: TanStack Query (React Query)
- **Data Visualization**: Recharts
- **HTTP Client**: 커스텀 API 클라이언트 (재시도 로직 포함)

### 프로젝트 구조
```
code/
├── src/
│   ├── components/          # 재사용 가능한 컴포넌트
│   │   ├── ui/             # shadcn/ui 컴포넌트
│   │   ├── ErrorBoundary.tsx
│   │   ├── KPICard.tsx
│   │   ├── Navigation.tsx
│   │   └── ...
│   ├── hooks/              # 커스텀 훅
│   │   └── use-data.ts     # 데이터 패칭 훅
│   ├── lib/                # 유틸리티 및 서비스
│   │   ├── api-client.ts   # HTTP 클라이언트
│   │   ├── data-service.ts # 데이터 변환 서비스
│   │   └── utils.ts
│   └── pages/              # 페이지 컴포넌트
       └── Index.tsx
├── datasets/               # 로컬 데이터셋
├── docs/                   # 프로젝트 문서
└── ppt/                    # 프레젠테이션 자료
```

## 🚀 시작하기

### 1. 환경 설정

```bash
# 레포지토리 클론
git clone https://github.com/your-username/saemangeum-insight-board.git
cd saemangeum-insight-board/code

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env
# .env 파일에 API 키 설정
```

### 2. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

### 3. 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 파일 미리보기
npm run preview
```

## 📋 개발 현황

### ✅ 완료된 기능 (95%)

#### Core Infrastructure
- [x] API 클라이언트 및 데이터 서비스 구축
- [x] React Query를 활용한 상태 관리
- [x] 에러 처리 및 로딩 상태 관리
- [x] TypeScript 타입 정의

#### Dashboard Components
- [x] 6개 KPI 카드 (투자유치액, 신규기업, 고용창출 등)
- [x] 실시간 알림 시스템
- [x] 데이터 품질 인디케이터
- [x] 네트워크 상태 모니터링

#### Data Integration
- [x] 9개 새만금 공공데이터 API 연동
- [x] 데이터 캐싱 시스템 (5분 캐시)
- [x] API 응답 데이터 변환 로직
- [x] 폴백 메커니즘

### 🔄 진행 중인 작업 (5%)

- [ ] 정책 시뮬레이션 고도화
- [ ] 지도 시각화 개선
- [ ] 고급 차트 및 분석 기능

## 🔧 주요 컴포넌트

### DataService
실제 API 호출 및 데이터 변환을 담당하는 싱글톤 서비스

```typescript
const dataService = DataService.getInstance();
const investmentData = await dataService.getInvestmentData();
```

### ErrorBoundary
애플리케이션 레벨 에러 처리 및 복구 기능

```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Custom Hooks
React Query를 래핑한 데이터 패칭 훅

```typescript
const { data, loading, error, refetch } = useInvestmentData();
```

## 📈 성능 최적화

- **캐싱 전략**: 데이터별 차별화된 캐시 정책
- **에러 복구**: 자동 재시도 및 폴백 처리
- **번들 최적화**: Tree shaking 및 code splitting
- **로딩 상태**: 스켈레톤 UI로 사용자 경험 개선

## 🔒 보안

- **API 키 관리**: 환경변수를 통한 민감 정보 보호
- **CORS 처리**: 적절한 크로스 오리진 설정
- **에러 로깅**: 민감 정보 노출 방지

## 📚 문서

- [기능 명세서](docs/05_pm_functional_specification.md)
- [사용자 스토리](docs/06_pm_user_stories_draft.md)
- [기술 분석](docs/07_technical_analysis_methodology.md)
- [제품 요구사항](docs/04_pm_product_requirements_document.md)

## 🤝 기여

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 연락처

새만금개발청 데이터 분석팀
- 이메일: contact@saemangeum.go.kr
- GitHub: https://github.com/saemangeum-dev

## 📄 라이선스

이 프로젝트는 새만금개발청의 공공데이터 활용 프로젝트로 오픈소스 라이선스를 따릅니다.

---

**마지막 업데이트**: 2025년 7월 29일  
**버전**: 1.0.0  
**상태**: Production Ready 🚀