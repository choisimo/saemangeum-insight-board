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

  const mapData = data;

  // 카카오맵 스크립트 동적 로드
  const loadKakaoMapScript = (apiKey: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // 기존 스크립트 제거
      if (window.kakao) {
        delete window.kakao;
      }
      
      const existingScripts = document.querySelectorAll('script[src*="dapi.kakao.com"]');
      existingScripts.forEach(script => script.remove());
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&libraries=services&autoload=false`;
      
      script.onload = () => {
        console.log('카카오맵 스크립트 로드 완료');
        
        // autoload=false로 설정했으므로 수동으로 로드
        if (window.kakao && window.kakao.maps) {
          console.log('카카오맵 기본 라이브러리 로드 완료, 수동 로드 시작');
          
          // 카카오맵 라이브러리 수동 로드
          window.kakao.maps.load(() => {
            console.log('카카오맵 라이브러리 수동 로드 완료');
            
            // 짧은 지연 후 객체 확인 (비동기 로딩 대응)
            setTimeout(() => {
              console.log('객체 준비 상태 확인:', {
                LatLng: !!window.kakao.maps.LatLng,
                Map: !!window.kakao.maps.Map,
                Marker: !!window.kakao.maps.Marker,
                InfoWindow: !!window.kakao.maps.InfoWindow,
                event: !!window.kakao.maps.event
              });
              
              // 라이브러리 객체들이 준비되었는지 확인
              if (window.kakao.maps.LatLng && window.kakao.maps.Map && window.kakao.maps.Marker) {
                console.log('모든 카카오맵 객체 로드 완료');
                resolve();
              } else {
                console.error('카카오맵 객체들이 아직 준비되지 않음');
                reject(new Error('카카오맵 라이브러리 객체들이 정상적으로 로드되지 않았습니다.'));
              }
            }, 100);
          });
        } else {
          console.error('카카오맵 기본 라이브러리 로드 실패');
          reject(new Error('카카오맵 라이브러리가 정상적으로 로드되지 않았습니다.'));
        }
      };
      
      script.onerror = (event) => {
        console.error('카카오맵 스크립트 로드 실패:', event);
        const errorMsg = `카카오맵 스크립트 로드 실패. 가능한 원인:
1. API 키가 유효하지 않음
2. 도메인이 등록되지 않음 (${window.location.hostname})
3. 네트워크 연결 문제`;
        reject(new Error(errorMsg));
      };
      
      document.head.appendChild(script);
    });
  };

  // 지도 초기화 함수
  const initializeMap = () => {
    console.log('지도 초기화 시작');
    
    if (!mapContainer.current) {
      console.error('지도 컨테이너가 존재하지 않습니다');
      setError('지도 컨테이너를 찾을 수 없습니다.');
      return;
    }
    
    if (!window.kakao || !window.kakao.maps) {
      console.error('카카오맵 라이브러리가 로드되지 않았습니다');
      setError('카카오맵 라이브러리가 로드되지 않았습니다.');
      return;
    }
    
    console.log('카카오맵 라이브러리 확인 완료, 지도 생성 시작');
    
    try {
      // 지도 옵션 설정
      const options = {
        center: new window.kakao.maps.LatLng(saemangumCenter.lat, saemangumCenter.lng),
        level: 8
      };
      console.log('지도 옵션 설정 완료:', options);
      
      // 지도 생성
      console.log('지도 생성 시도, 컨테이너:', mapContainer.current);
      const kakaoMap = new window.kakao.maps.Map(mapContainer.current, options);
      console.log('지도 생성 성공:', kakaoMap);
      
      setMap(kakaoMap);
      setIsLoaded(true);
      setError(null);
      
      console.log('마커 추가 시작, 데이터 개수:', mapData.length);
      
      // 마커 추가
      mapData.forEach((item, index) => {
        try {
          console.log(`마커 ${index + 1} 생성 시작:`, item.name);
          
          const markerPosition = new window.kakao.maps.LatLng(item.lat, item.lng);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition
          });
          marker.setMap(kakaoMap);
          
          console.log(`마커 ${index + 1} 생성 완료`);
          
          const infowindow = new window.kakao.maps.InfoWindow({
            content: `
              <div style="padding:15px; min-width:250px; max-width:350px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; position: relative;">
                <button onclick="this.parentElement.parentElement.parentElement.style.display='none'" style="position: absolute; top: 8px; right: 8px; background: #f3f4f6; border: none; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 14px; color: #6b7280; hover:background: #e5e7eb;" title="닫기">×</button>
                <div style="border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-bottom: 12px; padding-right: 20px;">
                  <h4 style="margin:0; font-size:16px; font-weight:bold; color:#1f2937; line-height:1.4;">${item.name}</h4>
                  <div style="margin-top: 4px;">
                    <span style="display: inline-block; background: ${item.type === 'investment' ? '#3b82f6' : item.type === 'renewable' ? '#10b981' : '#8b5cf6'}; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">
                      ${item.type === 'investment' ? '🏢 투자' : item.type === 'renewable' ? '⚡ 에너지' : '🏗️ 인프라'}
                    </span>
                  </div>
                </div>
                <p style="margin:0 0 8px 0; font-size:13px; color:#6b7280; line-height:1.5;">${item.description}</p>
                ${item.value ? `
                  <div style="background: #f3f4f6; padding: 8px 12px; border-radius: 8px; margin-top: 8px;">
                    <p style="margin:0; font-size:14px; color:#1f2937; font-weight:600; text-align: center;">${item.value}</p>
                  </div>
                ` : ''}
                <div style="margin-top: 10px; text-align: center;">
                  <small style="color: #9ca3af; font-size: 11px;">📍 새만금 개발사업</small>
                </div>
              </div>
            `
          });
          
          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.open(kakaoMap, marker);
          });
          
          console.log(`마커 ${index + 1} 이벤트 리스너 추가 완료`);
        } catch (markerError) {
          console.error(`마커 ${index + 1} 생성 오류:`, markerError);
          console.error('마커 데이터:', item);
        }
      });
      
      console.log('지도 초기화 완전히 완료');
      
    } catch (mapError) {
      console.error('지도 생성 오류 (상세):', {
        message: mapError.message,
        stack: mapError.stack,
        name: mapError.name,
        error: mapError
      });
      
      // 오류 타입별 메시지 설정
      let errorMessage = '지도를 생성하는 중 오류가 발생했습니다.';
      
      if (mapError.message && mapError.message.includes('Invalid API key')) {
        errorMessage = 'API 키가 유효하지 않습니다. 카카오 개발자 콘솔에서 확인해주세요.';
      } else if (mapError.message && mapError.message.includes('domain')) {
        errorMessage = '도메인이 등록되지 않았습니다. 카카오 개발자 콘솔에서 도메인을 등록해주세요.';
      } else if (mapError.message && mapError.message.includes('quota')) {
        errorMessage = 'API 사용량 한도를 초과했습니다.';
      }
      
      setError(errorMessage);
      setIsLoaded(false);
    }
  };

  // API 키 유효성 검증
  const validateApiKey = (apiKey: string): { isValid: boolean; message?: string } => {
    if (!apiKey || apiKey.trim() === '') {
      return { isValid: false, message: 'API 키가 비어있습니다.' };
    }
    
    if (apiKey === 'your_kakao_javascript_api_key_here') {
      return { isValid: false, message: '예시 API 키를 사용하고 있습니다. 실제 API 키를 입력해주세요.' };
    }
    
    // 카카오 JavaScript API 키 형식 검증 (32자 16진수)
    const kakaoKeyPattern = /^[a-f0-9]{32}$/i;
    if (!kakaoKeyPattern.test(apiKey)) {
      return { 
        isValid: false, 
        message: '잘못된 API 키 형식입니다. 카카오 JavaScript API 키는 32자 16진수여야 합니다.' 
      };
    }
    
    return { isValid: true };
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
          console.log('저장된 API 키 발견:', apiKey ? `${apiKey.substring(0, 8)}...` : '없음');
        } catch (error) {
          console.error('설정 로드 실패:', error);
        }
      }
      
      // 2. 환경변수에서 API 키 확인 (fallback)
      if (!apiKey) {
        apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY || '';
        if (apiKey) {
          console.log('환경변수에서 API 키 사용:', `${apiKey.substring(0, 8)}...`);
        }
      }
      
      // 3. API 키 유효성 검증
      const validation = validateApiKey(apiKey);
      if (!validation.isValid) {
        console.log('API 키 유효성 검증 실패:', validation.message);
        setHasApiKey(false);
        setError(validation.message || '유효하지 않은 API 키입니다.');
        return;
      }
      
      console.log('API 키 유효성 검증 통과, 스크립트 로드 시작...');
      
      // 4. 카카오맵 스크립트 로드
      try {
        await loadKakaoMapScript(apiKey);
        console.log('스크립트 로드 성공');
        
        // 5. 지도 초기화
        setTimeout(() => {
          if (window.kakao && window.kakao.maps) {
            initializeMap();
            setHasApiKey(true);
            console.log('카카오맵 로드 완료!');
          } else {
            console.error('카카오맵 라이브러리 객체가 없음');
            setError('카카오맵 라이브러리 로드 실패');
            setHasApiKey(false);
          }
        }, 100);
        
      } catch (scriptError) {
        console.error('스크립트 로드 실패:', scriptError);
        setError(scriptError instanceof Error ? scriptError.message : '카카오맵 스크립트 로드에 실패했습니다.');
        setHasApiKey(false);
      }
      
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
    const isScriptLoadError = error && error.includes('스크립트 로드 실패');
    
    return (
      <div className="w-full" style={{ height }}>
        <Alert className="h-full flex flex-col justify-center">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="mt-2">
            <div className="space-y-4">
              <div>
                <p className="font-medium text-red-600">
                  {error || '카카오맵 API 키가 설정되지 않았습니다.'}
                </p>
                {isScriptLoadError && (
                  <p className="text-sm text-muted-foreground mt-2">
                    현재 도메인: <code className="bg-muted px-1 rounded">{window.location.hostname}:{window.location.port}</code>
                  </p>
                )}
              </div>
              
              {isScriptLoadError ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-yellow-800 mb-2">필수 설정 확인 사항:</p>
                  <ol className="text-xs text-yellow-700 space-y-1 list-decimal list-inside">
                    <li>카카오 개발자 콘솔에서 <strong>웹 플랫폼</strong> 등록 확인</li>
                    <li>사이트 도메인에 <code>localhost</code>, <code>127.0.0.1</code> 등록</li>
                    <li><strong>JavaScript 키</strong> 사용 확인 (REST API 키 아님)</li>
                    <li>API 키 활성화 상태 확인</li>
                  </ol>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  카카오 개발자 센터에서 JavaScript API 키를 발급받아 설정에서 입력해주세요.
                </p>
              )}
              
              <div className="flex flex-wrap gap-2">
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
                
                {isScriptLoadError ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    asChild
                  >
                    <a 
                      href="https://developers.kakao.com/console/app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      콘솔에서 설정 확인
                    </a>
                  </Button>
                ) : (
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
                )}
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
          </div>
        </div>
      )}
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg border"
        style={{ height }}
      />
    </div>
  );
}
