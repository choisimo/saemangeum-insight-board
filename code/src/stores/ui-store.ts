import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { UIStore } from '../types/dashboard';
import { DASHBOARD_TABS, REFRESH_INTERVALS } from '../constants/dashboard';

/**
 * UI 상태 전역 관리 스토어
 */
export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        // 초기 상태
        activeTab: DASHBOARD_TABS[0].id,
        sidebarOpen: true,
        theme: 'system' as const,
        refreshInterval: REFRESH_INTERVALS.KPI_DATA,

        // 활성 탭 변경
        setActiveTab: (tab: string) => {
          const validTab = DASHBOARD_TABS.find(t => t.id === tab);
          if (validTab) {
            set({ activeTab: tab }, false, 'ui/setActiveTab');
          }
        },

        // 사이드바 토글
        setSidebarOpen: (open: boolean) => {
          set({ sidebarOpen: open }, false, 'ui/setSidebarOpen');
        },

        // 테마 변경
        setTheme: (theme: 'light' | 'dark' | 'system') => {
          set({ theme }, false, 'ui/setTheme');
          
          // 실제 테마 적용 로직
          const root = window.document.documentElement;
          
          if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.toggle('dark', systemTheme === 'dark');
          } else {
            root.classList.toggle('dark', theme === 'dark');
          }
        },

        // 새로고침 간격 설정
        setRefreshInterval: (interval: number) => {
          const validIntervals = Object.values(REFRESH_INTERVALS) as number[];
          if (validIntervals.includes(interval)) {
            set({ refreshInterval: interval }, false, 'ui/setRefreshInterval');
          }
        }
      }),
      {
        name: 'ui-store',
        partialize: (state) => ({
          activeTab: state.activeTab,
          sidebarOpen: state.sidebarOpen,
          theme: state.theme,
          refreshInterval: state.refreshInterval
        })
      }
    ),
    {
      name: 'ui-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// 선택자 함수들 (성능 최적화)
export const useActiveTab = () => useUIStore((state) => state.activeTab);
export const useSidebarOpen = () => useUIStore((state) => state.sidebarOpen);
export const useTheme = () => useUIStore((state) => state.theme);
export const useRefreshInterval = () => useUIStore((state) => state.refreshInterval);

// 액션 선택자 - 안정적인 참조를 위해 별도 선택자 사용
const actionsSelector = (state: UIStore) => ({
  setActiveTab: state.setActiveTab,
  setSidebarOpen: state.setSidebarOpen,
  setTheme: state.setTheme,
  setRefreshInterval: state.setRefreshInterval
});

export const useUIActions = () => useUIStore(actionsSelector);
