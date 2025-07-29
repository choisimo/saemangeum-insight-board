#!/usr/bin/env node

// 새만금 공공데이터 API 테스트 스크립트 (독립실행형)

const SERVICE_KEY = '4DynfiNb5l3cgZ34kFi2mqrHawIruUhNLUP+Gx93TiB1zPg1K3rmvc7lftSco4h5iSprU05i3OEuzklaPckFBA==';
const BASE_URL = 'https://api.odcloud.kr/api';

// API 엔드포인트 정의
const API_ENDPOINTS = {
  WEATHER_FORECAST: '/15138305/v1/uddi:acd5c118-0357-42a4-83c5-ae09cdb47265',
  WEATHER_CURRENT: '/15138304/v1/uddi:83bddb37-95d5-4fe1-8e1e-8d4e8d56e1f5',
  RENEWABLE_ENERGY: '/15068848/v1/uddi:1743c432-d853-40d9-9c4a-9076e4f35ce9',
  UTILITY_STATUS: '/15120069/v1/uddi:b763f323-2d2b-4ad3-aaab-91c1de9c4323',
  BUILDING_PERMITS: '/15006164/v1/uddi:55aa5c8a-090d-4db0-a99e-a20a2c9b4117',
  INVESTMENT_INCENTIVES: '/15121622/v1/uddi:d8e95b9d-7808-4643-b2f5-c1fa1a649ede',
  LAND_REGISTRY: '/15007965/v1/uddi:dd236945-0c76-455b-9c3f-b6e87041b8de',
  RECLAMATION_INFO: '/15040597/v1/uddi:df247c12-617e-44aa-86fe-d08a37ed729f',
  TRAFFIC_DATA: '/15002284/v1/uddi:a2608cef-b4b7-4645-a5b1-9fc28bbe918a'
};

// 테스트할 엔드포인트 정보
const TEST_ENDPOINTS = [
  {
    name: '초단기예보조회',
    endpoint: API_ENDPOINTS.WEATHER_FORECAST,
    description: '새만금 기상정보 초단기예보조회'
  },
  {
    name: '초단기실황조회', 
    endpoint: API_ENDPOINTS.WEATHER_CURRENT,
    description: '새만금 기상정보 초단기실황조회'
  },
  {
    name: '재생에너지사업정보',
    endpoint: API_ENDPOINTS.RENEWABLE_ENERGY,
    description: '새만금 재생에너지 사업 정보'
  },
  {
    name: '산업단지유틸리티현황',
    endpoint: API_ENDPOINTS.UTILITY_STATUS,
    description: '새만금지역 산업단지 유틸리티 현황'
  },
  {
    name: '건축물허가현황',
    endpoint: API_ENDPOINTS.BUILDING_PERMITS,
    description: '새만금사업지역 건축물 허가현황'
  },
  {
    name: '투자인센티브보조금지원현황',
    endpoint: API_ENDPOINTS.INVESTMENT_INCENTIVES,
    description: '새만금 투자 인센티브 보조금지원 현황'
  },
  {
    name: '지적공부',
    endpoint: API_ENDPOINTS.LAND_REGISTRY,
    description: '새만금사업지역 지적공부'
  },
  {
    name: '매립정보',
    endpoint: API_ENDPOINTS.RECLAMATION_INFO,
    description: '새만금사업 매립 정보'
  },
  {
    name: '방조제교통량',
    endpoint: API_ENDPOINTS.TRAFFIC_DATA,
    description: '새만금 방조제 교통량'
  }
];

// API 파라미터 빌더
function buildApiParams(options = {}) {
  const params = new URLSearchParams();
  params.append('serviceKey', SERVICE_KEY);
  params.append('page', (options.page || 1).toString());
  params.append('perPage', (options.perPage || 10).toString());
  
  // 추가 파라미터가 있다면 포함
  Object.entries(options).forEach(([key, value]) => {
    if (key !== 'page' && key !== 'perPage' && value !== undefined) {
      params.append(key, value.toString());
    }
  });
  
  return params;
}

