# 새만금 인사이트 대시보드 개발 가이드

## 📖 목차
- [개발 환경 설정](#개발-환경-설정)
- [아키텍처 개요](#아키텍처-개요)
- [코딩 컨벤션](#코딩-컨벤션)
- [상태 관리](#상태-관리)
- [API 연동](#api-연동)
- [컴포넌트 개발](#컴포넌트-개발)
- [타입 정의](#타입-정의)
- [테스팅](#테스팅)
- [배포](#배포)

## 🛠️ 개발 환경 설정

### 필수 요구사항
- **Node.js**: 18.0 이상
- **npm**: 8.0 이상
- **TypeScript**: 5.5+
- **Vite**: 5.4+

### 환경변수 설정
```bash
# .env 파일 생성
cp .env.example .env

# 필요한 API 키 설정
VITE_DATA_PORTAL_API_KEY=your_api_key_here
VITE_KAKAO_MAP_API_KEY=your_kakao_api_key_here
```

### IDE 설정 권장사항
```json
// VSCode settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## 🏗️ 아키텍처 개요

### 전체 아키텍처
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │◄───┤  Zustand Store  │◄───┤  Data Service   │
│                 │    │                 │    │                 │
│ • React 18      │    │ • Investment    │    │ • API Client    │
│ • shadcn/ui     │    │ • Renewable     │    │ • Data Transform│
│ • Tailwind CSS  │    │ • Alerts        │    │ • Error Handling│
│ • TypeScript    │    │ • UI State      │    │ • Retry Logic   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                       ▲                       ▲
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ TanStack Query  │    │ Error Boundary  │    │ Public APIs     │
│                 │    │                 │    │                 │
│ • Cache (5min)  │    │ • Global Error  │    │ • 새만금개발청   │
│ • Background    │    │ • Network Status│    │ • 9개 데이터셋  │
│ • Retry Logic   │    │ • Recovery UI   │    │ • REST JSON     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 폴더 구조 가이드라인
```
src/
├── components/          # React 컴포넌트 (40+ 개)
│   ├── ui/             # 재사용 가능한 UI 컴포넌트 (shadcn/ui 49개)
│   ├── dashboard/      # 대시보드 전용 컴포넌트 (3개)
│   └── [Feature].tsx   # 기능별 컴포넌트 (PascalCase)
├── hooks/              # 커스텀 React 훅 (6개)
├── stores/             # Zustand 스토어 (9개, 기능별 분리)
├── services/           # 외부 API 및 비즈니스 로직 (3개)
├── types/              # TypeScript 타입 정의
├── utils/              # 유틸리티 함수
├── constants/          # 상수 정의
└── pages/              # 페이지 컴포넌트
```

## 📝 코딩 컨벤션

### 파일명 규칙
```bash
# 컴포넌트: PascalCase
KPICard.tsx
DashboardHeader.tsx

# 훅: camelCase with use prefix
use-kpi-data.ts
use-alerts.ts

# 스토어: kebab-case with store suffix
investment-store.ts
renewable-store.ts

# 유틸리티: kebab-case
formatters.ts
kpi-calculator.ts

# 타입: kebab-case
dashboard.ts
```

### 컴포넌트 작성 패턴
```typescript
/**
 * KPI 카드 컴포넌트
 * @param data - KPI 데이터
 * @param loading - 로딩 상태
 * @param onClick - 클릭 핸들러
 */

import React, { memo, useCallback } from 'react';
import type { KPIMetric } from '@/types/dashboard';

interface KPICardProps {
  data: KPIMetric;
  loading?: boolean;
  onClick?: (targetTab: string) => void;
}

export const KPICard: React.FC<KPICardProps> = memo(({ 
  data, 
  loading = false, 
  onClick 
}) => {
  const handleClick = useCallback(() => {
    onClick?.('investment');
  }, [onClick]);

  if (loading) {
    return <KPICardSkeleton />;
  }

  return (
    <div 
      className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      {/* 컴포넌트 내용 */}
    </div>
  );
});

KPICard.displayName = 'KPICard';
```

### TypeScript 타입 정의
```typescript
// 기본 타입
export interface KPIMetric {
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  target?: number;
  progress?: number;
}

// 확장 타입
export interface InvestmentMetric extends KPIMetric {
  actualValue?: number;
  remainingValue?: number;
}

// 스토어 타입
export interface InvestmentStore {
  data: InvestmentData[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  
  // 액션
  fetchData: () => Promise<void>;
  setData: (data: InvestmentData[]) => void;
  clearData: () => void;
}
```

## 🗄️ 상태 관리

### Zustand 스토어 패턴
```typescript
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { InvestmentStore, InvestmentData } from '@/types/dashboard';

// 9개 전문화된 스토어
// - investment-store.ts, renewable-store.ts, alert-store.ts
// - energy-store.ts, environment-store.ts, traffic-store.ts
// - weather-store.ts, ui-store.ts, index.ts

export const useInvestmentStore = create<InvestmentStore>()(
  subscribeWithSelector((set, get) => ({
    // 초기 상태
    data: [],
    loading: false,
    error: null,
    lastUpdated: null,

    // 액션
    fetchData: async () => {
      set({ loading: true, error: null });
      try {
        const data = await apiService.getInvestmentData();
        set({ 
          data, 
          loading: false, 
          lastUpdated: new Date() 
        });
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : '알 수 없는 오류',
          loading: false 
        });
      }
    },

    setData: (data: InvestmentData[]) => set({ data }),
    clearData: () => set({ data: [], lastUpdated: null }),
  }))
);

// 셀렉터 훅 패턴
export const useInvestmentData = () => useInvestmentStore(state => state.data);
export const useInvestmentLoading = () => useInvestmentStore(state => state.loading);
export const useInvestmentError = () => useInvestmentStore(state => state.error);
```

### TanStack Query 설정
```typescript
// App.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      gcTime: 10 * 60 * 1000, // 10분
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('fetch')) {
          return failureCount < 3;
        }
        return failureCount < 1;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

## 🔌 API 연동

### API 클라이언트 사용법
```typescript
// 3개 전문화된 서비스
// - enhanced-api-service.ts: 향상된 API 서비스
// - real-api-service.ts: 실제 API 연동 서비스
// - alert-service.ts: 알림 전용 서비스

class EnhancedApiService {
  private async makeRequest(endpoint: string, params: Record<string, any> = {}): Promise<any> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    const allParams = {
      serviceKey: this.serviceKey,
      page: 1,
      perPage: 100,
      ...params
    };

    // URL 파라미터 설정
    Object.entries(allParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API 요청 실패 (${endpoint}):`, error);
      throw error;
    }
  }
}
```

### 에러 처리 패턴
```typescript
// 지수백오프를 사용한 재시도 로직
export async function fetchWithRetry<T>(
  fetchFn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      return await fetchFn();
    } catch (error) {
      if (i === maxRetries) throw error;
      
      // 지수백오프: 1초 → 2초 → 4초 → 8초...
      const delay = Math.min(1000 * 2 ** i, 30000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Max retries exceeded');
}

// TanStack Query 설정에서 재시도 로직
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof Error && error.message.includes('fetch')) {
          return failureCount < 3;
        }
        return failureCount < 1;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
```

## 🧩 컴포넌트 개발

### 컴포넌트 설계 원칙
1. **단일 책임 원칙**: 하나의 컴포넌트는 하나의 기능만
2. **재사용성**: 가능한 한 재사용 가능하게 설계
3. **Props 타입 정의**: 모든 props에 대해 TypeScript 타입 정의
4. **성능 최적화**: React.memo, useCallback, useMemo 적절히 사용
5. **접근성**: ARIA 속성 및 키보드 네비게이션 고려

### 컴포넌트 템플릿
```typescript
import React, { memo, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { ComponentProps } from '@/types/dashboard';

interface MyComponentProps {
  title: string;
  data: any[];
  loading?: boolean;
  className?: string;
  onItemClick?: (item: any) => void;
}

export const MyComponent: React.FC<MyComponentProps> = memo(({
  title,
  data,
  loading = false,
  className,
  onItemClick
}) => {
  // 메모이제이션된 계산값
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      processed: true
    }));
  }, [data]);

  // 메모이제이션된 이벤트 핸들러
  const handleItemClick = useCallback((item: any) => {
    onItemClick?.(item);
  }, [onItemClick]);

  // 로딩 상태 처리
  if (loading) {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("p-6 bg-white rounded-lg shadow", className)}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-2">
        {processedData.map((item, index) => (
          <div
            key={item.id || index}
            className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
            onClick={() => handleItemClick(item)}
          >
            {/* 아이템 렌더링 */}
          </div>
        ))}
      </div>
    </div>
  );
});

