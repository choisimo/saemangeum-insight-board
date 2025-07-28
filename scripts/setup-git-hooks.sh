#!/bin/bash
# 새만금 인사이트 대시보드 - Git Hook 설정 스크립트
# Saemangeum Insight Dashboard - Git Hook Setup Script

echo "🔧 Git 보안 훅을 설정합니다..."

# Git 프로젝트 루트 확인
if [ ! -d ".git" ]; then
    echo "❌ Git 프로젝트 루트에서 실행해주세요."
    exit 1
fi

# hooks 디렉토리 생성
mkdir -p .git/hooks

# pre-commit 훅 복사
cp scripts/pre-commit-security-check.sh .git/hooks/pre-commit

# 실행 권한 부여
chmod +x .git/hooks/pre-commit

echo "✅ Git 보안 훅이 설정되었습니다."
echo ""
echo "📋 설정된 기능:"
echo "   - 민감한 파일 패턴 검사"
echo "   - 파일 내용 보안 검사"
echo "   - 대용량 파일 검사"
echo ""
echo "🚨 주의: 이제 커밋 시 자동으로 보안 검사가 실행됩니다."
echo "   검사를 우회하려면 'git commit --no-verify' 사용"
echo ""
echo "🔍 테스트하려면: git commit -m \"test\""