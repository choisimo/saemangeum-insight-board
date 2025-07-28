import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<Record<string, never>>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<Record<string, never>>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <span>오류가 발생했습니다</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="border-destructive/20 bg-destructive/5">
                <AlertDescription className="text-destructive">
                  {this.state.error?.message || '알 수 없는 오류가 발생했습니다.'}
                </AlertDescription>
              </Alert>
              <Button 
                onClick={() => window.location.reload()} 
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                페이지 새로고침
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// API 에러 컴포넌트
interface ApiErrorProps {
  error: Error | null;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

export function ApiError({ 
  error, 
  onRetry, 
  title = "데이터 로딩 실패",
  description = "데이터를 불러오는 중 오류가 발생했습니다." 
}: ApiErrorProps) {
  if (!error) return null;

  const isNetworkError = error.message.includes('fetch') || 
                        error.message.includes('network') ||
                        error.message.includes('timeout');

  return (
    <Alert className="border-destructive/20 bg-destructive/5">
      <div className="flex items-start space-x-2">
        {isNetworkError ? (
          <WifiOff className="h-4 w-4 text-destructive mt-0.5" />
        ) : (
          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
        )}
        <div className="flex-1">
          <AlertDescription className="text-destructive font-medium">
            {title}
          </AlertDescription>
          <AlertDescription className="text-destructive/80 text-sm mt-1">
            {description}
          </AlertDescription>
          {error.message && (
            <AlertDescription className="text-destructive/60 text-xs mt-2 font-mono">
              오류 상세: {error.message}
            </AlertDescription>
          )}
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3 border-destructive/20 text-destructive hover:bg-destructive/10"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              다시 시도
            </Button>
          )}
        </div>
      </div>
    </Alert>
  );
}

// 로딩 스켈레톤 컴포넌트
export function LoadingSkeleton({ 
  className = "" 
}: { 
  className?: string 
}) {
  return (
    <div className={`animate-pulse bg-muted rounded-md ${className}`} />
  );
}

// 카드 로딩 스켈레톤
export function CardLoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-4 w-32" />
          <LoadingSkeleton className="h-8 w-8 rounded-lg" />
        </div>
      </CardHeader>
      <CardContent>
        <LoadingSkeleton className="h-8 w-24 mb-2" />
        <LoadingSkeleton className="h-4 w-16 mb-4" />
        <div className="flex items-center justify-between">
          <LoadingSkeleton className="h-4 w-20" />
          <LoadingSkeleton className="h-6 w-16 rounded-full" />
        </div>
        <LoadingSkeleton className="h-2 w-full mt-3 rounded-full" />
      </CardContent>
    </Card>
  );
}

// 네트워크 상태 표시기
export function NetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <Alert className="border-warning/20 bg-warning/5">
        <WifiOff className="h-4 w-4 text-warning" />
        <AlertDescription className="text-warning-foreground">
          인터넷 연결이 끊어졌습니다
        </AlertDescription>
      </Alert>
    </div>
  );
}

// 데이터 품질 인디케이터
interface DataQualityIndicatorProps {
  totalRecords: number;
  validRecords: number;
  qualityScore: number;
}

export function DataQualityIndicator({ 
  totalRecords, 
  validRecords, 
  qualityScore 
}: DataQualityIndicatorProps) {
  const getQualityColor = (score: number) => {
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getQualityLabel = (score: number) => {
    if (score >= 80) return '우수';
    if (score >= 60) return '보통';
    return '개선 필요';
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
      <span>데이터 품질:</span>
      <span className={getQualityColor(qualityScore)}>
        {getQualityLabel(qualityScore)} ({qualityScore}%)
      </span>
      <span>({validRecords}/{totalRecords})</span>
    </div>
  );
}