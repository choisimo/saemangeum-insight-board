/**
 * 탭 네비게이션 컴포넌트
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { DASHBOARD_TABS } from '@/constants/dashboard';
import type { DashboardTab } from '@/types/dashboard';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = React.memo(({ 
  activeTab, 
  onTabChange 
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
      {DASHBOARD_TABS.map((tab: DashboardTab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          size="sm"
          onClick={() => onTabChange(tab.id)}
          className={`
            transition-all duration-200 
            ${activeTab === tab.id 
              ? 'bg-white shadow-sm text-gray-900' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }
          `}
        >
          {tab.icon && <tab.icon className="h-4 w-4 mr-2" />}
          {tab.label}
        </Button>
      ))}
    </div>
  );
});

TabNavigation.displayName = 'TabNavigation';
