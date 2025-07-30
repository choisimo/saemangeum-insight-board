import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Info, ExternalLink, Calendar, Database, Shield } from 'lucide-react';

interface DataSource {
  id: string;
  name: string;
  description: string;
  provider: string;
  endpoint: string;
  updateFrequency: string;
  lastUpdated: string;
  dataCount: number;
  reliability: 'high' | 'medium' | 'low';
  category: string;
  sampleFields: string[];
}

interface DataSourceInfoProps {
  dataType: 'investment' | 'renewable' | 'weather' | 'utility' | 'building' | 'traffic' | 'land';
  compact?: boolean;
}

export function DataSourceInfo({ dataType, compact = false }: DataSourceInfoProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dataSources: Record<string, DataSource> = {
    investment: {
      id: 'investment',
      name: '투자인센티브보조금지원현황',
      description: '새만금 지역 투자 인센티브 및 보조금 지원 현황 데이터',
      provider: '공공데이터포털 (data.go.kr)',
      endpoint: '/15121622/v1/uddi:d8e95b9d-7808-4643-b2f5-c1fa1a649ede',
      updateFrequency: '월 1회',
      lastUpdated: '2024-07-29',
      dataCount: 15,
      reliability: 'high',
      category: '경제/투자',
      sampleFields: ['대상기업', '제도', '지역', '지원내용', '번호']
    },
    renewable: {
      id: 'renewable',
      name: '재생에너지사업정보',
      description: '새만금 지역 재생에너지 발전 시설 및 사업 정보',
      provider: '공공데이터포털 (data.go.kr)',
      endpoint: '/15068848/v1/uddi:1743c432-d853-40d9-9c4a-9076e4f35ce9',
      updateFrequency: '주 1회',
      lastUpdated: '2024-07-29',
      dataCount: 6,
      reliability: 'high',
      category: '에너지/환경',
      sampleFields: ['발전유형', '용량(기가와트)', '위치', '면적(제곱킬로미터)']
    },
    weather: {
      id: 'weather',
      name: '초단기예보조회',
      description: '새만금 지역 기상 정보 및 예보 데이터',
      provider: '공공데이터포털 (data.go.kr)',
      endpoint: '/15138305/v1/uddi:acd5c118-0357-42a4-83c5-ae09cdb47265',
      updateFrequency: '실시간',
      lastUpdated: '2024-07-29',
      dataCount: 23376,
      reliability: 'high',
      category: '기상/환경',
      sampleFields: ['발표일자', '예보 값', '예보지점 X 좌표', '예보지점 Y 좌표', '자료구분코드']
    },
    utility: {
      id: 'utility',
      name: '산업단지유틸리티현황',
      description: '새만금 산업단지 유틸리티 인프라 현황',
      provider: '공공데이터포털 (data.go.kr)',
      endpoint: '/15068849/v1/uddi:2743c432-d853-40d9-9c4a-9076e4f35ce9',
      updateFrequency: '월 1회',
      lastUpdated: '2024-07-29',
      dataCount: 0,
      reliability: 'medium',
      category: '인프라',
      sampleFields: ['구현 중']
    },
    building: {
      id: 'building',
      name: '건축물허가현황',
      description: '새만금 지역 건축물 허가 및 건설 현황',
      provider: '공공데이터포털 (data.go.kr)',
      endpoint: '/15068850/v1/uddi:4743c432-d853-40d9-9c4a-9076e4f35ce9',
      updateFrequency: '주 1회',
      lastUpdated: '2024-07-29',
      dataCount: 0,
      reliability: 'medium',
      category: '건설/개발',
      sampleFields: ['구현 중']
    },
    traffic: {
      id: 'traffic',
      name: '방조제교통량',
      description: '새만금 방조제 교통량 및 통행 현황',
      provider: '공공데이터포털 (data.go.kr)',
      endpoint: '/15068851/v1/uddi:5743c432-d853-40d9-9c4a-9076e4f35ce9',
      updateFrequency: '실시간',
      lastUpdated: '2024-07-29',
      dataCount: 0,
      reliability: 'medium',
      category: '교통',
      sampleFields: ['구현 중']
    },
    land: {
      id: 'land',
      name: '지적공부 및 매립정보',
      description: '새만금 지역 토지 및 매립 관련 정보',
      provider: '공공데이터포털 (data.go.kr)',
      endpoint: '/15068852/v1/uddi:6743c432-d853-40d9-9c4a-9076e4f35ce9',
      updateFrequency: '월 1회',
      lastUpdated: '2024-07-29',
      dataCount: 0,
      reliability: 'medium',
      category: '토지/지적',
      sampleFields: ['구현 중']
    }
  };

  const source = dataSources[dataType];

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getReliabilityText = (reliability: string) => {
    switch (reliability) {
      case 'high':
        return '높음';
      case 'medium':
        return '보통';
      case 'low':
        return '낮음';
      default:
        return '';
    }
  };

  if (compact) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Info className="h-3 w-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>데이터 출처 정보</span>
            </DialogTitle>
          </DialogHeader>
          <DataSourceDetails source={source} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Info className="h-4 w-4" />
          <span>데이터 출처</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>데이터 출처 정보</span>
          </DialogTitle>
        </DialogHeader>
        <DataSourceDetails source={source} />
      </DialogContent>
    </Dialog>
  );
}

