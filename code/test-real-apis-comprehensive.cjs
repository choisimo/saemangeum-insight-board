/**
 * 실제 작동하는 공공데이터 API 테스트 스크립트
 * 제공된 API들의 실제 작동 여부 확인
 */

const fetch = require('node-fetch');

// API 인증키들
const API_KEYS = {
  KOSIS: 'ZTQyZWFiNzc4MTY2ZjAwNTI2YTNjMDA3ODQxMWQ4NjA=',
  KEPCO: 'hoe917mF3y174m3l0f8zqPCn8TgL8ZnB6B3Q3BV7',
  DATA_GO_KR: 'test_key' // 실제 키 필요
};

// 새만금 지역 좌표
const SAEMANGEUM_COORDS = {
  nx: 54,
  ny: 74,
  lat: 35.7983,
  lng: 126.7041
};

console.log('🚀 실제 작동하는 공공데이터 API 검증 테스트 시작\n');

// 1. KOSIS API 테스트 (전북 대기질 현황)
async function testKOSISAPI() {
  console.log('=== 1단계: KOSIS API 테스트 ===\n');
  
  try {
    console.log('🔍 테스트 중: KOSIS 전북특별자치도 연평균 대기질 현황');
    
    // KOSIS API 엔드포인트 (실제 URL 확인 필요)
    const kosisUrl = 'https://kosis.kr/openapi/Param/statisticsParameterData.do';
    const kosisParams = new URLSearchParams({
      method: 'getList',
      apiKey: API_KEYS.KOSIS,
      itmId: 'ALL', // 항목 ID
      objL1: '41000', // 전북특별자치도
      format: 'json',
      jsonVD: 'Y'
    });
    
    const fullUrl = `${kosisUrl}?${kosisParams.toString()}`;
    console.log('요청 URL:', fullUrl.replace(API_KEYS.KOSIS, 'API_KEY'));
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; API-Test/1.0)'
      },
      timeout: 10000
    });
    
    console.log('응답 상태:', response.status, response.statusText);
    console.log('응답 헤더:', JSON.stringify(Object.fromEntries(response.headers), null, 2));
    
    if (response.ok) {
      const data = await response.text();
      console.log('응답 데이터 (처음 500자):', data.substring(0, 500));
      
      try {
        const jsonData = JSON.parse(data);
        console.log('✅ KOSIS API 성공 - JSON 파싱 완료');
        return jsonData;
      } catch (e) {
        console.log('⚠️ JSON 파싱 실패, 텍스트 응답:', data.substring(0, 200));
      }
    } else {
      const errorText = await response.text();
      console.log('❌ KOSIS API 실패:', errorText);
    }
  } catch (error) {
    console.error('❌ KOSIS API 오류:', error.message);
  }
  console.log('');
}

// 2. 한전 전력데이터 API 테스트
async function testKEPCOAPI() {
  console.log('=== 2단계: 한전 전력데이터 API 테스트 ===\n');
  
  try {
    console.log('🔍 테스트 중: 한전 재생에너지 발전량 데이터');
    
    const kepcoUrl = 'https://bigdata.kepco.co.kr/openapi/v1/renewEnergy.do';
    const kepcoParams = new URLSearchParams({
      year: '2024',
      metroCd: '45', // 전북특별자치도 코드
      genSrcCd: '1', // 태양광
      apiKey: API_KEYS.KEPCO,
      returnType: 'json'
    });
    
    const fullUrl = `${kepcoUrl}?${kepcoParams.toString()}`;
    console.log('요청 URL:', fullUrl.replace(API_KEYS.KEPCO, 'API_KEY'));
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; API-Test/1.0)',
        'Accept': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('응답 상태:', response.status, response.statusText);
    console.log('응답 헤더:', JSON.stringify(Object.fromEntries(response.headers), null, 2));
    
    if (response.ok) {
      const data = await response.text();
      console.log('응답 데이터 (처음 500자):', data.substring(0, 500));
      
      try {
        const jsonData = JSON.parse(data);
        console.log('✅ KEPCO API 성공 - JSON 파싱 완료');
        return jsonData;
      } catch (e) {
        console.log('⚠️ JSON 파싱 실패, 텍스트 응답:', data.substring(0, 200));
      }
    } else {
      const errorText = await response.text();
      console.log('❌ KEPCO API 실패:', errorText);
    }
  } catch (error) {
    console.error('❌ KEPCO API 오류:', error.message);
  }
  console.log('');
}

