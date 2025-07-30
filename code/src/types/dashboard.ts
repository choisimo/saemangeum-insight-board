/**
 * 대시보드 관련 타입 정의
 */

export type ChangeType = 'increase' | 'decrease' | 'neutral';

export interface KPIMetric {
  value: number;
  unit: string;
  change: number;
  changeType: ChangeType;
  target?: number;
  progress?: number;
}

export interface InvestmentMetric extends KPIMetric {
  actualValue?: number; // 실제 진행된 투자액
  remainingValue?: number; // 남은 투자액
}

export interface KPIData {
  totalInvestment: InvestmentMetric;
  newCompanies: KPIMetric;
  employment: KPIMetric & { target: number; progress: number };
  salesRate: KPIMetric;
  renewableEnergy: KPIMetric;
  complaints: KPIMetric;
}

export interface DashboardTab {
  id: string;
  label: string;
  icon?: React.ComponentType;
  description?: string; // 탭 설명 (선택적)
}

export interface DataLoadingState {
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface DashboardState {
  activeTab: string;
  kpiData: KPIData;
  loading: boolean;
  hasErrors: boolean;
}

// Zustand 스토어 타입 정의 (데이터 서비스 타입과 일치)
export interface InvestmentData {
  id: string;
  company: string;
  sector: string;
  investment: number; // 억원
  expectedJobs: number;
  progress: number; // 0-1
  location: string;
  startDate: string;
  status: 'planning' | 'in-progress' | 'completed' | 'delayed';
}

export interface RenewableData {
  id: string;
  region: string;
  type: 'solar' | 'wind' | 'hydro' | 'other';
  capacity: number; // MW
  status: 'operational' | 'under-construction' | 'planned';
  operator: string;
  installDate?: string;
}

export interface AlertData {
  id: string;
  type: 'error' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  source: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'investment' | 'environment' | 'infrastructure' | 'weather' | 'complaint' | 'system';
  data?: any;
  read?: boolean; // 읽음 상태 (선택적)
  // 호환성을 위해 priority를 severity의 별칭으로 사용
  priority?: 'low' | 'medium' | 'high';
}

// 스토어 상태 인터페이스
export interface InvestmentStore {
  data: InvestmentData[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // 액션
  fetchData: () => Promise<void>;
  setData: (data: InvestmentData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
}

export interface RenewableStore {
  data: RenewableData[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // 액션
  fetchData: () => Promise<void>;
  setData: (data: RenewableData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
}

export interface AlertStore {
  alerts: AlertData[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  
  // 액션
  fetchAlerts: () => Promise<void>;
  addAlert: (alert: Omit<AlertData, 'id' | 'timestamp'>) => void;
  markAsRead: (alertId: string) => void;
  markAllAsRead: () => void;
  removeAlert: (alertId: string) => void;
  clearAlerts: () => void;
}

export interface UIStore {
  activeTab: string;
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  refreshInterval: number;
  
  // 액션
  setActiveTab: (tab: string) => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setRefreshInterval: (interval: number) => void;
}
