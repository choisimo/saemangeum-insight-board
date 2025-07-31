/**
 * 업데이트된 Real API Service 테스트
 * 실제 기상청 API와 확장된 모킹 데이터 테스트
 */

import fetch from 'node-fetch';

// Node.js 환경에서 fetch 글로벌 설정
global.fetch = fetch;

// 환경변수 설정 (실제 API 키 사용)
process.env.VITE_API_SERVICE_KEY = '24V+3U7csvpfyBFjHAACEmoeerfMjNuyKpC5yJYDRi4PdYQ/Hh7gNWS4Nzw3yjCOPXtgCsQEtA3KHIE08sYxig==';

// 실제 RealApiService import 시뮬레이션
class TestRealApiService {
  constructor() {
    this.API_SERVICE_KEY = process.env.VITE_API_SERVICE_KEY || '';
    this.WEATHER_API_URL = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
    this.SAEMANGEUM_COORDS = { nx: 54, ny: 74 };
  }

  async callWeatherApi() {
    if (!this.API_SERVICE_KEY) {
      console.warn('기상청 API 키가 설정되지 않았습니다.');
      return null;
    }

    try {
      const now = new Date();
      const baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
      const baseTime = '0500';

      const url = new URL(this.WEATHER_API_URL);
      url.searchParams.append('serviceKey', encodeURIComponent(this.API_SERVICE_KEY));
      url.searchParams.append('dataType', 'JSON');
      url.searchParams.append('base_date', baseDate);
      url.searchParams.append('base_time', baseTime);
      url.searchParams.append('nx', String(this.SAEMANGEUM_COORDS.nx));
      url.searchParams.append('ny', String(this.SAEMANGEUM_COORDS.ny));
      url.searchParams.append('numOfRows', '50');
      url.searchParams.append('pageNo', '1');

      console.log(`기상청 API 호출: ${url.toString()}`);

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        console.log('기상청 API 응답 상태:', data.response?.header);
        
        if (data.response?.header?.resultCode === '00') {
          return data.response?.body?.items?.item || [];
        } else {
          console.warn('기상청 API 응답 코드:', data.response?.header?.resultCode, data.response?.header?.resultMsg);
        }
      } else {
        console.error('기상청 API HTTP 오류:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('기상청 API 오류:', error.message);
    }
    return null;
  }

  getWeatherCategoryName(code) {
    const categories = {
      'TMP': '기온',
      'UUU': '동서바람성분',
      'VVV': '남북바람성분',
      'REH': '습도',
      'PTY': '강수형태',
      'VEC': '풍향',
      'WSD': '풍속',
      'SKY': '하늘상태',
      'POP': '강수확률',
      'PCP': '강수량'
    };
    return categories[code] || code;
  }

  getWeatherUnit(category) {
    const units = {
      'TMP': '°C',
      'REH': '%',
      'WSD': 'm/s',
      'VEC': '°',
      'PCP': 'mm',
      'POP': '%',
      'SKY': '',
      'PTY': ''
    };
    return units[category] || '';
  }

  getSkyConditionText(skyCode) {
    const skyConditions = {
      '1': '맑음',
      '3': '구름많음', 
      '4': '흐림'
    };
    return skyConditions[skyCode] || '맑음';
  }

  async getEnhancedWeatherData() {
    try {
      const weatherData = await this.callWeatherApi();
      
      if (weatherData && weatherData.length > 0) {
        const currentWeather = {
          temperature: weatherData.find(item => item.category === 'TMP')?.fcstValue || '22',
          humidity: weatherData.find(item => item.category === 'REH')?.fcstValue || '65',
          windSpeed: weatherData.find(item => item.category === 'WSD')?.fcstValue || '3.2',
          windDirection: weatherData.find(item => item.category === 'VEC')?.fcstValue || '225',
          precipitation: weatherData.find(item => item.category === 'PCP')?.fcstValue || '강수없음',
          skyCondition: weatherData.find(item => item.category === 'SKY')?.fcstValue || '1',
          precipitationProbability: weatherData.find(item => item.category === 'POP')?.fcstValue || '20'
        };

        return {
          current: currentWeather,
          forecast: weatherData.slice(0, 10).map(item => ({
            time: item.fcstTime,
            date: item.fcstDate,
            category: this.getWeatherCategoryName(item.category),
            value: item.fcstValue,
            unit: this.getWeatherUnit(item.category)
          }))
        };
      }
      
      return null;
    } catch (error) {
      console.error('확장 기상 데이터 조회 실패:', error);
      return null;
    }
  }

  async getWeatherData() {
    try {
      console.log('새만금 기상 데이터 조회 중...');
      
      const enhancedWeatherData = await this.getEnhancedWeatherData();
      
      if (enhancedWeatherData) {
        console.log(`기상청 API에서 실시간 데이터 수신`);
        
        const today = new Date();
        const baseDate = today.toISOString().slice(0, 10).replace(/-/g, '');
        const baseTime = '0500';
        
        return {
          baseDate,
          baseTime,
          current: enhancedWeatherData.current,
          observations: [
            { 
              category: '기온', 
              obsrValue: `${enhancedWeatherData.current.temperature}°C`, 
              nx: String(this.SAEMANGEUM_COORDS.nx), 
              ny: String(this.SAEMANGEUM_COORDS.ny) 
            },
            { 
              category: '습도', 
              obsrValue: `${enhancedWeatherData.current.humidity}%`, 
              nx: String(this.SAEMANGEUM_COORDS.nx), 
              ny: String(this.SAEMANGEUM_COORDS.ny) 
            },
            { 
              category: '풍속', 
              obsrValue: `${enhancedWeatherData.current.windSpeed}m/s`, 
              nx: String(this.SAEMANGEUM_COORDS.nx), 
              ny: String(this.SAEMANGEUM_COORDS.ny) 
            },
            { 
              category: '강수량', 
              obsrValue: enhancedWeatherData.current.precipitation, 
              nx: String(this.SAEMANGEUM_COORDS.nx), 
              ny: String(this.SAEMANGEUM_COORDS.ny) 
            },
            { 
              category: '강수확률', 
              obsrValue: `${enhancedWeatherData.current.precipitationProbability}%`, 
              nx: String(this.SAEMANGEUM_COORDS.nx), 
              ny: String(this.SAEMANGEUM_COORDS.ny) 
            },
            { 
              category: '하늘상태', 
              obsrValue: this.getSkyConditionText(enhancedWeatherData.current.skyCondition), 
              nx: String(this.SAEMANGEUM_COORDS.nx), 
              ny: String(this.SAEMANGEUM_COORDS.ny) 
            }
          ],
          forecast: enhancedWeatherData.forecast
        };
      }
      
      return null;
    } catch (error) {
      console.error('기상 데이터 조회 실패:', error);
      return null;
    }
  }

  getTrafficMultiplier(hour) {
    if (hour >= 7 && hour <= 9) return 1.4;
    if (hour >= 12 && hour <= 13) return 1.2;
    if (hour >= 18 && hour <= 20) return 1.5;
    if (hour >= 22 || hour <= 5) return 0.3;
    return 1.0;
  }

  async getTrafficData() {
    try {
      console.log('새만금 교통량 데이터 생성 중...');
      
      const currentDate = new Date();
      const dateStr = currentDate.toISOString().slice(0, 10);
      const currentHour = currentDate.getHours();
      const trafficMultiplier = this.getTrafficMultiplier(currentHour);
      
      const trafficData = [
        {
          id: 'traffic_1',
          departure: '전주',
          destination: '새만금산업단지',
          smallVehicles: Math.round(12850 * trafficMultiplier),
          largeVehicles: Math.round(2570 * trafficMultiplier),
          totalTraffic: Math.round(15420 * trafficMultiplier),
          surveyDate: dateStr,
          timeSlot: `${String(currentHour).padStart(2, '0')}:00-${String(currentHour + 1).padStart(2, '0')}:00`
        },
        {
          id: 'traffic_2',
          departure: '군산',
          destination: '새만금대교',
          smallVehicles: Math.round(7450 * trafficMultiplier),
          largeVehicles: Math.round(1480 * trafficMultiplier),
          totalTraffic: Math.round(8930 * trafficMultiplier),
          surveyDate: dateStr,
          timeSlot: `${String(currentHour).padStart(2, '0')}:00-${String(currentHour + 1).padStart(2, '0')}:00`
        }
      ];
      
      console.log(`교통량 데이터 ${trafficData.length}건 생성 완료 (시간대 배수: ${trafficMultiplier.toFixed(2)})`);
      return trafficData;
    } catch (error) {
      console.error('교통량 데이터 조회 실패:', error);
      return [];
    }
  }
}

async function testUpdatedApiService() {
  console.log('🚀 업데이트된 Real API Service 테스트 시작\n');
  
  const apiService = new TestRealApiService();
  
  console.log('=== 1. 기상청 실제 API 테스트 ===');
  try {
    const weatherData = await apiService.getWeatherData();
    if (weatherData) {
      console.log('✅ 기상 데이터 수신 성공');
      console.log('현재 날씨:', {
        기온: weatherData.current?.temperature + '°C',
        습도: weatherData.current?.humidity + '%',
        풍속: weatherData.current?.windSpeed + 'm/s',
        하늘상태: apiService.getSkyConditionText(weatherData.current?.skyCondition)
      });
      console.log(`관측 데이터 ${weatherData.observations.length}건`);
      console.log(`예보 데이터 ${weatherData.forecast?.length || 0}건`);
    } else {
      console.log('❌ 기상 데이터 수신 실패');
    }
  } catch (error) {
    console.error('❌ 기상 API 테스트 오류:', error.message);
  }
  
  console.log('\n=== 2. 교통량 데이터 테스트 ===');
  try {
    const trafficData = await apiService.getTrafficData();
    console.log('✅ 교통량 데이터 생성 성공');
    console.log(`총 ${trafficData.length}건의 교통량 데이터`);
    if (trafficData.length > 0) {
      console.log('첫 번째 교통량 데이터:', {
        구간: `${trafficData[0].departure} → ${trafficData[0].destination}`,
        총교통량: trafficData[0].totalTraffic.toLocaleString() + '대',
        시간대: trafficData[0].timeSlot
      });
    }
  } catch (error) {
    console.error('❌ 교통량 데이터 테스트 오류:', error.message);
  }
  
  console.log('\n=== 테스트 완료 ===');
}

// 실행
testUpdatedApiService().catch(console.error);