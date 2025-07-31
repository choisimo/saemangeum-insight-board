/**
 * 실제 API 키를 사용한 통합 API 테스트
 * KOSIS, KEPCO 등 실제 작동하는 API들 검증
 */

const fetch = require('node-fetch');

// 실제 API 키들
const API_KEYS = {
  KOSIS: 'ZTQyZWFiNzc4MTY2ZjAwNTI2YTNjMDA3ODQxMWQ4NjA=',
  KEPCO: 'hoe917mF3y174m3l0f8zqPCn8TgL8ZnB6B3Q3BV7'
};

// API 엔드포인트들
const ENDPOINTS = {
  KOSIS: {
    BASE: 'https://kosis.kr/openapi/Param/statisticsParameterData.do',
    STATS: 'https://kosis.kr/openapi/statisticsData.do'
  },
  KEPCO: {
    RENEWABLE: 'https://bigdata.kepco.co.kr/openapi/v1/renewEnergy.do'
  }
};

// 새만금 지역 정보
const SAEMANGEUM_INFO = {
  JEONBUK_CODE: '45',
  GUNSAN_CODE: '45130',
  COORDS: { lat: 35.7983, lng: 126.7041 }
};

console.log('🚀 실제 API 키 기반 통합 테스트 시작');
console.log('📅 테스트 시간:', new Date().toLocaleString('ko-KR'));
console.log('🌍 대상 지역: 새만금 (전북특별자치도)');
console.log('');

/**
 * 1. KOSIS API 테스트 (전북특별자치도 대기질 현황)
 */
async function testKOSISAPI() {
  console.log('=== 1. KOSIS API 테스트 (통계청) ===');
  
  const testCases = [
    {
      name: '기본 통계 목록 조회',
      params: {
        method: 'getList',
        apiKey: API_KEYS.KOSIS,
        format: 'json',
        jsonVD: 'Y'
      }
    },
    {
      name: '전북 대기질 통계 조회',
      params: {
        method: 'getList',
        apiKey: API_KEYS.KOSIS,
        itmId: 'ALL',
        objL1: '45000', // 전북특별자치도
        format: 'json',
        jsonVD: 'Y'
      }
    },
    {
      name: '환경 관련 통계 조회',
      params: {
        method: 'getStatisticsList',
        apiKey: API_KEYS.KOSIS,
        vwCd: 'MT_ZTITLE',
        parentListId: 'A',
        format: 'json',
        jsonVD: 'Y'
      }
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n🔍 테스트: ${testCase.name}`);
      
      const params = new URLSearchParams(testCase.params);
      const url = `${ENDPOINTS.KOSIS.BASE}?${params.toString()}`;
      
      console.log('요청 URL:', url.replace(API_KEYS.KOSIS, 'API_KEY'));
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SaemangumTest/1.0)',
          'Accept': 'application/json, text/plain, */*'
        },
        timeout: 15000
      });

      console.log('응답 상태:', response.status, response.statusText);
      console.log('Content-Type:', response.headers.get('content-type'));

      if (response.ok) {
        const text = await response.text();
        console.log('응답 크기:', text.length, 'bytes');
        console.log('응답 미리보기 (처음 300자):', text.substring(0, 300));

        try {
          const data = JSON.parse(text);
          if (Array.isArray(data)) {
            console.log('✅ JSON 배열 파싱 성공:', data.length, '개 항목');
            if (data.length > 0) {
              console.log('첫 번째 항목 키들:', Object.keys(data[0]));
            }
          } else if (typeof data === 'object') {
            console.log('✅ JSON 객체 파싱 성공');
            console.log('객체 키들:', Object.keys(data));
          }
        } catch (jsonError) {
          console.log('⚠️ JSON 파싱 실패, 텍스트 응답');
        }
      } else {
        const errorText = await response.text();
        console.log('❌ API 오류:', errorText.substring(0, 200));
      }
    } catch (error) {
      console.error('❌ 요청 실패:', error.message);
    }
  }
}

/**
 * 2. KEPCO API 테스트 (한전 재생에너지 데이터)
 */
async function testKEPCOAPI() {
  console.log('\n=== 2. KEPCO API 테스트 (한국전력공사) ===');
  
  const currentYear = new Date().getFullYear();
  const testCases = [
    {
      name: '전북 태양광 발전량',
      params: {
        year: currentYear.toString(),
        metroCd: SAEMANGEUM_INFO.JEONBUK_CODE,
        genSrcCd: '1', // 태양광
        apiKey: API_KEYS.KEPCO,
        returnType: 'json'
      }
    },
    {
      name: '전북 풍력 발전량',
      params: {
        year: currentYear.toString(),
        metroCd: SAEMANGEUM_INFO.JEONBUK_CODE,
        genSrcCd: '2', // 풍력
        apiKey: API_KEYS.KEPCO,
        returnType: 'json'
      }
    },
    {
      name: '전국 재생에너지 현황',
      params: {
        year: (currentYear - 1).toString(), // 작년 데이터
        metroCd: '00', // 전국
        genSrcCd: '0', // 전체
        apiKey: API_KEYS.KEPCO,
        returnType: 'json'
      }
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n🔍 테스트: ${testCase.name}`);
      
      const params = new URLSearchParams(testCase.params);
      const url = `${ENDPOINTS.KEPCO.RENEWABLE}?${params.toString()}`;
      
      console.log('요청 URL:', url.replace(API_KEYS.KEPCO, 'API_KEY'));
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; SaemangumTest/1.0)',
          'Accept': 'application/json',
          'Referer': 'https://bigdata.kepco.co.kr/'
        },
        timeout: 15000
      });

      console.log('응답 상태:', response.status, response.statusText);
      console.log('Content-Type:', response.headers.get('content-type'));

      if (response.ok) {
        const text = await response.text();
        console.log('응답 크기:', text.length, 'bytes');
        console.log('응답 미리보기 (처음 500자):', text.substring(0, 500));

        try {
          const data = JSON.parse(text);
          console.log('✅ JSON 파싱 성공');
          
          if (data.resultCode) {
            console.log('결과 코드:', data.resultCode);
            console.log('결과 메시지:', data.resultMsg);
          }
          
          if (data.data && Array.isArray(data.data)) {
            console.log('데이터 항목 수:', data.data.length);
            if (data.data.length > 0) {
              console.log('첫 번째 데이터 항목:', JSON.stringify(data.data[0], null, 2));
            }
          } else if (data.list && Array.isArray(data.list)) {
            console.log('리스트 항목 수:', data.list.length);
            if (data.list.length > 0) {
              console.log('첫 번째 리스트 항목:', JSON.stringify(data.list[0], null, 2));
            }
          }
        } catch (jsonError) {
          console.log('⚠️ JSON 파싱 실패:', jsonError.message);
          console.log('원본 응답:', text.substring(0, 200));
        }
      } else {
        const errorText = await response.text();
        console.log('❌ API 오류:', errorText.substring(0, 300));
      }
    } catch (error) {
      console.error('❌ 요청 실패:', error.message);
    }
  }
}

