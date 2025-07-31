/**
 * 투자 현황 개요 컴포넌트
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { InvestmentData } from '@/types/dashboard';
import { 
  Building2, 
  DollarSign, 
  Users, 
  MapPin,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface InvestmentOverviewProps {
  data: InvestmentData[];
}

export const InvestmentOverview: React.FC<InvestmentOverviewProps> = ({ data }) => {
  // 투자 현황 통계 계산
  const totalInvestment = data.reduce((sum, item) => sum + item.investment, 0);
  const totalJobs = data.reduce((sum, item) => sum + item.expectedJobs, 0);
  // 진행률은 이미 백분율이므로 추가로 100을 곱하지 않음
  const avgProgress = data.length > 0 ? data.reduce((sum, item) => sum + (item.progress || 0), 0) / data.length : 0;
  
  // 상태별 분류
  const statusCounts = data.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 업종별 분류
  const sectorCounts = data.reduce((acc, item) => {
    acc[item.sector] = (acc[item.sector] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'planning': return 'bg-yellow-500';
      case 'delayed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '완료';
      case 'in-progress': return '진행중';
      case 'planning': return '계획중';
      case 'delayed': return '지연';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* 투자 현황 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 투자액</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvestment.toLocaleString()}억원</div>
            <p className="text-xs text-muted-foreground">
              {data.length}개 프로젝트
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">예상 고용창출</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs.toLocaleString()}명</div>
            <p className="text-xs text-muted-foreground">
              평균 {Math.round(totalJobs / data.length || 0)}명/프로젝트
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 진행률</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress.toFixed(2)}%</div>
            <Progress value={avgProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* 상태별 현황 */}
      <Card>
        <CardHeader>
          <CardTitle>프로젝트 상태별 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(statusCounts).map(([status, count]) => (
              <Badge 
                key={status} 
                variant="outline" 
                className={`${getStatusColor(status)} text-white border-0`}
              >
                {getStatusLabel(status)}: {count}개
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 업종별 현황 */}
      <Card>
        <CardHeader>
          <CardTitle>업종별 투자 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(sectorCounts).map(([sector, count]) => (
              <div key={sector} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold">{count}</div>
                <div className="text-sm text-gray-600">{sector}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 투자 프로젝트 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>투자 프로젝트 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((project) => (
              <div key={project.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="h-4 w-4 text-gray-500" />
                      <h3 className="font-semibold">{project.company}</h3>
                      <Badge 
                        variant="outline" 
                        className={`${getStatusColor(project.status)} text-white border-0 text-xs`}
                      >
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        <span>{project.investment}억원</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{project.expectedJobs}명</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{project.startDate}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>진행률</span>
                        <span>{project.progress.toFixed(2)}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
