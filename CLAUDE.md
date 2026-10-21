# 나의 1인 회사 — 프로젝트 안내 (Claude Code용)

## 이 프로젝트는
혼자 사는 개인 투자자(비전공 초보자)가 **코딩을 배우면서** 만드는 게임형 자기관리 앱.
픽셀 오피스 지도에서 부서(재무부·인사부·교육부…)에 들어가 기록하면 경험치와 레벨이 오른다.
최종 목표는 각 부서에 AI 직원을 붙여 24시간 돌아가는 회사로 키우는 것.
사용자는 12월부터 하루 5시간 이상 공부하며, 주식 매매·헬스·코딩·AI 공부를 루틴으로 관리한다.

## 가장 중요한 규칙: 학습용 코드
- 사용자는 코딩을 처음 배운다. **코드보다 설명이 먼저다.** 모든 변경에는 "왜 이렇게 했는지" 한국어 주석을 넉넉히 단다.
- 새 개념은 한 번에 하나만. 고급 문법(클래스, 모듈 import/export, 화살표 함수 남발, 비동기)은 커리큘럼에서 배우기 전에는 쓰지 않는다. `function` 키워드, `for...of`, `if/else`로 충분하다.
- 단계가 끝나면 `docs/lesson-N.md`에 설명 + 숙제 3개를 쓴다. 기존 lesson 파일의 말투와 구조를 따른다.
- 빌드 도구, npm 패키지, 프레임워크 없음. `index.html`을 더블클릭해서 열리는 순수 HTML/CSS/JS를 유지한다.

## 파일 구조 (부서마다 파일 하나)
| 파일 | 역할 |
|---|---|
| `index.html` | 화면 뼈대. 지도 + 부서 화면(`#xxx-screen`). 맨 아래 script 순서가 중요 |
| `style.css` | 픽셀 게임 테마. 상태 색은 `[data-status="done"]` 한 계열만 |
| `sprites.js` | 글자 격자 + PALETTE + `drawSprite(name, scale)` → canvas |
| `curriculum.js` | 66단원 데이터. **직접 고치지 말고** `docs/curriculum/modules.json` 수정 후 `python3 docs/curriculum/make-curriculum-js.py` |
| `routine.js` | 인사부: 루틴 체크, 연속 달성일 |
| `study.js` | 교육부: 커리큘럼 진도, 예정일 |
| `assets.js` | 자산관리부: 계좌, 날짜별 잔고 스냅샷, 순자산 (주 1회 점검 부서, `ROOMS`의 `weekly: true`) |
| `report.js` | 기획부: 주간 목표(3개)·회고, 다른 부서 데이터를 읽기만 해서 만드는 주간 리포트, 8주 경험치 막대 (주 1회 부서, `weekly: true`) |
| `ceo.js` | 사장실: 회사 현황, JSON 백업 내보내기/가져오기/초기화 (`BACKUP_KEYS`에 저장 키 목록) |
| `app.js` | 공용 함수(`makeElement`, `todayString`…) + 지도(`ROOMS`, `buildRoom`) + 재무부 + **시작(8번 구역)**. 항상 맨 마지막에 읽힌다 |
- `app.js`는 `// ---------- N. 제목 ----------` 번호 구역 구조를 유지한다.
- 새 부서를 열 때: `ROOMS`에서 `open: true`, `index.html`에 `#id-screen` 추가, `id.js` 파일 추가, `roomDoneToday()`에 한 줄, `render()`에 `renderXxx()` 한 줄.
- 저장은 전부 `localStorage`. 키: `ledger-entries`, `routine-checks`, `study-progress`, `asset-accounts`, `weekly-plans`. 불러올 때 `try/catch` + 모양 검사 필수. 새 키를 만들면 `ceo.js`의 `BACKUP_KEYS`에도 추가.
- 날짜는 현지 시간 기준 `dateToString()`/`todayString()`만 쓴다. `toISOString()` 금지(UTC라 밤에 날짜가 어긋남).

## 검증 방법
- 브라우저로 `index.html`을 열어 직접 확인. 자동 확인은 Playwright(설치돼 있으면)로 file:// 열기 → 기록 추가 → 새로고침 유지 → 잠긴 방 클릭 dialog → 390px 폭에서 가로 스크롤 없음.
- 커밋 전에 `node -e "new Function(require('fs').readFileSync('app.js','utf8'))"` 로 문법 확인.

## 문서
- `docs/ROADMAP.md` 단계표, `docs/lesson-*.md` 단계별 설명·숙제
- `docs/curriculum/OUTLINE.md` 14과정 66단원 개요, `docs/curriculum/NN-xxx/NN-M.md` 단원 문서(공통 형식 엄수), `docs/SCHEDULE.md` 12월~2월 일정
- 클로드·AI 관련 사실은 공식 문서(code.claude.com/docs, platform.claude.com/docs, support.claude.com)를 확인하고 URL과 확인일을 적는다. 지어내지 않는다.

## 작업 방식
- 한 번에 작은 단위로. 사용자에게 선택지를 줄 때는 추천을 먼저.
- 비용: 병렬 에이전트·워크플로우는 사용자가 명시적으로 요청할 때만. 기본은 단일 세션에서 직접 작업.
- 커밋 메시지는 한국어, 무엇을 왜 바꿨는지. PR은 요청이 있을 때만.