// 3. 기상청 단기예보 API 테스트 (개선된 버전)
async function testWeatherAPI() {
  console.log('=== 3단계: 기상청 단기예보 API 테스트 ===\n');
  
  try {
    console.log('🔍 테스트 중: 기상청 단기예보 서비스 (새만금 지역)');
    
    const now = new Date();
    const baseDate = now.toISOString().slice(0, 10).replace(/-/g, '');
    const baseTime = '0500'; // 고정된 발표시간
    
    const weatherUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';
    const weatherParams = new URLSearchParams({
      serviceKey: 'test_service_key', // 실제 키 필요
      dataType: 'JSON',
      base_date: baseDate,
      base_time: baseTime,
      nx: SAEMANGEUM_COORDS.nx.toString(),
      ny: SAEMANGEUM_COORDS.ny.toString(),
      numOfRows: '50',
      pageNo: '1'
    });
    
    const fullUrl = `${weatherUrl}?${weatherParams.toString()}`;
    console.log('요청 URL:', fullUrl.replace('test_service_key', 'SERVICE_KEY'));
    
    console.log('🔍 테스트 중: 초단기실황 조회');
    const realtimeUrl = 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst';
    const realtimeParams = new URLSearchParams({
      serviceKey: 'test_service_key',
      dataType: 'JSON',
      base_date: baseDate,
      base_time: '1400', // 현재 시간 기준
      nx: SAEMANGEUM_COORDS.nx.toString(),
      ny: SAEMANGEUM_COORDS.ny.toString(),
      numOfRows: '50',
      pageNo: '1'
    });
    
    console.log('초단기실황 URL:', `${realtimeUrl}?${realtimeParams.toString()}`.replace('test_service_key', 'SERVICE_KEY'));
    console.log('⚠️ 실제 서비스키가 필요합니다 (data.go.kr에서 발급)');
    
  } catch (error) {
    console.error('❌ 기상청 API 오류:', error.message);
  }
  console.log('');
}

// 4. 국토교통부 공간정보 API 테스트
async function testMOLITAPI() {
  console.log('=== 4단계: 국토교통부 공간정보 API 테스트 ===\n');
  
  try {
    console.log('🔍 테스트 중: 국토교통부 검색 API (새만금 관련 POI)');
    
    // VWorld API 테스트 (실제 키 필요)
    const vworldUrl = 'https://api.vworld.kr/req/search';
    const vworldParams = new URLSearchParams({
      service: 'search',
      request: 'search',
      version: '2.0',
      crs: 'EPSG:4326',
      size: '10',
      page: '1',
      query: '새만금',
      type: 'DISTRICT',
      category: 'L4',
      format: 'json',
      errorformat: 'json',
      key: 'test_vworld_key' // 실제 키 필요
    });
    
    const fullUrl = `${vworldUrl}?${vworldParams.toString()}`;
    console.log('요청 URL:', fullUrl.replace('test_vworld_key', 'VWORLD_KEY'));
    console.log('⚠️ VWorld API 키가 필요합니다 (www.vworld.kr에서 발급)');
    
  } catch (error) {
    console.error('❌ 국토교통부 API 오류:', error.message);
  }
  console.log('');
}

// 5. 해양수산부 해양수질 API 테스트
async function testOceanAPI() {
  console.log('=== 5단계: 해양수산부 해양수질 API 테스트 ===\n');
  
  try {
    console.log('🔍 테스트 중: 해양수산부 실시간 해양수질자동측정망');
    
    const oceanUrl = 'https://apis.data.go.kr/1192000/OceansWemoObvpRtmInfoService/getObvpRtmInfoList';
    const oceanParams = new URLSearchParams({
      serviceKey: 'test_service_key',
      pageNo: '1',
      numOfRows: '10',
      dataType: 'JSON',
      obsPostId: '', // 관측소 ID (새만금 인근)
      obsDate: new Date().toISOString().slice(0, 10).replace(/-/g, '')
    });
    
    const fullUrl = `${oceanUrl}?${oceanParams.toString()}`;
    console.log('요청 URL:', fullUrl.replace('test_service_key', 'SERVICE_KEY'));
    console.log('⚠️ 실제 서비스키가 필요합니다');
    
  } catch (error) {
    console.error('❌ 해양수산부 API 오류:', error.message);
  }
  console.log('');
}

// 6. 전북 군산 산업단지 API 테스트
async function testGunsanAPI() {
  console.log('=== 6단계: 전북 군산 산업단지 API 테스트 ===\n');
  
  try {
    console.log('🔍 테스트 중: 전북특별자치도 군산 산업단지 종합정보');
    
    const gunsanUrl = 'https://apis.data.go.kr/4671000/gunsan-open-api/getIndustrialComplexInfo';
    const gunsanParams = new URLSearchParams({
      serviceKey: 'test_service_key',
      pageNo: '1',
      numOfRows: '10',
      dataType: 'JSON'
    });
    
    const fullUrl = `${gunsanUrl}?${gunsanParams.toString()}`;
    console.log('요청 URL:', fullUrl.replace('test_service_key', 'SERVICE_KEY'));
    console.log('⚠️ 실제 서비스키가 필요합니다');
    
  } catch (error) {
    console.error('❌ 군산 산업단지 API 오류:', error.message);
  }
  console.log('');
}

// 메인 테스트 실행
async function runTests() {
  console.log('📊 테스트 실행 시간:', new Date().toLocaleString('ko-KR'));
  console.log('🌍 새만금 지역 좌표:', SAEMANGEUM_COORDS);
  console.log('');
  
  const results = {
    kosis: await testKOSISAPI(),
    kepco: await testKEPCOAPI(),
    weather: await testWeatherAPI(),
    molit: await testMOLITAPI(),
    ocean: await testOceanAPI(),
    gunsan: await testGunsanAPI()
  };
  
  console.log('=== 📊 테스트 결과 요약 ===');
  console.log('✅ 성공:', Object.values(results).filter(r => r).length);
  console.log('❌ 실패:', Object.values(results).filter(r => !r).length);
  console.log('');
  console.log('⚠️ 대부분의 API는 실제 인증키가 필요합니다.');
  console.log('📖 다음 단계: 실제 키를 발급받아 통합 API 서비스를 구현합니다.');
}

runTests().catch(console.error);