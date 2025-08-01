# 새만금 인사이트 대시보드 - 기능 명세서

## 문서 정보
- **프로젝트명**: 새만금 인사이트 대시보드
- **문서 유형**: 기능 명세서 (Functional Specification)
- **버전**: 1.1 (업데이트됨)
- **작성일**: 2025년 7월 29일
- **작성자**: 새만금 인사이트 대시보드 개발팀

## 🚀 구현 현황 요약 (2025-07-29 기준)

### ✅ 완료된 기능 (95%)
- **API 통합**: 9개 새만금개발청 공공데이터 API 완전 연동
- **실시간 대시보드**: 6개 KPI 카드 및 실시간 알림 시스템
- **에러 처리**: 강력한 ErrorBoundary 및 재시도 메커니즘
- **데이터 서비스**: 캐싱, 변환, 품질 관리 시스템
- **타입 안전성**: 완전한 TypeScript 구현

### 🔄 진행 중 (5%)
- **정책 시뮬레이션**: 고도화 작업 중
- **지도 시각화**: 개선 작업 중

## 1. 시스템 기능 개요

### 1.1 시스템 구성도
```
┌─────────────────────────────────────────────────────────┐
│                    사용자 인터페이스 (UI)                  │
├─────────────────────────────────────────────────────────┤
│  대시보드  │  시뮬레이션  │  지도  │  보고서  │  관리자  │
├─────────────────────────────────────────────────────────┤
│                    비즈니스 로직 레이어                    │
├─────────────────────────────────────────────────────────┤
│  데이터 처리  │  분석 엔진  │  알림 시스템  │  사용자 관리  │
├─────────────────────────────────────────────────────────┤
│                    데이터 액세스 레이어                    │
├─────────────────────────────────────────────────────────┤
│     공공API     │    내부DB    │   캐시    │   로그    │
└─────────────────────────────────────────────────────────┘
```

### 1.2 주요 모듈
1. **대시보드 모듈**: 실시간 KPI 모니터링
2. **시뮬레이션 모듈**: 정책 효과 예측 분석
3. **지도 모듈**: 공간정보 시각화
4. **보고서 모듈**: 자동 보고서 생성
5. **관리 모듈**: 사용자 및 시스템 관리

## 2. 상세 기능 명세

### 2.1 실시간 현황 대시보드

#### 2.1.1 KPI 모니터링 카드
**기능 ID**: F-DASH-001  
**우선순위**: P0 (필수)

**기능 설명**:
새만금 개발사업의 6개 핵심 KPI를 실시간으로 모니터링하는 카드형 위젯

**세부 기능**:
1. **총 투자유치액 카드**
   - 현재 누적 투자유치액 표시 (단위: 억원)
   - 전월 대비 증감률 (%, 색상 코딩)
   - 연간 목표 대비 달성률 (진행률 바)
   - 최근 3개월 트렌드 미니 차트

2. **신규 입주기업 수 카드**
   - 현재 입주 기업 수 (단위: 개)
   - 전월 대비 증감 수 (절대값)
   - 업종별 분포 도넛 차트
   - 최근 신규 입주 기업 목록 (최대 3개)

3. **고용창출 인원 카드**
   - 현재 고용 인원 (단위: 명)
   - 목표 대비 달성률 (%)
   - 지역별 고용 분포 (간단한 막대 그래프)
   - 예상 신규 고용 인원 (다음 분기)

4. **분양률 카드**
   - 전체 분양률 (%)
   - 공구별 분양 현황 (미니 차트)
   - 분양 추이 (월별, 최근 6개월)
   - 미분양 면적 (㎡)

5. **재생에너지 발전량 카드**
   - 현재 발전 용량 (MW)
   - RE100 목표 대비 달성률 (%)
   - 에너지원별 분포 (태양광, 풍력 등)
   - 월간 발전량 추이

6. **민원/제보 건수 카드**
   - 현재 월 민원 건수 (건)
   - 전월 대비 증감률 (%)
   - 민원 유형별 분포 (파이 차트)
   - 평균 해결 소요 시간 (일)

