import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Info, 
  X, 
  Trash2, 
  RefreshCw,
  Bell,
  TrendingUp,
  Cloud,
  Building2,
  MessageSquare,
  Settings
} from 'lucide-react';
import { useAlerts } from '@/hooks/use-alerts';
import type { AlertData } from '@/services/alert-service';

const AlertIcon = ({ type, severity }: { type: AlertData['type'], severity: AlertData['severity'] }) => {
  const getIconColor = () => {
    if (severity === 'critical') return 'text-red-600';
    if (severity === 'high') return 'text-red-500';
    if (severity === 'medium') return 'text-yellow-500';
    return 'text-blue-500';
  };

  const iconClass = `h-4 w-4 ${getIconColor()}`;

  switch (type) {
    case 'error':
      return <AlertTriangle className={iconClass} />;
    case 'warning':
      return <Clock className={iconClass} />;
    case 'success':
      return <CheckCircle className={iconClass} />;
    case 'info':
    default:
      return <Info className={iconClass} />;
  }
};

const CategoryIcon = ({ category }: { category: AlertData['category'] }) => {
  const iconClass = "h-4 w-4 text-muted-foreground";
  
  switch (category) {
    case 'investment':
      return <TrendingUp className={iconClass} />;
    case 'environment':
      return <Building2 className={iconClass} />;
    case 'weather':
      return <Cloud className={iconClass} />;
    case 'complaint':
      return <MessageSquare className={iconClass} />;
    case 'system':
      return <Settings className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
  }
};

const SeverityBadge = ({ severity }: { severity: AlertData['severity'] }) => {
  const getVariant = () => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getSeverityText = () => {
    switch (severity) {
      case 'critical':
        return '긴급';
      case 'high':
        return '높음';
      case 'medium':
        return '보통';
      case 'low':
        return '낮음';
      default:
        return '알 수 없음';
    }
  };

  return (
    <Badge variant={getVariant()} className="text-xs">
      {getSeverityText()}
    </Badge>
  );
};

const AlertItem = ({ alert, onRemove }: { alert: AlertData, onRemove: (id: string) => void }) => {
  const getAlertClassName = () => {
    switch (alert.type) {
      case 'error':
        return 'border-destructive/20 bg-destructive/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'info':
      default:
        return 'border-primary/20 bg-primary/5';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  return (
    <Alert className={`${getAlertClassName()} relative group`}>
      <div className="flex items-start space-x-3">
        <div className="flex items-center space-x-2">
          <AlertIcon type={alert.type} severity={alert.severity} />
          <CategoryIcon category={alert.category} />
        </div>
        
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{alert.title}</h4>
            <div className="flex items-center space-x-2">
              <SeverityBadge severity={alert.severity} />
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                onClick={() => onRemove(alert.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <AlertDescription className="text-sm">
            {alert.message}
          </AlertDescription>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{alert.source}</span>
            <span>{formatTimestamp(alert.timestamp)}</span>
          </div>
        </div>
      </div>
    </Alert>
  );
};

export function AlertCenter() {
  const { 
    alerts, 
    loading, 
    refreshAlerts, 
    removeAlert, 
    clearAllAlerts, 
    getAlertCounts,
    getAlertsByCategory,
    getRecentAlerts,
    runAnalysis
  } = useAlerts();

  const [activeTab, setActiveTab] = useState('all');
  const counts = getAlertCounts();
  const recentAlerts = getRecentAlerts();

  const getFilteredAlerts = () => {
    switch (activeTab) {
      case 'recent':
        return recentAlerts;
      case 'critical':
        return alerts.filter(a => a.severity === 'critical' || a.severity === 'high');
      case 'investment':
        return getAlertsByCategory('investment');
      case 'environment':
        return getAlertsByCategory('environment');
      case 'weather':
        return getAlertsByCategory('weather');
      case 'system':
        return getAlertsByCategory('system');
      default:
        return alerts;
    }
  };

  const filteredAlerts = getFilteredAlerts();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
        <span>알림을 불러오는 중...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>실시간 알림 센터</span>
              {counts.total > 0 && (
                <Badge variant="secondary">{counts.total}</Badge>
              )}
            </CardTitle>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={runAnalysis}
                className="flex items-center space-x-1"
              >
                <RefreshCw className="h-4 w-4" />
                <span>분석 실행</span>
              </Button>
              
              {counts.total > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllAlerts}
                  className="flex items-center space-x-1 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>모두 삭제</span>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="all" className="text-xs">
                전체 ({counts.total})
              </TabsTrigger>
              <TabsTrigger value="recent" className="text-xs">
                최근 ({recentAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="critical" className="text-xs">
                중요 ({counts.critical + counts.high})
              </TabsTrigger>
              <TabsTrigger value="investment" className="text-xs">
                투자 ({getAlertsByCategory('investment').length})
              </TabsTrigger>
              <TabsTrigger value="environment" className="text-xs">
                환경 ({getAlertsByCategory('environment').length})
              </TabsTrigger>
              <TabsTrigger value="weather" className="text-xs">
                기상 ({getAlertsByCategory('weather').length})
              </TabsTrigger>
              <TabsTrigger value="system" className="text-xs">
                시스템 ({getAlertsByCategory('system').length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <div className="space-y-3">
                {filteredAlerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>표시할 알림이 없습니다.</p>
                    <p className="text-sm mt-1">
                      시스템이 지속적으로 모니터링하고 있습니다.
                    </p>
                  </div>
                ) : (
                  filteredAlerts.map((alert) => (
                    <AlertItem
                      key={alert.id}
                      alert={alert}
                      onRemove={removeAlert}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* 알림 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">긴급/높음</p>
                <p className="text-lg font-bold">{counts.critical + counts.high}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">보통</p>
                <p className="text-lg font-bold">{counts.medium}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Info className="h-4 w-4 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">낮음</p>
                <p className="text-lg font-bold">{counts.low}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">24시간 내</p>
                <p className="text-lg font-bold">{recentAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
