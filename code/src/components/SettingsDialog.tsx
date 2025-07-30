import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Settings, 
  Key, 
  Database, 
  Bell, 
  Palette, 
  Shield, 
  Save, 
  RotateCcw,
  AlertTriangle,
  Info,
  ExternalLink
} from 'lucide-react';
import { useToast } from './ui/use-toast';

interface SettingsConfig {
  // API 설정
  kakaoMapApiKey: string;
  kakaoMapAppKey: string;
  dataApiBaseUrl: string;
  apiServiceKey: string;
  apiTimeout: number;
  apiRetryCount: number;
  cacheDuration: number;
  refreshInterval: number;
  
  // 환경 설정
  appEnv: 'development' | 'production' | 'staging';
  debugMode: boolean;
  dataQualityThreshold: number;
  
  // 지도 좌표 설정
  defaultLat: number;
  defaultLng: number;
  
  // 애플리케이션 메타데이터
  appName: string;
  appVersion: string;
  appDescription: string;
  
  // 외부 서비스
  analyticsId: string;
  sentryDsn: string;
  
  // 알림 설정
  enableNotifications: boolean;
  alertThresholds: {
    investment: number;
    employment: number;
    complaints: number;
  };
  
  // UI 설정
  theme: 'light' | 'dark' | 'system';
  language: 'ko' | 'en';
  compactMode: boolean;
  
  // 데이터 설정
  dataRetentionDays: number;
  enableDataValidation: boolean;
}

const defaultSettings: SettingsConfig = {
  kakaoMapApiKey: '',
  kakaoMapAppKey: '',
  dataApiBaseUrl: 'https://api.data.go.kr/openapi/tn_pubr_public_saemangeum_api',
  apiServiceKey: '',
  apiTimeout: 30000,
  apiRetryCount: 3,
  cacheDuration: 300000,
  refreshInterval: 300000,
  
  appEnv: 'development',
  debugMode: true,
  dataQualityThreshold: 80,
  
  defaultLat: 35.7983,
  defaultLng: 126.7041,
  
  appName: '새만금 인사이트 대시보드',
  appVersion: '1.0.0',
  appDescription: '새만금개발청 공공데이터 기반 통합 대시보드',
  
  analyticsId: '',
  sentryDsn: '',
  
  enableNotifications: true,
  alertThresholds: {
    investment: 1000,
    employment: 100,
    complaints: 50
  },
  theme: 'system',
  language: 'ko',
  compactMode: false,
  dataRetentionDays: 30,
  enableDataValidation: true
};