**입력 데이터**:
- 새만금 투자 인센티브 보조금지원 현황 API
- 새만금산업단지 입주기업 계약 현황 API
- 새만금 재생에너지 사업 정보 API
- 내부 민원 관리 시스템 데이터

**출력 형태**:
- 반응형 카드 레이아웃 (3열 × 2행, 모바일 시 1열)
- 실시간 업데이트 (WebSocket 연결)
- 애니메이션 효과 (숫자 카운트업, 색상 변화)

**비즈니스 규칙**:
- 증감률 색상: 증가(녹색), 감소(빨간색), 변화없음(회색)
- 목표 달성률 색상: 80% 이상(녹색), 60-80%(주황), 60% 미만(빨간색)
- 데이터 업데이트 주기: 1분 간격
- 오류 시 마지막 정상 데이터 표시 + 경고 아이콘

#### 2.1.2 실시간 알림 시스템
**기능 ID**: F-DASH-002  
**우선순위**: P0 (필수)

**기능 설명**:
중요한 변화나 이벤트를 실시간으로 알려주는 알림 시스템

**세부 기능**:
1. **긴급 알림 (Critical)**
   - 투자 계약 취소 또는 지연
   - 시스템 오류 또는 데이터 동기화 실패
   - 보안 관련 이슈
   - 표시: 빨간색 배경, 경고 아이콘, 즉시 팝업

2. **중요 알림 (Warning)**
   - 목표 대비 진행률 저조 (80% 미만)
   - 민원 건수 급증 (전월 대비 50% 증가)
   - API 응답 지연 (5초 이상)
   - 표시: 주황색 배경, 주의 아이콘, 배너 형태

3. **정보 알림 (Info)**
   - 신규 투자 계약 체결
   - 목표 달성 (분양률, 고용 등)
   - 정기 보고서 생성 완료
   - 표시: 파란색 배경, 정보 아이콘, 토스트 메시지

**입력 조건**:
- KPI 데이터 변화량 모니터링
- 시스템 성능 지표 모니터링
- 사용자 정의 임계값 설정

**출력 형태**:
- 실시간 알림 센터 (우상단 벨 아이콘)
- 팝업 모달 (긴급 알림)
- 배너 알림 (중요 알림)
- 토스트 메시지 (정보 알림)

#### 2.1.3 빠른 인사이트 패널
**기능 ID**: F-DASH-003  
**우선순위**: P1 (중요)

**기능 설명**:
주요 성과와 트렌드를 한눈에 파악할 수 있는 요약 정보 패널

**세부 기능**:
1. **오늘의 주요 성과**
   - 신규 투자 계약 (금액, 기업명)
   - 고용 창출 (신규 채용 인원)
   - 재생에너지 발전 (일일 발전량)
   - 주요 마일스톤 달성 현황

2. **주간 트렌드**
   - 투자 유치 진행률 (목표 대비 %)
   - 분양 목표 달성률 (목표 대비 %)
   - 민원 해결률 (해결/전체 %)
   - 시스템 가용성 (%)

**출력 형태**:
- 2×2 그리드 레이아웃
- 진행률 바 및 백분율 표시
- 간단한 아이콘 및 숫자 강조

### 2.2 정책 시뮬레이션

#### 2.2.1 투자 인센티브 시뮬레이터
**기능 ID**: F-SIM-001  
**우선순위**: P0 (필수)

**기능 설명**:
투자 인센티브 정책 변경 시 예상되는 투자 유치 효과를 분석하는 도구

**세부 기능**:
1. **인센티브 조건 설정**
   - 투자 규모별 인센티브율 조정 (%)
   - 업종별 차등 인센티브 설정
   - 고용 인원 기준 추가 혜택
   - 지역별 특별 인센티브 설정

2. **예측 모델 계산**
   - 과거 데이터 기반 회귀 분석
   - 유사 정책 사례 비교 분석
   - 경제적 파급효과 계산
   - 리스크 시나리오 분석

