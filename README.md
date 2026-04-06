# 🖥️ 온라인 야근 — 배포 가이드

> 혼자 야근하는 것 같지만, 우리는 다 같이 야근 중입니다.

---

## ⚡ 빠른 배포 순서 (총 30분 소요)

```
1. GitHub 업로드 (5분)
2. Supabase 설정 (10분)
3. Vercel 배포 (5분)
4. 환경변수 입력 (5분)
5. 테스트 (5분)
```

---

## STEP 1 — GitHub에 올리기

```bash
# 이 폴더에서 실행
cd online-yagun

# Git 초기화
git init
git add .
git commit -m "feat: 온라인 야근 초기 배포"

# GitHub에 새 레포지토리 만들고 (github.com > New repository)
# 레포 이름: online-yagun
git remote add origin https://github.com/YOUR_USERNAME/online-yagun.git
git branch -M main
git push -u origin main
```

---

## STEP 2 — Supabase 설정

### 2-1. 프로젝트 생성
1. [supabase.com](https://supabase.com) 접속 → 로그인
2. **New Project** 클릭
3. 이름: `online-yagun`, 비밀번호 설정, Region: **Northeast Asia (Seoul)**
4. **Create new project** 클릭 (약 2분 소요)

### 2-2. SQL 스키마 실행
1. 좌측 메뉴 **SQL Editor** 클릭
2. `supabase-schema.sql` 파일 전체 내용 복사 → 붙여넣기
3. **Run** 클릭

### 2-3. Realtime 활성화
1. 좌측 메뉴 **Database** → **Replication** 클릭
2. `messages` 테이블 찾기 → **INSERT** 토글 ON

### 2-4. API 키 복사
1. 좌측 메뉴 **Settings** → **API** 클릭
2. 아래 두 값을 복사해두기:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## STEP 3 — Vercel 배포

1. [vercel.com](https://vercel.com) 접속 → GitHub 계정으로 로그인
2. **Add New Project** 클릭
3. `online-yagun` 레포지토리 선택 → **Import**
4. Framework Preset: **Next.js** (자동 감지됨)
5. **Environment Variables** 섹션에 추가:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | (Supabase에서 복사한 URL) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (Supabase에서 복사한 anon key) |

6. **Deploy** 클릭 → 약 2분 후 완료
7. 배포된 URL 확인 (예: `online-yagun.vercel.app`)

---

## STEP 4 — 도메인 연결 (선택)

Vercel Dashboard → **Domains** → 원하는 도메인 입력
- 추천 도메인: `yagun.kr`, `onlineyagun.com`, `야근.kr`
- 도메인 구매: 가비아, 후이즈, Namecheap

---

## STEP 5 — Google AdSense 신청 (수익화)

### 신청 조건 준비
- [ ] 사이트 접속자 수 어느 정도 확보 (최소 수백 명/일)
- [ ] 개인정보처리방침 페이지 추가 (아래 참고)
- [ ] 이용약관 페이지 추가

### AdSense 신청
1. [adsense.google.com](https://adsense.google.com) 접속
2. 사이트 URL 입력 → 심사 신청
3. 승인 후 `.env.local`에 추가:
   ```
   NEXT_PUBLIC_ADSENSE_ID=ca-pub-xxxxxxxxxxxxxxxx
   ```
4. Vercel 환경변수에도 동일하게 추가 후 재배포

### 개인정보처리방침 페이지 추가 방법
`src/app/privacy/page.tsx` 파일 생성 후 기본 개인정보처리방침 내용 작성

---

## 로컬 개발 실행

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.local.example .env.local
# .env.local 파일 열고 Supabase 값 입력

# 개발 서버 실행
npm run dev
# → http://localhost:3000 접속
```

---

## 폴더 구조

```
online-yagun/
├── src/
│   ├── app/
│   │   ├── api/messages/route.ts  ← 채팅 API
│   │   ├── layout.tsx             ← SEO + AdSense 설정
│   │   ├── page.tsx               ← 메인 페이지
│   │   └── globals.css            ← 전역 스타일
│   ├── components/
│   │   └── YagunApp.tsx           ← 메인 앱 (전체 UI)
│   ├── lib/
│   │   ├── supabase.ts            ← Supabase 클라이언트
│   │   └── nick.ts                ← 닉네임 생성기
│   └── types/
│       └── index.ts               ← 타입 정의
├── supabase-schema.sql            ← DB 스키마 (Supabase에서 실행)
├── .env.local.example             ← 환경변수 템플릿
└── README.md
```

---

## 수익화 로드맵

| 단계 | DAU 기준 | 방법 | 예상 월수익 |
|------|---------|------|-----------|
| 1단계 | 500+ | 카카오 애드핏 | 5~30만원 |
| 2단계 | 2,000+ | Google AdSense | 30~100만원 |
| 3단계 | 5,000+ | 브랜드 스폰서십 | 100~300만원 |
| 4단계 | 1만+ | 프리미엄 방 + 굿즈 | 300만원+ |

---

## 바이럴 전략

배포 직후 아래 커뮤니티에 동시 포스팅:
- **블라인드** (직장인 커뮤니티) — 가장 효과적
- **에펨코리아** 자유게시판
- **트위터(X)** — `#야근` `#직장인` 해시태그
- **인스타그램 릴스** — 화면 녹화 + 브금
- **카카오톡 오픈채팅** 직장인 방

---

## 문의 / 이슈

배포 중 문제가 생기면 Supabase URL/Key 설정 먼저 확인하세요.
