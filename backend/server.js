const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const API_ENDPOINTS = {
  weather: 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst',
  traffic: 'https://api.odcloud.kr/api/15077586/v1/uddi:a6c72222-2c4e-465b-87b9-4d0ffd2e6c1e',
  renewable: 'https://api.odcloud.kr/api/15077588/v1/uddi:f94e77c9-2c4e-465b-87b9-4d0ffd2e6c1e',
  investment: 'https://api.odcloud.kr/api/15077587/v1/uddi:b6c73333-3d5f-576c-98ca-5e1ffe3f7d2f'
};

const API_KEY = '24V%2B3U7csvpfyBFjHAACEmoeerfMjNuyKpC5yJYDRi4PdYQ%2FHh7gNWS4Nzw3yjCOPXtgCsQEtA3KHIE08sYxig%3D%3D';
const API_KEY_DECODED = '24V+3U7csvpfyBFjHAACEmoeerfMjNuyKpC5yJYDRi4PdYQ/Hh7gNWS4Nzw3yjCOPXtgCsQEtA3KHIE08sYxig==';

// Mock 데이터 생성 함수들
function generateMockWeatherData() {
  return {
    response: {
      header: { resultCode: '00', resultMsg: 'NORMAL_SERVICE' },
      body: {
        items: {
          item: [
            { category: 'T1H', obsrValue: '22.5' },
            { category: 'REH', obsrValue: '65' },
            { category: 'WSD', obsrValue: '3.2' },
            { category: 'RN1', obsrValue: '0' },
            { category: 'PTY', obsrValue: '0' }
          ]
        }
      }
    }
  };
}

function generateMockTrafficData() {
  return [
    { departure: '전주', destination: '새만금', smallVehicles: 12850, largeVehicles: 2570 },
    { departure: '군산', destination: '새만금', smallVehicles: 7450, largeVehicles: 1480 }
  ];
}

function generateMockRenewableData() {
  return [
    { region: '새만금', generationType: '태양광', capacity: 2800, area: 14000000 },
    { region: '새만금', generationType: '풍력', capacity: 2400, area: 80000000 }
  ];
}

function generateMockInvestmentData() {
  return [
    { company: '한국수력원자력공사', sector: '에너지', investment: 2500, expectedJobs: 230 },
    { company: '대림산업', sector: '제조업', investment: 1800, expectedJobs: 180 }
  ];
}

app.get('/api/weather', async (req, res) => {
  try {
    console.log('Weather API 요청 수신');
    
    // 현재 날짜와 시간 계산
    const now = new Date();
    const baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
    const baseTime = String(Math.floor(now.getHours() / 3) * 3).padStart(2, '0') + '00'; // 3시간 간격
    
    console.log(`날짜: ${baseDate}, 시간: ${baseTime}`);
    
    // 인코딩된 키와 디코딩된 키 모두 시도
    const keysToTry = [API_KEY, API_KEY_DECODED];
    
    for (const key of keysToTry) {
      try {
        console.log(`API 키 시도: ${key.substring(0, 20)}...`);
        
        const response = await axios.get(API_ENDPOINTS.weather, {
          params: {
            serviceKey: key,
            numOfRows: 50,
            pageNo: 1,
            dataType: 'JSON',
            base_date: baseDate,
            base_time: baseTime,
            nx: 54,
            ny: 125
          },
          timeout: 10000
        });
        
        console.log('API 응답 받음:', typeof response.data);
        
        // XML 오류 응답 확인
        if (typeof response.data === 'string' && response.data.includes('SERVICE ERROR')) {
          console.log('서비스 오류 응답:', response.data);
          continue; // 다음 키 시도
        }
        
        // JSON 응답 확인
        if (response.data.response?.header?.resultCode === '00') {
          console.log('✅ Weather API 성공! 실제 데이터 반환');
          return res.json(response.data);
        } else {
          console.log('API 응답 오류:', response.data.response?.header);
          continue; // 다음 키 시도
        }
      } catch (keyError) {
        console.log(`API 키 ${key.substring(0, 10)}... 실패:`, keyError.message);
        continue; // 다음 키 시도
      }
    }
    
    // 모든 키 실패 시 Mock 데이터 사용하지 않고 오류 반환
    throw new Error('모든 API 키가 실패했습니다');
    
  } catch (error) {
    console.error('Weather API 최종 오류:', error.message);
    console.log('❌ 실제 API 호출 실패 - Mock 데이터 대신 오류 반환');
    return res.status(500).json({ 
      error: 'Weather API 호출 실패', 
      message: error.message,
      fallback: 'mock_data_disabled'
    });
  }
});

