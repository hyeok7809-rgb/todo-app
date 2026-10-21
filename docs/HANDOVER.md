# 인수인계서 — 다음 세션(Claude 채팅 또는 Claude Code)에서 이어서 하기

작성일 2026-10-21. 이 문서와 `CLAUDE.md`를 먼저 읽으면 지금까지의 맥락을 그대로 이어받을 수 있다.

## 1. 한 줄 요약

혼자 사는 개인 투자자(코딩 입문자)가 **코딩을 배우면서** 쓰는 게임형 자기관리 앱 "나의 1인 회사"와, 12월 1일부터 공부할 **14과정 66단원 커리큘럼**이 한 저장소에 들어 있다. 앱은 빌드 도구 없이 `index.html`을 더블클릭하면 열린다.

- 저장소: `hyeok7809-rgb/todo-app` (GitHub). 기본 브랜치 `main`.
- 작업 브랜치: `claude/confident-goodall-gdy93b`. PR #1로 main에 한 번 합쳤고, 그 뒤의 커밋(기획부, 검토 반영)도 main에 합쳐 두었다. 둘이 같은 내용이면 어느 쪽에서 시작해도 된다.
- 사용자: 12월부터 하루 5시간 이상 공부 예정. 루틴은 주식 매매 복기·헬스·코딩 공부·가계부. 학습 방식은 "설명 + 숙제". Claude 유료 구독, ChatGPT, Gemini 사용.

## 2. 지금 상태 (무엇이 끝났나)

### 앱 (로드맵 `docs/ROADMAP.md`)
| 단계 | 부서 | 파일 | 상태 |
|---|---|---|---|
| 1, 1.5, 1.6, 2.5 | 재무부(가계부·카테고리·이번 달 요약), 지도, 사장실(현황·JSON 백업) | `app.js`, `sprites.js`, `ceo.js` | ✅ |
| 2 | 인사부(루틴·연속 달성일), 교육부(66단원 진도·예정일) | `routine.js`, `study.js` | ✅ |
| 3 | 자산관리부(계좌·잔고 스냅샷·순자산) | `assets.js` | ✅ |
| 4 | 기획부(주간 목표 3개·일요일 회고·주간 리포트·8주 경험치 막대) | `report.js` | ✅ (lesson-04) |
| 6, 7, 8 | 자산관리부 확장, 그림 교체, AI 직원실 | 없음 | 미착수 |

- 저장은 전부 `localStorage`. 키 5개: `ledger-entries`, `routine-checks`, `study-progress`, `asset-accounts`, `weekly-plans`. 사장실 백업이 이 5개를 JSON으로 내보낸다.
- 교육부의 "문서" 링크는 GitHub 주소(`study.js`의 `DOC_BASE`)로 열린다. 오프라인으로 쓰려면 `""`로 바꾼다.
- 단계별 설명과 숙제: `docs/lesson-01.md` ~ `lesson-04.md`(1b, 1c 포함).

### 커리큘럼 (`docs/curriculum/`)
- 개요 `OUTLINE.md`, 데이터 `modules.json` → `python3 docs/curriculum/make-curriculum-js.py`가 `curriculum.js`를 만든다. **`curriculum.js`는 직접 고치지 않는다.**
- 66단원 문서 전부 작성 완료. 형식 검사 `python3 docs/curriculum/check-format.py` 66/66 통과.
- 일정표 `docs/SCHEDULE.md`: 2026-12-01 개강, 월~토 하루 한 단원, 일요일 회고.
- **검토 현황**: 0~7과정은 과정별 검토 에이전트가 읽고 찾은 124건 중 약 118건을 원문과 대조해 반영했다. 8~13과정은 아직 검토하지 않았다. 남은 일과 체크리스트는 `docs/curriculum/REVIEW-TODO.md`.

## 3. 꼭 지킬 규칙 (자세한 건 `CLAUDE.md`)

