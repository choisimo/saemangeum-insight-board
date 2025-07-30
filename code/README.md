# Saemangeum Insight Dashboard

새만금개발청 공공데이터 기반 통합 대시보드 - 실시간 개발현황 모니터링 및 정책 시뮬레이션

## 🎯 Project Overview

새만금 지역의 투자유치, 기업 입주, 재생에너지, 교통량 등의 실시간 데이터를 통합하여 정책 결정을 지원하는 현대적인 웹 대시보드입니다.

### 주요 기능 (Key Features)
- ✅ **실시간 KPI 모니터링**: 6개 핵심 지표 대시보드
- ✅ **API 통합**: 9개 새만금개발청 공공데이터 API 연동
- ✅ **에러 처리**: 강력한 에러 복구 및 재시도 메커니즘 (ErrorBoundary 구현)
- ✅ **데이터 캐싱**: TanStack Query 기반 효율적인 5분 캐시 시스템
- ✅ **카카오맵 통합**: 새만금 지역 공간 데이터 시각화
- ✅ **데이터 출처 정보**: 투명성 및 신뢰성 향상
- ✅ **Zustand 상태관리**: 투자유치, 재생에너지, 알림 등 전역 상태 관리
- ✅ **TypeScript 타입 안전성**: 전체 코드베이스 타입 정의
- ✅ **반응형 디자인**: shadcn/ui 기반 모바일/태블릿/데스크톱 지원
- 🔄 **정책 시뮬레이션**: What-if 분석 도구
- 🔄 **고도화된 공간정보**: 지도 기반 데이터 분석

## 🏗️ Technology Stack

### Core Technologies
- **React 18**: 최신 React 기능 활용
- **TypeScript**: 타입 안전성 보장
- **Vite**: 빠른 개발 서버 및 빌드
- **TanStack Query**: 서버 상태 관리
- **shadcn/ui**: 모던 UI 컴포넌트
- **Tailwind CSS**: 유틸리티 퍼스트 스타일링

### Data & API
- **TanStack Query**: 서버 상태 관리 및 캐싱 (5분 TTL, 10분 GC)
- **Zustand**: 전역 상태 관리 (투자, 재생에너지, 알림, UI)
- **Custom HTTP Client**: 재시도 로직 포함 (최대 3회, 지수적 백오프)
- **Data Service Layer**: 데이터 변환 및 캐싱
- **Error Boundary**: 전역 에러 처리 및 네트워크 상태 모니터링
- **Real-time Updates**: 정기적 데이터 갱신

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 이상
- npm 또는 yarn

### 설치 및 실행

