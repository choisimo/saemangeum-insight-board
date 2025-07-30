/**
 * KPI 데이터 관리 Custom Hook
 * Zustand 스토어를 사용하여 전역 상태에서 데이터를 가져옵니다.
 */

import { useMemo } from 'react';
import type { KPIData } from '@/types/dashboard';
import { 
  aggregateInvestmentData,
  calculateTotalRenewableCapacity,
  calculateChangeRate,
  calculateTarget,
  calculateProgressPercentage,
  getChangeType
} from '@/utils/kpi-calculator';
import { KPI_CONSTANTS } from '@/constants/dashboard';
import { 
  useInvestmentData, 
  useInvestmentLoading,
  useRenewableData,
  useRenewableLoading
} from '@/stores';

/**
 * Zustand 스토어에서 KPI 데이터를 계산하여 반환하는 훅
 */
export const useKPIData = (): KPIData => {
  // 스토어에서 데이터 가져오기
  const investmentData = useInvestmentData();
  const investmentLoading = useInvestmentLoading();
  const renewableData = useRenewableData();
  const renewableLoading = useRenewableLoading();
  
  const loading = investmentLoading || renewableLoading;
  
  return useMemo(() => {
    // 로딩 중이거나 데이터가 없을 때 기본값 반환
    if (loading || (!investmentData.length && !renewableData.length)) {
      return {
        totalInvestment: { 
          value: 0, 
          unit: "억원", 
          change: 0, 
          changeType: "neutral",
          actualValue: 0,
          remainingValue: 0
        },
        newCompanies: { 
          value: 0, 
          unit: "개", 
          change: 0, 
          changeType: "neutral" 
        },
        employment: { 
          value: 0, 
          unit: "명", 
          change: 0, 
          changeType: "neutral", 
          target: 2000, 
          progress: 0 
        },
        salesRate: { 
          value: 0, 
          unit: "%", 
          change: 0, 
          changeType: "neutral" 
        },
        renewableEnergy: { 
          value: 0, 
          unit: "MW", 
          change: 0, 
          changeType: "neutral" 
        },
        complaints: { 
          value: 0, 
          unit: "건", 
          change: 0, 
          changeType: "neutral" 
        }
      };
    }

    // 투자 데이터 집계
    const investmentAgg = aggregateInvestmentData(investmentData);
    
    // 재생에너지 총 용량
    const totalRenewableCapacity = calculateTotalRenewableCapacity(renewableData);
    
    // 목표값 계산
    const employmentTarget = calculateTarget(
      investmentAgg.totalEmployment, 
      KPI_CONSTANTS.TARGET_MULTIPLIER.EMPLOYMENT
    );
    
    // 진행률 계산
    const employmentProgress = calculateProgressPercentage(
      investmentAgg.totalEmployment, 
      employmentTarget
    );
    
    // 변화율 계산 (실제 데이터 진행률 기반)
    const avgProgress = investmentData.length > 0 
      ? investmentAgg.actualInvestment / investmentAgg.totalInvestment 
      : 0;
    
    const employmentChange = avgProgress * 15; // 진행률 기반 변화율
    const salesChange = avgProgress * 8;
    const renewableChange = totalRenewableCapacity > 0 ? 12 : 0;
    const complaintsChange = -avgProgress * 5; // 진행률이 높을수록 민원 감소
    
    return {
      totalInvestment: {
        value: Math.round(investmentAgg.totalInvestment * 10) / 10,
        unit: "억원",
        change: Math.round(avgProgress * 20 * 10) / 10,
        changeType: getChangeType(avgProgress * 20),
        actualValue: Math.round(investmentAgg.actualInvestment * 10) / 10,
        remainingValue: Math.round(investmentAgg.remainingInvestment * 10) / 10,
        target: calculateTarget(investmentAgg.totalInvestment, KPI_CONSTANTS.TARGET_MULTIPLIER.INVESTMENT),
        progress: calculateProgressPercentage(
          investmentAgg.actualInvestment, 
          calculateTarget(investmentAgg.totalInvestment, KPI_CONSTANTS.TARGET_MULTIPLIER.INVESTMENT)
        )
      },
      
      newCompanies: {
        value: investmentAgg.companyCount,
        unit: "개",
        change: Math.round(avgProgress * 25),
        changeType: getChangeType(avgProgress * 25),
        target: calculateTarget(investmentAgg.companyCount, KPI_CONSTANTS.TARGET_MULTIPLIER.COMPANIES),
        progress: calculateProgressPercentage(
          investmentAgg.companyCount,
          calculateTarget(investmentAgg.companyCount, KPI_CONSTANTS.TARGET_MULTIPLIER.COMPANIES)
        )
      },
      
      employment: {
        value: investmentAgg.totalEmployment,
        unit: "명",
        change: Math.round(employmentChange * 10) / 10,
        changeType: getChangeType(employmentChange),
        target: employmentTarget,
        progress: Math.round(employmentProgress * 10) / 10
      },
      
      salesRate: {
        value: Math.round(salesChange * 10) / 10,
        unit: "%",
        change: Math.round(salesChange * 0.3 * 10) / 10,
        changeType: getChangeType(salesChange * 0.3)
      },
      
      renewableEnergy: {
        value: Math.round(totalRenewableCapacity),
        unit: "MW",
        change: Math.round(renewableChange * 10) / 10,
        changeType: getChangeType(renewableChange)
      },
      
      complaints: {
        value: Math.max(0, Math.round(50 + complaintsChange)),
        unit: "건",
        change: Math.round(complaintsChange * 10) / 10,
        changeType: getChangeType(complaintsChange)
      }
    };
  }, [investmentData, renewableData, investmentLoading, renewableLoading]);
};