3. **결과 시각화**
   - 투자 유치 예상 증가율 (%)
   - 기간별 투자 유치 예측 (월별, 연간)
   - 업종별 투자 분포 변화
   - ROI 분석 (정책 비용 대비 효과)

**입력 파라미터**:
- 기본 인센티브율 (현재: 10-30%)
- 투자 규모 구간 (예: 100억, 500억, 1000억 이상)
- 업종 카테고리 (제조업, 서비스업, IT 등)
- 시뮬레이션 기간 (6개월, 1년, 3년)

**출력 형태**:
- 인터랙티브 차트 (라인, 바, 파이 차트)
- 비교 테이블 (현재 vs 시뮬레이션)
- PDF 보고서 생성 기능
- 시나리오 저장 및 공유 기능

#### 2.2.2 개발 시나리오 분석
**기능 ID**: F-SIM-002  
**우선순위**: P1 (중요)

**기능 설명**:
개발 속도 및 용도 배분 변경 시 경제적 파급효과를 분석하는 도구

**세부 기능**:
1. **개발 속도 조정**
   - 매립 완료 일정 조정
   - 인프라 구축 우선순위 변경
   - 단계별 개발 계획 수정

2. **용도별 배분 최적화**
   - 산업용지 vs 상업용지 비율 조정
   - 주거용지 비율 변경
   - 공공시설 배치 최적화

3. **경제적 파급효과 계산**
   - 지역 GDP 기여도 변화
   - 고용 창출 효과 예측
   - 인구 유입 효과 분석
   - 세수 증가 효과 계산

#### 2.2.3 What-if 분석 도구
**기능 ID**: F-SIM-003  
**우선순위**: P1 (중요)

**기능 설명**:
다양한 변수 조정을 통한 시나리오 기반 분석 도구

**세부 기능**:
1. **변수 조정 인터페이스**
   - 슬라이더 기반 변수 조정
   - 드롭다운 선택 옵션
   - 직접 입력 필드
   - 프리셋 시나리오 선택

2. **실시간 결과 업데이트**
   - 변수 변경 시 즉시 결과 반영
   - 다중 시나리오 동시 비교
   - 민감도 분석 (변수별 영향도)

3. **시나리오 관리**
   - 시나리오 저장 및 명명
   - 시나리오 복사 및 수정
   - 시나리오 공유 기능
   - 히스토리 관리

### 2.3 새만금 공간정보 지도

#### 2.3.1 인터랙티브 지도 시각화
**기능 ID**: F-MAP-001  
**우선순위**: P1 (중요)

**기능 설명**:
새만금 지역의 공간 정보를 지도 위에 시각화하여 제공

**세부 기능**:
1. **기본 지도 기능**
   - 줌인/줌아웃 (마우스 휠, 버튼)
   - 패닝 (드래그)
   - 지도 타입 변경 (위성, 도로, 하이브리드)
   - 전체화면 모드

2. **공구별 현황 표시**
   - 공구별 경계선 표시
   - 개발 단계별 색상 코딩
   - 클릭 시 상세 정보 팝업
   - 매립률 진행 상태 표시

3. **상호작용 기능**
   - 지역 클릭 시 상세 정보 표시
   - 툴팁 표시 (마우스 오버)
   - 확대/축소 제어 버튼
   - 위치 검색 기능

**지도 데이터**:
- 새만금사업 매립 정보 API
- 새만금사업지역 지적공부 API
- 카카오맵 또는 네이버맵 API

#### 2.3.2 레이어 기반 정보 표시
**기능 ID**: F-MAP-002  
**우선순위**: P2 (선택)

**기능 설명**:
다양한 정보를 레이어로 구분하여 선택적으로 표시하는 기능

**세부 기능**:
1. **투자기업 레이어**
   - 기업 위치 마커 표시
   - 투자 규모별 마커 크기 차별화
   - 업종별 마커 색상 구분
   - 클릭 시 기업 상세 정보