```bash
# 1. 의존성 설치
npm install

# 2. 환경변수 설정 (필요시)
cp .env.example .env
# 데이터포털 API 키 설정: https://www.data.go.kr
# 카카오맵 API 키 설정: https://developers.kakao.com

# 3. 개발 서버 시작
npm run dev

# 4. 브라우저에서 확인
# http://localhost:5173
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview

# 코드 품질 검사
npm run lint
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트 (40+ 컴포넌트)
│   ├── dashboard/          # 대시보드 관련 컴포넌트
│   │   ├── DashboardHeader.tsx
│   │   ├── KPISection.tsx
│   │   └── TabNavigation.tsx
│   ├── ErrorBoundary.tsx   # 에러 처리 및 네트워크 상태 컴포넌트
│   ├── KPICard.tsx        # KPI 카드 컴포넌트
│   ├── Navigation.tsx     # 메인 네비게이션
│   ├── PolicySimulator.tsx
│   ├── SaemangumMap.tsx   # 공간정보 지도 컴포넌트
│   ├── KakaoMap.tsx       # 카카오맵 지도 컴포넌트
│   ├── DataSourceInfo.tsx # 데이터 출처 정보 컴포넌트
│   ├── DataMethodology.tsx # 데이터 방법론 및 메타데이터
│   ├── InvestmentOverview.tsx
│   ├── InvestmentReport.tsx
│   └── AlertCenter.tsx    # 시스템 알림 센터
├── hooks/
│   ├── use-data.ts        # 데이터 패칭 훅
│   ├── use-kpi-data.ts    # KPI 데이터 전용 훅
│   ├── use-alerts.ts      # 알림 관련 훅
│   └── use-mobile.tsx     # 모바일 감지 훅
├── services/
│   ├── data-service.ts    # API 클라이언트 및 데이터 변환
│   └── alert-service.ts   # 알림 서비스
├── stores/
│   ├── index.ts          # Zustand 스토어 통합
│   ├── investment-store.ts  # 투자 데이터 스토어
│   ├── renewable-store.ts   # 재생에너지 스토어
│   ├── alert-store.ts       # 알림 스토어
│   └── ui-store.ts         # UI 상태 스토어
├── types/
│   └── dashboard.ts       # 전체 타입 정의 (44개 인터페이스)
├── utils/
│   ├── formatters.ts      # 데이터 포맷팅 유틸리티
│   └── kpi-calculator.ts  # KPI 계산 로직
├── constants/
│   └── dashboard.ts       # 대시보드 상수
├── pages/
│   ├── Index.tsx         # 메인 페이지 (500줄)
│   └── NotFound.tsx      # 404 페이지
└── App.tsx               # 루트 컴포넌트 (React Query, 에러 바운더리 설정)
```

## 🔗 API Integration

### 연동된 새만금개발청 공공데이터 (9개)

1. **투자 인센티브 보조금지원 현황** - 기업 투자 현황
2. **재생에너지 사업 정보** - 신재생에너지 프로젝트
3. **기상정보 초단기실황조회** - 실시간 날씨 데이터
4. **방조제 교통량** - 교통 흐름 분석
5. **사업지역 지적공부** - 토지 정보
6. **사업 매립 정보** - 매립 진행 현황
7. **산업단지 입주기업 계약 현황** - 기업 입주 상황
8. **건축물 허가현황** - 건설 허가 데이터
9. **지역 산업단지 유틸리티 현황** - 인프라 현황

### API 클라이언트 특징
- ✅ 자동 재시도 메커니즘 (최대 3회, 지수적 백오프)
- ✅ 요청 타임아웃 처리 (30초)
- ✅ 에러 분류 및 적절한 에러 메시지
- ✅ 데이터 변환 및 정제 로직 (533줄)
- ✅ API 엔드포인트별 특화된 데이터 처리
- ✅ 실시간 로깅 및 디버깅 지원

## 📊 Data Flow

```
Public API → HTTP Client → Data Service → Zustand Store → React Query → UI Components
     ↓              ↓            ↓            ↓            ↓            ↓
  재시도 로직    에러 처리    데이터 변환    전역 상태     캐싱 관리    상태 표시
     ↓              ↓            ↓            ↓            ↓            ↓
최대 3회 재시도  Error분류   타입 안전성   지속성 보장   5분 TTL    반응형 업데이트
```

### 상태 관리 아키텍처
- **Zustand**: 투자, 재생에너지, 알림, UI 상태 관리
- **TanStack Query**: 서버 상태 캐싱 및 동기화
- **Local State**: 컴포넌트별 임시 상태 (useState)
- **Error Boundary**: 전역 에러 포착 및 복구

## 🛠️ Development

### 개발 가이드라인

1. **컴포넌트 작성**
   - TypeScript 타입 정의 필수
   - Props interface 명시적 선언
   - Error boundary 활용

2. **API 통합**
   - DataService 클래스 사용
   - React Query 훅 패턴 준수
   - 에러 상태 처리 필수

3. **스타일링**
   - Tailwind CSS 클래스 활용
   - shadcn/ui 컴포넌트 우선 사용
   - 반응형 디자인 고려

### 코드 품질

