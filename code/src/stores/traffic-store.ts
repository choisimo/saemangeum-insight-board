import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { TrafficStore, TrafficData } from '../types/dashboard';
import { realApiService } from '../services/real-api-service';

/**
 * 교통량 데이터 전역 상태 관리 스토어
 */
export const useTrafficStore = create<TrafficStore>()(
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

        set({ loading: true, error: null }, false, 'traffic/fetchData/start');

        try {
          const data = await realApiService.getTrafficData();
          
          if (data && data.length > 0) {
            set(
              {
                data,
                loading: false,
                lastUpdated: new Date(),
                error: null
              },
              false,
              'traffic/fetchData/success'
            );
          } else {
            set(
              {
                data: [],
                loading: false,
                error: '교통량 데이터를 가져올 수 없습니다'
              },
              false,
              'traffic/fetchData/empty'
            );
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '교통량 데이터 로딩 실패';
          set(
            {
              data: [],
              loading: false,
              error: errorMessage
            },
            false,
            'traffic/fetchData/error'
          );
        }
      },

      // 데이터 직접 설정
      setData: (data: TrafficData[]) => {
        set(
          {
            data,
            lastUpdated: new Date(),
            error: null
          },
          false,
          'traffic/setData'
        );
      },

      // 로딩 상태 설정
      setLoading: (loading: boolean) => {
        set({ loading }, false, 'traffic/setLoading');
      },

      // 에러 상태 설정
      setError: (error: string | null) => {
        set({ error }, false, 'traffic/setError');
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
          'traffic/clearData'
        );
      }
    }),
    {
      name: 'traffic-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// 선택자 함수들 (성능 최적화)
export const useTrafficData = () => useTrafficStore((state) => state.data);
export const useTrafficLoading = () => useTrafficStore((state) => state.loading);
export const useTrafficError = () => useTrafficStore((state) => state.error);

// 액션 선택자
const actionsSelector = (state: TrafficStore) => state;

export const useTrafficActions = () => {
  const store = useTrafficStore(actionsSelector);
  return {
    fetchData: store.fetchData,
    setData: store.setData,
    setLoading: store.setLoading,
    setError: store.setError,
    clearData: store.clearData
  };
};