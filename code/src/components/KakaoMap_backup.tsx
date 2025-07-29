import React, { useRef, useEffect, useState } from 'react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Settings, AlertTriangle, MapPin, RefreshCw } from 'lucide-react';

// 카카오맵 타입 정의
declare global {
  interface Window {
    kakao: any;
  }
}

interface MapData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'investment' | 'renewable' | 'infrastructure';
  description: string;
  value?: string;
}

interface KakaoMapProps {
  data?: MapData[];
  height?: string;
}

export function KakaoMap({ data = [], height = "400px" }: KakaoMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 새만금 중심 좌표
  const saemangumCenter = {
    lat: 35.7983,
    lng: 126.7041
  };

  // 샘플 데이터 (실제 새만금 지역 좌표)
  const sampleData: MapData[] = [
    {
      id: 'inv-1',
      name: '새만금 태양광 발전소',
      lat: 35.7700,
      lng: 126.5500,
      type: 'renewable',
      description: '300MW 태양광 발전 시설',
      value: '300MW'
    },
    {
      id: 'inv-2', 
      name: '새만금 산업단지',
      lat: 35.7600,
      lng: 126.5600,
      type: 'investment',
      description: '제조업 투자유치 지역',
      value: '1,500억원'
    },
    {
      id: 'inf-1',
      name: '새만금 신항만',
      lat: 35.7650,
      lng: 126.5450,
      type: 'infrastructure',
      description: '물류 허브 항만 시설',
      value: '완공 예정'
    }
  ];

  const mapData = data.length > 0 ? data : sampleData;

  // 카카오맵 스크립트 동적 로드
  const loadKakaoMapScript = (apiKey: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 기존 스크립트 제거
      const existingScript = document.querySelector('script[src*="dapi.kakao.com"]');
      if (existingScript) {
        existingScript.remove();
      }

      // 새 스크립트 생성
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services`;
      script.onload = () => {
        console.log('카카오맵 스크립트 로드 완료');
        resolve();
      };
      script.onerror = () => {
        console.error('카카오맵 스크립트 로드 실패');
        reject(new Error('카카오맵 스크립트 로드 실패'));
      };
      
      document.head.appendChild(script);
    });
  };

  // 지도 초기화 함수
  const initializeMap = () => {
    if (window.kakao && window.kakao.maps && mapContainer.current) {
      try {
        window.kakao.maps.load(() => {
          const options = {
            center: new window.kakao.maps.LatLng(saemangumCenter.lat, saemangumCenter.lng),
            level: 8
          };
          const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
          setMap(kakaoMap);
          setIsLoaded(true);
          setError(null);

          // 마커 추가
          mapData.forEach((item) => {
            const markerPosition = new window.kakao.maps.LatLng(item.lat, item.lng);
            const marker = new window.kakao.maps.Marker({
              position: markerPosition
            });
            marker.setMap(kakaoMap);

            const infowindow = new window.kakao.maps.InfoWindow({
              content: `
                <div style="padding:10px; min-width:200px;">
                  <h4 style="margin:0 0 5px 0; font-size:14px; font-weight:bold;">${item.name}</h4>
                  <p style="margin:0 0 5px 0; font-size:12px; color:#666;">${item.description}</p>
                  ${item.value ? `<p style="margin:0; font-size:12px; color:#0066cc; font-weight:bold;">${item.value}</p>` : ''}
                </div>
              `
            });

            window.kakao.maps.event.addListener(marker, 'click', () => {
              infowindow.open(kakaoMap, marker);
            });
          });
        });
      } catch (err) {
        console.error('카카오맵 초기화 오류:', err);
        setError('지도를 로드하는 중 오류가 발생했습니다.');
        setIsLoaded(false);
      }
    }
  };

  // API 키 확인 및 스크립트 로드
  const checkAndLoadKakaoMap = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // 1. 설정에서 저장된 API 키 확인
      const savedSettings = localStorage.getItem('saemangeum-settings');
      let apiKey = '';
      
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings);
          apiKey = settings.kakaoMapApiKey?.trim() || '';
        } catch (error) {
          console.error('설정 로드 실패:', error);
        }
      }
      
      // 2. 환경변수에서 API 키 확인 (fallback)
      if (!apiKey) {
        apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY || '';
      }
      
      if (!apiKey || apiKey === 'your_kakao_javascript_api_key_here') {
        setHasApiKey(false);
        setError('카카오맵 API 키가 설정되지 않았습니다. 설정에서 API 키를 입력해주세요.');
        setIsLoading(false);
        return;
      }
      
      // 3. 카카오맵 스크립트 로드
      await loadKakaoMapScript(apiKey);
      
      // 4. 지도 초기화
      setTimeout(() => {
        if (window.kakao && window.kakao.maps) {
          initializeMap();
          setHasApiKey(true);
        } else {
          throw new Error('카카오맵 라이브러리 로드 실패');
        }
      }, 100);
      
    } catch (error) {
      console.error('카카오맵 로드 오류:', error);
      setError(error instanceof Error ? error.message : '카카오맵을 로드하는 중 오류가 발생했습니다.');
      setHasApiKey(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 카카오맵 로드
  useEffect(() => {
    checkAndLoadKakaoMap();
  }, []);

  // 설정 변경 감지를 위한 이벤트 리스너
  useEffect(() => {
    const handleStorageChange = () => {
      checkAndLoadKakaoMap();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!hasApiKey || error) {
    return (
      <div className="w-full" style={{ height }}>
        <Alert className="h-full flex flex-col justify-center">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="mt-2">
            <div className="space-y-3">
              <p className="font-medium">
                {error || '카카오맵 API 키가 설정되지 않았습니다.'}
              </p>
              <p className="text-sm text-muted-foreground">
                카카오 개발자 센터에서 JavaScript API 키를 발급받아 설정에서 입력해주세요.
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={checkAndLoadKakaoMap}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3 w-3 mr-1" />
                  )}
                  다시 시도
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                >
                  <a 
                    href="https://developers.kakao.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    API 키 발급받기
                  </a>
                </Button>
              </div>
              
              {/* 샘플 데이터 표시 */}
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  새만금 지역 주요 시설 (샘플 데이터)
                </p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  {sampleData.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full" style={{ height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span className="text-sm">지도를 로드하는 중...</span>
                      <div>새만금 태양광</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded border">
                      <Building2 className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                      <div>산업단지</div>
                    </div>
                    <div className="p-2 bg-purple-50 rounded border">
                      <MapPin className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                      <div>신항만</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {hasApiKey && error && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-center p-6">
                  <Info className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">지도 로드 오류</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
              </div>
            )}
            {hasApiKey && !error && !isLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted/50 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">지도 로딩 중...</p>
                </div>
              </div>
            )}
          </div>

          {/* 지도 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mapData.map((item) => (
              <div key={item.id} className="p-3 border rounded-lg">
                <div className="flex items-start space-x-2">
                  {getMarkerIcon(item.type)}
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                    {item.value && (
                      <p className="text-xs font-medium text-primary mt-1">{item.value}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
