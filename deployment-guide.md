# 배포 가이드

## nginx 설정 파일 배포

### 1. HTTP 전용 설정 (nginx.conf)
현재 프로젝트에서 HTTP로만 서비스할 경우:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/saemangeum.nodove.com
sudo ln -s /etc/nginx/sites-available/saemangeum.nodove.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 2. HTTPS 설정 (nginx-ssl.conf)
SSL 인증서가 있는 경우:

1. SSL 인증서 준비:
   ```bash
   # Let's Encrypt 사용 예시
   sudo certbot --nginx -d saemangeum.nodove.com
   ```

2. nginx 설정 적용:
   ```bash
   sudo cp nginx-ssl.conf /etc/nginx/sites-available/saemangeum.nodove.com
   sudo ln -s /etc/nginx/sites-available/saemangeum.nodove.com /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### 3. 도메인 설정
DNS에서 saemangeum.nodove.com을 서버 IP로 A 레코드 설정

### 4. 파일 권한 설정
```bash
sudo chown -R www-data:www-data /workspace/saemangeum-insight-board-0730/code/dist
sudo chmod -R 755 /workspace/saemangeum-insight-board-0730/code/dist
```

### 5. 방화벽 설정
```bash
sudo ufw allow 'Nginx Full'
```

## 주요 설정 내용

- **도메인**: saemangeum.nodove.com
- **루트 디렉토리**: /workspace/saemangeum-insight-board-0730/code/dist
- **SPA 라우팅**: React Router 지원
- **정적 파일 캐싱**: 1년
- **Gzip 압축**: 활성화
- **보안 헤더**: 추가됨
- **API 프록시**: /api/ 경로 (포트 3001로)