2. **재생에너지 레이어**
   - 태양광, 풍력 발전소 위치
   - 발전 용량별 아이콘 크기
   - 운영 상태별 색상 구분
   - 발전량 실시간 정보

3. **교통 인프라 레이어**
   - 도로, 철도, 항만 시설
   - 교통량 히트맵 표시
   - 접근성 분석 결과
   - 대중교통 노선 정보

4. **환경 영향 레이어**
   - 환경보호구역 표시
   - 수질 모니터링 지점
   - 대기질 측정 데이터
   - 소음 영향 범위

#### 2.3.3 공간 분석 도구
**기능 ID**: F-MAP-003  
**우선순위**: P2 (선택)

**기능 설명**:
지도 상에서 직접 거리, 면적 등을 측정하고 분석하는 도구

**세부 기능**:
1. **측정 도구**
   - 거리 측정 (직선, 경로)
   - 면적 측정 (다각형)
   - 반경 그리기 (원형 영역)
   - 측정 결과 저장

2. **분석 도구**
   - 접근성 분석 (시간, 거리 기준)
   - 영향권 분석 (반경 내 시설)
   - 밀도 분석 (기업, 인구 등)
   - 최적 위치 추천

### 2.4 기업 투자 유치 보고서

#### 2.4.1 투자 현황 분석
**기능 ID**: F-RPT-001  
**우선순위**: P1 (중요)

**기능 설명**:
기업별 투자 진행 현황을 추적하고 분석하는 기능

**세부 기능**:
1. **기업별 투자 트래킹**
   - 투자 단계별 진행 현황 (계약, 착공, 완공)
   - 투자 일정 대비 진행률
   - 지연 위험 기업 식별
   - 투자 변경 이력 관리

2. **업종별 투자 분석**
   - 업종별 투자 분포 (금액, 기업 수)
   - 업종별 성장률 비교
   - 신산업 투자 동향
   - 업종 다양성 지수

3. **투자 성과 분석**
   - 투자 대비 고용 창출 효과
   - 투자 대비 생산성 지표
   - 지역 경제 파급효과
   - 투자 성공률 분석

**데이터 소스**:
- 새만금산업단지 입주기업 계약 현황 API
- 새만금 투자 인센티브 보조금지원 현황 API
- 내부 투자 관리 시스템

#### 2.4.2 자동 보고서 생성
**기능 ID**: F-RPT-002  
**우선순위**: P1 (중요)

**기능 설명**:
정기적으로 투자 유치 현황 보고서를 자동으로 생성하는 기능

**세부 기능**:
1. **보고서 템플릿**
   - 주간 투자 현황 보고서
   - 월간 투자 성과 보고서
   - 분기별 투자 분석 보고서
   - 연간 투자 종합 보고서

2. **자동 생성 기능**
   - 예약된 시간에 자동 생성
   - 데이터 업데이트 시 자동 반영
   - 이메일 자동 발송
   - 다양한 형식 지원 (PDF, Excel, PPT)

3. **보고서 커스터마이징**
   - 보고서 섹션 선택
   - 차트 타입 설정
   - 수신자 그룹 관리
   - 브랜딩 요소 적용

### 2.5 시스템 관리 기능

#### 2.5.1 사용자 관리 시스템
**기능 ID**: F-SYS-001  
**우선순위**: P0 (필수)

**기능 설명**:
시스템 사용자 계정 및 권한을 관리하는 기능

**세부 기능**:
1. **사용자 계정 관리**
   - 사용자 등록/수정/삭제
   - 비밀번호 정책 관리
   - 계정 잠금/해제
   - 사용자 프로필 관리

2. **역할 기반 접근 제어 (RBAC)**
   - 역할 정의 (관리자, 사용자, 게스트)
   - 권한 할당 (메뉴별, 기능별)
   - 데이터 접근 범위 제어
   - 임시 권한 부여

3. **인증 및 보안**
   - 싱글 사인온 (SSO) 연동
   - 다중 인증 (MFA) 지원
   - 세션 관리
   - 로그인 이력 추적

