import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { EnvironmentStore, EnvironmentData } from '../types/dashboard';
import { realApiService } from '../services/real-api-service';

/**
 * 환경 모니터링 데이터 전역 상태 관리 스토어
 */
export const useEnvironmentStore = create<EnvironmentStore>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      data: [],
      loading: false,
      error: null,
      lastUpdated: null,

      // 데이터 페칭 액션
      fetchData: async () => {
        const { loading } = get();
        if (loading) return; // 중복 요청 방지

        set({ loading: true, error: null }, false, 'environment/fetchData/start');

        try {
          const data = await realApiService.getEnvironmentData();
          
          if (data && data.length > 0) {
            set(
              {
                data,
                loading: false,
                lastUpdated: new Date(),
                error: null
              },
              false,
              'environment/fetchData/success'
            );
          } else {
            set(
              {
                data: [],
                loading: false,
                error: '환경 모니터링 데이터를 가져올 수 없습니다'
              },
              false,
              'environment/fetchData/empty'
            );
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '환경 데이터 로딩 실패';
          set(
            {
              data: [],
              loading: false,
              error: errorMessage
            },
            false,
            'environment/fetchData/error'
          );
        }
      },

      // 데이터 직접 설정
      setData: (data: EnvironmentData[]) => {
        set(
          {
            data,
            lastUpdated: new Date(),
            error: null
          },
          false,
          'environment/setData'
        );
      },

      // 로딩 상태 설정
      setLoading: (loading: boolean) => {
        set({ loading }, false, 'environment/setLoading');
      },

      // 에러 상태 설정
      setError: (error: string | null) => {
        set({ error }, false, 'environment/setError');
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
          'environment/clearData'
        );
      }
    }),
    {
      name: 'environment-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// 선택자 함수들 (성능 최적화)
export const useEnvironmentData = () => useEnvironmentStore((state) => state.data);
export const useEnvironmentLoading = () => useEnvironmentStore((state) => state.loading);
export const useEnvironmentError = () => useEnvironmentStore((state) => state.error);

// 액션 선택자
const actionsSelector = (state: EnvironmentStore) => state;

export const useEnvironmentActions = () => {
  const store = useEnvironmentStore(actionsSelector);
  return {
    fetchData: store.fetchData,
    setData: store.setData,
    setLoading: store.setLoading,
    setError: store.setError,
    clearData: store.clearData
  };
};