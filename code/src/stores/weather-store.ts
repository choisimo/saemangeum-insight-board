import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { WeatherStore, WeatherData } from '../types/dashboard';
import { realApiService } from '../services/real-api-service';

/**
 * 기상 데이터 전역 상태 관리 스토어
 */
export const useWeatherStore = create<WeatherStore>()(
  devtools(
    (set, get) => ({
      // 초기 상태
      data: null,
      loading: false,
      error: null,
      lastUpdated: null,

      // 데이터 페칭 액션
      fetchData: async () => {
        const { loading } = get();
        if (loading) return; // 중복 요청 방지

        set({ loading: true, error: null }, false, 'weather/fetchData/start');

        try {
          const data = await realApiService.getWeatherData();
          
          if (data) {
            set(
              {
                data,
                loading: false,
                lastUpdated: new Date(),
                error: null
              },
              false,
              'weather/fetchData/success'
            );
          } else {
            set(
              {
                data: null,
                loading: false,
                error: '기상 데이터를 가져올 수 없습니다'
              },
              false,
              'weather/fetchData/empty'
            );
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '기상 데이터 로딩 실패';
          set(
            {
              data: null,
              loading: false,
              error: errorMessage
            },
            false,
            'weather/fetchData/error'
          );
        }
      },

      // 데이터 직접 설정
      setData: (data: WeatherData | null) => {
        set(
          {
            data,
            lastUpdated: new Date(),
            error: null
          },
          false,
          'weather/setData'
        );
      },

      // 로딩 상태 설정
      setLoading: (loading: boolean) => {
        set({ loading }, false, 'weather/setLoading');
      },

      // 에러 상태 설정
      setError: (error: string | null) => {
        set({ error }, false, 'weather/setError');
      },

      // 데이터 초기화
      clearData: () => {
        set(
          {
            data: null,
            loading: false,
            error: null,
            lastUpdated: null
          },
          false,
          'weather/clearData'
        );
      }
    }),
    {
      name: 'weather-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// 선택자 함수들 (성능 최적화)
export const useWeatherData = () => useWeatherStore((state) => state.data);
export const useWeatherLoading = () => useWeatherStore((state) => state.loading);
export const useWeatherError = () => useWeatherStore((state) => state.error);

// 액션 선택자
const actionsSelector = (state: WeatherStore) => state;

export const useWeatherActions = () => {
  const store = useWeatherStore(actionsSelector);
  return {
    fetchData: store.fetchData,
    setData: store.setData,
    setLoading: store.setLoading,
    setError: store.setError,
    clearData: store.clearData
  };
};