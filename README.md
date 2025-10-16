# APEC 2025 Notice Board

Google Sheets 기반 공지사항 시스템

## 🌐 Live Demo

**배포 URL:** https://jakeon32.github.io/apec-notice/

## 📋 프로젝트 개요

APEC 2025 경주 교통 안내를 위한 심플한 공지사항 게시판입니다. Google Sheets를 데이터베이스로 사용하여 별도의 백엔드 없이 실시간으로 공지사항을 업데이트할 수 있습니다.

## ✨ 주요 기능

### 1. Google Sheets 연동
- Google Sheets API를 통해 실시간 데이터 로드
- Sheets만 수정하면 웹사이트에 자동 반영
- HTML 서식 지원 (굵게, 목록, 하이라이트 등)

### 2. 읽음/안 읽음 추적
- LocalStorage를 활용한 읽은 공지 추적
- 플로팅 버튼 배지에 안 읽은 공지 개수 표시
- 공지 클릭 시 자동으로 읽음 처리
- 캐시 삭제 시 초기화

### 3. 반응형 디자인
- 모바일, 태블릿, 데스크톱 완벽 지원
- 사이드 패널 형식의 공지 목록
- 플로팅 액션 버튼으로 빠른 접근

### 4. 사용자 경험
- 긴급/정보/일반 공지 색상 구분
- 상단 알림 배너 (닫기 가능, 24시간 쿠키 저장)
- 부드러운 애니메이션 효과
- ESC 키로 패널 닫기

## 🛠 기술 스택

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Data Source:** Google Sheets API
- **Hosting:** GitHub Pages
- **Storage:** LocalStorage (읽음 상태 관리)

## 📂 파일 구조

```
notice/
├── index.html                      # 메인 HTML 파일
├── README.md                       # 프로젝트 문서
├── GOOGLE_SHEETS_SETUP_GUIDE.md   # Google Sheets 연동 가이드
├── GOOGLE_SHEETS_SETUP_SIMPLE.md  # 간단한 연동 방법
├── NEXT_STEPS.md                  # 초기 설정 가이드
└── sample_notice_content.txt      # 샘플 데이터
```

## 🚀 시작하기

### 1. Google Sheets 설정

1. [Google Sheets](https://sheets.google.com/)에서 새 스프레드시트 생성
2. 첫 번째 행에 헤더 입력:
   ```
   title | date | category | content
   ```
3. 시트 탭 이름을 **"notices"**로 변경
4. 시트 공개 설정: **"링크가 있는 모든 사용자"** (뷰어)

### 2. Google Cloud API 설정

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 새 프로젝트 생성
3. Google Sheets API 활성화
4. API 키 생성
5. HTTP 리퍼러 제한 설정:
   ```
   https://jakeon32.github.io/*
   http://localhost/*
   ```

### 3. 코드 설정

`index.html` 파일의 683-685번째 줄 수정:

```javascript
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID';
const API_KEY = 'YOUR_API_KEY';
const SHEET_NAME = 'notices';
```

### 4. 데이터 입력 형식

| title | date | category | content |
|-------|------|----------|---------|
| 공지 제목 | 2025-10-16 | URGENT | `<p>HTML 형식 내용</p>` |

**Category 옵션:**
- `URGENT` - 긴급 (빨간색)
- `INFO` - 정보 (파란색)
- `NOTICE` - 일반 (회색)

**Content HTML 지원:**
```html
<p>문단</p>
<strong>굵은 글씨</strong>
<ul><li>목록 항목</li></ul>
<a href="URL">링크</a>
<div class="notice-highlight">하이라이트 박스</div>
```

## 📱 로컬 테스트

### Python 서버:
```bash
cd D:\study\claude\notice
python -m http.server 8000
```

### Node.js 서버:
```bash
npx http-server -p 8000
```

### VS Code Live Server:
1. Live Server 확장 프로그램 설치
2. `index.html` 우클릭 → "Open with Live Server"

## 🌍 배포

### GitHub Pages

1. GitHub 저장소 생성
2. 코드 업로드
3. Settings → Pages
4. Source: `main` 브랜치 선택
5. 1-2분 후 `https://USERNAME.github.io/REPO_NAME/` 접속

## 🔧 주요 함수

### 데이터 관리
- `loadNoticesFromGoogleSheets()` - Google Sheets에서 데이터 로드
- `renderNoticeList()` - 공지 목록 렌더링

### 읽음 상태 관리
- `markAsRead(noticeId)` - 공지를 읽음으로 표시
- `isNoticeRead(notice)` - 읽음 여부 확인
- `getUnreadCount()` - 안 읽은 공지 개수

### UI 제어
- `openNoticePanel()` - 공지 패널 열기
- `closeNoticePanel()` - 공지 패널 닫기
- `showNoticeDetail(noticeId)` - 공지 상세 보기
- `updateNoticeBadge()` - 배지 업데이트

## 🎨 커스터마이징

### 색상 변경
```css
/* 메인 컬러 */
--primary-color: #1a237e;
--urgent-color: #d32f2f;
--info-color: #1976d2;
```

### 플로팅 버튼 위치
```css
.floating-notice-btn {
    bottom: 30px;  /* 하단 거리 */
    right: 30px;   /* 우측 거리 */
}
```

## 🔐 보안

- API 키는 HTTP 리퍼러로 제한
- Google Sheets는 읽기 전용으로 공개
- 민감한 정보는 저장하지 않음

## 📝 업데이트 히스토리

### 2025-10-16
- ✅ 초기 프로젝트 생성
- ✅ Google Sheets 연동 구현
- ✅ 반응형 디자인 적용
- ✅ 플로팅 버튼 및 사이드 패널 구현
- ✅ 읽음/안 읽은 상태 추적 기능 추가
- ✅ GitHub Pages 배포 완료

## 🤝 기여

이 프로젝트는 APEC 2025 경주 교통 안내를 위해 제작되었습니다.

## 📄 라이선스

MIT License

## 👤 제작

- **Repository:** [jakeon32/apec-notice](https://github.com/jakeon32/apec-notice)
- **Live Site:** https://jakeon32.github.io/apec-notice/

---

## 💡 팁

### Google Sheets 데이터 업데이트
1. Google Sheets에서 내용 수정
2. 자동 저장됨
3. 웹사이트 새로고침 (F5)
4. 변경사항 즉시 반영

### 읽음 상태 초기화
브라우저 개발자 도구(F12) → Application → Local Storage → `readNotices` 삭제

### 공지 작성 가이드
- 제목은 간결하게 (30자 이내 권장)
- 날짜는 일관된 형식 사용
- Content는 HTML로 작성하여 서식 활용
- 최신 공지를 상단에 배치

## 🐛 문제 해결

### API 키 오류
- Google Cloud Console에서 API 키 확인
- HTTP 리퍼러 설정 확인
- Google Sheets API 활성화 여부 확인

### 데이터 로드 실패
- 시트 공개 설정 확인 (링크가 있는 모든 사용자)
- 시트 탭 이름이 "notices"인지 확인
- F12 개발자 도구 Console에서 오류 확인

### 읽음 상태 미작동
- 브라우저 LocalStorage 사용 가능 여부 확인
- 시크릿 모드에서는 LocalStorage가 제한될 수 있음

---

**Made with ❤️ for APEC 2025 Gyeongju**
