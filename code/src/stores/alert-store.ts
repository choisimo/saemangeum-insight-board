import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { AlertStore, AlertData } from '../types/dashboard';
import AlertService from '../services/alert-service';

/**
 * 알림 데이터 전역 상태 관리 스토어
 */
export const useAlertStore = create<AlertStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 초기 상태
        alerts: [],
        unreadCount: 0,
        loading: false,
        error: null,

        // 알림 데이터 페칭
        fetchAlerts: async () => {
          const { loading } = get();
          if (loading) return; // 중복 요청 방지

          set({ loading: true, error: null }, false, 'alert/fetchAlerts/start');

          try {
            const alertServiceInstance = AlertService.getInstance();
            const alerts = await alertServiceInstance.getAlerts();
            const unreadCount = alerts.filter(alert => !alert.read).length;

            set(
              {
                alerts,
                unreadCount,
                loading: false,
                error: null
              },
              false,
              'alert/fetchAlerts/success'
            );
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : '알림 데이터 로딩 실패';
            set(
              {
                loading: false,
                error: errorMessage
              },
              false,
              'alert/fetchAlerts/error'
            );
          }
        },

        // 새 알림 추가
        addAlert: (alertData: Omit<AlertData, 'id' | 'timestamp'>) => {
          const newAlert: AlertData = {
            ...alertData,
            id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date()
          };

          set(
            (state) => ({
              alerts: [newAlert, ...state.alerts],
              unreadCount: state.unreadCount + 1
            }),
            false,
            'alert/addAlert'
          );
        },

        // 알림 읽음 처리
        markAsRead: (alertId: string) => {
          set(
            (state) => {
              const updatedAlerts = state.alerts.map(alert =>
                alert.id === alertId ? { ...alert, read: true } : alert
              );
              const unreadCount = updatedAlerts.filter(alert => !alert.read).length;

              return {
                alerts: updatedAlerts,
                unreadCount
              };
            },
            false,
            'alert/markAsRead'
          );
        },

        // 모든 알림 읽음 처리
        markAllAsRead: () => {
          set(
            (state) => ({
              alerts: state.alerts.map(alert => ({ ...alert, read: true })),
              unreadCount: 0
            }),
            false,
            'alert/markAllAsRead'
          );
        },

        // 알림 제거
        removeAlert: (alertId: string) => {
          set(
            (state) => {
              const updatedAlerts = state.alerts.filter(alert => alert.id !== alertId);
              const unreadCount = updatedAlerts.filter(alert => !alert.read).length;

              return {
                alerts: updatedAlerts,
                unreadCount
              };
            },
            false,
            'alert/removeAlert'
          );
        },

        // 모든 알림 초기화
        clearAlerts: () => {
          set(
            {
              alerts: [],
              unreadCount: 0,
              loading: false,
              error: null
            },
            false,
            'alert/clearAlerts'
          );
        }
      }),
      {
        name: 'alert-store',
        partialize: (state) => ({
          alerts: state.alerts,
          unreadCount: state.unreadCount
        })
      }
    ),
    {
      name: 'alert-store',
      enabled: process.env.NODE_ENV === 'development'
    }
  )
);

// 선택자 함수들 (성능 최적화)
export const useAlerts = () => useAlertStore((state) => state.alerts);
export const useUnreadCount = () => useAlertStore((state) => state.alerts.filter(alert => !alert.read).length);
export const useAlertLoading = () => useAlertStore((state) => state.loading);
export const useAlertError = () => useAlertStore((state) => state.error);

// 액션 선택자 - 안정적인 참조를 위해 별도 선택자 사용
const actionsSelector = (state: AlertStore) => ({
  fetchAlerts: state.fetchAlerts,
  addAlert: state.addAlert,
  markAsRead: state.markAsRead,
  removeAlert: state.removeAlert,
  clearAlerts: state.clearAlerts
});

export const useAlertActions = () => useAlertStore(actionsSelector);
