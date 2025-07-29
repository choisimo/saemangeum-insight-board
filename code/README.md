# Saemangeum Insight Dashboard

새만금개발청 공공데이터 기반 통합 대시보드 - 실시간 개발현황 모니터링 및 정책 시뮬레이션

## 🎯 Project Overview

새만금 지역의 투자유치, 기업 입주, 재생에너지, 교통량 등의 실시간 데이터를 통합하여 정책 결정을 지원하는 현대적인 웹 대시보드입니다.

### 주요 기능 (Key Features)
- ✅ **실시간 KPI 모니터링**: 6개 핵심 지표 대시보드
- ✅ **API 통합**: 9개 새만금개발청 공공데이터 API 연동
- ✅ **에러 처리**: 강력한 에러 복구 및 재시도 메커니즘
- ✅ **데이터 캐싱**: 효율적인 5분 캐시 시스템
- ✅ **카카오맵 통합**: 새만금 지역 공간 데이터 시각화
- ✅ **데이터 출처 정보**: 투명성 및 신뢰성 향상
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
- **Custom HTTP Client**: 재시도 로직 포함
- **Data Service Layer**: 데이터 변환 및 캐싱
- **Error Boundary**: 전역 에러 처리
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
│   ├── ui/                 # shadcn/ui 컴포넌트
│   ├── ErrorBoundary.tsx   # 에러 처리 컴포넌트
│   ├── KPICard.tsx        # KPI 카드 컴포넌트
│   ├── Navigation.tsx     # 네비게이션
│   ├── PolicySimulator.tsx
│   ├── SaemangumMap.tsx   # 공간정보 지도 컴포넌트
│   ├── KakaoMap.tsx       # 카카오맵 지도 컴포넌트
│   ├── DataSourceInfo.tsx # 데이터 출처 정보 컴포넌트
│   └── InvestmentReport.tsx
├── hooks/
│   └── use-data.ts        # 데이터 패칭 훅
├── lib/
│   ├── api-client.ts      # HTTP 클라이언트
│   ├── data-service.ts    # 데이터 서비스
│   └── utils.ts          # 유틸리티 함수
├── pages/
│   ├── Index.tsx         # 메인 페이지
│   └── NotFound.tsx      # 404 페이지
└── App.tsx               # 루트 컴포넌트
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
- ✅ 자동 재시도 메커니즘 (최대 3회)
- ✅ 요청 타임아웃 처리 (30초)
- ✅ 에러 분류 및 적절한 에러 메시지
- ✅ 데이터 변환 및 정제 로직

## 📊 Data Flow

```
Public API → HTTP Client → Data Service → React Query → UI Components
     ↓              ↓            ↓            ↓            ↓
  재시도 로직    에러 처리    데이터 변환    캐싱 관리    상태 표시
```

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

# 테스트 (추후 추가 예정)
npm run test
```

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
- **데이터 캐싱**: 5분 TTL로 API 호출 최소화
- **코드 분할**: 동적 임포트로 번들 크기 최적화
- **이미지 최적화**: WebP 포맷 사용
- **메모이제이션**: React.memo 및 useMemo 활용

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
npm run dev          # 개발 서버 시작
npm run build        # 프로덕션 빌드
npm run build:dev    # 개발 모드 빌드
npm run preview      # 빌드 결과 미리보기
npm run lint         # ESLint 실행
```

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

**마지막 업데이트**: 2025-07-29  
**버전**: 1.0.0  
**라이선스**: MIT
