/**
 * 실제 새만금개발청 공공데이터포털 API 검증 테스트
 * 제공된 UDDI와 엔드포인트를 기반으로 실제 호출 가능성 검증
 */

// 실제 새만금개발청 공공데이터 API 엔드포인트들
const REAL_SAEMANGEUM_APIS = [
  {
    name: "새만금 방조제 교통량",
    uddi: "uddi:6aeb7e79-34ba-40ba-9f54-92866841a9e1",
    request_number: "92753785",
    url: "http://openapi.data.go.kr/openapi/service/rest/SaemangumTrafficService/getTrafficData",
    test_params: {
      year: "2024",
      month: "01",
      departure: "전주",
      destination: "새만금"
    }
  },
  {
    name: "새만금사업 매립 정보",
    uddi: "uddi:df247c12-617e-44aa-86fe-d08a37ed729f",
    request_number: "92753775",
    url: "http://openapi.data.go.kr/openapi/service/rest/SaemangumReclaimService/getReclaimData",
    test_params: {
      region: "새만금",
      landType: "산업용지",
      baseYear: "2024"
    }
  },
  {
    name: "새만금 투자 인센티브 보조금지원 현황",
    uddi: "uddi:d8e95b9d-7808-4643-b2f5-c1fa1a649ede",
    request_number: "92753761",
    url: "http://openapi.data.go.kr/openapi/service/rest/SaemangumInvestmentService/getInvestmentData",
    test_params: {
      supportYear: "2024",
      companyName: "",
      supportRegion: "새만금"
    }
  },
  {
    name: "새만금사업지역 건축물 허가현황",
    uddi: "uddi:55aa5c8a-090d-4db0-a99e-a20a2c9b4117",
    request_number: "92753730",
    url: "http://openapi.data.go.kr/openapi/service/rest/SaemangumBuildingService/getBuildingPermitData",
    test_params: {
      permitDate: "20240101",
      location: "새만금",
      buildingType: "공장"
    }
  },
  {
    name: "새만금지역 산업단지 유틸리티 현황",
    uddi: "uddi:b763f323-2d2b-4ad3-aaab-91c1de9c4323",
    request_number: "92514555",
    url: "http://openapi.data.go.kr/openapi/service/rest/SaemangumUtilityService/getUtilityData",
    test_params: {
      utilityType: "전력",
      supplier: ""
    }
  },
  {
    name: "새만금 재생에너지 사업 정보",
    uddi: "uddi:1743c432-d853-40d9-9c4a-9076e4f35ce9",
    request_number: "92514484",
    url: "http://openapi.data.go.kr/openapi/service/rest/SaemangumRenewableService/getRenewableData",
    test_params: {
      targetRegion: "새만금",
      generationType: "태양광"
    }
  },
  {
    name: "새만금개발청_기상정보초단기실황조회",
    uddi: "uddi:83bddb37-95d5-4fe1-8e1e-8d4e8d56e1f5",
    request_number: "92514381",
    url: "http://openapi.data.go.kr/openapi/service/rest/SaemangumWeatherService/getUltraSrtNcst",
    test_params: {
      base_date: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
      base_time: "1400",
      nx: "54",
      ny: "74"
    }
  },
  {
    name: "새만금산업단지 입주기업 계약 현황",
    uddi: "uddi:ace5dd01-ee09-4bea-952c-f0bfef77fcb4",
    request_number: "92514334",
    url: "http://openapi.data.go.kr/openapi/service/rest/SaemangumCompanyService/getCompanyContractData",
    test_params: {
      contractDate: "20240101",
      companyName: ""
    }
  }
];

// 공공데이터포털 표준 API 형식으로 테스트
const STANDARD_DATA_GO_KR_APIS = [
  {
    name: "새만금 투자 인센티브 (표준형식)",
    url: "https://api.data.go.kr/15121622/v1/uddi:d8e95b9d-7808-4643-b2f5-c1fa1a649ede",
    test_params: {
      serviceKey: "TEST_KEY",
      numOfRows: "10",
      pageNo: "1",
      type: "json"
    }
  },
  {
    name: "새만금 재생에너지 (표준형식)",
    url: "https://api.data.go.kr/15068848/v1/uddi:1743c432-d853-40d9-9c4a-9076e4f35ce9",
    test_params: {
      serviceKey: "TEST_KEY",
      numOfRows: "10",
      pageNo: "1",
      type: "json"
    }
  },
  {
    name: "새만금 기상정보 (표준형식)",
    url: "https://api.data.go.kr/15138304/v1/uddi:83bddb37-95d5-4fe1-8e1e-8d4e8d56e1f5",
    test_params: {
      serviceKey: "TEST_KEY",
      numOfRows: "10",
      pageNo: "1",
      type: "json"
    }
  }
];

