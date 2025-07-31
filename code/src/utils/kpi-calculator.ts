/**
 * KPI 계산 유틸리티 함수들
 */

import type { ProcessedInvestmentData, ProcessedRenewableData } from '@/services/real-api-service';
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
export const extractInvestmentAmount = (supportContent: string): number => {
  if (!supportContent) return 0; // 데이터가 없으면 0 반환
  
  // 지원내용에서 백분율 추출 시도
  const percentMatch = supportContent.match(/(\d+)%/);
  if (percentMatch) {
    // 백분율만 있고 실제 투자액 정보가 없으므로 0 반환
    return 0;
  }
  
  // 금액 정보 추출 시도 (억원, 만원 등)
  const amountMatch = supportContent.match(/(\d+(?:\.\d+)?)\s*[억만]/);
  if (amountMatch) {
    const amount = parseFloat(amountMatch[1]);
    if (supportContent.includes('억')) {
      return amount;
    } else if (supportContent.includes('만')) {
      return amount / 10000; // 만원을 억원으로 변환
    }
  }
  
  return 0; // 추출할 수 없으면 0 반환
};

/**
 * 고용 창출 계산 (실제 데이터가 있는 경우만 계산)
 */
export const calculateEmployment = (investmentAmount: number): number => {
  // 실제 API에는 고용 정보가 없으므로 0 반환
  // 투자액 기반 추정도 하지 않음 (가짜 데이터 생성 방지)
  return 0;
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
 * 재생에너지 총 용량 계산 (실제 API 데이터만 사용)
 */
export const calculateTotalRenewableCapacity = (renewableData: ProcessedRenewableData[]): number => {
  return renewableData.reduce((total, item) => {
    // 실제 API에서 처리된 capacity 값만 사용 (MW 단위)
    const capacity = typeof item.capacity === 'number' ? item.capacity : 0;
    return total + capacity;
  }, 0);
};

/**
 * 투자 데이터 집계 (실제 API 데이터만 사용)
 */
export const aggregateInvestmentData = (investmentData: ProcessedInvestmentData[]) => {
  let totalInvestment = 0;
  let totalEmployment = 0;
  let actualInvestment = 0;
  
  investmentData.forEach((item) => {
    // 실제 API 데이터만 사용, 가짜 데이터 생성하지 않음
    const amount = typeof item.investment === 'number' ? item.investment : 0;
    const employment = typeof item.expectedJobs === 'number' ? item.expectedJobs : 0;
    const progress = typeof item.progress === 'number' ? Math.min(1, item.progress) : 0;
    
    totalInvestment += amount;
    totalEmployment += employment;
    actualInvestment += amount * progress;
  });
  
  console.log('실제 투자 데이터 집계 결과:', {
    totalInvestment,
    totalEmployment,
    actualInvestment,
    companyCount: investmentData.length,
    note: '모든 값은 실제 API 데이터 기반'
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
