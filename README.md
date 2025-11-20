# 🎭 PerformanceService

**공연 정보 관리 REST API 서비스**

NestJS, TypeORM, PostgreSQL(Supabase)를 활용한 백엔드 서비스

---

## 📋 Table of Contents

- [개요](#개요)
- [기술 스택](#기술-스택)
- [설치 및 실행](#설치-및-실행)
- [실행 방법](#실행-방법)
- [주요 기능](#주요-기능)
- [API 문서](#api-문서)
- [프로젝트 구조](#프로젝트-구조)
- [데이터 모델](#데이터-모델)
- [환경 변수](#환경-변수)
- [배포](#배포)

---

## 개요

**PerformanceService**는 공연(theater, musical, concert, exhibition, movie) 정보를 관리하고 제공하는 REST API입니다.

- ✅ 공연 정보 CRUD 기능
- ✅ Supabase PostgreSQL 연동
- ✅ 자동 유효성 검사
- ✅ Swagger API 문서화

---

## 기술 스택

| 분류           | 기술              | 버전  | 설명                            |
| -------------- | ----------------- | ----- | ------------------------------- |
| **Runtime**    | Node.js           | 18.x+ | JavaScript 런타임 환경          |
| **Framework**  | NestJS            | 11.x  | 프로그레시브 Node.js 프레임워크 |
| **Language**   | TypeScript        | 5.x   | 정적 타입 기반 JavaScript       |
| **ORM**        | TypeORM           | 0.3.x | 데이터베이스 ORM                |
| **Database**   | PostgreSQL        | 15+   | Supabase 클라우드 데이터베이스  |
| **Connection** | Supabase Pooler   | -     | 연결 풀 관리                    |
| **API Docs**   | Swagger/OpenAPI   | 11.x  | API 문서화 및 테스트            |
| **Validation** | class-validator   | 0.x   | 데이터 유효성 검사              |
| **Transform**  | class-transformer | 0.x   | 데이터 변환 및 직렬화           |
| **Config**     | @nestjs/config    | 3.x   | 환경 변수 관리                  |

---

## 설치 및 실행

### 필수 요구사항

- Node.js 18.x 이상
- npm 또는 yarn
- Supabase 계정

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd PerformanceService

# 의존성 설치
npm install
# 또는
yarn install
```

### 환경 변수 설정

프로젝트 루트에 `.env` 파일 생성:

```bash
PORT=3000

# Database 설정
DB_HOST=your-project.pooler.supabase.com
DB_PORT=5432
DB_USERNAME=postgres.your-project-id
DB_PASSWORD=your-password
DB_DATABASE=postgres

# 환경
NODE_ENV=development
```

---

## 실행 방법

```bash
# 개발 모드
npm run start:dev

# 프로덕션 모드
npm run start:prod

# 빌드
npm run build
```

서버가 시작되면 `http://localhost:3000`에서 접속 가능합니다.

---

## 주요 기능

### 1. 공연 목록 조회

```
GET /performances
```

모든 공연 정보를 조회합니다.

### 2. 공연 상세 조회

```
GET /performances/:id
```

특정 공연 정보를 조회합니다.

### 3. 공연 등록

```
POST /performances
```

공연 정보를 등록합니다.

### 4. 공연 정보 수정

```
PATCH /performances/:id
```

공연 정보를 수정합니다.

### 5. 공연 삭제

```
DELETE /performances/:id
```

공연 정보를 삭제합니다.

---

## API 문서

### Swagger UI 접속

```
http://localhost:3000/api
```

Swagger UI에서 모든 API를 시각적으로 확인하고 테스트할 수 있습니다.

### API 요청 예시

**공연 목록 조회 (GET /performances)**

```bash
curl -X GET http://localhost:3000/performances
```

**공연 상세 조회 (GET /performances/:id)**

```bash
curl -X GET http://localhost:3000/performances/1
```

**공연 등록 (POST /performances)**

```json
{
  "title": "Hamlet",
  "description": "Shakespeare's masterpiece",
  "category": "THEATER",
  "genre": "DRAMA",
  "venue": "National Theater",
  "imageUrl": "https://example.com/poster.jpg",
  "price": 50000,
  "startDate": "2025-12-01T00:00:00Z",
  "endDate": "2025-12-31T23:59:59Z",
  "runningTime": 120
}
```

```bash
curl -X POST http://localhost:3000/performances \
  -H "Content-Type: application/json" \
  -d '{...위의 JSON...}'
```

**공연 정보 수정 (PATCH /performances/:id)**

```json
{
  "title": "Updated Title",
  "price": 60000
}
```

```bash
curl -X PATCH http://localhost:3000/performances/1 \
  -H "Content-Type: application/json" \
  -d '{...위의 JSON...}'
```

**공연 삭제 (DELETE /performances/:id)**

```bash
curl -X DELETE http://localhost:3000/performances/1
```

### API 응답 예시

**성공 (200 OK)**

```json
{
  "id": 1,
  "title": "Hamlet",
  "description": "Shakespeare's masterpiece",
  "category": "THEATER",
  "genre": "DRAMA",
  "venue": "National Theater",
  "price": 50000,
  "startDate": "2025-12-01T00:00:00.000Z",
  "endDate": "2025-12-31T23:59:59.000Z",
  "runningTime": 120,
  "createdAt": "2025-11-20T10:00:00.000Z",
  "updatedAt": "2025-11-20T10:00:00.000Z"
}
```

**에러 (404 Not Found)**

```json
{
  "statusCode": 404,
  "message": "해당 1의 공연 정보를 찾을 수 없습니다."
}
```

---

## 프로젝트 구조

```
PerformanceService/
├── src/
│   ├── main.ts                          # 애플리케이션 진입점
│   ├── app.module.ts                    # 루트 모듈
│   ├── app.controller.ts                # 루트 컨트롤러
│   ├── app.service.ts                   # 루트 서비스
│   └── performances/
│       ├── performances.module.ts       # 공연 모듈
│       ├── performances.controller.ts   # 공연 컨트롤러
│       ├── performances.service.ts      # 공연 서비스
│       ├── dto/
│       │   └── performance.dto.ts       # 공연 DTO (데이터 유효성 검사)
│       └── entities/
│           └── performances.entity.ts   # 공연 엔티티 (DB 스키마)
├── test/
│   └── app.e2e-spec.ts                  # E2E 테스트
├── .env                                 # 환경 변수 (git 무시)
├── package.json                         # 프로젝트 메타데이터
├── tsconfig.json                        # TypeScript 설정
├── eslint.config.mjs                    # ESLint 설정
└── README.md
```

---

## 데이터 모델

### PerformanceModel

| 필드          | 타입     | 설명                                                         |
| ------------- | -------- | ------------------------------------------------------------ |
| `id`          | number   | 고유 ID (자동 증가)                                          |
| `title`       | string   | 공연 제목                                                    |
| `description` | string   | 공연 설명                                                    |
| `category`    | CATEGORY | 공연 카테고리 (THEATER, MUSICAL, CONCERT, EXHIBITION, MOVIE) |
| `venue`       | string   | 공연 장소                                                    |
| `imageUrl`    | string   | 포스터 이미지 URL                                            |
| `price`       | number   | 티켓 가격                                                    |
| `startDate`   | Date     | 공연 시작일                                                  |
| `endDate`     | Date     | 공연 종료일                                                  |
| `runningTime` | number   | 러닝타임 (분 단위)                                           |
| `createdAt`   | Date     | 생성 일시                                                    |
| `updatedAt`   | Date     | 수정 일시                                                    |

---

## 환경 변수

### 필수 환경 변수

| 변수          | 설명                  | 예시                          |
| ------------- | --------------------- | ----------------------------- |
| `PORT`        | 서버 포트             | `3000`                        |
| `DB_HOST`     | 데이터베이스 호스트   | `project.pooler.supabase.com` |
| `DB_PORT`     | 데이터베이스 포트     | `5432`                        |
| `DB_USERNAME` | 데이터베이스 사용자   | `postgres.project-id`         |
| `DB_PASSWORD` | 데이터베이스 비밀번호 | `your-secure-password`        |
| `DB_DATABASE` | 데이터베이스 이름     | `postgres`                    |

---

## 배포
