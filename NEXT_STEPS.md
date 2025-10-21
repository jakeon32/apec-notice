# 다음 단계: Google Sheets 연동 완료하기

API 키가 적용되었습니다! 이제 마지막 단계만 남았습니다.

## ✅ 완료된 것
- ✅ API 키 생성 완료
- ✅ API 키가 코드에 적용됨

## 📝 남은 작업

### 1. Google Sheets 만들기

1. [Google Sheets](https://sheets.google.com/) 접속
2. **빈 스프레드시트 만들기**
3. 첫 번째 행(헤더)에 다음 입력:

```
| title | date | category | content |
```

4. 두 번째 행부터 데이터 입력 (예시):

| title | date | category | content |
|-------|------|----------|---------|
| 교통 통제 안내 | 2025-10-16 | URGENT | `<p>정상회담 기간 동안 교통 통제가 실시됩니다.</p>` |
| 셔틀 버스 예약 안내 | 2025-10-15 | INFO | `<p>셔틀 버스 예약 시스템이 오픈되었습니다.</p>` |
| 주차장 안내 | 2025-10-14 | NOTICE | `<p>주차장 정보 및 이용 안내입니다.</p>` |

**카테고리 옵션:**
- `URGENT` - 긴급 (빨간색)
- `INFO` - 정보 (파란색)
- `NOTICE` - 일반 공지 (회색)

**Content 컬럼 작성법:**
- HTML 태그 사용 가능: `<p>`, `<strong>`, `<ul>`, `<li>`, `<br>` 등
- 예: `<p>첫 번째 문단</p><p><strong>중요:</strong> 두 번째 문단</p>`

### 2. 시트 이름 변경

- 하단 탭 이름을 **"notices"**로 변경 (기본값: "시트1")

### 3. 시트 공개 설정

1. 우측 상단 **"공유"** 버튼 클릭
2. **"일반 액세스"** 섹션 클릭
3. **"링크가 있는 모든 사용자"** 선택
4. 역할: **"뷰어"** 선택
5. **"완료"** 클릭

### 4. 시트 ID 복사

브라우저 주소창의 URL에서 ID 복사:

```
https://docs.google.com/spreadsheets/d/[이_부분이_시트_ID]/edit
```

예시:
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
                                      ↑___________이 부분___________↑
```

### 5. index.html 수정

`index.html` 파일의 **683번째 줄**을 수정:

**현재:**
```javascript
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID'; // 여기에 구글 시트 ID를 입력하세요
```

**수정 후:**
```javascript
const SHEET_ID = '복사한_시트_ID_여기에_붙여넣기';
```

### 6. 테스트

1. `index.html` 파일을 브라우저에서 열기
2. 우측 하단 📢 버튼 클릭
3. Google Sheets의 데이터가 표시되는지 확인

---

## 🔧 문제 해결

### 오류가 발생하면?

**1. F12 키를 눌러 개발자 도구 열기**

**2. Console 탭에서 오류 확인**

**일반적인 오류:**

#### "API key not valid"
→ API 키 확인 필요

#### "The caller does not have permission"
→ 시트 공개 설정 확인 (3단계)

#### "Unable to parse range: notices"
→ 시트 탭 이름이 "notices"인지 확인 (2단계)

---

## 📊 샘플 데이터

복사해서 사용하세요:

### 행 2:
- **title**: Traffic Control During Summit Period
- **date**: Oct 16, 2025
- **category**: URGENT
- **content**: `<p><strong>Important Notice:</strong> Traffic control measures will be implemented during the APEC Summit.</p>`

### 행 3:
- **title**: Shuttle Bus Reservation Guide
- **date**: Oct 15, 2025
- **category**: INFO
- **content**: `<p>The shuttle bus reservation system is now open. Please visit our portal to make reservations.</p>`

### 행 4:
- **title**: Parking Information
- **date**: Oct 14, 2025
- **category**: NOTICE
- **content**: `<p>Parking facilities are available at designated locations. Please display your parking permit.</p>`

---

## 🚀 완료 후

Google Sheets만 수정하면 웹사이트에 자동으로 반영됩니다!

- 새 공지 추가: 새 행 추가
- 공지 수정: 해당 셀 수정
- 공지 삭제: 해당 행 삭제
- 변경사항 확인: 웹사이트 새로고침 (F5)

---

## 💡 팁

1. **HTML 형식 사용**
   - 줄바꿈: `<p>첫 문단</p><p>둘째 문단</p>`
   - 강조: `<strong>중요</strong>`
   - 목록: `<ul><li>항목1</li><li>항목2</li></ul>`

2. **하이라이트 박스**
   ```html
   <div class="notice-highlight">
     <strong>중요:</strong> 강조할 내용
   </div>
   ```

3. **데이터 정렬**
   - 최신 공지를 위에 배치하세요
   - 첫 번째 공지가 알림 배너에 연동됩니다

---

막히는 부분이 있으면 알려주세요!