// HTTP 요청 함수
async function apiRequest(endpoint, params) {
  const url = new URL(endpoint, BASE_URL);
  if (params) {
    url.search = params.toString();
  }

  console.log(`📡 API 요청: ${url.toString()}`);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`API 요청 실패: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

// 재시도 로직
async function withRetry(fn, maxRetries = 3, delay = 1000) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (i === maxRetries - 1) {
        throw lastError;
      }

      console.warn(`⚠️  API 요청 실패 (${i + 1}/${maxRetries}), ${delay}ms 후 재시도:`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }

  throw lastError;
}

// 테스트 결과 저장
const testResults = [];

async function testEndpoint(endpointInfo) {
  const { name, endpoint, description } = endpointInfo;
  console.log(`\n🔍 테스트 중: ${name} (${description})`);
  console.log(`📡 엔드포인트: ${endpoint}`);
  
  const startTime = Date.now();
  
  try {
    // API 파라미터 구성 (작은 데이터로 테스트)
    const params = buildApiParams({ 
      page: 1, 
      perPage: 5  // 테스트용으로 적은 수
    });
    
    // API 호출
    const response = await withRetry(() => 
      apiRequest(endpoint, params)
    );
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // 응답 분석
    const dataCount = response.data ? response.data.length : 0;
    const totalCount = response.totalCount || 0;
    
    const result = {
      name,
      endpoint,
      description,
      status: 'SUCCESS',
      responseTime: `${responseTime}ms`,
      dataCount,
      totalCount,
      sampleData: response.data ? response.data.slice(0, 1) : null, // 샘플 1개만
      responseStructure: response.data && response.data.length > 0 ? Object.keys(response.data[0]) : [],
      error: null
    };
    
    testResults.push(result);
    
    console.log(`✅ 성공! 응답시간: ${responseTime}ms`);
    console.log(`📊 데이터 개수: ${dataCount}/${totalCount}`);
    
    if (response.data && response.data.length > 0) {
      console.log(`📋 데이터 구조:`, Object.keys(response.data[0]).join(', '));
      console.log(`📄 샘플 데이터:`, JSON.stringify(response.data[0], null, 2));
    }
    
    return result;
    
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const result = {
      name,
      endpoint,
      description,
      status: 'ERROR',
      responseTime: `${responseTime}ms`,
      dataCount: 0,
      totalCount: 0,
      sampleData: null,
      responseStructure: [],
      error: error.message
    };
    
    testResults.push(result);
    
    console.log(`❌ 실패! 응답시간: ${responseTime}ms`);
    console.log(`🔴 오류: ${error.message}`);
    
    return result;
  }
}

async function runAllTests() {
  console.log('🚀 새만금 공공데이터 API 테스트 시작');
  console.log('🔑 서비스키:', SERVICE_KEY.substring(0, 20) + '...');
  console.log('🌐 기본 URL:', BASE_URL);
  console.log('='.repeat(80));
  
  // 모든 엔드포인트 순차적으로 테스트
  for (const endpoint of TEST_ENDPOINTS) {
    await testEndpoint(endpoint);
    // API 호출 간격을 두어 서버 부하 방지
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  // 테스트 결과 요약
  console.log('\n' + '='.repeat(80));
  console.log('📊 테스트 결과 요약');
  console.log('='.repeat(80));
  
  const successCount = testResults.filter(r => r.status === 'SUCCESS').length;
  const errorCount = testResults.filter(r => r.status === 'ERROR').length;
  const totalDataCount = testResults.reduce((sum, r) => sum + r.dataCount, 0);
  
  console.log(`✅ 성공: ${successCount}/${testResults.length}`);
  console.log(`❌ 실패: ${errorCount}/${testResults.length}`);
  console.log(`📊 총 데이터 건수: ${totalDataCount}`);
  
  // 개별 결과 표시
  console.log('\n📋 개별 테스트 결과:');
  testResults.forEach((result, index) => {
    const status = result.status === 'SUCCESS' ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.name}: ${result.dataCount}건 (${result.responseTime})`);
    if (result.error) {
      console.log(`   🔴 ${result.error}`);
    }
  });
  
  // 성공한 엔드포인트의 데이터 구조 정보
  const successfulEndpoints = testResults.filter(r => r.status === 'SUCCESS');
  if (successfulEndpoints.length > 0) {
    console.log('\n📊 성공한 엔드포인트 데이터 구조:');
    successfulEndpoints.forEach(result => {
      console.log(`\n✅ ${result.name}:`);
      console.log(`   데이터 개수: ${result.dataCount}/${result.totalCount}`);
      if (result.responseStructure.length > 0) {
        console.log(`   필드 구조: ${result.responseStructure.join(', ')}`);
      }
    });
  }
  
  // 실패한 엔드포인트가 있으면 상세 정보 출력
  const failedEndpoints = testResults.filter(r => r.status === 'ERROR');
  if (failedEndpoints.length > 0) {
    console.log('\n🔍 실패한 엔드포인트 상세:');
    failedEndpoints.forEach(result => {
      console.log(`\n❌ ${result.name}`);
      console.log(`   엔드포인트: ${result.endpoint}`);
      console.log(`   오류: ${result.error}`);
    });
  }
  
  // JSON 파일로 상세 결과 저장
  const fs = await import('fs');
  const testReport = {
    timestamp: new Date().toISOString(),
    serviceKey: SERVICE_KEY.substring(0, 20) + '...',
    baseUrl: BASE_URL,
    summary: {
      total: testResults.length,
      success: successCount,
      error: errorCount,
      totalDataCount
    },
    results: testResults
  };
  
  await fs.promises.writeFile(
    'api-test-results.json', 
    JSON.stringify(testReport, null, 2)
  );
  
  console.log('\n💾 상세 결과가 api-test-results.json에 저장되었습니다.');
  
  if (successCount === testResults.length) {
    console.log('\n🎉 모든 API 테스트가 성공했습니다!');
  } else {
    console.log(`\n⚠️  ${errorCount}개의 API에서 오류가 발생했습니다.`);
  }
  
  return testReport;
}

// 메인 실행
runAllTests().catch(console.error);