1. **코드보다 설명.** 모든 변경에 "왜"를 한국어 주석으로. 새 개념은 한 번에 하나. 클래스·모듈 import/export·화살표 함수 남발·비동기는 커리큘럼에서 배우기 전엔 쓰지 않는다. `function`, `for...of`, `if/else`면 충분하다.
2. **순수 HTML/CSS/JS.** 빌드 도구·npm·프레임워크 없음.
3. **부서마다 파일 하나.** 새 부서를 열 때: `ROOMS`에서 `open: true` → `index.html`에 `#id-screen` → `id.js` → `roomDoneToday()`·`render()`·`totalXp()`·8번 구역에 한 줄씩 → `ceo.js`의 `BACKUP_KEYS`에 저장 키 추가 → `docs/lesson-N.md`(설명 + 숙제 3개) → `ROADMAP.md` ✅.
4. **날짜는 `todayString()`/`dateToString()`만.** `toISOString()` 금지(UTC라 밤에 날짜가 어긋남).
5. **단원 문서 공통 형식.** 제목 `# N-M. …`, 메타표(과정/예상 시간/선수 단원/경험치=시간×20), 섹션 8개(이 단원을 마치면 / 왜 배우나 / 핵심 개념 / 따라하기 / 흔한 실수와 해결 / 확인 퀴즈 5문항 `<details>` / 더 보기 / 숙제 3개).
6. **Claude·AI 사실은 공식 문서로.** code.claude.com/docs, platform.claude.com/docs, support.claude.com에서 직접 확인한 것만 URL과 확인일을 적는다. 못 연 주소는 "주소만 기재(작성 환경에서 접속 불가, 직접 확인)". 지어내지 않는다.
7. **비용.** 병렬 에이전트·워크플로우는 사용자가 명시적으로 요청할 때만. 기본은 단일 세션.
8. 커밋 메시지는 한국어로 "무엇을 왜". PR은 요청이 있을 때만.

## 4. 검증 방법

```bash
# 문법 (파일마다)
node -e "new Function(require('fs').readFileSync('app.js','utf8'))"
# 단원 문서 형식
python3 docs/curriculum/check-format.py
```

브라우저 확인: `index.html` 열기 → 기록 추가 → 새로고침해도 남는지 → 잠긴 방(AI 직원실) 클릭 시 안내 → 390px 폭에서 가로 스크롤 없음. Playwright가 있으면 같은 흐름을 자동으로 돌린다(이 저장소에는 테스트 파일을 두지 않았다).

## 5. 다음에 할 일 (추천 순서)

1. **8~13과정 검토** — `REVIEW-TODO.md`의 체크리스트 7가지로. 과정 하나씩, 찾은 건은 원문을 열어 확인한 뒤 고친다.
2. **`REVIEW-TODO.md` 1번의 남은 5건** — 코드 블록을 실제 코드로 다시 쓰는 일.
3. **GitHub Pages 켜기** — 저장소 Settings → Pages → Branch `main`, 폴더 `/ (root)`. 주소는 `https://hyeok7809-rgb.github.io/todo-app/`가 될 것이다. 폰에서 쓸 수 있다(기록은 기기별 브라우저에 저장되니 백업으로 옮긴다).
4. **로드맵 6단계** 자산관리부 확장(월별 순자산 추이) — 기획부의 8주 막대와 같은 방식으로 그릴 수 있다.
5. **8단계 AI 직원실** — 커리큘럼 10과정(Claude API)을 끝낸 뒤.
6. 12월 1일 전에 `OUTLINE.md`와 `SCHEDULE.md`를 한 번 읽고, 0-1부터 시작.

## 6. Claude 채팅(claude.ai)에서 이어가는 법

1. 새 대화를 열고 이 저장소를 준다. GitHub 연동이 있으면 저장소를 연결하고, 없으면 `CLAUDE.md`, 이 문서, 작업할 파일(예: `docs/curriculum/08-claude-code-basics/08-1.md`)을 붙여 넣는다.
2. 첫 요청 예: "docs/HANDOVER.md와 CLAUDE.md를 읽고, REVIEW-TODO.md의 체크리스트로 8-1 단원을 검토해서 파일·구절·고칠 문장을 표로 줘. 고치지는 말고." → 표를 보고 동의하는 것만 "이 3건 고쳐 줘"로 다시 요청한다.
3. 받은 수정본은 파일에 붙여 넣고 저장 → GitHub Desktop이나 Claude Code에서 커밋. 커밋 메시지는 한국어로 무엇을 왜 바꿨는지.
4. 한 번에 한 과정(또는 한 단원)만. 긴 파일 여러 개를 한 번에 주면 답이 흐려진다.
5. Claude Code(웹 또는 터미널)를 쓸 때는 CLAUDE.md가 자동으로 읽히니 "HANDOVER.md 읽고 시작해"만 말하면 된다. 워크플로우·에이전트 병렬 실행은 요청하지 않는 한 쓰지 않는다.

## 7. 이번 세션의 비용 기록 (참고)

- 클라우드 크레딧 250달러 중 약 230달러를 썼다. 큰 몫은 픽셀 지도 리디자인과 0~4과정 집필, 그리고 마지막의 검토 워크플로우(과정당 3~4달러, 8개 과정까지 돌리고 중단).
- 단일 세션 직접 작업은 쌌다: 7~13과정 32단원 + 자산관리부가 약 22달러, 기획부 한 단계가 약 8달러.
- 교훈: 문서 집필·검토처럼 양이 많은 일은 "과정 하나씩, 단일 세션"이 비용 대비 가장 낫다.
