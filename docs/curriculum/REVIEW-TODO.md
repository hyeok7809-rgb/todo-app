# 커리큘럼 검토에서 남은 일 (REVIEW-TODO)

2026-10-21 과정별 검토 에이전트(0~7과정, 14개 중 8개 완료 후 비용 때문에 중단)가 찾은 124건 중 약 118건을 반영했다.
아래는 코드 블록 전체를 다시 써야 해서 아직 못 고친 것과, 검토 자체를 못 한 과정이다. 하나 고칠 때마다 이 파일에서 지운다.

## 1. 검토는 됐지만 아직 못 고친 것

### docs/curriculum/02-web-basics/02-4.md (medium/code-mismatch)
- 문제 구절: `// 1. 싹 비운다`
- 무엇이 틀렸나: 172~184행을 app.js의 `render()`라고 인용했지만 현재 app.js 307~317행의 `render()`는 `renderLevel(); renderLedger(); renderMonth(); renderRoutine(); … renderStatus();`를 부르기만 한다. 잔액·목록 비우기·`<li>` 만들기는 365~405행 `renderLedger()`에 있고, 요소 생성도 `document.createElement`가 아니라 69행의 `makeElement()`를 쓴다(114~125행 '`render()`의 한 줄 만들기'도 같은 문제).
- 고칠 방향: 코드 블록을 `function renderLedger() { balanceText.textContent = formatMoney(calculateBalance()); list.innerHTML = ""; … for (const entry of recentFirst) { const item = makeElement("li"); … list.appendChild(item); } }`로 바꾸고, 그 위에 '`render()`는 `renderLedger()`를 포함한 부서별 그리기 함수를 차례로 부르는 함수이고, `makeElement()`는 `createElement`+`className`+`textContent` 세 줄을 묶은 app.js 2-1 구역의 도우미'라는 설명을 붙인다.

### docs/curriculum/02-web-basics/02-3.md (medium/code-mismatch)
- 문제 구절: `grid-template-columns: 1fr 1fr;   /* 같은 너비의 열 2개 */`
- 무엇이 틀렸나: style.css 225~241행에서 `.building`은 배경·테두리·패딩만 있는 상자이고, 격자는 `.floor { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }`에 `.room-ceo { grid-column: span 2; }`다(1000px 이하 2열, 640px 이하 1열). 168행 '방이 6개이니 2열이면 3행이 자동으로 생긴다'도 방 7개·층당 4열인 실제와 다르다.
- 고칠 방향: 코드 블록을 `.floor { display: grid; grid-template-columns: repeat(4, 1fr);  /* 같은 너비의 열 4개 */ gap: 10px; } .room-ceo { grid-column: span 2; }`로 바꾸고, 168행을 '한 층에 방이 4개씩이고 사장실은 `span 2`로 두 칸을 차지한다. `@media (max-width: 1000px)`에서 `repeat(2, 1fr)`, 640px 이하에서 `1fr`로 줄어든다'로 고친다.

### docs/curriculum/02-web-basics/02-3.md (medium/code-mismatch)
- 문제 구절: `**실제 예시 2 — animation.** 복도를 걷는 사장님.`
- 무엇이 틀렸나: 219~228행의 `@keyframes walk { from { left: 20px } to { left: calc(100% - 52px) } }`와 `.player { animation: walk 6s linear infinite alternate; }`는 style.css에 없다. 실제는 493~552행 `.walker { animation: stroll 18s linear infinite; }`, `@keyframes stroll`(50%에서 `scaleX(-1)`로 몸을 뒤집어 돌아옴), `.walker-body { animation: bob 0.5s steps(1, end) infinite; }`다. 퀴즈 5 해설(379행)의 '`.player`의 `animation: walk 6s linear infinite alternate`'도 같은 오류다.
- 고칠 방향: 코드 블록을 `@keyframes stroll { 0% { left: 2%; transform: scaleX(1); } 49.99% { left: calc(100% - 36px); transform: scaleX(1); } 50% { left: calc(100% - 36px); transform: scaleX(-1); } … }`와 `.walker { position: absolute; animation: stroll 18s linear infinite; }`로 바꾸고, `alternate` 대신 `scaleX(-1)`로 되돌아오는 이유를 설명한다. 퀴즈 5 해설도 '`.walker`의 `animation: stroll 18s linear infinite`(계속 왕복)'로 고친다.