```bash
# 린트 검사
npm run lint

# 타입 체크 (빌드에 포함됨)
npm run build

# 개발 서버 (포트 8080)
npm run dev
```

### 코드 품질 현황
- **TypeScript**: strict mode 일부 비활성화 (레거시 호환성)
- **ESLint**: typescript-eslint 기반 설정
- **컴포넌트 구조**: 함수형 컴포넌트, React.memo 적용
- **타입 안전성**: 전체 인터페이스 44개 정의
- **에러 처리**: ErrorBoundary 및 try-catch 패턴
- **성능 최적화**: useCallback, useMemo 적극 활용

## 🐛 Troubleshooting

### 자주 발생하는 문제

1. **API 호출 실패**
   - 환경변수 API 키 확인
   - 네트워크 연결 상태 점검
   - 에러 바운더리에서 자동 재시도

2. **빌드 에러**
   - TypeScript 타입 에러 수정
   - 의존성 버전 충돌 해결

3. **개발 서버 실행 실패**
   - Node.js 버전 확인 (18.0+)
   - 포트 충돌 해결 (5173)

## 📈 Performance

### 최적화 전략
- **데이터 캐싱**: TanStack Query 5분 TTL, 10분 GC
- **코드 분할**: 동적 임포트로 번들 크기 최적화
- **이미지 최적화**: WebP 포맷 사용
- **메모이제이션**: React.memo, useCallback, useMemo 활용
- **상태 관리**: Zustand 기반 효율적인 전역 상태
- **에러 복구**: 자동 재시도 및 fallback UI

### 성능 지표
- ⚡ 첫 콘텐츠 표시: < 1.5초
- ⚡ 상호작용 지연: < 100ms
- ⚡ 번들 크기: < 400KB (gzipped)

## 🔒 Security

- **환경변수**: API 키 등 민감 정보 보호
- **CORS**: 적절한 크로스 오리진 설정
- **입력 검증**: 사용자 입력 데이터 검증
- **에러 처리**: 민감 정보 노출 방지

## 📝 Scripts Reference

```bash
npm run dev          # 개발 서버 시작 (포트 8080)
npm run build        # 프로덕션 빌드
npm run build:dev    # 개발 모드 빌드
npm run preview      # 빌드 결과 미리보기
npm run lint         # ESLint 실행 (TypeScript 규칙 포함)
```

## 🔧 Development Status

### 현재 구현 상태 (2025-07-30 기준)
- ✅ **프로젝트 설정**: Vite + React + TypeScript 완료
- ✅ **UI 컴포넌트**: shadcn/ui 40+ 컴포넌트 설치
- ✅ **상태 관리**: Zustand 4개 스토어 구현
- ✅ **데이터 서비스**: 533줄 API 클라이언트 완료
- ✅ **타입 정의**: 44개 인터페이스 정의
- ✅ **메인 페이지**: 500줄 Index 컴포넌트 완료
- ✅ **에러 처리**: ErrorBoundary 및 네트워크 상태 모니터링
- ✅ **반응형 디자인**: 모바일/태블릿/데스크톱 지원
- 🔄 **정책 시뮬레이터**: 기본 구조 완료, 고도화 진행중
- 🔄 **지도 시스템**: 카카오맵 연동 진행중

## 🤝 Contributing

1. 이슈 확인 또는 새로운 기능 제안
2. Feature branch 생성
3. 코드 작성 및 테스트
4. Pull Request 생성
5. 코드 리뷰 및 머지

## 📞 Support

문제가 발생하거나 기능 요청이 있으시면:
- GitHub Issues: 버그 리포트 및 기능 요청
- 이메일: dev@saemangeum.go.kr

---

**마지막 업데이트**: 2025-07-30  
**버전**: 1.1.0  
**라이선스**: MIT  
**개발 환경**: Node.js 18+, TypeScript 5.5+, Vite 5.4+