interface SettingsDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SettingsDialog({ trigger, open, onOpenChange }: SettingsDialogProps) {
  const [settings, setSettings] = useState<SettingsConfig>(defaultSettings);
  const [isLoading, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('saemangeum-settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('설정 로드 실패:', error);
      toast({
        title: "설정 로드 실패",
        description: "기본 설정을 사용합니다.",
        variant: "destructive",
      });
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      localStorage.setItem('saemangeum-settings', JSON.stringify(settings));
      
      const currentKey = localStorage.getItem('kakao-api-key');
      if (currentKey !== settings.kakaoMapApiKey) {
        localStorage.setItem('kakao-api-key', settings.kakaoMapApiKey);
      }
      
      setHasChanges(false);
      toast({
        title: "설정 저장 완료",
        description: "설정이 성공적으로 저장되었습니다.",
      });
      
      if (currentKey !== settings.kakaoMapApiKey && settings.kakaoMapApiKey) {
        toast({
          title: "페이지 새로고침 권장",
          description: "지도 API 키 변경사항을 적용하려면 페이지를 새로고침해주세요.",
          action: (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
            >
              새로고침
            </Button>
          ),
        });
      }
    } catch (error) {
      console.error('설정 저장 실패:', error);
      toast({
        title: "설정 저장 실패",
        description: "설정을 저장하는 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    toast({
      title: "설정 초기화",
      description: "모든 설정이 기본값으로 초기화되었습니다.",
    });
  };

  const updateSetting = <K extends keyof SettingsConfig>(
    key: K, 
    value: SettingsConfig[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const updateAlertThreshold = (type: keyof SettingsConfig['alertThresholds'], value: number) => {
    setSettings(prev => ({
      ...prev,
      alertThresholds: {
        ...prev.alertThresholds,
        [type]: value
      }
    }));
    setHasChanges(true);
  };

  const testKakaoApiKey = async () => {
    if (!settings.kakaoMapApiKey) {
      toast({
        title: "API 키 없음",
        description: "테스트할 API 키를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (settings.kakaoMapApiKey.length < 10) {
        throw new Error('API 키 형식이 올바르지 않습니다.');
      }

      toast({
        title: "API 키 테스트",
        description: "API 키가 유효한 형식입니다. 실제 동작은 지도에서 확인해주세요.",
      });
    } catch (error) {
      toast({
        title: "API 키 테스트 실패",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>시스템 설정</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="api" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="api" className="flex items-center space-x-2">
              <Key className="h-4 w-4" />
              <span>API 설정</span>
            </TabsTrigger>
            <TabsTrigger value="env" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>환경 설정</span>
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>알림 설정</span>
            </TabsTrigger>
            <TabsTrigger value="ui" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span>UI 설정</span>
            </TabsTrigger>
            <TabsTrigger value="data" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>데이터 설정</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Key className="h-4 w-4" />
                  <span>외부 API 설정</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="kakao-api-key">카카오맵 API 키</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="kakao-api-key"
                      type="password"
                      placeholder="카카오맵 JavaScript API 키를 입력하세요"
                      value={settings.kakaoMapApiKey}
                      onChange={(e) => updateSetting('kakaoMapApiKey', e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      onClick={testKakaoApiKey}
                      disabled={!settings.kakaoMapApiKey}
                    >
                      테스트
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-service-key">공공데이터 API 서비스 키</Label>
                  <Input
                    id="api-service-key"
                    type="password"
                    placeholder="data.go.kr에서 발급받은 서비스 키를 입력하세요"
                    value={settings.apiServiceKey}
                    onChange={(e) => updateSetting('apiServiceKey', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-base-url">공공데이터 API 기본 URL</Label>
                  <Input
                    id="api-base-url"
                    value={settings.dataApiBaseUrl}
                    onChange={(e) => updateSetting('dataApiBaseUrl', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="env" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>환경 및 성능 설정</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>환경 모드</Label>
                  <div className="flex space-x-2">
                    {(['development', 'production', 'staging'] as const).map((env) => (
                      <Button
                        key={env}
                        variant={settings.appEnv === env ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateSetting('appEnv', env)}
                      >
                        {env === 'development' ? '개발' : env === 'production' ? '운영' : '스테이징'}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>디버그 모드</Label>
                    <p className="text-sm text-muted-foreground">
                      개발 도구 및 디버그 정보를 표시합니다.
                    </p>
                  </div>
                  <Switch
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => updateSetting('debugMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>알림 및 임계값 설정</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>알림 활성화</Label>
                    <p className="text-sm text-muted-foreground">
                      시스템 알림을 받을지 설정합니다.
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableNotifications}
                    onCheckedChange={(checked) => updateSetting('enableNotifications', checked)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="investment-threshold">투자 임계값 (억원)</Label>
                    <Input
                      id="investment-threshold"
                      type="number"
                      min="0"
                      value={settings.alertThresholds.investment}
                      onChange={(e) => updateAlertThreshold('investment', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="employment-threshold">고용 임계값 (명)</Label>
                    <Input
                      id="employment-threshold"
                      type="number"
                      min="0"
                      value={settings.alertThresholds.employment}
                      onChange={(e) => updateAlertThreshold('employment', parseInt(e.target.value))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="complaints-threshold">민원 임계값 (건)</Label>
                    <Input
                      id="complaints-threshold"
                      type="number"
                      min="0"
                      value={settings.alertThresholds.complaints}
                      onChange={(e) => updateAlertThreshold('complaints', parseInt(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ui" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-4 w-4" />
                  <span>사용자 인터페이스 설정</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>테마 설정</Label>
                  <div className="flex space-x-2">
                    {(['light', 'dark', 'system'] as const).map((theme) => (
                      <Button
                        key={theme}
                        variant={settings.theme === theme ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateSetting('theme', theme)}
                      >
                        {theme === 'light' ? '라이트' : theme === 'dark' ? '다크' : '시스템'}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>언어 설정</Label>
                  <div className="flex space-x-2">
                    {(['ko', 'en'] as const).map((lang) => (
                      <Button
                        key={lang}
                        variant={settings.language === lang ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => updateSetting('language', lang)}
                      >
                        {lang === 'ko' ? '한국어' : 'English'}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>컴팩트 모드</Label>
                    <p className="text-sm text-muted-foreground">
                      UI 요소들을 더 작게 표시합니다.
                    </p>
                  </div>
                  <Switch
                    checked={settings.compactMode}
                    onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span>데이터 관리 설정</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="data-retention">데이터 보관 기간 (일)</Label>
                  <Input
                    id="data-retention"
                    type="number"
                    min="1"
                    max="365"
                    value={settings.dataRetentionDays}
                    onChange={(e) => updateSetting('dataRetentionDays', parseInt(e.target.value))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>데이터 유효성 검증</Label>
                    <p className="text-sm text-muted-foreground">
                      받아온 데이터의 유효성을 검증합니다.
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableDataValidation}
                    onCheckedChange={(checked) => updateSetting('enableDataValidation', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            {hasChanges && (
              <Badge variant="outline" className="text-warning">
                <AlertTriangle className="h-3 w-3 mr-1" />
                저장되지 않은 변경사항
              </Badge>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={resetSettings}
              disabled={isLoading}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              초기화
            </Button>
            <Button
              onClick={saveSettings}
              disabled={isLoading || !hasChanges}
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              저장
            </Button>
          </div>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            설정 변경사항은 즉시 적용되며, 일부 설정은 페이지 새로고침이 필요할 수 있습니다.
            카카오맵 API 키는 안전하게 브라우저 로컬 스토리지에 저장됩니다.
          </AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  );
}