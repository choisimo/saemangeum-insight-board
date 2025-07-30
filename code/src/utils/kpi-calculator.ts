/**
 * KPI 계산 유틸리티 함수들
 */

import type { InvestmentData, RenewableEnergyData } from '@/services/data-service';
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
 * 투자액에서 숫자 추출
 */
export const extractInvestmentAmount = (investment: string, index: number): number => {
  if (!investment) return (index + 1) * 2.5; // 인덱스 기반 일관된 값
  
  const match = investment.match(/(\d+(?:\.\d+)?)/);
  if (match) {
    return parseFloat(match[1]);
  }
  
  return (index + 1) * 2.5; // 폴백값
};

/**
 * 고용 창출 계산
 */
export const calculateEmployment = (investmentAmount: number): number => {
  return Math.floor(
    (investmentAmount / KPI_CONSTANTS.INVESTMENT_UNIT) * 
    KPI_CONSTANTS.EMPLOYMENT_PER_INVESTMENT + 
    KPI_CONSTANTS.EMPLOYMENT_BASE
  );
};

/**
 * 진행률 계산 (인덱스 기반)
 */
export const calculateProgress = (index: number): number => {
  return Math.min(
    KPI_CONSTANTS.PROGRESS_MAX,
    index * KPI_CONSTANTS.PROGRESS_INCREMENT + KPI_CONSTANTS.PROGRESS_BASE
  );
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
 * 투자 데이터 집계
 */
export const aggregateInvestmentData = (investmentData: InvestmentData[]) => {
  let totalInvestment = 0;
  let totalEmployment = 0;
  let actualInvestment = 0;
  
  investmentData.forEach((item, index) => {
    const investmentStr = typeof item.investment === 'string' ? item.investment : String(item.investment || '');
    const amount = extractInvestmentAmount(investmentStr, index);
    const progress = calculateProgress(index);
    const employment = calculateEmployment(amount);
    
    totalInvestment += amount;
    totalEmployment += employment;
    actualInvestment += amount * progress;
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