### docs/curriculum/02-web-basics/02-3.md (medium/code-mismatch)
- 문제 구절: `**실제 예시.** `style.css`에서 하나씩.`
- 무엇이 틀렸나: 'style.css에서 하나씩' 가져왔다는 37~63행 블록 중 네 규칙이 실제 파일에 없다: `.sign h1 { color: var(--accent); }`(`.sign`·`h1` 없음), `.room.locked { opacity: 0.6; }`(실제는 자식에 `opacity: 0.75`), `.room:hover { transform: translate(-2px, -2px); }`(실제 254~258행은 `outline: 3px solid var(--yellow)`), `.room.locked::after { content: "🔒"; }`(style.css에 `::after` 규칙 없음). 68행 '잠긴 방의 🔒는 HTML에 없고 `::after`가 그린 것'도 틀렸다. 🔒는 app.js 502행 `makeElement("span", "lock-badge", "🔒")`와 513행 `door-lock` span이 만든다.
- 고칠 방향: 코드 블록에서 네 규칙을 실제 규칙으로 바꾼다: 자손 선택자 예 → `.pill b { color: var(--yellow); }`, 두 클래스 예 → `.room.locked { cursor: not-allowed; }`, 의사 클래스 예 → `.room:hover { outline: 3px solid var(--yellow); }`, 의사 요소 예 → `.status-item + .status-item::before { content: ""; }`(상태 바 항목 사이 구분선). 68행은 '상태 바 항목 사이의 세로 선은 HTML에 없고 `::before`가 그린 것이다. 잠긴 방의 🔒는 `app.js`의 `buildRoom()`이 span으로 만들어 넣는다'로 고친다.

### docs/curriculum/04-data-api/04-1.md (low/format)
- 문제 구절: `4. **4-3 예습** — 한국투자증권 공식 샘플 저장소의 `examples_llm/domestic_stock/inquire_price/inquire_price.py`를 열어, 핵심 개념 6의 체크리스트 여섯 칸을 직접 채운다. 응답 본문의 필드 이름(현재가 등)은 어디서 확인해야 하`
- 무엇이 틀렸나: 공통 형식은 숙제 3개인데 이 단원만 4개다(4-2·4-3·4-4는 모두 3개). 다른 단원(4-2 등)은 '다음 단원 예습'을 3번 숙제로 넣어 3개를 지킨다.
- 고칠 방향: 이 항목을 삭제하고, 3번 숙제 끝에 "(4-3 예습: 공식 샘플 `examples_llm/domestic_stock/inquire_price/inquire_price.py`로 체크리스트 여섯 칸을 채워 본다)"를 한 문장으로 덧붙여 숙제를 3개로 맞춘다.

## 2. 검토를 아직 안 한 과정: 8~13과정 (08-claude-code-basics ~ 13-monetize)

0~7과정에서 반복해서 나온 오류 유형이다. 8~13과정을 볼 때 같은 것을 먼저 찾는다.

1. **옛 app.js 기준 설명**: `addEntry(type, title, amount)`(실제는 `addEntry(type, category, title, amount)`), `load()`에 try/catch가 없다는 전제(실제는 있음), `render()` 안에 잔액·목록 코드가 있다는 설명(실제는 `renderLedger()`), 방 6개(실제 7개), `.sign`/`<h1>`/`.player`(없음. `.status-bar`, `.walker`).
2. **`toISOString()` 사용**: 날짜는 `todayString()`/`dateToString()`만. CLAUDE.md 규칙.
3. **로드맵 단계 번호**: 인사부·교육부는 2단계, 사장실 백업은 2.5단계, 자산관리부 3단계, 기획부 4단계. '5단계 루틴', '6단계 교육부'는 틀림.
4. **없는 단원·문서 참조**: 단원 번호는 `docs/curriculum/OUTLINE.md`에서 확인. '0과정 lesson-01' 같은 표현 금지.
5. **숙제 4개**: 공통 형식은 3개. 4번째는 `- 보너스(선택):`으로 바꾼다.
6. **entry 객체에 category 누락**: 실제 저장 모양은 `{id, type, category, title, amount, date}`.
7. **Claude·AI 사실**: 공식 문서에서 직접 확인한 것만 '확인일'을 남긴다. 못 연 주소는 '주소만 기재(작성 환경에서 접속 불가, 직접 확인)'.

검토 방법: 과정 하나를 통째로 Claude에게 주고 "이 체크리스트 7가지로 검토해서 파일·구절·고칠 문장을 표로 줘"라고 요청한 뒤, 한 건씩 원문을 열어 확인하고 고친다. `python3 docs/curriculum/check-format.py`로 형식을 다시 확인한다.