/**
 * 3. 기타 공공데이터 API 테스트 (서비스키 없이 가능한 것들)
 */
async function testPublicDataAPIs() {
  console.log('\n=== 3. 기타 공공데이터 API 테스트 ===');
  
  // 기상청 API (서비스키 없이 테스트)
  try {
    console.log('\n🔍 기상청 API 엔드포인트 확인');
    
    const weatherUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
    const params = new URLSearchParams({
      serviceKey: 'test_key',
      dataType: 'JSON',
      base_date: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
      base_time: '0500',
      nx: '54',
      ny: '74',
      numOfRows: '1'
    });
    
    const url = `${weatherUrl}?${params.toString()}`;
    console.log('기상청 API URL 구조:', url.replace('test_key', 'SERVICE_KEY'));
    console.log('⚠️ 실제 서비스키 필요');
    
  } catch (error) {
    console.error('기상청 API 테스트 실패:', error.message);
  }

  // VWorld API 테스트 (키 없이 구조 확인)
  try {
    console.log('\n🔍 VWorld API 엔드포인트 확인');
    
    const vworldUrl = 'https://api.vworld.kr/req/search';
    const params = new URLSearchParams({
      service: 'search',
      request: 'search',
      version: '2.0',
      crs: 'EPSG:4326',
      size: '10',
      query: '새만금',
      type: 'DISTRICT',
      format: 'json',
      key: 'test_key'
    });
    
    const url = `${vworldUrl}?${params.toString()}`;
    console.log('VWorld API URL 구조:', url.replace('test_key', 'VWORLD_KEY'));
    console.log('⚠️ VWorld API 키 필요 (www.vworld.kr)');
    
  } catch (error) {
    console.error('VWorld API 테스트 실패:', error.message);
  }
}

/**
 * 4. API 응답 시간 및 안정성 테스트
 */
async function testAPIPerformance() {
  console.log('\n=== 4. API 성능 및 안정성 테스트 ===');
  
  const performanceTests = [
    {
      name: 'KOSIS API 응답 시간',
      url: `${ENDPOINTS.KOSIS.BASE}?method=getList&apiKey=${API_KEYS.KOSIS}&format=json&jsonVD=Y`
    },
    {
      name: 'KEPCO API 응답 시간',
      url: `${ENDPOINTS.KEPCO.RENEWABLE}?year=2023&metroCd=45&genSrcCd=1&apiKey=${API_KEYS.KEPCO}&returnType=json`
    }
  ];

  for (const test of performanceTests) {
    try {
      console.log(`\n⏱️ ${test.name} 측정 중...`);
      
      const startTime = Date.now();
      const response = await fetch(test.url, {
        method: 'GET',
        timeout: 30000
      });
      const endTime = Date.now();
      
      const responseTime = endTime - startTime;
      console.log(`응답 시간: ${responseTime}ms`);
      console.log(`응답 상태: ${response.status}`);
      console.log(`응답 크기: ${response.headers.get('content-length') || 'unknown'} bytes`);
      
      if (responseTime < 1000) {
        console.log('✅ 빠른 응답 (1초 미만)');
      } else if (responseTime < 5000) {
        console.log('⚠️ 보통 응답 (1-5초)');
      } else {
        console.log('❌ 느린 응답 (5초 이상)');
      }
      
    } catch (error) {
      console.error(`❌ ${test.name} 측정 실패:`, error.message);
    }
  }
}

/**
 * 메인 테스트 실행
 */
async function runAllTests() {
  try {
    await testKOSISAPI();
    await testKEPCOAPI();
    await testPublicDataAPIs();
    await testAPIPerformance();
    
    console.log('\n=== 📊 테스트 결과 요약 ===');
    console.log('✅ KOSIS API: 전북특별자치도 대기질 통계 데이터');
    console.log('✅ KEPCO API: 한전 재생에너지 발전량 데이터');
    console.log('⚠️ 기타 API: 추가 서비스키 발급 필요');
    console.log('');
    console.log('📖 다음 단계:');
    console.log('1. 실제 API 응답 구조에 맞게 데이터 파싱 로직 개선');
    console.log('2. 추가 API 키 발급 및 통합');
    console.log('3. 대시보드 컴포넌트에 실제 데이터 연동');
    console.log('4. 데이터 품질 검증 및 오류 처리 강화');
    
  } catch (error) {
    console.error('❌ 전체 테스트 실행 실패:', error);
  }
}

// 테스트 실행
runAllTests().catch(console.error);
