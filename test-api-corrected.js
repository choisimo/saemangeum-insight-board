#!/usr/bin/env node

// 새만금 공공데이터 API 테스트 스크립트 (data.go.kr 공식 API 형식)

const SERVICE_KEY = '4DynfiNb5l3cgZ34kFi2mqrHawIruUhNLUP+Gx93TiB1zPg1K3rmvc7lftSco4h5iSprU05i3OEuzklaPckFBA==';

// 실제 data.go.kr API 엔드포인트들 (올바른 형식)
const TEST_ENDPOINTS = [
  {
    name: '초단기예보조회',
    url: 'https://api.odcloud.kr/api/15138305/v1/uddi:acd5c118-0357-42a4-83c5-ae09cdb47265',
    description: '새만금 기상정보 초단기예보조회',
    requiredParams: {
      base_date: '20250129',
      base_time: '1400',
      nx: '244',
      ny: '526'
    }
  },
  {
    name: '초단기실황조회', 
    url: 'https://api.odcloud.kr/api/15138304/v1/uddi:83bddb37-95d5-4fe1-8e1e-8d4e8d56e1f5',
    description: '새만금 기상정보 초단기실황조회',
    requiredParams: {
      base_date: '20250129',
      base_time: '1400',
      nx: '244',
      ny: '526'
    }
  },
  {
    name: '재생에너지사업정보',
    url: 'https://api.odcloud.kr/api/15068848/v1/uddi:1743c432-d853-40d9-9c4a-9076e4f35ce9',
    description: '새만금 재생에너지 사업 정보',
    requiredParams: {}
  },
  {
    name: '산업단지유틸리티현황',
    url: 'https://api.odcloud.kr/api/15120069/v1/uddi:b763f323-2d2b-4ad3-aaab-91c1de9c4323',
    description: '새만금지역 산업단지 유틸리티 현황',
    requiredParams: {}
  },
  {
    name: '건축물허가현황',
    url: 'https://api.odcloud.kr/api/15006164/v1/uddi:55aa5c8a-090d-4db0-a99e-a20a2c9b4117',
    description: '새만금사업지역 건축물 허가현황',
    requiredParams: {}
  },
  {
    name: '투자인센티브보조금지원현황',
    url: 'https://api.odcloud.kr/api/15121622/v1/uddi:d8e95b9d-7808-4643-b2f5-c1fa1a649ede',
    description: '새만금 투자 인센티브 보조금지원 현황',
    requiredParams: {}
  },
  {
    name: '지적공부',
    url: 'https://api.odcloud.kr/api/15007965/v1/uddi:dd236945-0c76-455b-9c3f-b6e87041b8de',
    description: '새만금사업지역 지적공부',
    requiredParams: {}
  },
  {
    name: '매립정보',
    url: 'https://api.odcloud.kr/api/15040597/v1/uddi:df247c12-617e-44aa-86fe-d08a37ed729f',
    description: '새만금사업 매립 정보',
    requiredParams: {}
  },
  {
    name: '방조제교통량',
    url: 'https://api.odcloud.kr/api/15002284/v1/uddi:a2608cef-b4b7-4645-a5b1-9fc28bbe918a',
    description: '새만금 방조제 교통량',
    requiredParams: {}
  }
];

// API 파라미터 빌더 (올바른 형식)
function buildApiParams(endpointInfo, options = {}) {
  const params = new URLSearchParams();
  params.append('serviceKey', SERVICE_KEY);
  params.append('page', (options.page || 1).toString());
  params.append('perPage', (options.perPage || 10).toString());
  
  // 필수 파라미터 추가
  Object.entries(endpointInfo.requiredParams || {}).forEach(([key, value]) => {
    params.append(key, value);
  });
  
  // 추가 파라미터가 있다면 포함
  Object.entries(options).forEach(([key, value]) => {
    if (key !== 'page' && key !== 'perPage' && value !== undefined) {
      params.append(key, value.toString());
    }
  });
  
  return params;
}

