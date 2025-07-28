#!/bin/bash
# 새만금 인사이트 대시보드 - Pre-commit Hook
# Saemangeum Insight Dashboard - Pre-commit Security Check

echo "🔍 보안 검사를 실행합니다..."

# 민감한 파일 패턴 검사
sensitive_patterns=(
    "\.env$"
    "\.env\."
    "password"
    "secret"
    "key.*="
    "token.*="
    "api.*key"
    "credential"
    "private.*key"
)

# 커밋할 파일 목록 가져오기
files=$(git diff --cached --name-only)

# 민감한 패턴 검사
for file in $files; do
    for pattern in "${sensitive_patterns[@]}"; do
        if echo "$file" | grep -iE "$pattern" > /dev/null; then
            echo "❌ 민감한 파일이 감지되었습니다: $file"
            echo "   패턴: $pattern"
            echo "   .gitignore에 추가하거나 파일을 제거하세요."
            exit 1
        fi
    done
    
    # 파일 내용에서 민감한 정보 검사
    if [ -f "$file" ]; then
        if grep -iE "(api.*key|password|secret|token).*=.*[a-zA-Z0-9]{20}" "$file" > /dev/null; then
            echo "❌ 파일 내용에 민감한 정보가 포함되어 있습니다: $file"
            echo "   API 키나 패스워드가 하드코딩되어 있는지 확인하세요."
            exit 1
        fi
    fi
done

# 파일 크기 검사 (10MB 이상)
for file in $files; do
    if [ -f "$file" ]; then
        size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null)
        if [ "$size" -gt 10485760 ]; then
            echo "❌ 큰 파일이 감지되었습니다: $file ($(($size / 1024 / 1024))MB)"
            echo "   Git LFS 사용을 고려하거나 .gitignore에 추가하세요."
            exit 1
        fi
    fi
done

echo "✅ 보안 검사를 통과했습니다."
exit 0