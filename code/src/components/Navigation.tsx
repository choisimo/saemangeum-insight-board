import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Bell, 
  Settings, 
  User,
  Menu,
  X,
  FileText,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsDialog } from "./SettingsDialog";
import { useAlertStatus } from "@/hooks/use-alerts";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

// 핵심 메인 페이지만 상단 네비게이션에 포함
const navigationItems = [
  { id: "dashboard", label: "대시보드", icon: BarChart3, description: "종합 현황 및 KPI" },
  { id: "reports", label: "보고서", icon: FileText, description: "상세 분석 보고서" },
  { id: "monitoring", label: "모니터링", icon: Activity, description: "실시간 모니터링" },
  { id: "alerts", label: "알림", icon: Bell, description: "시스템 알림" },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { hasUnreadAlerts, hasCriticalAlerts, totalCount } = useAlertStatus();

  // 네비게이션 핸들러 - 세부 기능들을 적절한 탭으로 매핑
  const handleNavigation = (itemId: string) => {
    switch (itemId) {
      case 'dashboard':
        onTabChange('dashboard');
        break;
      case 'reports':
        // 보고서 섹션 - 투자유치보고서를 기본으로
        onTabChange('investment');
        break;
      case 'monitoring':
        // 모니터링 섹션 - 모니터링 탭으로 직접 이동
        onTabChange('monitoring');
        break;
      case 'alerts':
        onTabChange('alerts');
        break;
      default:
        onTabChange(itemId);
    }
  };

  return (
    <>
      {/* 데스크톱 네비게이션 */}
      <nav className="hidden md:flex items-center justify-between p-4 bg-card border-b border-border">
        <div className="flex items-center space-x-6">
          {/* 로고 */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">새</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">새만금 정책 대시보드</h1>
              <p className="text-xs text-muted-foreground">Saemangeum Policy Dashboard</p>
            </div>
          </div>

          {/* 메인 네비게이션 - 핵심 기능만 */}
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || 
                (item.id === 'reports' && ['investment', 'environment'].includes(activeTab)) ||
                (item.id === 'monitoring' && ['monitoring', 'map', 'simulator'].includes(activeTab));
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => handleNavigation(item.id)}
                  className={cn(
                    "flex items-center space-x-2 relative",
                    isActive && "bg-primary text-primary-foreground"
                  )}
                  title={item.description}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.id === "alerts" && hasUnreadAlerts && (
                    <Badge 
                      variant={hasCriticalAlerts ? "destructive" : "secondary"} 
                      className="ml-1 px-1.5 py-0.5 text-xs"
                    >
                      {totalCount}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* 사용자 메뉴 */}
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
            실시간 연결됨
          </Badge>
          <SettingsDialog 
            open={isSettingsOpen} 
            onOpenChange={setIsSettingsOpen}
            trigger={
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            }
          />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              // TODO: 사용자 프로필 메뉴 구현
              alert('사용자 프로필 기능이 곧 추가될 예정입니다.');
            }}
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* 모바일 네비게이션 */}
      <nav className="md:hidden">
        {/* 모바일 헤더 */}
        <div className="flex items-center justify-between p-4 bg-card border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-primary to-secondary rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">새</span>
            </div>
            <h1 className="font-bold text-base text-foreground">새만금</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <SettingsDialog 
              open={isSettingsOpen} 
              onOpenChange={setIsSettingsOpen}
              trigger={
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              }
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMobileMenuOpen && (
          <div className="bg-card border-b border-border p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || 
                (item.id === 'reports' && ['investment', 'environment'].includes(activeTab)) ||
                (item.id === 'monitoring' && ['monitoring', 'map', 'simulator'].includes(activeTab));
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  onClick={() => {
                    handleNavigation(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                  title={item.description}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span>{item.label}</span>
                  <span className="text-xs text-muted-foreground ml-2">{item.description}</span>
                  {item.id === "alerts" && hasUnreadAlerts && (
                    <Badge 
                      variant={hasCriticalAlerts ? "destructive" : "secondary"} 
                      className="ml-auto px-1.5 py-0.5 text-xs"
                    >
                      {totalCount}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
}