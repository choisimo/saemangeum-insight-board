# .gitignore 보안 가이드
# Git Ignore Security Guide

## 📋 개요

새만금 인사이트 대시보드 프로젝트의 보안 및 파일 관리를 위한 포괄적인 .gitignore 설정입니다.

## 🔒 보안 우선순위

### 1. 최고 우선순위 (Critical)
- **API 키 및 인증 정보**: `.env`, `*.key`, `credentials/`
- **개인정보 포함 데이터**: `real-data/`, `sensitive/`
- **프로덕션 설정**: `.env.production`, `config.prod.*`

### 2. 높은 우선순위 (High)
- **백업 파일**: `*.backup`, `*.bak`
- **로그 파일**: `*.log`, `logs/`
- **임시 파일**: `tmp/`, `*.tmp`

### 3. 중간 우선순위 (Medium)
- **빌드 결과물**: `dist/`, `build/`
- **의존성**: `node_modules/`
- **캐시 파일**: `.cache/`, `.npm/`

## 📁 디렉토리별 .gitignore 구성

### 루트 디렉토리 (`/.gitignore`)
```
/
├── .gitignore          # 전체 프로젝트 보안 설정
├── code/
├── datasets/
├── docs/
└── ppt/
```

**주요 보호 대상**:
- 🔐 민감한 정보 (API 키, 인증서)
- 📦 빌드 결과물
- 🗂️ 대용량 파일
- 💾 캐시 및 임시 파일

### 코드 디렉토리 (`/code/.gitignore`)
```
Frontend Development Specific:
- Node.js 빌드 아티팩트
- TypeScript 컴파일 결과
- 번들 분석 결과
- 테스트 커버리지
```

### 데이터셋 디렉토리 (`/datasets/.gitignore`)
```
Data Security Focus:
- 실제 개인정보 데이터
- 대용량 CSV 파일
- API 응답 샘플 (민감한)
- 데이터 처리 로그
```

### 문서 디렉토리 (`/docs/.gitignore`)
```
Documentation Security:
- 내부 전용 문서
- API 키 포함 문서
- 자동 생성 문서
- 고해상도 이미지
```

### 프레젠테이션 디렉토리 (`/ppt/.gitignore`)
```
Presentation Specific:
- PowerPoint 임시 파일
- 자동 저장 파일
- 폰트 라이선스 파일
- 비디오 출력 파일
```

## 🛡️ 보안 체크리스트

### ✅ 필수 확인 사항

1. **환경변수 파일**
   - [ ] `.env` 파일들이 모두 제외되었는가?
   - [ ] `.env.example`만 포함되었는가?
   - [ ] 실제 API 키가 커밋되지 않았는가?

2. **민감한 데이터**
   - [ ] 실제 개인정보 데이터가 제외되었는가?
   - [ ] API 응답 샘플에 민감한 정보가 없는가?
   - [ ] 인증서 파일들이 제외되었는가?

3. **로그 및 임시 파일**
   - [ ] 모든 로그 파일이 제외되었는가?
   - [ ] 임시 디렉토리가 제외되었는가?
   - [ ] 백업 파일들이 제외되었는가?

4. **빌드 결과물**
   - [ ] `node_modules/`가 제외되었는가?
   - [ ] `dist/`, `build/` 디렉토리가 제외되었는가?
   - [ ] 컴파일된 파일들이 제외되었는가?

### ⚠️ 주의사항

1. **전역 .gitignore 설정**
```bash
# 사용자 전역 설정
git config --global core.excludesfile ~/.gitignore_global
```

2. **이미 커밋된 파일 제거**
```bash
# 캐시에서 제거 (파일은 유지)
git rm --cached filename

# 디렉토리 제거
git rm -r --cached directory/
```

3. **민감한 파일 히스토리 제거**
```bash
# BFG Repo-Cleaner 사용 권장
# 또는 git filter-branch (복잡함)
```

## 🔍 파일 타입별 분류

### 🔐 보안 관련 (Security)
```
.env*                 # 환경변수
*.key, *.pem         # 인증서
secrets/             # 비밀 정보
credentials/         # 인증 정보
```

### 📦 빌드 관련 (Build)
```
node_modules/        # 의존성
dist/, build/        # 빌드 결과
*.js.map            # 소스맵
bundle-analyzer/     # 번들 분석
```

### 💾 데이터 관련 (Data)
```
*.large.csv         # 대용량 데이터
real-data/          # 실제 데이터
backup/             # 백업 파일
*.sql, *.dump       # DB 덤프
```

### 🛠️ 개발 도구 (Development)
```
.vscode/            # 에디터 설정
.idea/              # IDE 설정
*.log               # 로그 파일
coverage/           # 테스트 커버리지
```

### 🖥️ 시스템 파일 (System)
```
.DS_Store           # macOS
Thumbs.db           # Windows
*~                  # Linux 백업
*.swp               # Vim
```

## 📋 체크 명령어

### 현재 무시된 파일 확인
```bash
# 무시된 파일 목록 보기
git status --ignored

# 특정 파일이 무시되는지 확인
git check-ignore filename

# .gitignore 규칙 디버깅
git check-ignore -v filename
```

### 실수로 커밋된 파일 확인
```bash
# 큰 파일 찾기
git rev-list --objects --all | sort -k 2 | cut -f 2 -d\ | uniq | while read filename; do echo "$(git log --pretty=format:%s $filename | wc -l) $filename"; done | sort -rn | head -10

# 민감한 패턴 검색
git log --all --full-history -- "*.env*"
git log --all --full-history -- "*secret*"
git log --all --full-history -- "*key*"
```

## 🚨 긴급 대응

### 민감한 정보가 커밋된 경우

1. **즉시 조치**
```bash
# 파일을 .gitignore에 추가
echo "sensitive-file.txt" >> .gitignore

# 캐시에서 제거
git rm --cached sensitive-file.txt

# 커밋
git commit -m "Remove sensitive file from tracking"
```

2. **히스토리에서 완전 제거**
```bash
# BFG Repo-Cleaner 사용 (권장)
bfg --delete-files sensitive-file.txt

# 또는 git filter-branch (복잡)
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch sensitive-file.txt' \
--prune-empty --tag-name-filter cat -- --all
```

3. **원격 저장소 강제 업데이트**
```bash
git push origin --force --all
git push origin --force --tags
```

## 📚 참고 자료

- [Git Documentation - gitignore](https://git-scm.com/docs/gitignore)
- [GitHub gitignore templates](https://github.com/github/gitignore)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)

---

**마지막 업데이트**: 2025-07-29  
**버전**: 1.0  
**관리자**: 새만금 인사이트 대시보드 개발팀