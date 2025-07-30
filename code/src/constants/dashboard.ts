/**
 * 대시보드 관련 상수 정의
 */

import { DashboardTab } from '@/types/dashboard';

// 대시보드 내부 세부 탭 구성 (상단 네비게이션과 분리)
export const DASHBOARD_TABS: DashboardTab[] = [
  { id: 'dashboard', label: '종합 현황', description: 'KPI 요약 및 주요 지표' },
  { id: 'investment', label: '투자유치 상세', description: '투자 현황 및 입주기업 정보' },
  { id: 'environment', label: '환경·에너지', description: '재생에너지 및 환경 모니터링' },
  { id: 'data', label: '데이터 및 방법론', description: '데이터 소스 및 계산 방법' }
];

// 보고서 섹션 탭 구성
export const REPORT_TABS: DashboardTab[] = [
  { id: 'investment', label: '투자유치 보고서', description: '상세 투자 분석 및 전망' },
  { id: 'environment', label: '환경영향 보고서', description: '환경 영향 평가 및 대응방안' },
  { id: 'policy', label: '정책효과 보고서', description: '정책 시행 효과 및 개선안' }
];

// 모니터링 섹션 탭 구성
export const MONITORING_TABS: DashboardTab[] = [
  { id: 'map', label: '공간정보 시스템', description: '지리정보 및 공간 데이터' },
  { id: 'simulator', label: '정책 시뮬레이터', description: '정책 시나리오 및 예측 모델' },
  { id: 'realtime', label: '실시간 모니터링', description: '실시간 데이터 및 알림' }
];

// KPI 계산 상수
export const KPI_CONSTANTS = {
  // 고용 창출 계산: 투자액 100억원당 8명
  EMPLOYMENT_PER_INVESTMENT: 8,
  EMPLOYMENT_BASE: 30,
  INVESTMENT_UNIT: 100, // 억원 단위
  
  // 목표값 계산 배수
  TARGET_MULTIPLIER: {
    EMPLOYMENT: 1.5,
    INVESTMENT: 2.0,
    COMPANIES: 1.8
  },
  
  // 진행률 계산
  PROGRESS_BASE: 0.3,
  PROGRESS_INCREMENT: 0.1,
  PROGRESS_MAX: 0.9,
  
  // 변화율 계산
  CHANGE_THRESHOLD: {
    POSITIVE: 0.05, // 5% 이상 증가
    NEGATIVE: -0.05 // 5% 이상 감소
  }
} as const;

// 업종 분류
export const BUSINESS_SECTORS = [
  '제조업',
  '물류업',
  '에너지',
  '관광업',
  '농업',
  'IT/소프트웨어',
  '바이오',
  '화학'
] as const;

// 데이터 새로고침 간격 (밀리초)
export const REFRESH_INTERVALS = {
  KPI_DATA: 60000, // 1분
  ALERTS: 30000,   // 30초
  WEATHER: 300000  // 5분
} as const;

// UI 관련 상수
export const UI_CONSTANTS = {
  LOADING_SKELETON_COUNT: 6,
  CHART_ANIMATION_DURATION: 1000,
  NOTIFICATION_DURATION: 5000
} as const;
