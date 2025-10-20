# 버전 업데이트 가이드

## 📌 버전 관리 시스템

이 프로젝트는 캐시 문제를 방지하기 위해 버전 관리 시스템을 사용합니다.

## 🔄 버전 업데이트 방법

### 1. 파일 수정 시 버전 변경

CSS나 JavaScript 파일을 수정한 경우, 다음 3곳의 버전을 업데이트하세요:

#### ① `version.json` 파일
```json
{
  "version": "1.0.1",  ← 버전 증가
  "lastUpdated": "2025-01-20T15:30:00Z",  ← 현재 시간
  "description": "APEC 2025 Notice Board Version"
}
```

#### ② `index.html` 파일
```html
<!-- CSS 파일 -->
<link rel="stylesheet" href="style.css?v=1.0.1">

<!-- JavaScript 파일 -->
<script src="script.js?v=1.0.1"></script>
```

#### ③ `script.js` 파일 (첫 줄)
```javascript
const APP_VERSION = '1.0.1';
```

---

## 📋 버전 번호 규칙 (Semantic Versioning)

```
Major.Minor.Patch
  1  . 0  . 1
```

### 버전 증가 규칙:

- **Patch (0.0.X)**: 버그 수정, 작은 CSS 변경
  - 예: `1.0.0` → `1.0.1`

- **Minor (0.X.0)**: 새로운 기능 추가, UI 개선
  - 예: `1.0.1` → `1.1.0`

- **Major (X.0.0)**: 대규모 변경, 구조 개편
  - 예: `1.1.0` → `2.0.0`

---

## 🛠 일반적인 작업별 버전 증가

| 작업 내용 | 버전 변경 | 예시 |
|----------|----------|------|
| 오타 수정, 색상 미세 조정 | Patch | 1.0.0 → 1.0.1 |
| 캐러셀 추가, 모달 개선 | Minor | 1.0.1 → 1.1.0 |
| Google Sheets 연동 추가 | Minor | 1.1.0 → 1.2.0 |
| 전체 디자인 리뉴얼 | Major | 1.2.0 → 2.0.0 |

---

## 🚀 빠른 업데이트 체크리스트

파일 수정 후 배포 전:

```
□ version.json 버전 변경
□ version.json lastUpdated 시간 변경
□ index.html CSS 링크 버전 변경
□ index.html JS 링크 버전 변경
□ script.js APP_VERSION 변경
□ git commit 메시지에 버전 포함
```

**Git Commit 예시:**
```bash
git add .
git commit -m "v1.0.1 - Fix modal layout issue"
git push
```

---

## 🌐 배포 후 확인

1. **브라우저 개발자 도구 (F12)** 열기
2. **Console 탭** 확인
3. `APEC Notice Board v1.0.1` 메시지 확인
4. 하드 리프레시 (Ctrl + Shift + R / Cmd + Shift + R)

---

## 💡 캐시 문제 해결

### 사용자에게 캐시 문제가 발생한 경우:

#### 방법 1: 하드 리프레시
- **Windows/Linux**: `Ctrl + Shift + R` 또는 `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

#### 방법 2: 캐시 삭제
1. 브라우저 설정 → 개인정보 및 보안
2. 인터넷 사용 기록 삭제
3. "캐시된 이미지 및 파일" 선택
4. 삭제 후 페이지 새로고침

#### 방법 3: 시크릿 모드 테스트
- 시크릿 모드/비공개 모드로 열어서 테스트

---

## 🔧 자동화 스크립트 (선택사항)

버전 업데이트를 자동화하려면 다음 스크립트를 사용하세요:

### `update-version.sh` (Bash)
```bash
#!/bin/bash

# 새 버전 입력 받기
read -p "Enter new version (e.g., 1.0.1): " NEW_VERSION

# version.json 업데이트
cat > version.json << EOF
{
  "version": "$NEW_VERSION",
  "lastUpdated": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "description": "APEC 2025 Notice Board Version"
}
EOF

# index.html 업데이트
sed -i "s/style.css?v=[0-9.]*\"/style.css?v=$NEW_VERSION\"/g" index.html
sed -i "s/script.js?v=[0-9.]*\"/script.js?v=$NEW_VERSION\"/g" index.html

# script.js 업데이트
sed -i "s/const APP_VERSION = '[0-9.]*'/const APP_VERSION = '$NEW_VERSION'/g" script.js

echo "✅ Version updated to $NEW_VERSION"
```

### 사용법:
```bash
chmod +x update-version.sh
./update-version.sh
```

---

## 📝 버전 히스토리 예시

| 버전 | 날짜 | 변경 사항 |
|------|------|----------|
| 1.0.0 | 2025-01-20 | 초기 릴리스 |
| 1.0.1 | 2025-01-20 | 모달 레이아웃 수정 |
| 1.1.0 | 2025-01-20 | 캐러셀 기능 추가 |
| 1.2.0 | 2025-01-21 | 배너 캐러셀 추가 |

---

## ⚠️ 주의사항

1. **3곳 모두 업데이트**: version.json, index.html, script.js
2. **동일한 버전 번호 사용**: 세 파일의 버전이 일치해야 함
3. **배포 전 확인**: 로컬에서 먼저 테스트
4. **Git 커밋**: 버전 변경 후 반드시 커밋

---

## 🎯 체크포인트

버전 업데이트 후:
- [ ] 로컬에서 정상 작동 확인
- [ ] 개발자 도구에서 새 버전 확인
- [ ] Git commit & push
- [ ] GitHub Pages 반영 확인 (1-2분 소요)
- [ ] 실제 URL에서 새 버전 확인

---

**현재 버전**: `1.0.0`
**마지막 업데이트**: 2025-01-20
