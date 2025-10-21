# Google Sheets 연동 - 간단한 방법 (API 키 없이)

API 키 생성이 복잡하거나 보이지 않는 경우, **더 간단한 방법**을 사용할 수 있습니다.

## 방법 1: Google Sheets를 CSV로 공개하기 (가장 쉬움)

### 1단계: Google Sheets 생성

1. [Google Sheets](https://sheets.google.com/) 접속
2. 새 스프레드시트 만들기
3. 첫 번째 행에 헤더 입력:

| title | date | category | content |
|-------|------|----------|---------|

4. 데이터 입력 (예시):

| title | date | category | content |
|-------|------|----------|---------|
| Traffic Control Notice | Oct 16, 2025 | URGENT | Important traffic control information |
| Shuttle Service | Oct 15, 2025 | INFO | Shuttle reservation system guide |

### 2단계: CSV로 공개

1. 상단 메뉴 **파일** → **공유** → **웹에 게시** 클릭
2. **링크** 탭 선택
3. 드롭다운에서:
   - 첫 번째: "notices" (시트 이름) 선택
   - 두 번째: **"쉼표로 구분된 값(.csv)"** 선택
4. **게시** 버튼 클릭
5. 확인 팝업에서 **확인** 클릭
6. **생성된 URL 복사** (예: `https://docs.google.com/spreadsheets/d/e/2PACX-...`)

### 3단계: 코드 수정

아래 코드를 사용하세요:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>APEC 2025 KOREA Transportation Guide - Gyeongju</title>
    <!-- 기존 스타일 그대로... -->
</head>
<body>
    <!-- 기존 HTML 그대로... -->

    <script>
        // Google Sheets CSV URL (웹에 게시한 CSV URL)
        const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/YOUR_PUBLISHED_URL';

        let notices = [];

        // Load notices from Google Sheets CSV
        async function loadNoticesFromGoogleSheets() {
            try {
                const response = await fetch(SHEET_CSV_URL);
                const csvText = await response.text();

                // Parse CSV
                const rows = csvText.split('\n').map(row => {
                    // Simple CSV parsing (handles basic cases)
                    return row.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''));
                });

                if (rows.length > 1) {
                    // Skip header row
                    notices = rows.slice(1)
                        .filter(row => row[0]) // Filter empty rows
                        .map((row, index) => ({
                            id: index,
                            title: row[0] || '',
                            date: row[1] || '',
                            category: row[2] || 'NOTICE',
                            tag: (row[2] || 'general').toLowerCase(),
                            content: formatContent(row[3] || '')
                        }));

                    renderNoticeList();
                    updateNoticeBadge();
                } else {
                    showErrorMessage('No notices found');
                }
            } catch (error) {
                console.error('Error loading notices:', error);
                showErrorMessage('Failed to load notices');
            }
        }

        // Format content with proper HTML
        function formatContent(text) {
            // If already contains HTML tags, return as is
            if (text.includes('<p>') || text.includes('<ul>')) {
                return text;
            }
            // Otherwise wrap in paragraph tags
            return `<p>${text.replace(/\n/g, '</p><p>')}</p>`;
        }

        // 나머지 함수들은 기존과 동일...
    </script>
</body>
</html>
```

---

## 방법 2: API 키 생성 (새로운 인터페이스용)

Google Cloud Console 인터페이스가 변경된 경우:

### 1단계: Google Cloud Console 접속
1. [https://console.cloud.google.com/](https://console.cloud.google.com/)
2. 프로젝트 만들기

### 2단계: Google Sheets API 활성화
1. 왼쪽 메뉴 ☰ 클릭
2. **"API 및 서비스"** → **"사용 설정된 API 및 서비스"** 클릭
3. **"+ API 및 서비스 사용 설정"** 클릭
4. "Google Sheets API" 검색 → 클릭 → **"사용"** 버튼

### 3단계: API 키 만들기 (새로운 방법)
1. 왼쪽 메뉴에서 **"API 및 서비스"** → **"사용자 인증 정보"**
2. 상단에 **"+ 사용자 인증 정보 만들기"** 버튼 클릭
3. 드롭다운 메뉴에서:
   - **"API 키"**가 보이면 클릭
   - 안 보이면 **"API 키"** 대신 다음 확인:

#### API 키가 안 보이는 경우:
1. 페이지를 새로고침 (F5)
2. 프로젝트가 제대로 선택되어 있는지 확인 (상단)
3. Google Sheets API가 활성화되어 있는지 확인
4. 브라우저 캐시 삭제 후 재시도

#### 그래도 안 되면:
1. 상단 검색창에 "API 키" 입력
2. "API 및 서비스의 API 키" 결과 클릭
3. 또는 직접 URL 접속:
   ```
   https://console.cloud.google.com/apis/credentials?project=YOUR_PROJECT_ID
   ```

---

## 방법 3: 직접 JSON 파일 사용 (가장 간단)

Google Sheets 대신 로컬 JSON 파일 사용:

### 1. notices.json 파일 생성

```json
[
  {
    "title": "Traffic Control During Summit",
    "date": "Oct 16, 2025",
    "category": "URGENT",
    "content": "<p><strong>Important:</strong> Traffic control measures...</p>"
  },
  {
    "title": "Shuttle Service Guide",
    "date": "Oct 15, 2025",
    "category": "INFO",
    "content": "<p>Shuttle reservation system is now open...</p>"
  }
]
```

### 2. 코드 수정

```javascript
async function loadNoticesFromJSON() {
    try {
        const response = await fetch('notices.json');
        const data = await response.json();

        notices = data.map((item, index) => ({
            id: index,
            title: item.title,
            date: item.date,
            category: item.category,
            tag: item.category.toLowerCase(),
            content: item.content
        }));

        renderNoticeList();
        updateNoticeBadge();
    } catch (error) {
        console.error('Error loading notices:', error);
        showErrorMessage('Failed to load notices');
    }
}

// 페이지 로드 시
window.addEventListener('load', () => {
    loadNoticesFromJSON();
});
```

---

## 권장 방법

**지금 당장 시작하려면:** 방법 1 (CSV 공개) 또는 방법 3 (JSON 파일)
- 설정이 간단함
- API 키 불필요

**나중에 업그레이드:** 방법 2 (API 키)
- 더 안정적
- 쿼리 옵션 풍부

어떤 방법을 사용하시겠습니까?
