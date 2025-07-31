const axios = require('axios');

async function testFrontendAPIs() {
  console.log('🔧 프론트엔드 API 연동 테스트 시작\n');
  
  // 백엔드 API 테스트
  const backendTests = [
    { name: 'Weather API', url: 'http://localhost:3001/api/weather' },
    { name: 'Traffic API', url: 'http://localhost:3001/api/traffic' },
    { name: 'Renewable API', url: 'http://localhost:3001/api/renewable' },
    { name: 'Investment API', url: 'http://localhost:3001/api/investment' }
  ];

  console.log('📡 백엔드 API 테스트:');
  for (const test of backendTests) {
    try {
      const response = await axios.get(test.url, { timeout: 5000 });
      const dataType = Array.isArray(response.data) ? 'Array' : 'Object';
      const count = Array.isArray(response.data) ? response.data.length : 
                   (response.data.response?.body?.items?.item?.length || 'N/A');
      console.log(`✅ ${test.name}: ${dataType} (${count} items)`);
    } catch (error) {
      console.log(`❌ ${test.name}: ${error.message}`);
    }
  }

  // 프론트엔드 서버 테스트
  console.log('\n🌐 프론트엔드 서버 테스트:');
  try {
    // 여러 포트 시도
    const ports = [8883, 5173, 3000, 4173];
    let frontendUrl = null;
    
    for (const port of ports) {
      try {
        const response = await axios.get(`http://localhost:${port}`, { 
          timeout: 2000,
          validateStatus: () => true 
        });
        if (response.status === 200) {
          frontendUrl = `http://localhost:${port}`;
          console.log(`✅ 프론트엔드 서버 발견: ${frontendUrl}`);
          break;
        }
      } catch (err) {
        // 포트를 찾지 못함
      }
    }
    
    if (!frontendUrl) {
      console.log('❌ 프론트엔드 서버를 찾을 수 없습니다');
    }
  } catch (error) {
    console.log(`❌ 프론트엔드 서버 테스트 실패: ${error.message}`);
  }

  console.log('\n📊 Mock 데이터 샘플:');
  try {
    const weatherRes = await axios.get('http://localhost:3001/api/weather');
    const trafficRes = await axios.get('http://localhost:3001/api/traffic');
    
    console.log('기상 데이터 샘플:', JSON.stringify(weatherRes.data.response.body.items.item[0], null, 2));
    console.log('교통량 데이터 샘플:', JSON.stringify(trafficRes.data[0], null, 2));
  } catch (error) {
    console.log('❌ 샘플 데이터 로드 실패:', error.message);
  }

  console.log('\n✅ API 연동 테스트 완료!');
  console.log('💡 프론트엔드에서 브라우저 개발자 도구 콘솔을 확인하여 실제 데이터 로딩을 확인하세요.');
}

// 스크립트 실행
testFrontendAPIs().catch(console.error);