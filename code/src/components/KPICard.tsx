import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  target?: number;
  progress?: number;
  icon?: React.ReactNode;
  className?: string;
  actualValue?: number; // 실제 진행된 값
  remainingValue?: number; // 남은 값
}

export function KPICard({
  title,
  value,
  unit = "",
  change,
  changeType = 'neutral',
  target,
  progress,
  icon,
  className,
  actualValue,
  remainingValue
}: KPICardProps) {
  const getTrendIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'decrease':
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-success';
      case 'decrease':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105",
      "bg-gradient-to-br from-card to-card/80",
      "border-l-4 border-l-primary",
      className
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          {title}
          {icon && (
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {unit && (
            <span className="text-sm text-muted-foreground font-medium">
              {unit}
            </span>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          {change !== undefined && (
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span className={cn("text-sm font-medium", getTrendColor())}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-muted-foreground">
                전년 대비
              </span>
            </div>
          )}
          
          {target && progress !== undefined && (
            <Badge variant="outline" className="ml-auto">
              목표 달성률 {progress}%
            </Badge>
          )}
        </div>

        {/* 투자액 상세 정보 */}
        {actualValue !== undefined && remainingValue !== undefined && (
          <div className="mt-3 p-3 bg-muted/30 rounded-lg">
            <div className="text-xs text-muted-foreground mb-2">투자 진행 현황</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">진행된 투자액</span>
                <span className="text-sm font-medium text-success">{actualValue.toLocaleString()}{unit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">남은 투자액</span>
                <span className="text-sm font-medium text-warning">{remainingValue.toLocaleString()}{unit}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-success to-success/80 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((actualValue / (actualValue + remainingValue)) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {target && progress !== undefined && !actualValue && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>진행률</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}