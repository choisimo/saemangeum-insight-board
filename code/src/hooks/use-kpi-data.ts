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

    // 실제 데이터 기반 KPI 계산 (간단하게)
    const investmentAgg = aggregateInvestmentData(investmentData);
    const totalRenewableCapacity = calculateTotalRenewableCapacity(renewableData);
    
    return {
      totalInvestment: {
        value: 0, // 실제 API에는 투자액 정보가 없음
        unit: "억원",
        change: 0,
        changeType: "neutral",
        actualValue: 0,
        remainingValue: 0
      },
      newCompanies: {
        value: investmentAgg.companyCount, // 실제 지원 제도 수
        unit: "개",
        change: 0,
        changeType: "neutral"
      },
      employment: {
        value: 0, // 실제 API에는 고용 정보가 없음
        unit: "명",
        change: 0,
        changeType: "neutral",
        target: 2000,
        progress: 0
      },
      salesRate: {
        value: 0, // 실제 API에는 분양률 정보가 없음
        unit: "%",
        change: 0,
        changeType: "neutral"
      },
      renewableEnergy: {
        value: Math.round(totalRenewableCapacity), // 실제 재생에너지 용량
        unit: "MW",
        change: 0,
        changeType: "neutral"
      },
      complaints: {
        value: 0, // 실제 API에는 민원 정보가 없음
        unit: "건",
        change: 0,
        changeType: "neutral"
      }
    };
  }, [investmentData, renewableData, investmentLoading, renewableLoading]);
};
