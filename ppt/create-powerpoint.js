// PowerPoint 자동 생성 스크립트 (Node.js + pptxgenjs)
// npm install pptxgenjs 설치 후 실행

const PptxGenJS = require('pptxgenjs');

// 프레젠테이션 생성
let pptx = new PptxGenJS();

// 기본 설정
pptx.author = '삼인성호(三人成虎)';
pptx.company = '전북대학교';
pptx.subject = 'AI 기반 수요 예측을 통한 전북 제약산업 혁신 플랫폼 제안';
pptx.title = '2025년 JB선도산업 육성방안 탐구지원사업 발표자료';

// 슬라이드 1: 표지
let slide1 = pptx.addSlide();
slide1.background = { fill: 'F8FAFC' };
slide1.addText('AI 기반 수요 예측을 통한\n전북 제약산업 혁신 플랫폼 제안', {
    x: 1, y: 1.5, w: 8, h: 2,
    fontSize: 36, bold: true, color: '1E40AF',
    align: 'center'
});
slide1.addText('2025년 JB선도산업 육성방안 탐구지원사업 발표자료', {
    x: 1, y: 3.5, w: 8, h: 0.5,
    fontSize: 20, color: '6B7280',
    align: 'center'
});

// 팀 정보 박스
slide1.addShape(pptx.ShapeType.rect, {
    x: 1, y: 4.5, w: 8, h: 2,
    fill: { color: 'FFFFFF', transparency: 20 },
    line: { color: 'E5E7EB', width: 1 }
});

slide1.addText('탐구 주제: AI 기반 수요 예측 시스템을 통한 도내 제약회사 재고 관리 및 영업 지원 플랫폼 제안', {
    x: 1.5, y: 4.8, w: 7, h: 0.5,
    fontSize: 14, color: '374151'
});

slide1.addText('팀명: 삼인성호(三人成虎)', {
    x: 1.5, y: 5.3, w: 7, h: 0.4,
    fontSize: 16, bold: true, color: 'DC2626'
});

slide1.addText('팀원: 정우주(팀장), 김경민, 최시몬', {
    x: 1.5, y: 5.8, w: 7, h: 0.4,
    fontSize: 14, color: '374151'
});

// 슬라이드 2: 문제 제기
let slide2 = pptx.addSlide();
slide2.background = { fill: 'FEF2F2' };
slide2.addText('문제 제기: 우리가 풀어야 할 과제', {
    x: 1, y: 0.5, w: 8, h: 1,
    fontSize: 32, bold: true, color: 'DC2626',
    align: 'center'
});

slide2.addText('의약품 공급 불안, 더는 지켜볼 수 없는 현실입니다.', {
    x: 1, y: 1.3, w: 8, h: 0.5,
    fontSize: 18, color: 'B91C1C',
    align: 'center'
});

// ADHD 치료제 품절 대란
slide2.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 2.5, w: 4, h: 3,
    fill: { color: 'FFFFFF' },
    line: { color: 'EF4444', width: 3 }
});

slide2.addText('ADHD 치료제 품절 대란', {
    x: 0.8, y: 2.8, w: 3.4, h: 0.5,
    fontSize: 18, bold: true, color: '1F2937'
});

slide2.addText('• 2024년 하반기 발생\n• 데이터 기반 수요 예측 시스템의 부재로\n• 33만 명 ADHD 환자 치료 중단 위기', {
    x: 0.8, y: 3.5, w: 3.4, h: 1.5,
    fontSize: 12, color: '374151'
});

// 고가·희귀의약품 공급난
slide2.addShape(pptx.ShapeType.rect, {
    x: 5.5, y: 2.5, w: 4, h: 3,
    fill: { color: 'FFFFFF' },
    line: { color: 'F97316', width: 3 }
});

slide2.addText('고가·희귀의약품 공급난', {
    x: 5.8, y: 2.8, w: 3.4, h: 0.5,
    fontSize: 18, bold: true, color: '1F2937'
});

slide2.addText('• 최근 5년간 지속적 문제\n• 71개 희귀의약품 품목 수급 불안정\n• 48개 품목 여전히 불안정\n• 복잡한 공급망 관리의 어려움', {
    x: 5.8, y: 3.5, w: 3.4, h: 1.5,
    fontSize: 12, color: '374151'
});

