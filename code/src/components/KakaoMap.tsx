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
        setHasApiKey(false);
        setError(validation.message || '유효하지 않은 API 키입니다.');
        setIsLoading(false);
        return;
      }
      
      console.log('API 키 유효성 검증 통과, 스크립트 로드 시작...');
      
      // 4. 카카오맵 스크립트 로드
      await loadKakaoMapScript(apiKey);
      
      // 5. 지도 초기화
      setTimeout(() => {
        if (window.kakao && window.kakao.maps) {
          initializeMap();
          setHasApiKey(true);
          console.log('카카오맵 로드 완료!');
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