MyComponent.displayName = 'MyComponent';
```

## 🔧 테스팅

### 테스트 구조 (추후 구현 예정)
```typescript
// __tests__/KPICard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { KPICard } from '@/components/KPICard';
import type { KPIMetric } from '@/types/dashboard';

const mockKPIData: KPIMetric = {
  value: 1500,
  unit: '억원',
  change: 12.5,
  changeType: 'increase'
};

describe('KPICard', () => {
  it('renders KPI data correctly', () => {
    render(<KPICard data={mockKPIData} />);
    
    expect(screen.getByText('1500억원')).toBeInTheDocument();
    expect(screen.getByText('12.5%')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = jest.fn();
    render(<KPICard data={mockKPIData} onClick={mockOnClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledWith('investment');
  });
});
```

## 🚀 배포

### 빌드 및 배포 과정
```bash
# 1. 의존성 설치
npm install

# 2. 타입 체크
npm run lint

# 3. 빌드
npm run build

# 4. 빌드 결과 확인
npm run preview

# 5. 배포 (예: Vercel)
vercel --prod
```

### 환경별 설정
```bash
# 개발환경
npm run build:dev

# 프로덕션
npm run build
```

## 📋 체크리스트

### 새 기능 개발 시
- [ ] 타입 정의 작성
- [ ] 컴포넌트 구현
- [ ] 스토어/훅 구현
- [ ] 에러 처리 추가
- [ ] 로딩 상태 처리
- [ ] 반응형 디자인 확인
- [ ] 접근성 검증
- [ ] 성능 최적화
- [ ] 테스트 작성 (추후)
- [ ] 문서 업데이트

### 버그 수정 시
- [ ] 문제 원인 파악
- [ ] 수정사항 구현
- [ ] 관련 테스트 수정
- [ ] 회귀 테스트 수행
- [ ] 문서 업데이트

## 🔗 추가 리소스

- [React 공식 문서](https://react.dev)
- [TypeScript 핸드북](https://www.typescriptlang.org/docs)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [Zustand 문서](https://zustand-demo.pmnd.rs)
- [shadcn/ui 컴포넌트](https://ui.shadcn.com)
- [Tailwind CSS 문서](https://tailwindcss.com/docs)

---

**최종 업데이트**: 2025-07-31  
**작성자**: 개발팀  
**버전**: 1.1.0