function DataSourceDetails({ source }: { source: DataSource }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center justify-between">
            {source.name}
            <Badge className={getReliabilityColor(source.reliability)}>
              <Shield className="h-3 w-3 mr-1" />
              신뢰도: {getReliabilityText(source.reliability)}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm mb-2">데이터 설명</h4>
            <p className="text-sm text-muted-foreground">{source.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2">제공기관</h4>
              <p className="text-sm">{source.provider}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">카테고리</h4>
              <Badge variant="secondary">{source.category}</Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                업데이트 주기
              </h4>
              <p className="text-sm">{source.updateFrequency}</p>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">마지막 업데이트</h4>
              <p className="text-sm">{source.lastUpdated}</p>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">데이터 건수</h4>
            <p className="text-sm">
              {source.dataCount > 0 ? `${source.dataCount.toLocaleString()}건` : '구현 중'}
            </p>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">API 엔드포인트</h4>
            <div className="flex items-center space-x-2">
              <code className="text-xs bg-muted px-2 py-1 rounded flex-1">
                api.odcloud.kr{source.endpoint}
              </code>
              <Button variant="ghost" size="sm" asChild>
                <a 
                  href={getDataSourceUrl(source.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-sm mb-2">데이터 필드</h4>
            <div className="flex flex-wrap gap-2">
              {source.sampleFields.map((field, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {field}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getReliabilityColor(reliability: string) {
  switch (reliability) {
    case 'high':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'low':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

function getDataSourceUrl(dataSourceId: string): string {
  const urlMapping: Record<string, string> = {
    investment: 'https://www.data.go.kr/data/15121622/fileData.do',
    renewable: 'https://www.data.go.kr/data/15068848/fileData.do', 
    weather: 'https://www.data.go.kr/data/15138304/fileData.do',
    utility: 'https://www.data.go.kr/data/15120069/fileData.do',
    building: 'https://www.data.go.kr/data/15002297/fileData.do',
    traffic: 'https://www.data.go.kr/data/15002284/fileData.do',
    land: 'https://www.data.go.kr/data/15040597/fileData.do'
  };
  
  return urlMapping[dataSourceId] || 'https://www.data.go.kr';
}

function getReliabilityText(reliability: string) {
  switch (reliability) {
    case 'high':
      return '높음';
    case 'medium':
      return '보통';
    case 'low':
      return '낮음';
    default:
      return '';
  }
}