async function testApiEndpoint(api, isStandardFormat = false) {
  console.log(`\n🔍 테스트 중: ${api.name}`);
  console.log(`URL: ${api.url}`);
  console.log(`UDDI: ${api.uddi || 'N/A'}`);
  
  try {
    const url = new URL(api.url);
    
    // 파라미터 추가
    Object.entries(api.test_params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    
    console.log(`전체 URL: ${url.toString()}`);
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'SaemangumDashboard/1.0'
      },
    });
    
    console.log(`응답 상태: ${response.status} ${response.statusText}`);
    console.log(`응답 헤더:`, Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      console.log(`Content-Type: ${contentType}`);
      
      if (contentType && contentType.includes('application/json')) {
        try {
          const data = await response.json();
          console.log('JSON 응답 데이터:', JSON.stringify(data, null, 2));
          
          // 공공데이터포털 표준 응답 구조 확인
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
        } catch (jsonError) {
          console.log('JSON 파싱 실패, 텍스트로 확인...');
          const text = await response.text();
          console.log('응답 텍스트 (처음 500자):', text.substring(0, 500));
        }
      } else {
        const text = await response.text();
        console.log('비JSON 응답 (처음 500자):', text.substring(0, 500));
      }
      
      return { success: true, status: response.status, endpoint: api.name };
    } else {
      const errorText = await response.text();
      console.log('오류 응답:', errorText.substring(0, 500));
      return { success: false, status: response.status, endpoint: api.name, error: errorText };
    }
    
  } catch (error) {
    console.error(`❌ 오류 발생:`, error.message);
    return { success: false, error: error.message, endpoint: api.name };
  }
}

async function testAllSaemangumApis() {
  console.log('🚀 새만금개발청 실제 공공데이터 API 검증 테스트 시작\n');
  
  const results = [];
  
  console.log('=== 1단계: 새만금개발청 REST API 형식 테스트 ===');
  for (const api of REAL_SAEMANGEUM_APIS) {
    const result = await testApiEndpoint(api, false);
    results.push(result);
    
    // 요청 간 1초 대기 (API 서버 부하 방지)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n=== 2단계: 공공데이터포털 표준 API 형식 테스트 ===');
  for (const api of STANDARD_DATA_GO_KR_APIS) {
    const result = await testApiEndpoint(api, true);
    results.push(result);
    
    // 요청 간 1초 대기
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n📊 테스트 결과 요약:');
  results.forEach(result => {
    const status = result.success ? '✅ 성공' : '❌ 실패';
    const detail = result.status ? `(${result.status})` : `(${result.error?.substring(0, 50) || 'Unknown'})`;
    console.log(`${status} - ${result.endpoint} ${detail}`);
  });
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n총 ${results.length}개 API 중 ${successCount}개 성공`);
  
  if (successCount === 0) {
    console.log('\n⚠️  모든 API 호출이 실패했습니다.');
    console.log('가능한 원인:');
    console.log('1. API 서비스 키가 필요할 수 있습니다');
    console.log('2. API 엔드포인트 URL이 변경되었을 수 있습니다');
    console.log('3. 새만금개발청 API 서비스가 현재 중단되었을 수 있습니다');
    console.log('4. 네트워크 접근 제한이 있을 수 있습니다');
  }
  
  return results;
}

// Node.js 환경에서 실행
if (typeof window === 'undefined') {
  import('node-fetch').then(({ default: fetch }) => {
    global.fetch = fetch;
    testAllSaemangumApis().catch(console.error);
  });
}

// 브라우저 환경에서 실행
if (typeof window !== 'undefined') {
  window.testAllSaemangumApis = testAllSaemangumApis;
  console.log('브라우저 콘솔에서 testAllSaemangumApis() 함수를 실행하세요.');
}
