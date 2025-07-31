import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { InvestmentStore, InvestmentData } from '../types/dashboard';
import { realApiService } from '../services/real-api-service';

/**
 * 투자 데이터 전역 상태 관리 스토어
 */
export const useInvestmentStore = create<InvestmentStore>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      data: [],
      loading: false,
      error: null,
      lastUpdated: null,

      // 데이터 페칭 액션 (realApiService 사용)
      fetchData: async () => {
        const { loading } = get();
        if (loading) return; // 중복 요청 방지

        set({ loading: true, error: null }, false, 'investment/fetchData/start');

        try {
          const data = await realApiService.getInvestmentData();
          
          if (data && data.length > 0) {
            set(
              {
                data,
                loading: false,
                lastUpdated: new Date(),
                error: null
              },
              false,
              'investment/fetchData/success'
            );
          } else {
            set(
              {
                data: [],
                loading: false,
                error: '투자 데이터를 가져올 수 없습니다'
              },
              false,
              'investment/fetchData/empty'
            );
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '투자 데이터 로딩 실패';
          set(
            {
              data: [],
              loading: false,
              error: errorMessage
            },
            false,
            'investment/fetchData/error'
          );
        }
      },

      // 데이터 직접 설정
      setData: (data: InvestmentData[]) => {
        set(
          {
            data,
            lastUpdated: new Date(),
            error: null
          },
          false,
          'investment/setData'
        );
      },

      // 로딩 상태 설정
      setLoading: (loading: boolean) => {
        set({ loading }, false, 'investment/setLoading');
      },

      // 에러 상태 설정
      setError: (error: string | null) => {
        set({ error }, false, 'investment/setError');
      },

      // 데이터 초기화
      clearData: () => {
        set(
          {
            data: [],
            loading: false,
            error: null,
            lastUpdated: null
          },
          false,
          'investment/clearData'
        );
      }
    }),
    {
      name: 'investment-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// 선택자 함수들 (성능 최적화)
export const useInvestmentData = () => useInvestmentStore((state) => state.data);
export const useInvestmentLoading = () => useInvestmentStore((state) => state.loading);
export const useInvestmentError = () => useInvestmentStore((state) => state.error);

// 액션 선택자 - 메모이제이션으로 안정적인 참조 보장
const actionsSelector = (state: InvestmentStore) => state;

export const useInvestmentActions = () => {
  const store = useInvestmentStore(actionsSelector);
  return {
    fetchData: store.fetchData,
    setData: store.setData,
    setLoading: store.setLoading,
    setError: store.setError,
    clearData: store.clearData
  };
};