app.get('/api/traffic', async (req, res) => {
  try {
    console.log('Traffic API 요청 수신');
    
    const keysToTry = [API_KEY, API_KEY_DECODED];
    
    for (const key of keysToTry) {
      try {
        console.log(`Traffic API 키 시도: ${key.substring(0, 20)}...`);
        
        const response = await axios.get(API_ENDPOINTS.traffic, {
          params: {
            serviceKey: key,
            page: 1,
            perPage: 100
          },
          timeout: 10000
        });
        
        if (typeof response.data === 'string' && response.data.includes('SERVICE ERROR')) {
          console.log('서비스 오류 응답:', response.data);
          continue;
        }
        
        if (response.data && !response.data.error) {
          console.log('✅ Traffic API 성공! 실제 데이터 반환');
          return res.json(response.data);
        }
      } catch (keyError) {
        console.log(`Traffic API 키 실패:`, keyError.message);
        continue;
      }
    }
    
    throw new Error('모든 API 키가 실패했습니다');
    
  } catch (error) {
    console.error('Traffic API 최종 오류:', error.message);
    return res.status(500).json({ 
      error: 'Traffic API 호출 실패', 
      message: error.message,
      fallback: 'mock_data_disabled'
    });
  }
});

app.get('/api/renewable', async (req, res) => {
  try {
    console.log('Renewable API 요청 수신');
    
    const keysToTry = [API_KEY, API_KEY_DECODED];
    
    for (const key of keysToTry) {
      try {
        console.log(`Renewable API 키 시도: ${key.substring(0, 20)}...`);
        
        const response = await axios.get(API_ENDPOINTS.renewable, {
          params: {
            serviceKey: key,
            page: 1,
            perPage: 100
          },
          timeout: 10000
        });
        
        if (typeof response.data === 'string' && response.data.includes('SERVICE ERROR')) {
          console.log('서비스 오류 응답:', response.data);
          continue;
        }
        
        if (response.data && !response.data.error) {
          console.log('✅ Renewable API 성공! 실제 데이터 반환');
          return res.json(response.data);
        }
      } catch (keyError) {
        console.log(`Renewable API 키 실패:`, keyError.message);
        continue;
      }
    }
    
    throw new Error('모든 API 키가 실패했습니다');
    
  } catch (error) {
    console.error('Renewable API 최종 오류:', error.message);
    return res.status(500).json({ 
      error: 'Renewable API 호출 실패', 
      message: error.message,
      fallback: 'mock_data_disabled'
    });
  }
});

app.get('/api/investment', async (req, res) => {
  try {
    console.log('Investment API 요청 수신');
    
    const keysToTry = [API_KEY, API_KEY_DECODED];
    
    for (const key of keysToTry) {
      try {
        console.log(`Investment API 키 시도: ${key.substring(0, 20)}...`);
        
        const response = await axios.get(API_ENDPOINTS.investment, {
          params: {
            serviceKey: key,
            page: 1,
            perPage: 100
          },
          timeout: 10000
        });
        
        if (typeof response.data === 'string' && response.data.includes('SERVICE ERROR')) {
          console.log('서비스 오류 응답:', response.data);
          continue;
        }
        
        if (response.data && !response.data.error) {
          console.log('✅ Investment API 성공! 실제 데이터 반환');
          return res.json(response.data);
        }
      } catch (keyError) {
        console.log(`Investment API 키 실패:`, keyError.message);
        continue;
      }
    }
    
    throw new Error('모든 API 키가 실패했습니다');
    
  } catch (error) {
    console.error('Investment API 최종 오류:', error.message);
    return res.status(500).json({ 
      error: 'Investment API 호출 실패', 
      message: error.message,
      fallback: 'mock_data_disabled'
    });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});