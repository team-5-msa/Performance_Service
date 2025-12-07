# Vercel 자동 배포 설정 가이드

이 문서는 GitHub Actions를 통한 Vercel 자동 배포를 설정하는 방법을 단계별로 안내합니다.

## 📋 사전 요구사항

- Vercel 계정
- GitHub 저장소에 대한 관리자 권한

## 🚀 설정 단계

### 1단계: Vercel 토큰 생성

1. [Vercel 대시보드](https://vercel.com/account/tokens)에 로그인
2. **Tokens** 탭으로 이동
3. **Create** 버튼 클릭
4. 토큰 이름 입력 (예: "GitHub Actions Deploy")
5. 스코프 선택: **Full Account**
6. **Create Token** 클릭
7. 생성된 토큰을 복사하여 안전한 곳에 저장 (한 번만 표시됨)

### 2단계: Vercel 프로젝트 설정

#### 방법 A: Vercel CLI 사용 (권장)

```bash
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 디렉토리로 이동
cd Performance_Service

# Vercel 프로젝트 연결
vercel link

# 프로젝트 정보 확인
cat .vercel/project.json
```

출력 예시:
```json
{
  "orgId": "team_xxxxxxxxxxxxxxxxxxxx",
  "projectId": "prj_xxxxxxxxxxxxxxxxxxxx"
}
```

#### 방법 B: Vercel 대시보드 사용

1. [Vercel 대시보드](https://vercel.com/dashboard)에서 프로젝트 선택
2. **Settings** > **General** 으로 이동
3. URL에서 프로젝트 ID 확인:
   ```
   https://vercel.com/[team-name]/[project-name]/settings
   ```
4. **Project ID**와 **Team ID** 복사

### 3단계: GitHub Secrets 설정

1. GitHub 저장소로 이동
2. **Settings** > **Secrets and variables** > **Actions** 클릭
3. **New repository secret** 버튼 클릭
4. 다음 3개의 시크릿을 각각 추가:

#### VERCEL_TOKEN
- Name: `VERCEL_TOKEN`
- Value: 1단계에서 생성한 Vercel 토큰

#### VERCEL_ORG_ID
- Name: `VERCEL_ORG_ID`
- Value: 2단계에서 확인한 조직 ID (예: `team_xxxxxxxxxxxxxxxxxxxx`)

#### VERCEL_PROJECT_ID
- Name: `VERCEL_PROJECT_ID`
- Value: 2단계에서 확인한 프로젝트 ID (예: `prj_xxxxxxxxxxxxxxxxxxxx`)

### 4단계: Vercel 환경 변수 설정

1. [Vercel 대시보드](https://vercel.com/dashboard)에서 프로젝트 선택
2. **Settings** > **Environment Variables** 클릭
3. 다음 환경 변수를 추가:

| 변수명        | 설명                  | 환경          |
| ------------- | --------------------- | ------------- |
| DB_HOST       | 데이터베이스 호스트   | Production    |
| DB_PORT       | 데이터베이스 포트     | Production    |
| DB_USERNAME   | 데이터베이스 사용자명 | Production    |
| DB_PASSWORD   | 데이터베이스 비밀번호 | Production    |
| DB_DATABASE   | 데이터베이스 이름     | Production    |
| PORT          | 서버 포트             | Production    |
| NODE_ENV      | 실행 환경 (production)| Production    |

> 💡 **팁**: "Encrypt" 옵션을 활성화하여 민감한 값을 보호하세요.

## ✅ 테스트

설정이 완료되면 다음과 같이 테스트할 수 있습니다:

```bash
# main 브랜치에 푸시
git checkout main
git pull origin main
git merge your-feature-branch
git push origin main
```

또는 Pull Request를 생성하여 `main` 브랜치에 머지:

1. 기능 브랜치에서 Pull Request 생성
2. 리뷰 후 `main` 브랜치에 머지
3. 자동으로 배포 시작

## 📊 배포 모니터링

### GitHub Actions
- 저장소의 **Actions** 탭에서 워크플로우 실행 상태 확인
- 각 단계별 로그 확인 가능
- 실패 시 상세한 에러 메시지 확인

### Vercel 대시보드
- [Vercel 대시보드](https://vercel.com/dashboard)에서 배포 상태 확인
- 빌드 로그 및 런타임 로그 확인
- 배포된 URL 확인

## 🔧 문제 해결

### 배포 실패 시

#### 1. Secrets 확인
```bash
# GitHub Actions 로그에서 다음과 같은 에러 확인:
# "Error: No token found"
# "Error: Invalid project id"
```
**해결**: GitHub Secrets가 올바르게 설정되었는지 확인

#### 2. 빌드 실패
```bash
# "Build failed" 에러
```
**해결**: 로컬에서 빌드 테스트
```bash
npm ci
npm run build
```

#### 3. 환경 변수 누락
```bash
# "Cannot connect to database"
```
**해결**: Vercel 환경 변수 확인

### 일반적인 문제

| 문제                      | 원인                       | 해결 방법                                       |
| ------------------------- | -------------------------- | ----------------------------------------------- |
| 토큰 인증 실패            | 잘못된 VERCEL_TOKEN        | 새 토큰 생성 후 Secret 업데이트                 |
| 프로젝트를 찾을 수 없음   | 잘못된 PROJECT_ID          | Vercel CLI로 올바른 ID 확인 후 업데이트         |
| 빌드 시간 초과            | 빌드 시간이 너무 길음      | 불필요한 의존성 제거 또는 Vercel 플랜 업그레이드 |
| 환경 변수 누락            | Vercel 환경 변수 미설정    | Vercel 대시보드에서 환경 변수 추가              |

## 📚 추가 자료

- [Vercel 문서](https://vercel.com/docs)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [Vercel Action](https://github.com/amondnet/vercel-action)

## 🔐 보안 권장사항

1. **토큰 관리**: Vercel 토큰은 절대 코드에 포함하지 마세요
2. **환경 변수**: 민감한 정보는 반드시 환경 변수로 관리
3. **권한 최소화**: 필요한 최소한의 권한만 부여
4. **정기적 검토**: 토큰 및 접근 권한을 정기적으로 검토

## 💡 유용한 팁

- **프리뷰 배포**: 다른 브랜치에 푸시하면 프리뷰 배포 생성 가능
- **롤백**: Vercel 대시보드에서 이전 배포로 즉시 롤백 가능
- **커스텀 도메인**: Vercel 대시보드에서 커스텀 도메인 설정 가능
- **모니터링**: Vercel Analytics로 성능 모니터링 가능
