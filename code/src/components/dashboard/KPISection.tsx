/**
 * KPI 섹션 컴포넌트
 */

import React from 'react';
import { KPICard } from '@/components/KPICard';
import { CardLoadingSkeleton } from '@/components/ErrorBoundary';
import type { KPIData } from '@/types/dashboard';
import { UI_CONSTANTS } from '@/constants/dashboard';
import { 
  DollarSign, 
  Building2, 
  Users, 
  TrendingUp, 
  Zap, 
  MessageSquare 
} from 'lucide-react';

interface KPISectionProps {
  kpiData: KPIData;
  loading: boolean;
  onCardClick?: (cardType: string) => void;
}

const KPI_CONFIG = [
  {
    key: 'totalInvestment' as keyof KPIData,
    title: '총 투자유치액',
    icon: DollarSign,
    color: 'text-green-600',
    targetTab: 'investment',
    description: '투자 현황 상세보기'
  },
  {
    key: 'newCompanies' as keyof KPIData,
    title: '신규 입주기업',
    icon: Building2,
    color: 'text-blue-600',
    targetTab: 'investment',
    description: '입주기업 현황 상세보기'
  },
  {
    key: 'employment' as keyof KPIData,
    title: '고용창출',
    icon: Users,
    color: 'text-purple-600',
    targetTab: 'investment',
    description: '고용 현황 상세보기'
  },
  {
    key: 'salesRate' as keyof KPIData,
    title: '분양률',
    icon: TrendingUp,
    color: 'text-orange-600',
    targetTab: 'investment',
    description: '분양 현황 상세보기'
  },
  {
    key: 'renewableEnergy' as keyof KPIData,
    title: '재생에너지',
    icon: Zap,
    color: 'text-yellow-600',
    targetTab: 'environment',
    description: '재생에너지 현황 상세보기'
  },
  {
    key: 'complaints' as keyof KPIData,
    title: '민원 접수',
    icon: MessageSquare,
    color: 'text-red-600',
    targetTab: 'environment',
    description: '민원 현황 상세보기'
  }
];

export const KPISection: React.FC<KPISectionProps> = React.memo(({ 
  kpiData, 
  loading,
  onCardClick
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: UI_CONSTANTS.LOADING_SKELETON_COUNT }).map((_, index) => (
          <CardLoadingSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {KPI_CONFIG.map(({ key, title, icon: Icon, color, targetTab, description }) => {
        const data = kpiData[key];
        
        return (
          <div 
            key={key}
            className="cursor-pointer transition-transform hover:scale-105 group"
            onClick={() => onCardClick?.(targetTab)}
            title={description}
          >
            <KPICard
              title={title}
              value={data.value}
              unit={data.unit}
              change={data.change}
              changeType={data.changeType}
              icon={<Icon className={`h-4 w-4 ${color}`} />}
              target={data.target}
              progress={data.progress}
              actualValue={key === 'totalInvestment' ? (data as any).actualValue : undefined}
              remainingValue={key === 'totalInvestment' ? (data as any).remainingValue : undefined}
              isClickable={true}
            />
          </div>
        );
      })}
    </div>
  );
});

KPISection.displayName = 'KPISection';
