import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { RenewableStore, RenewableData } from '../types/dashboard';
import { dataService } from '../services/data-service';

/**
 * 재생에너지 데이터 전역 상태 관리 스토어
 */
export const useRenewableStore = create<RenewableStore>()(
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

        set({ loading: true, error: null }, false, 'renewable/fetchData/start');

        try {
          const rawData = await dataService.getRenewableEnergyData();
          
          // API에서 실제 데이터가 반환된 경우에만 처리
          if (rawData && rawData.length > 0) {
            // 데이터를 그대로 사용 (필터링만 적용)
            const transformedData: RenewableData[] = rawData.filter(item => 
              item.region && item.type && item.capacity > 0
            );

            set(
              {
                data: transformedData,
                loading: false,
                lastUpdated: new Date(),
                error: null
              },
              false,
              'renewable/fetchData/success'
            );
          } else {
            // 데이터가 없는 경우 빈 배열과 에러 메시지 설정
            set(
              {
                data: [],
                loading: false,
                error: 'API에서 재생에너지 데이터를 가져올 수 없습니다'
              },
              false,
              'renewable/fetchData/empty'
            );
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '재생에너지 데이터 로딩 실패';
          set(
            {
              data: [], // 에러 시 빈 배열만 설정
              loading: false,
              error: errorMessage
            },
            false,
            'renewable/fetchData/error'
          );
        }
      },

      // 데이터 직접 설정
      setData: (data: RenewableData[]) => {
        set(
          {
            data,
            lastUpdated: new Date(),
            error: null
          },
          false,
          'renewable/setData'
        );
      },

      // 로딩 상태 설정
      setLoading: (loading: boolean) => {
        set({ loading }, false, 'renewable/setLoading');
      },

      // 에러 상태 설정
      setError: (error: string | null) => {
        set({ error }, false, 'renewable/setError');
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
          'renewable/clearData'
        );
      }
    }),
    {
      name: 'renewable-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// 선택자 함수들 (성능 최적화)
export const useRenewableData = () => useRenewableStore((state) => state.data);
export const useRenewableLoading = () => useRenewableStore((state) => state.loading);
export const useRenewableError = () => useRenewableStore((state) => state.error);

// 액션 선택자 - 안정적인 참조를 위해 별도 선택자 사용
const actionsSelector = (state: RenewableStore) => ({
  fetchData: state.fetchData,
  setData: state.setData,
  setLoading: state.setLoading,
  setError: state.setError,
  clearData: state.clearData
});

export const useRenewableActions = () => useRenewableStore(actionsSelector);
