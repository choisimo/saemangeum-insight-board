/**
 * KPI 계산 유틸리티 함수들
 */

import type { InvestmentData, RenewableEnergyData } from '@/lib/data-service';
import type { KPIData, ChangeType } from '@/types/dashboard';
import { KPI_CONSTANTS, BUSINESS_SECTORS } from '@/constants/dashboard';

/**
 * 변화 타입 결정
 */
export const getChangeType = (change: number): ChangeType => {
  if (change > KPI_CONSTANTS.CHANGE_THRESHOLD.POSITIVE) return 'increase';
  if (change < KPI_CONSTANTS.CHANGE_THRESHOLD.NEGATIVE) return 'decrease';
  return 'neutral';
};

/**
 * 투자액에서 숫자 추출 (실제 데이터만 사용, 생성하지 않음)
 */
export const extractInvestmentAmount = (investment: string, index: number): number => {
  if (!investment) return 0; // 데이터가 없으면 0 반환
  
  const match = investment.match(/(\d+(?:\.\d+)?)/);
  if (match) {
    return parseFloat(match[1]);
  }
  
  return 0; // 추출할 수 없으면 0 반환
};

/**
 * 고용 창출 계산 (실제 데이터가 있는 경우만 계산)
 */
export const calculateEmployment = (investmentAmount: number): number => {
  if (investmentAmount === 0) return 0; // 투자액이 0이면 고용도 0
  
  return Math.floor(
    (investmentAmount / KPI_CONSTANTS.INVESTMENT_UNIT) * 
    KPI_CONSTANTS.EMPLOYMENT_PER_INVESTMENT + 
    KPI_CONSTANTS.EMPLOYMENT_BASE
  );
};

/**
 * 진행률 계산 (실제 데이터만 사용)
 */
export const calculateProgress = (index: number): number => {
  return 0; // 실제 API에는 진행률 정보가 없으므로 0 반환
};

/**
 * 업종 할당 (순환 방식)
 */
export const getSectorByIndex = (index: number): string => {
  return BUSINESS_SECTORS[index % BUSINESS_SECTORS.length];
};

/**
 * 재생에너지 총 용량 계산
 */
export const calculateTotalRenewableCapacity = (renewableData: RenewableEnergyData[]): number => {
  return renewableData.reduce((total, item) => {
    const capacity = typeof item.capacity === 'string' 
      ? parseFloat(item.capacity.replace(/[^\d.]/g, '')) || 0
      : (typeof item.capacity === 'number' ? item.capacity : 0);
    return total + capacity;
  }, 0);
};

/**
 * 투자 데이터 집계 (실제 데이터만 사용)
 */
export const aggregateInvestmentData = (investmentData: InvestmentData[]) => {
  let totalInvestment = 0;
  let totalEmployment = 0;
  let actualInvestment = 0;
  
  investmentData.forEach((item, index) => {
    // investment 필드가 실제로는 0이므로 실제 집계는 0
    const amount = typeof item.investment === 'number' ? item.investment : 0;
    const employment = typeof item.expectedJobs === 'number' ? item.expectedJobs : 0;
    
    totalInvestment += amount;
    totalEmployment += employment;
    actualInvestment += amount * (item.progress || 0);
  });
  
  return {
    totalInvestment,
    totalEmployment,
    actualInvestment,
    remainingInvestment: totalInvestment - actualInvestment,
    companyCount: investmentData.length
  };
};

/**
 * 변화율 계산 (실제 데이터 기반)
 */
export const calculateChangeRate = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

/**
 * 목표값 계산
 */
export const calculateTarget = (current: number, multiplier: number): number => {
  return Math.ceil(current * multiplier);
};

/**
 * 진행률 백분율 계산
 */
export const calculateProgressPercentage = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.min(100, (current / target) * 100);
};
