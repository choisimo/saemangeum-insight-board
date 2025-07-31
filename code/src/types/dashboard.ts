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

// real-api-service와 일치하는 타입 정의
export interface InvestmentData {
  id: string;
  company: string;
  sector: string;
  region: string;
  supportContent: string;
  investment: number; // 억원
  expectedJobs: number;
  progress: number; // 0-1
  status: string;
}

export interface RenewableData {
  id: string;
  region: string;
  generationType: string;
  capacity: number; // MW
  area: number; // 제곱미터
  status: string;
  progress?: number; // 진행률
  coordinates?: { lat: number; lng: number };
}

export interface WeatherData {
  baseDate: string;
  baseTime: string;
  observations: Array<{
    category: string;
    obsrValue: string;
    nx: string;
    ny: string;
  }>;
}

export interface TrafficData {
  id: string;
  departure: string;
  destination: string;
  smallVehicles: number;
  largeVehicles: number;
  totalTraffic: number;
  surveyDate: string;
  timeSlot: string;
}

export interface EnvironmentData {
  id: string;
  location: string;
  airQualityIndex: number;
  pm25: number;
  pm10: number;
  ozone: number;
  carbonMonoxide: number;
  measurementTime: string;
  status: string; // 좋음, 보통, 나쁨, 매우나쁨
}

export interface EnergyData {
  id: string;
  facilityName: string;
  energyType: string; // 태양광, 풍력, 연료전지 등
  currentOutput: number; // MW
  maxCapacity: number; // MW
  efficiency: number; // %
  operationStatus: string;
  lastUpdated: string;
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

// 스토어 상태 인터페이스 업데이트 (새로운 데이터 타입 사용)
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

export interface TrafficStore {
  data: TrafficData[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // 액션
  fetchData: () => Promise<void>;
  setData: (data: TrafficData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
}

export interface EnvironmentStore {
  data: EnvironmentData[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // 액션
  fetchData: () => Promise<void>;
  setData: (data: EnvironmentData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
}

export interface EnergyStore {
  data: EnergyData[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // 액션
  fetchData: () => Promise<void>;
  setData: (data: EnergyData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearData: () => void;
}

export interface WeatherStore {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // 액션
  fetchData: () => Promise<void>;
  setData: (data: WeatherData | null) => void;
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
