import { useState, useEffect, useCallback } from 'react';
import AlertService, { type AlertData } from '@/services/alert-service';
import { useInvestmentData, useRenewableData } from '@/stores';
import { useRenewableEnergyData, useWeatherData } from './use-data';

export function useAlerts() {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const alertService = AlertService.getInstance();

  // 데이터 훅들
  const investmentData = useInvestmentData();
  const { data: renewableData } = useRenewableEnergyData();
  const { data: weatherData } = useWeatherData();

  // 알림 목록 새로고침
  const refreshAlerts = useCallback(() => {
    const currentAlerts = alertService.getAlerts(50); // 최근 50개만
    setAlerts(currentAlerts);
    setLoading(false);
  }, [alertService]);

  // 실시간 분석 실행
  const runAnalysis = useCallback(async () => {
    try {
      await alertService.runAnalysis();
      refreshAlerts();
    } catch (error) {
      console.error('알림 분석 실패:', error);
    }
  }, [alertService, refreshAlerts]);

  // 알림 삭제
  const removeAlert = useCallback((id: string) => {
    alertService.removeAlert(id);
    refreshAlerts();
  }, [alertService, refreshAlerts]);

  // 모든 알림 삭제
  const clearAllAlerts = useCallback(() => {
    alertService.clearAlerts();
    refreshAlerts();
  }, [alertService, refreshAlerts]);

  // 심각도별 알림 개수
  const getAlertCounts = useCallback(() => {
    return {
      critical: alerts.filter(a => a.severity === 'critical').length,
      high: alerts.filter(a => a.severity === 'high').length,
      medium: alerts.filter(a => a.severity === 'medium').length,
      low: alerts.filter(a => a.severity === 'low').length,
      total: alerts.length
    };
  }, [alerts]);

  // 카테고리별 알림 필터링
  const getAlertsByCategory = useCallback((category: string) => {
    return alerts.filter(alert => alert.category === category);
  }, [alerts]);

  // 최근 알림 (24시간 이내)
  const getRecentAlerts = useCallback(() => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return alerts.filter(alert => alert.timestamp > twentyFourHoursAgo);
  }, [alerts]);

  // 초기 로드 및 주기적 분석
  useEffect(() => {
    refreshAlerts();
    
    // 초기 분석 실행
    const initialAnalysisTimer = setTimeout(() => {
      runAnalysis();
    }, 2000);

    // 5분마다 실시간 분석 실행
    const analysisInterval = setInterval(() => {
      runAnalysis();
    }, 5 * 60 * 1000);

    // 30초마다 알림 목록 새로고침 (새로운 알림 확인)
    const refreshInterval = setInterval(() => {
      refreshAlerts();
    }, 30 * 1000);

    return () => {
      clearTimeout(initialAnalysisTimer);
      clearInterval(analysisInterval);
      clearInterval(refreshInterval);
    };
  }, [runAnalysis, refreshAlerts]);

  return {
    alerts,
    loading,
    refreshAlerts,
    removeAlert,
    clearAllAlerts,
    getAlertCounts,
    getAlertsByCategory,
    getRecentAlerts,
    runAnalysis
  };
}

// 실시간 알림 상태 훅 (헤더 알림 배지용)
export function useAlertStatus() {
  const { alerts, getAlertCounts } = useAlerts();
  const counts = getAlertCounts();
  
  const hasUnreadAlerts = counts.total > 0;
  const hasCriticalAlerts = counts.critical > 0;
  const hasHighPriorityAlerts = counts.high > 0;
  
  return {
    hasUnreadAlerts,
    hasCriticalAlerts,
    hasHighPriorityAlerts,
    totalCount: counts.total,
    criticalCount: counts.critical,
    highCount: counts.high
  };
}
