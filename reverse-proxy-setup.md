# Reverse Proxy 설정 적용 가이드

## 1. 설정 파일 복사 및 활성화

다음 명령어를 sudo 권한으로 실행하세요:

```bash
# 기존 설정 제거 (만약 있다면)
sudo rm -f /etc/nginx/sites-enabled/saemangeum
sudo rm -f /etc/nginx/sites-available/saemangeum.nodove.com

# HTTP 버전 설정 적용
sudo cp /workspace/saemangeum-insight-board-0730/saemangeum.nodove.com-http.conf /etc/nginx/sites-available/saemangeum.nodove.com

# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/saemangeum.nodove.com /etc/nginx/sites-enabled/

# nginx 설정 테스트
sudo nginx -t

# nginx 재로드
sudo systemctl reload nginx
```

## 2. SSL 인증서가 있는 경우

Let's Encrypt를 사용한다면:

```bash
# SSL 인증서 생성
sudo certbot --nginx -d saemangeum.nodove.com

# 또는 수동으로 HTTPS 버전 적용
sudo cp /workspace/saemangeum-insight-board-0730/saemangeum.nodove.com.conf /etc/nginx/sites-available/saemangeum.nodove.com
sudo systemctl reload nginx
```

## 3. 접속 방법

설정 완료 후:
- HTTP: http://saemangeum.nodove.com
- HTTPS: https://saemangeum.nodove.com (SSL 인증서 설치 후)

## 4. 현재 상태

- 백엔드 서버: http://127.0.0.1:8081 (내부 접근만)
- 프론트엔드: nginx reverse proxy를 통해 외부 접근
- 포트 노출: 없음 (80/443만 사용)

## 5. 헬스체크

```bash
curl http://saemangeum.nodove.com/health
```

이 설정으로 포트 8081을 직접 노출하지 않고 표준 HTTP/HTTPS 포트를 통해 접근할 수 있습니다.