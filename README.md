# 2023 - CJ그룹 매체 영향력 평가 관리자 시스템

### 목차

1. [History](#history)
2. [Project 정보](#project-정보)
3. [FTP 정보](#ftp-정보)
4. [Server 정보](#server-정보)
5. [Local Server 설정](#local-server-설정)
6. [MSW 설정](#msw-설정)
7. [배포](#배포)

---

### History

| 일자       | 버전  | 내용                                   |
| ---------- | ----- | -------------------------------------- |
| 2025-02-12 | 1.0.2 | API 가이드 주소 변경                   |
| 2024-09-05 | 1.0.1 | 사이트 검색어 > 사이트목록 비교값 수정 |
| 2023-11-03 | 1.0.0 | 프로젝트 생성                          |

---

#### Project 정보

-   (Daas) CJ그룹 매체 영향력 평가 - 관리자 시스템
-   node: - v18
-   API가이드 : -
-   브랜치
    -   main: 운영 [운영 서버 반영 용]
    -   hotfix/경로-수정기능(페이지/컨텐츠/모듈/컴포넌트): 운영 긴급 패치
    -   release: 운영 반영 전 테스트 [개발 서버 반영 용]
    -   devel: 개발 통합
    -   feature/경로-기능(페이지/컨텐츠/모듈/컴포넌트): 기능별 개발

---

#### MSW 설정

-   Local 개발용 Mockup API
-   기본 경로 : src/api/mocks/...
-   browser.js ···························// msw 기본 셋팅
-   common_handlers.js ···················// 공용 API
-   keyword_mng_handlers.js ··············// 키워드 관리 API

```
// mockup service worker 실행파일 생성
npx msw init public/

// 크롬 브라우저 기준 ServiceWorker 추가
// 도메인에 아래 주소 입력
chrome://flags/#unsafely-treat-insecure-origin-as-secure

// 개발
```

-   크롬 브라우저 기준 ServiceWorker 추가
-   도메인에 아래 주소 입력
    chrome://flags/#unsafely-treat-insecure-origin-as-secure
-   입력창에 개발도메인, 실 API도메인 입력
    ![image](/uploads/502a42275f9cb8ebe7bbe15928413d04/image.png)

---

#### 배포

```
// 배포 버전 생성
npm run build

// 개발 버전 생성
npm run build:dev

// 개발/배포 버전 한번에 생성
npm run generate
```
