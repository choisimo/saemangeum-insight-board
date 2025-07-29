import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Calculator, 
  Map, 
  Bell, 
  Settings, 
  User,
  Menu,
  X,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SettingsDialog } from "./SettingsDialog";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navigationItems = [
  { id: "dashboard", label: "대시보드", icon: BarChart3 },
  { id: "simulator", label: "정책시뮬레이션", icon: Calculator },
  { id: "map", label: "공간정보", icon: Map },
  { id: "investment", label: "투자유치보고서", icon: Building2 },
  { id: "alerts", label: "알림", icon: Bell },
];

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

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

          {/* 메인 네비게이션 */}
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "flex items-center space-x-2",
                    activeTab === item.id && "bg-primary text-primary-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                  {item.id === "alerts" && (
                    <Badge variant="destructive" className="ml-1 px-1.5 py-0.5 text-xs">
                      3
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
              setIsUserMenuOpen(true);
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
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "default" : "ghost"}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full justify-start"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  <span>{item.label}</span>
                  {item.id === "alerts" && (
                    <Badge variant="destructive" className="ml-auto px-1.5 py-0.5 text-xs">
                      3
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