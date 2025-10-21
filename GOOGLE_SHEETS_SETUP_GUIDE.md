# Google Sheets API 연동 가이드

## 1단계: Google Cloud Console 접속

1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. Google 계정으로 로그인

## 2단계: 프로젝트 생성

1. 상단의 프로젝트 선택 드롭다운 클릭
2. "새 프로젝트" 클릭
3. 프로젝트 이름 입력 (예: "APEC-Notice-Board")
4. "만들기" 클릭
5. 프로젝트가 생성될 때까지 대기 (약 10초)
6. 알림에서 생성된 프로젝트 선택

## 3단계: Google Sheets API 활성화

1. 좌측 메뉴에서 "API 및 서비스" > "라이브러리" 클릭
   - 또는 검색창에 "API 라이브러리" 입력
2. 검색창에 "Google Sheets API" 입력
3. "Google Sheets API" 클릭
4. "사용" 또는 "Enable" 버튼 클릭
5. API가 활성화될 때까지 대기

## 4단계: API 키 생성

1. 좌측 메뉴에서 "API 및 서비스" > "사용자 인증 정보" 클릭
2. 상단의 "+ 사용자 인증 정보 만들기" 버튼 클릭
3. "API 키" 선택
4. API 키가 생성되면 팝업창에 표시됩니다
5. **"키 복사" 버튼 클릭하여 저장** (중요!)

## 5단계: API 키 제한 설정 (보안을 위해 필수!)

API 키가 생성된 후:

1. "키 제한" 또는 "Edit API key" 클릭
2. **애플리케이션 제한사항:**
   - "HTTP 리퍼러(웹사이트)" 선택
   - "항목 추가" 클릭
   - 웹사이트 URL 입력:
     - 로컬 테스트: `http://localhost/*`
     - 배포 후: `https://yourdomain.com/*`
   - 여러 URL을 추가할 수 있습니다

3. **API 제한사항:**
   - "키 제한" 선택
   - "Google Sheets API" 체크박스 선택

4. "저장" 클릭

## 6단계: Google 시트 생성 및 설정

### 6-1. 시트 생성
1. [Google Sheets](https://sheets.google.com/) 접속
2. 빈 스프레드시트 만들기
3. 시트 이름을 "notices"로 변경 (하단 탭)

### 6-2. 헤더 행 설정
첫 번째 행에 다음 컬럼 입력:

| A (title) | B (date) | C (category) | D (content) |
|-----------|----------|--------------|-------------|

### 6-3. 샘플 데이터 입력
예시:

| title | date | category | content |
|-------|------|----------|---------|
| Traffic Control During Summit | Oct 16, 2025 | URGENT | `<p><strong>Important Notice:</strong> Traffic control measures...</p>` |
| Shuttle Service Guide | Oct 15, 2025 | INFO | `<p>Shuttle reservation system is now open...</p>` |
| Parking Information | Oct 14, 2025 | NOTICE | `<p>Parking lots are available at...</p>` |

**content 컬럼 작성 팁:**
- HTML 태그 사용 가능: `<p>`, `<strong>`, `<ul>`, `<li>` 등
- 줄바꿈은 `<br>` 또는 `<p>` 태그로
- 예: `<p>첫 문단</p><p>둘째 문단</p><ul><li>항목1</li><li>항목2</li></ul>`

### 6-4. 시트 공개 설정
1. 우측 상단 "공유" 버튼 클릭
2. "일반 액세스" 섹션에서 "제한됨" 클릭
3. "링크가 있는 모든 사용자" 선택
4. 역할: "뷰어" 선택
5. "완료" 클릭

### 6-5. 시트 ID 확인
브라우저 URL에서 시트 ID 복사:
```
https://docs.google.com/spreadsheets/d/[여기가_시트_ID]/edit
```
예: `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## 7단계: 코드에 적용

`index.html` 파일의 724-726 라인 수정:

```javascript
const SHEET_ID = '위에서_복사한_시트_ID';
const API_KEY = '위에서_생성한_API_키';
const SHEET_NAME = 'notices'; // 시트 탭 이름과 동일하게
```

## 8단계: 테스트

1. `index.html` 파일을 브라우저에서 열기
2. 우측 하단의 공지사항 버튼(📢) 클릭
3. Google Sheets의 데이터가 표시되는지 확인

**문제 발생 시:**
- F12 키를 눌러 개발자 도구 열기
- Console 탭에서 오류 메시지 확인
- 일반적인 오류:
  - "API key not valid": API 키 확인
  - "The caller does not have permission": 시트 공개 설정 확인
  - "Unable to parse range": 시트 이름(탭 이름) 확인

## 카테고리별 색상

- **URGENT**: 빨간색 (#d32f2f)
- **INFO**: 파란색 (#1976d2)
- **NOTICE**: 회색 (#757575)

## 데이터 업데이트 방법

1. Google Sheets에서 직접 수정
2. 저장은 자동으로 됨
3. 웹사이트 새로고침 (F5)
4. 변경사항이 즉시 반영됨

## 로컬 파일로 테스트하는 경우

브라우저 보안 정책으로 인해 `file://` 프로토콜에서는 API 호출이 차단될 수 있습니다.

**해결방법: 간단한 로컬 서버 실행**

### Python이 설치된 경우:
```bash
# Python 3
python -m http.server 8000

# 브라우저에서 http://localhost:8000 접속
```

### Node.js가 설치된 경우:
```bash
npx http-server -p 8000

# 브라우저에서 http://localhost:8000 접속
```

### VS Code 사용하는 경우:
- "Live Server" 확장 프로그램 설치
- HTML 파일에서 우클릭 > "Open with Live Server"

## 보안 주의사항

1. **API 키는 공개 저장소에 올리지 마세요**
2. **HTTP 리퍼러 제한을 반드시 설정하세요**
3. **API 키가 노출되면 즉시 재생성하세요**
4. 프로덕션 환경에서는 서버 사이드에서 API를 호출하는 것이 더 안전합니다

## 비용

- Google Sheets API는 무료 할당량이 있습니다
- 읽기: 하루 60,000 요청 (분당 100 요청)
- 이 프로젝트의 사용량으로는 무료 범위 내에서 충분합니다

## 추가 도움말

문제가 발생하면:
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. "API 및 서비스" > "대시보드"에서 사용량 확인
3. "사용자 인증 정보"에서 API 키 상태 확인
