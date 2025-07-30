import type { InvestmentData, RenewableEnergyData, WeatherData } from './data-service';
import { dataService } from './data-service';

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
}

export interface AlertThresholds {
  investmentDelayDays: number;
  weatherWarningLevel: number;
  complaintIncreasePercent: number;
  renewableTargetPercent: number;
  progressDelayPercent: number;
}

export class AlertService {
  private static instance: AlertService;
  private alerts: AlertData[] = [];
  private thresholds: AlertThresholds = {
    investmentDelayDays: 30,
    weatherWarningLevel: 3,
    complaintIncreasePercent: 20,
    renewableTargetPercent: 90,
    progressDelayPercent: 15
  };

  static getInstance(): AlertService {
    if (!AlertService.instance) {
      AlertService.instance = new AlertService();
    }
    return AlertService.instance;
  }

  private constructor() {
    // 싱글톤 패턴으로 인스턴스 생성 제한
    // 기존 알림 로드 (localStorage에서)
    this.loadAlertsFromStorage();
  }

  private loadAlertsFromStorage() {
    try {
      const stored = localStorage.getItem('saemangeum_alerts');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.alerts = parsed.map((alert: any) => ({
          ...alert,
          timestamp: new Date(alert.timestamp)
        }));
      }
    } catch (error) {
      console.warn('알림 데이터 로드 실패:', error);
    }
  }

  private saveAlertsToStorage() {
    try {
      localStorage.setItem('saemangeum_alerts', JSON.stringify(this.alerts));
    } catch (error) {
      console.warn('알림 데이터 저장 실패:', error);
    }
  }

  private addAlert(alert: Omit<AlertData, 'id' | 'timestamp'>) {
    const newAlert: AlertData = {
      ...alert,
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    // 중복 알림 방지 (같은 카테고리, 같은 메시지는 1시간 내 중복 생성 안함)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const isDuplicate = this.alerts.some(existing => 
      existing.category === newAlert.category &&
      existing.message === newAlert.message &&
      existing.timestamp > oneHourAgo
    );

    if (!isDuplicate) {
      this.alerts.unshift(newAlert);
      
      // 최대 100개 알림만 유지
      if (this.alerts.length > 100) {
        this.alerts = this.alerts.slice(0, 100);
      }
      
      this.saveAlertsToStorage();
    }
  }

  // 투자 데이터 기반 알림 생성
  analyzeInvestmentData(data: InvestmentData[]): void {
    const now = new Date();
    
    // 진행 지연 프로젝트 감지
    data.forEach(investment => {
      const startDate = new Date(investment.startDate);
      const daysSinceStart = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // 예상보다 진행률이 낮은 경우
      const expectedProgress = Math.min(daysSinceStart / 365, 1); // 1년 기준
      const actualProgress = investment.progress;
      
      if (daysSinceStart > this.thresholds.investmentDelayDays && actualProgress < expectedProgress - 0.1) {
        this.addAlert({
          type: 'warning',
          title: '투자 프로젝트 진행 지연',
          message: `${investment.company} (${investment.sector}) - 예상 진행률 대비 ${((expectedProgress - actualProgress) * 100).toFixed(2)}% 지연`,
          source: 'investment_analysis',
          severity: actualProgress < expectedProgress - 0.3 ? 'high' : 'medium',
          category: 'investment',
          data: investment
        });
      }

      // 대규모 투자 완료
      if (investment.status === 'completed' && investment.investment > 500) {
        this.addAlert({
          type: 'success',
          title: '대규모 투자 프로젝트 완료',
          message: `${investment.company} - ${investment.investment}억원 투자 프로젝트 완료`,
          source: 'investment_completion',
          severity: 'medium',
          category: 'investment',
          data: investment
        });
      }
    });

    // 업종별 투자 집중도 분석
    const sectorInvestments = data.reduce((acc, inv) => {
      acc[inv.sector] = (acc[inv.sector] || 0) + inv.investment;
      return acc;
    }, {} as Record<string, number>);

    const totalInvestment = Object.values(sectorInvestments).reduce((sum, val) => sum + val, 0);
    Object.entries(sectorInvestments).forEach(([sector, amount]) => {
      const percentage = (amount / totalInvestment) * 100;
      if (percentage > 40) {
        this.addAlert({
          type: 'info',
          title: '업종 집중도 높음',
          message: `${sector} 업종이 전체 투자의 ${Math.round(percentage)}%를 차지`,
          source: 'sector_analysis',
          severity: 'low',
          category: 'investment'
        });
      }
    });
  }

  // 재생에너지 데이터 기반 알림 생성
  analyzeRenewableEnergyData(data: RenewableEnergyData[]): void {
    const totalCapacity = data.reduce((sum, item) => sum + item.capacity, 0);
    
    // RE100 목표 달성률 계산 (가정: 목표 1000MW)
    const targetCapacity = 1000;
    const achievementRate = (totalCapacity / targetCapacity) * 100;
    
    if (achievementRate >= this.thresholds.renewableTargetPercent) {
      this.addAlert({
        type: 'success',
        title: 'RE100 목표 달성률 높음',
        message: `재생에너지 목표 달성률 ${Math.round(achievementRate)}% 돌파`,
        source: 'renewable_analysis',
        severity: 'medium',
        category: 'environment'
      });
    }

    // 신규 재생에너지 시설 감지
    const recentProjects = data.filter(item => {
      const installDate = new Date(item.installDate);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return installDate > thirtyDaysAgo;
    });

    if (recentProjects.length > 0) {
      const totalNewCapacity = recentProjects.reduce((sum, item) => sum + item.capacity, 0);
      this.addAlert({
        type: 'success',
        title: '신규 재생에너지 시설 설치',
        message: `최근 30일간 ${recentProjects.length}개 시설, 총 ${totalNewCapacity}MW 용량 추가`,
        source: 'renewable_new_installations',
        severity: 'low',
        category: 'environment'
      });
    }
  }

  // 기상 데이터 기반 알림 생성
  analyzeWeatherData(data: WeatherData | null): void {
    if (!data) return;

    // 강풍 경보
    if (data.windSpeed > 15) {
      this.addAlert({
        type: 'warning',
        title: '강풍 주의보',
        message: `현재 풍속 ${data.windSpeed}m/s - 건설 작업 주의 필요`,
        source: 'weather_monitoring',
        severity: data.windSpeed > 20 ? 'high' : 'medium',
        category: 'weather',
        data: data
      });
    }

    // 극한 기온
    if (data.temperature > 35 || data.temperature < -10) {
      this.addAlert({
        type: 'warning',
        title: '극한 기온 경보',
        message: `현재 기온 ${data.temperature}°C - 야외 작업 주의`,
        source: 'weather_monitoring',
        severity: 'medium',
        category: 'weather',
        data: data
      });
    }

    // 강수량 경보
    if (data.precipitation > 50) {
      this.addAlert({
        type: 'error',
        title: '집중호우 경보',
        message: `시간당 강수량 ${data.precipitation}mm - 공사 중단 검토 필요`,
        source: 'weather_monitoring',
        severity: 'high',
        category: 'weather',
        data: data
      });
    }
  }

  // 시스템 상태 기반 알림 생성
  async analyzeSystemStatus(): Promise<void> {
    try {
      // 실제 데이터 품질 계산
      const [investmentData, renewableData] = await Promise.all([
        dataService.getInvestmentData(),
        dataService.getRenewableEnergyData()
      ]);
      
      const validInvestmentRecords = investmentData.filter(item => item.company && item.investment > 0).length;
      const validRenewableRecords = renewableData.filter(item => item.capacity > 0).length;
      const totalRecords = investmentData.length + renewableData.length;
      const validRecords = validInvestmentRecords + validRenewableRecords;
      
      const dataQualityScore = totalRecords > 0 ? Math.round((validRecords / totalRecords) * 100) : 100;
      
      // 데이터 품질이 80% 미만일 때만 알림 생성
      if (dataQualityScore < 80) {
        this.addAlert({
          type: 'warning',
          title: '데이터 품질 저하',
          message: `데이터 품질 점수: ${dataQualityScore}% - 일부 데이터가 누락되었을 수 있습니다 (유효 레코드: ${validRecords}/${totalRecords})`,
          source: 'data_quality_check',
          severity: dataQualityScore < 60 ? 'high' : 'medium',
          category: 'system'
        });
      }
      
      // API 응답 시간 체크 (실제 사용 시에만 활성화)
      // const apiResponseTime = performance.now();
      // if (apiResponseTime > 5000) {
      //   this.addAlert({
      //     type: 'warning',
      //     title: 'API 응답 지연',
      //     message: `데이터 로딩 시간이 ${Math.round(apiResponseTime)}ms로 지연되고 있습니다`,
      //     source: 'system_monitoring',
      //     severity: 'low',
      //     category: 'system'
      //   });
      // }
    } catch (error) {
      console.error('시스템 상태 분석 실패:', error);
    }
  }

  // 실제 민원 데이터 기반 알림 생성 (민원 API 연동 필요)
  async generateComplaintAlert(): Promise<void> {
    try {
      // 실제 민원 데이터를 가져와서 증가율 계산
      // 현재는 민원 API가 없으므로 기본 알림만 생성
      const currentComplaints = 20; // 기본값
      const previousComplaints = 18; // 이전 달 기본값
      const increaseRate = ((currentComplaints - previousComplaints) / previousComplaints) * 100;
      
      if (increaseRate > this.thresholds.complaintIncreasePercent) {
        this.addAlert({
          type: 'warning',
          title: '민원 증가 추세 감지',
          message: `전월 대비 민원 ${Math.round(increaseRate)}% 증가 - 대응 방안 검토 권장`,
          source: 'complaint_analysis',
          severity: increaseRate > 30 ? 'high' : 'medium',
          category: 'complaint'
        });
      }
    } catch (error) {
      console.error('민원 알림 생성 실패:', error);
    }
  }

  // 알림 목록 조회
  getAlerts(limit?: number): AlertData[] {
    const sorted = [...this.alerts].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return limit ? sorted.slice(0, limit) : sorted;
  }

  // 알림 삭제
  removeAlert(id: string): void {
    this.alerts = this.alerts.filter(alert => alert.id !== id);
    this.saveAlertsToStorage();
  }

  // 모든 알림 삭제
  clearAlerts(): void {
    this.alerts = [];
    this.saveAlertsToStorage();
  }

  // 알림 읽음 처리 (확장 가능)
  markAsRead(id: string): void {
    // 향후 읽음/안읽음 상태 관리 시 구현
  }

  // 임계값 설정 업데이트
  updateThresholds(newThresholds: Partial<AlertThresholds>): void {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  // 전체 데이터 분석 실행
  async runAnalysis(): Promise<void> {
    try {
      const [investmentData, renewableData, weatherData] = await Promise.all([
        dataService.getInvestmentData(),
        dataService.getRenewableEnergyData(),
        dataService.getWeatherData()
      ]);

      this.analyzeInvestmentData(investmentData);
      this.analyzeRenewableEnergyData(renewableData);
      this.analyzeWeatherData(weatherData);
      await this.analyzeSystemStatus(); // async로 변경

      console.log('알림 분석 완료:', this.alerts.length, '개 알림 생성');
    } catch (error) {
      console.error('알림 분석 실패:', error);
    }
  }
}

export default AlertService;