#### 2.5.2 데이터 관리 시스템
**기능 ID**: F-SYS-002  
**우선순위**: P0 (필수)

**기능 설명**:
외부 API 연동 및 데이터 품질을 관리하는 기능

**세부 기능**:
1. **API 연동 관리**
   - API 엔드포인트 설정
   - 인증키 관리
   - 호출 빈도 제어
   - 연동 상태 모니터링

2. **데이터 품질 검증**
   - 데이터 유효성 검사
   - 중복 데이터 제거
   - 데이터 형식 표준화
   - 이상값 감지 및 처리

3. **데이터 동기화**
   - 실시간 데이터 수집
   - 배치 데이터 처리
   - 증분 업데이트
   - 오류 재시도 로직

#### 2.5.3 알림 및 커뮤니케이션
**기능 ID**: F-SYS-003  
**우선순위**: P2 (선택)

**기능 설명**:
시스템 알림 및 사용자 간 커뮤니케이션을 지원하는 기능

**세부 기능**:
1. **알림 설정**
   - 개인별 알림 선호도 설정
   - 알림 채널 선택 (이메일, SMS, 앱)
   - 알림 빈도 조절
   - 알림 차단 시간 설정

2. **외부 시스템 연동**
   - Slack 워크스페이스 연동
   - Microsoft Teams 연동
   - 이메일 서버 연동
   - SMS 발송 서비스 연동

## 3. 데이터 플로우

### 3.1 실시간 데이터 플로우
```
공공 API → API Gateway → 데이터 검증 → 캐시 저장 → WebSocket → UI 업데이트
```

### 3.2 배치 데이터 플로우
```
스케줄러 → 데이터 수집 → ETL 처리 → 데이터베이스 저장 → 보고서 생성
```

### 3.3 사용자 인터랙션 플로우
```
사용자 입력 → 인증/인가 → 비즈니스 로직 → 데이터 조회/수정 → 응답 반환
```

## 4. 인터페이스 명세

### 4.1 외부 API 연동
- **새만금개발청 공공데이터 API**: REST API, JSON 형식
- **지도 서비스 API**: 카카오맵/네이버맵 JavaScript API
- **날씨 API**: 기상청 동네예보 API
- **알림 서비스 API**: 이메일/SMS 발송 API

### 4.2 내부 API 설계
- **REST API**: 표준 HTTP 메서드 사용
- **GraphQL**: 복잡한 데이터 조회용
- **WebSocket**: 실시간 데이터 전송용
- **인증**: JWT 토큰 기반

### 4.3 데이터베이스 스키마
- **사용자 테이블**: users, roles, permissions
- **투자 데이터**: investments, companies, sectors
- **KPI 데이터**: kpi_values, kpi_history
- **알림 데이터**: notifications, notification_settings

## 5. 성능 및 제약사항

### 5.1 성능 요구사항
- **응답 시간**: API 호출 평균 500ms 이내
- **동시 사용자**: 최대 500명 지원
- **데이터 처리**: 실시간 업데이트 1분 이내
- **파일 크기**: 보고서 파일 최대 50MB

### 5.2 기술적 제약사항
- **브라우저 지원**: Chrome, Firefox, Safari, Edge 최신 버전
- **모바일 지원**: 반응형 웹 디자인
- **네트워크**: 최소 1Mbps 인터넷 연결
- **데이터베이스**: PostgreSQL 12+ 또는 MySQL 8+

### 5.3 보안 제약사항
- **데이터 암호화**: TLS 1.3 전송 암호화, AES-256 저장 암호화
- **접근 제어**: 역할 기반 접근 제어 (RBAC)
- **감사 로그**: 모든 사용자 활동 로그 기록
- **데이터 보호**: 개인정보보호법 준수

---

**작성일**: 2025년 1월 28일  
**작성자**: 새만금 인사이트 대시보드 개발팀  
**검토자**: [TBD]  
**승인자**: [TBD]