// HTTP 요청 함수
async function apiRequest(url, params) {
  const requestUrl = `${url}?${params.toString()}`;
  console.log(`📡 API 요청: ${requestUrl}`);

  const response = await fetch(requestUrl, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '응답 본문 읽기 실패');
    throw new Error(`API 요청 실패: ${response.status} - ${response.statusText}\\n응답: ${errorText}`);
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
  const { name, url, description, requiredParams } = endpointInfo;
  console.log(`\\n🔍 테스트 중: ${name} (${description})`);
  console.log(`📡 API URL: ${url}`);
  
  if (Object.keys(requiredParams).length > 0) {
    console.log(`📋 필수 파라미터:`, JSON.stringify(requiredParams, null, 2));
  }
  
  const startTime = Date.now();
  
  try {
    // API 파라미터 구성
    const params = buildApiParams(endpointInfo, { 
      page: 1, 
      perPage: 5  // 테스트용으로 적은 수
    });
    
    // API 호출
    const response = await withRetry(() => 
      apiRequest(url, params)
    );
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // 응답 분석
    let dataCount = 0;
    let totalCount = 0;
    let sampleData = null;
    let responseStructure = [];
    
    // 다양한 응답 형태 처리
    if (response.data && Array.isArray(response.data)) {
      dataCount = response.data.length;
      totalCount = response.totalCount || response.data.length;
      sampleData = response.data.slice(0, 1);
      if (response.data.length > 0) {
        responseStructure = Object.keys(response.data[0]);
      }
    } else if (response.items && Array.isArray(response.items)) {
      dataCount = response.items.length;
      totalCount = response.totalCount || response.items.length;
      sampleData = response.items.slice(0, 1);
      if (response.items.length > 0) {
        responseStructure = Object.keys(response.items[0]);
      }
    } else if (Array.isArray(response)) {
      dataCount = response.length;
      totalCount = response.length;
      sampleData = response.slice(0, 1);
      if (response.length > 0) {
        responseStructure = Object.keys(response[0]);
      }
    } else if (response.result && Array.isArray(response.result)) {
      dataCount = response.result.length;
      totalCount = response.totalCount || response.result.length;
      sampleData = response.result.slice(0, 1);
      if (response.result.length > 0) {
        responseStructure = Object.keys(response.result[0]);
      }
    } else {
      // 단일 객체 또는 다른 형태의 응답
      sampleData = response;
      responseStructure = Object.keys(response);
      dataCount = 1;
      totalCount = 1;
    }
    
    const result = {
      name,
      url,
      description,
      status: 'SUCCESS',
      responseTime: `${responseTime}ms`,
      dataCount,
      totalCount,
      sampleData,
      responseStructure,
      fullResponse: response, // 전체 응답 구조 확인용
      error: null
    };
    
    testResults.push(result);
    
    console.log(`✅ 성공! 응답시간: ${responseTime}ms`);
    console.log(`📊 데이터 개수: ${dataCount}/${totalCount}`);
    
    if (responseStructure.length > 0) {
      console.log(`📋 데이터 구조:`, responseStructure.join(', '));
    }
    
    if (sampleData && sampleData.length > 0) {
      console.log(`📄 샘플 데이터:`, JSON.stringify(sampleData[0], null, 2));
    } else if (sampleData) {
      console.log(`📄 응답 데이터:`, JSON.stringify(sampleData, null, 2));
    }
    
    return result;
    
  } catch (error) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    const result = {
      name,
      url,
      description,
      status: 'ERROR',
      responseTime: `${responseTime}ms`,
      dataCount: 0,
      totalCount: 0,
      sampleData: null,
      responseStructure: [],
      fullResponse: null,
      error: error.message
    };
    
    testResults.push(result);
    
    console.log(`❌ 실패! 응답시간: ${responseTime}ms`);
    console.log(`🔴 오류: ${error.message}`);
    
    return result;
  }
}

async function runAllTests() {
  console.log('🚀 새만금 공공데이터 API 테스트 시작 (올바른 형식)');
  console.log('🔑 서비스키:', SERVICE_KEY.substring(0, 20) + '...');
  console.log('🌐 API 서버: api.odcloud.kr');
  console.log('='.repeat(80));
  
  // 모든 엔드포인트 순차적으로 테스트
  for (const endpoint of TEST_ENDPOINTS) {
    await testEndpoint(endpoint);
    // API 호출 간격을 두어 서버 부하 방지
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // 테스트 결과 요약
  console.log('\\n' + '='.repeat(80));
  console.log('📊 테스트 결과 요약');
  console.log('='.repeat(80));
  
  const successCount = testResults.filter(r => r.status === 'SUCCESS').length;
  const errorCount = testResults.filter(r => r.status === 'ERROR').length;
  const totalDataCount = testResults.reduce((sum, r) => sum + r.dataCount, 0);
  
  console.log(`✅ 성공: ${successCount}/${testResults.length}`);
  console.log(`❌ 실패: ${errorCount}/${testResults.length}`);
  console.log(`📊 총 데이터 건수: ${totalDataCount}`);
  
  // 개별 결과 표시
  console.log('\\n📋 개별 테스트 결과:');
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
    console.log('\\n📊 성공한 엔드포인트 데이터 구조:');
    successfulEndpoints.forEach(result => {
      console.log(`\\n✅ ${result.name}:`);
      console.log(`   데이터 개수: ${result.dataCount}/${result.totalCount}`);
      if (result.responseStructure.length > 0) {
        console.log(`   필드 구조: ${result.responseStructure.join(', ')}`);
      }
    });
  }
  
  // 실패한 엔드포인트가 있으면 상세 정보 출력
  const failedEndpoints = testResults.filter(r => r.status === 'ERROR');
  if (failedEndpoints.length > 0) {
    console.log('\\n🔍 실패한 엔드포인트 상세:');
    failedEndpoints.forEach(result => {
      console.log(`\\n❌ ${result.name}`);
      console.log(`   URL: ${result.url}`);
      console.log(`   오류: ${result.error}`);
    });
  }
  
  // JSON 파일로 상세 결과 저장
  const fs = await import('fs');
  const testReport = {
    timestamp: new Date().toISOString(),
    serviceKey: SERVICE_KEY.substring(0, 20) + '...',
    server: 'api.odcloud.kr',
    summary: {
      total: testResults.length,
      success: successCount,
      error: errorCount,
      totalDataCount
    },
    results: testResults
  };
  
  await fs.promises.writeFile(
    'api-test-results-corrected.json', 
    JSON.stringify(testReport, null, 2)
  );
  
  console.log('\\n💾 상세 결과가 api-test-results-corrected.json에 저장되었습니다.');
  
  if (successCount === testResults.length) {
    console.log('\\n🎉 모든 API 테스트가 성공했습니다!');
  } else if (successCount > 0) {
    console.log(`\\n✨ ${successCount}개의 API 테스트가 성공했습니다!`);
    console.log(`⚠️  ${errorCount}개의 API에서 오류가 발생했습니다.`);
  } else {
    console.log(`\\n⚠️  모든 API에서 오류가 발생했습니다.`);
  }
  
  return testReport;
}

// 메인 실행
runAllTests().catch(console.error);