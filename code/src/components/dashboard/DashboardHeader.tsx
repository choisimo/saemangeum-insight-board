/**
 * 대시보드 헤더 컴포넌트
 */

import React from 'react';
import { NetworkStatus, DataQualityIndicator } from '@/components/ErrorBoundary';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface DashboardHeaderProps {
  hasErrors: boolean;
  lastUpdated?: Date;
  dataQuality?: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = React.memo(({ 
  hasErrors, 
  lastUpdated,
  dataQuality = 95
}) => {
  const formatLastUpdated = (date?: Date) => {
    if (!date) return '업데이트 정보 없음';
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getDataQualityStatus = (quality: number) => {
    if (quality >= 90) return { label: '우수', color: 'bg-green-500', icon: CheckCircle };
    if (quality >= 80) return { label: '양호', color: 'bg-yellow-500', icon: Clock };
    return { label: '주의', color: 'bg-red-500', icon: AlertTriangle };
  };

  const qualityStatus = getDataQualityStatus(dataQuality);
  const QualityIcon = qualityStatus.icon;

  return (
    <div className="mb-6 space-y-4">
      {/* 시스템 상태 알림 */}
      {hasErrors && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            일부 데이터 소스에서 오류가 발생했습니다. 시스템이 자동으로 복구를 시도하고 있습니다.
          </AlertDescription>
        </Alert>
      )}

      {/* 상태 표시줄 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <NetworkStatus />
          <DataQualityIndicator 
            totalRecords={100}
            validRecords={dataQuality}
            qualityScore={dataQuality}
          />
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`${qualityStatus.color} text-white border-0`}>
              <QualityIcon className="h-3 w-3 mr-1" />
              데이터 품질: {qualityStatus.label}
            </Badge>
            <span>{dataQuality}%</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>최종 업데이트: {formatLastUpdated(lastUpdated)}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

DashboardHeader.displayName = 'DashboardHeader';