// 슬라이드 3: 왜 전북인가?
let slide3 = pptx.addSlide();
slide3.background = { fill: 'F0FDF4' };
slide3.addText('왜 \'전북\'이 최적의 기회인가?', {
    x: 1, y: 0.5, w: 8, h: 1,
    fontSize: 32, bold: true, color: '059669',
    align: 'center'
});

slide3.addText('전북은 AI 헬스케어 혁신을 선도할 최적의 테스트베드입니다.', {
    x: 1, y: 1.3, w: 8, h: 0.5,
    fontSize: 18, color: '047857',
    align: 'center'
});

// 정책적 기회
slide3.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 2.5, w: 4, h: 3,
    fill: { color: 'FFFFFF' },
    line: { color: '3B82F6', width: 3 }
});

slide3.addText('정책적 기회', {
    x: 0.8, y: 2.8, w: 3.4, h: 0.5,
    fontSize: 18, bold: true, color: '1F2937'
});

slide3.addText('2025년 핵심 정책 변화:\n• 의약품 RFID 시스템 도입 의무화\n• 정부의 고가약 사후관리 강화\n\n⚡ 도내 제약사들의 디지털 전환이 시급한 상황', {
    x: 0.8, y: 3.3, w: 3.4, h: 2,
    fontSize: 12, color: '374151'
});

// 구조적 이점
slide3.addShape(pptx.ShapeType.rect, {
    x: 5.5, y: 2.5, w: 4, h: 3,
    fill: { color: 'FFFFFF' },
    line: { color: '10B981', width: 3 }
});

slide3.addText('구조적 이점', {
    x: 5.8, y: 2.8, w: 3.4, h: 0.5,
    fontSize: 18, bold: true, color: '1F2937'
});

slide3.addText('완벽한 테스트베드 환경:\n• 전북 지역 제약사 네트워크\n• 밀집된 약국 네트워크\n• 빠른 적용과 효과 검증이 유리한 환경', {
    x: 5.8, y: 3.3, w: 3.4, h: 2,
    fontSize: 12, color: '374151'
});

// 슬라이드 4: 해결책
let slide4 = pptx.addSlide();
slide4.background = { fill: 'EFF6FF' };
slide4.addText('우리의 해결책: AI 혁신 플랫폼', {
    x: 1, y: 0.5, w: 8, h: 1,
    fontSize: 32, bold: true, color: '2563EB',
    align: 'center'
});

slide4.addText('데이터로 재고를 최적화하고, 환자의 안정적인 치료를 보장합니다.', {
    x: 1, y: 1.3, w: 8, h: 0.5,
    fontSize: 18, color: '1D4ED8',
    align: 'center'
});

// 솔루션 개요
slide4.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 2, w: 9, h: 1,
    fill: { color: 'FFFFFF' },
    line: { color: '3B82F6', width: 2 }
});

slide4.addText('AI 수요 예측 및 영업 지원 플랫폼 PoC 개발', {
    x: 1, y: 2.3, w: 8, h: 0.5,
    fontSize: 20, bold: true, color: '1F2937',
    align: 'center'
});

// 3가지 핵심 기능
const features = [
    {
        title: '재고 최적화',
        content: '• AI 수요 예측\n• 품절 최소화\n• 폐기 최소화',
        color: '10B981'
    },
    {
        title: '영업 지원',
        content: '• Next Best Action\n• 데이터 기반 최적 활동 추천\n• 성과 향상',
        color: '8B5CF6'
    },
    {
        title: '기대 효과',
        content: '• 안정적 공급망\n• 환자 치료 연속성\n• 지역 기반 네트워크',
        color: '059669'
    }
];

features.forEach((feature, index) => {
    const x = 0.5 + (index * 3);
    slide4.addShape(pptx.ShapeType.rect, {
        x: x, y: 3.5, w: 2.8, h: 2.5,
        fill: { color: 'FFFFFF' },
        line: { color: feature.color, width: 2 }
    });
    
    slide4.addText(feature.title, {
        x: x + 0.1, y: 3.7, w: 2.6, h: 0.5,
        fontSize: 16, bold: true, color: '1F2937'
    });
    
    slide4.addText(feature.content, {
        x: x + 0.1, y: 4.3, w: 2.6, h: 1.5,
        fontSize: 11, color: '374151'
    });
});

