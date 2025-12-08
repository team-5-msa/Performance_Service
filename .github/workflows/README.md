# GitHub Actions Workflows

## Vercel Production Deployment

### 개요

`vercel-deploy.yml` 워크플로우는 `main` 브랜치에 코드가 푸시될 때 자동으로 Vercel에 프로덕션 배포를 수행합니다.

### 트리거 조건

- **이벤트**: `push`
- **브랜치**: `main`

### 워크플로우 단계

1. **Checkout code**: 저장소 코드를 체크아웃
2. **Setup Node.js**: Node.js 18 환경 설정 및 npm 캐시 활성화
3. **Install dependencies**: `npm ci`로 의존성 설치
4. **Build project**: `npm run build`로 프로젝트 빌드
5. **Deploy to Vercel**: Vercel에 프로덕션 배포

### 필수 Secrets

GitHub 저장소 설정에서 다음 Secrets를 추가해야 합니다:

| Secret 이름         | 설명                          | 필수 여부 |
| ------------------- | ----------------------------- | --------- |
| `VERCEL_TOKEN`      | Vercel 액세스 토큰             | ✅        |
| `VERCEL_ORG_ID`     | Vercel 조직 ID                | ✅        |
| `VERCEL_PROJECT_ID` | Vercel 프로젝트 ID            | ✅        |

### 사용 방법

1. 필요한 GitHub Secrets 설정 (위 참조)
2. `main` 브랜치에 코드 푸시:
   ```bash
   git push origin main
   ```
3. GitHub Actions 탭에서 워크플로우 실행 상태 확인
4. Vercel 대시보드에서 배포 결과 확인

### 주의사항

- 프로덕션 배포이므로 `main` 브랜치에 푸시하기 전에 충분한 테스트 필요
- Vercel 환경 변수가 올바르게 설정되어 있는지 확인
- 배포 실패 시 GitHub Actions 로그에서 상세 오류 확인 가능

### 문제 해결

#### 배포 실패 시

1. GitHub Actions 로그 확인
2. Vercel 대시보드의 배포 로그 확인
3. Secrets가 올바르게 설정되었는지 확인
4. `vercel.json` 설정이 올바른지 확인

#### 환경 변수 문제

- Vercel 대시보드에서 환경 변수가 올바르게 설정되었는지 확인
- 환경 변수 변경 후 재배포 필요
