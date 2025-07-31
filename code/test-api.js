/**
 * API 호출 테스트 스크립트
 * 실제 공공데이터포털 API가 작동하는지 확인
 */

// 테스트할 API 엔드포인트들 (실제 공공데이터포털 API)
const API_ENDPOINTS = [
  {
    name: '투자인센티브보조금지원현황',
    url: 'http://openapi.data.go.kr/openapi/service/rest/SaemangumInvestmentService/getInvestmentList'
  },
  {
    name: '재생에너지사업정보',
    url: 'http://openapi.data.go.kr/openapi/service/rest/SaemangumRenewableService/getRenewableList'
  },
  {
    name: '초단기예보조회 (기상청)',
    url: 'http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst'
  }
];

async function testApiEndpoint(endpoint) {
  console.log(`\n🔍 테스트 중: ${endpoint.name}`);
  console.log(`URL: ${endpoint.url}`);
  
  try {
    // 서비스 키 없이 기본 호출 (오류 메시지 확인용)
    const testUrl = `${endpoint.url}?type=json&numOfRows=1&pageNo=1`;
    
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    console.log(`응답 상태: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('응답 데이터 구조:', JSON.stringify(data, null, 2));
      
      if (data.response) {
        console.log(`결과 코드: ${data.response.header?.resultCode}`);
        console.log(`결과 메시지: ${data.response.header?.resultMsg}`);
        
        if (data.response.body?.items) {
          console.log(`데이터 개수: ${data.response.body.items.length}`);
          if (data.response.body.items.length > 0) {
            console.log('첫 번째 데이터 샘플:', JSON.stringify(data.response.body.items[0], null, 2));
          }
        }
      }
    } else {
      const errorText = await response.text();
      console.log('오류 응답:', errorText);
    }
    
    return { success: response.ok, status: response.status, endpoint: endpoint.name };
  } catch (error) {
    console.error(`❌ 오류 발생:`, error.message);
    return { success: false, error: error.message, endpoint: endpoint.name };
  }
}

async function testAllApis() {
  console.log('🚀 새만금 공공데이터 API 테스트 시작\n');
  
  const results = [];
  
  for (const endpoint of API_ENDPOINTS) {
    const result = await testApiEndpoint(endpoint);
    results.push(result);
    
    // 요청 간 1초 대기 (API 서버 부하 방지)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 테스트 결과 요약:');
  results.forEach(result => {
    const status = result.success ? '✅ 성공' : '❌ 실패';
    console.log(`${status} - ${result.endpoint} (${result.status || result.error})`);
  });
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n총 ${results.length}개 API 중 ${successCount}개 성공`);
}

// Node.js 환경에서 실행
if (typeof window === 'undefined') {
  // fetch polyfill for Node.js
  import('node-fetch').then(({ default: fetch }) => {
    global.fetch = fetch;
    testAllApis().catch(console.error);
  });
}

// 브라우저 환경에서 실행
if (typeof window !== 'undefined') {
  window.testAllApis = testAllApis;
  console.log('브라우저 콘솔에서 testAllApis() 함수를 실행하세요.');
}