// 슬라이드 5: 프로젝트 목표
let slide5 = pptx.addSlide();
slide5.background = { fill: 'FFFBEB' };
slide5.addText('프로젝트 목표: 명확한 성과를 약속합니다', {
    x: 1, y: 0.5, w: 8, h: 1,
    fontSize: 28, bold: true, color: 'D97706',
    align: 'center'
});

// 최종 목표
slide5.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 1.8, w: 9, h: 1.2,
    fill: { color: 'FFFFFF' },
    line: { color: 'F59E0B', width: 2 }
});

slide5.addText('최종 목표', {
    x: 1, y: 2, w: 8, h: 0.4,
    fontSize: 20, bold: true, color: '1F2937',
    align: 'center'
});

slide5.addText('AI 수요 예측 플랫폼 PoC를 통해 전북 제약 산업의 재고 최적화 모델 제시', {
    x: 1, y: 2.5, w: 8, h: 0.4,
    fontSize: 16, color: '374151',
    align: 'center'
});

// 정량 목표
const goals = [
    { title: '의약품 품절률', value: '60%', unit: '감소', color: 'DC2626' },
    { title: '의약품 폐기율', value: '50%', unit: '감소', color: 'EA580C' },
    { title: '재고 회전일', value: '30%', unit: '단축', color: '059669' }
];

slide5.addText('정량 목표 (PoC 참여 제약사 기준)', {
    x: 1, y: 3.5, w: 8, h: 0.5,
    fontSize: 18, bold: true, color: '1F2937',
    align: 'center'
});

goals.forEach((goal, index) => {
    const x = 0.8 + (index * 2.8);
    slide5.addShape(pptx.ShapeType.rect, {
        x: x, y: 4.2, w: 2.4, h: 2,
        fill: { color: 'FFFFFF' },
        line: { color: goal.color, width: 2 }
    });
    
    slide5.addText(goal.title, {
        x: x + 0.1, y: 4.4, w: 2.2, h: 0.4,
        fontSize: 14, bold: true, color: '1F2937',
        align: 'center'
    });
    
    slide5.addText(goal.value, {
        x: x + 0.1, y: 4.9, w: 2.2, h: 0.6,
        fontSize: 36, bold: true, color: goal.color,
        align: 'center'
    });
    
    slide5.addText(goal.unit, {
        x: x + 0.1, y: 5.6, w: 2.2, h: 0.4,
        fontSize: 16, bold: true, color: goal.color,
        align: 'center'
    });
});

// 슬라이드 6-10은 동일한 패턴으로 생성...
// (간략화하여 핵심 내용만 포함)

// 마지막 슬라이드: 감사합니다
let slideEnd = pptx.addSlide();
slideEnd.background = { fill: 'F8FAFC' };
slideEnd.addText('감사합니다', {
    x: 1, y: 2, w: 8, h: 1.5,
    fontSize: 48, bold: true, color: '1F2937',
    align: 'center'
});

slideEnd.addText('2025년 JB선도산업 육성방안 탐구지원사업', {
    x: 1, y: 3.8, w: 8, h: 0.6,
    fontSize: 20, color: '6B7280',
    align: 'center'
});

slideEnd.addText('AI 기반 수요 예측을 통한 전북 제약산업 혁신 플랫폼 제안', {
    x: 1, y: 4.5, w: 8, h: 0.6,
    fontSize: 16, bold: true, color: '2563EB',
    align: 'center'
});

// 연락처
slideEnd.addShape(pptx.ShapeType.rect, {
    x: 2, y: 5.5, w: 6, h: 1,
    fill: { color: 'FFFFFF' },
    line: { color: 'E5E7EB', width: 1 }
});

slideEnd.addText('팀 삼인성호 연락처\n정우주(팀장) | 김경민 | 최시몬', {
    x: 2.2, y: 5.7, w: 5.6, h: 0.6,
    fontSize: 12, color: '374151',
    align: 'center'
});

// PowerPoint 파일 저장
pptx.writeFile({ fileName: 'AI기반_수요예측_전북제약산업혁신플랫폼.pptx' })
    .then(() => {
        console.log('PowerPoint 파일이 성공적으로 생성되었습니다!');
    })
    .catch(err => {
        console.error('파일 생성 중 오류 발생:', err);
    });