# 1.6단계: 픽셀 오피스 — 글자로 그리는 그림과 데이터로 만드는 방

회사 지도를 "진짜 사무실"처럼 다시 그렸다. 새로 들어온 파일은 `sprites.js` 하나.
가계부(`app.js` 1~5번 구역)와 저장 방식(`localStorage`의 `ledger-entries`)은 그대로다.

이번에 새로 배우는 것 다섯 가지:

| # | 무엇 | 어디 |
|---|---|---|
| 1 | 글자 격자 + 색 대응표 + 이중 반복문으로 그림 그리기 | `sprites.js` |
| 2 | 데이터 배열(`ROOMS`)을 반복문으로 돌려 방 7개 만들기 | `app.js` 1-1, 5-1 구역 |
| 3 | 시간대 규칙으로 오늘 상태 정하기, `data-status`로 색 입히기 | `app.js` 4-2, 5 구역 + `style.css` |
| 4 | 걷는 캐릭터: CSS 애니메이션 세 겹 | `style.css` `.walker` |
| 5 | 같은 세 줄이 반복되면 함수로 묶기 (`makeElement`) | `app.js` 2-1 구역 |

## 1. 그림 = 글자 격자 + 색 대응표 + 이중 반복문

`sprites.js`를 열면 이런 게 보인다.

```js
SPRITES.PLANT = [
  "...EE...",   // E = 잎
  "..EgEE..",
  ".EEgEEE.",
  "...KK...",   // K = 검은 윤곽선
  ".KTTTTK.",   // T = 테라코타 화분
];
```

- **글자 격자**: 문자열 하나가 한 줄, 글자 하나가 픽셀 한 칸. `.`은 투명(안 찍음).
- **색 대응표**(`PALETTE`): `K: "#1a1a1a"` 처럼 글자마다 색 하나. 글자 `O`는 직원 머리의 주황색이다.
- **이중 반복문**(`drawSprite`): 바깥 반복문은 줄(y), 안쪽 반복문은 그 줄의 글자(x). 글자마다 `fillRect`로 작은 네모를 찍는다.

```js
for (let y = 0; y < rows.length; y++) {        // 줄마다
  for (let x = 0; x < rows[y].length; x++) {   // 글자마다
    const color = PALETTE[rows[y][x]];
    if (!color) continue;                      // "." 은 건너뛴다
    ctx.fillStyle = color;
    ctx.fillRect(x * scale, y * scale, scale, scale);
  }
}
```

`drawSprite("PLANT", 3)` 은 한 칸을 3px × 3px로 찍은 `<canvas>` 요소를 돌려준다.
`<canvas>`는 "자바스크립트로 그림을 그릴 수 있는 빈 도화지"다. `app.js`는 돌려받은 도화지를 `appendChild`로 방에 붙이기만 한다.
CSS의 `image-rendering: pixelated` 덕분에 확대해도 번지지 않고 각지게 보인다.

**앉은 자세는 겹치는 순서로 만든다.** 자리 하나(`.seat`)에는 의자 → 캐릭터 → 책상 순서로 그림을 붙인다.
나중에 붙인 것이 위에 보이므로, 책상이 캐릭터의 다리를 가려서 "앉아 있는" 것처럼 보인다.
캐릭터 그림 자체는 서 있는 모습 그대로다. 위치(몇 px 아래)는 `style.css`의 `.seat .sprite-chair` 같은 줄이 정한다.

## 2. 방은 데이터 → 반복문 → 화면

방 7개를 HTML에 일일이 적지 않았다. `app.js` 1-1 구역의 `ROOMS` 배열에 방 정보를 한 줄씩 적어 두고,

```js
{ id: "ledger", icon: "📒", name: "재무부", floor: 1, open: true,
  pattern: "check", color: "#dcefff",
  shelf: ["WINDOW", "WHITEBOARD", "CLOCK"], props: ["PLANT", "COPIER"] },
```

`buildMap()`이 배열을 돌면서 `buildRoom(room)`으로 방을 하나씩 만든다.

```js
for (const room of ROOMS) {
  const el = buildRoom(room);          // 방 하나를 만들어서
  if (room.floor === 1) floor1.appendChild(el);   // 층에 붙인다
  else floor2.appendChild(el);
}
```

`buildRoom()` 안을 보면 방 하나는 네 부분이다. `index.html`의 주석에도 같은 그림이 있다.

```
.room
  ├ .room-tag     이름표 (아이콘 · 부서명 · 인원 · 상태 칩)
  ├ .room-shelf   위쪽 벽 띠 (창문·칠판·시계 + 오른쪽 끝에 문)
  ├ .room-inside  바닥 (팀장 자리 → 직원 책상 3×2, 사장실은 카펫)
  └ .room-props   아래쪽 널빤지 바닥 띠 + 소품
```

`room.color`는 `el.style.setProperty("--floor", room.color)` 로 CSS 변수에 넣는다.
CSS 쪽에서는 `.room-inside { background-color: var(--floor); }` 라고만 적어 두면 방마다 다른 색이 된다.
"값은 자바스크립트가 넣고, 어떻게 보일지는 CSS가 정한다"는 역할 분리의 또 다른 예다.

## 3. 오늘 상태 계산 (4-2 구역)과 data-status

재무부 팀장(= 나)의 상태를 네 가지 중 하나로 정한다. 조건문이 위에서부터 차례로 걸러낸다.

```js
function todayStatus() {
  const count = todayEntries().length;
  const hour = new Date().getHours(); // 0 ~ 23

  if (count > 0) return "done";       // 오늘 기록이 있으면 무조건 완료
  if (hour >= 22) return "problem";   // 기록 없음 + 22시 이후
  if (hour >= 9) return "working";    // 기록 없음 + 9시~21시
  return "rest";                      // 기록 없음 + 9시 이전
}
```

| 상태 | 조건 |
|---|---|
| ✅ 완료 | 오늘 날짜 기록이 1건 이상 |
| ⚠ 문제 | 기록 없음 + 22시 이후 |
| 💬 근무 중 | 기록 없음 + 9시~21시 |
| 💤 쉬는 중 | 기록 없음 + 9시 이전 |

아이콘과 글자는 `STATUS` 표 한 곳에만 있다. `renderStatus()`는 상태 이름을 요소에 이렇게 붙인다.

```js
pill.dataset.status = status;   // HTML로 치면 <span data-status="done">
```

그러면 `style.css`의 이 네 줄 중 하나가 골라진다.

```css
[data-status="done"]    { background: var(--c-done); }
[data-status="working"] { background: var(--c-working); }
[data-status="problem"] { background: var(--c-problem); }
[data-status="rest"]    { background: var(--c-rest); }
```

상태가 붙는 곳이 상단 바, 방 이름표 칩, 팀장 알약, 재무부 창 제목까지 네 군데나 되지만 전부 같은 방식이다.

> 함정 하나: `.chip { background: ... }` 처럼 칩 자체에 배경색을 또 적으면 상태 색이 전부 무시된다.
> `[data-status="done"]` 과 `.chip` 은 CSS가 보기에 "힘(명시도)"이 같고, 힘이 같으면 **파일에서 더 뒤에 쓴 규칙이 이긴다**.
> 그래서 `style.css`의 `.chip` 에는 일부러 `background` 를 적지 않았다. (주석으로도 남겨 뒀다)

`render()` 안에서 부르기 때문에 기록을 추가하거나 지우면 바로 바뀌고, 8번 구역의 `setInterval(renderStatus, 60 * 1000)` 덕분에 가만히 둬도 1분마다 다시 계산된다 (21시 59분 → 22시가 되면 저절로 ⚠ 문제가 된다).

## 4. 걷는 캐릭터 (CSS 세 겹)

길 위의 캐릭터는 자바스크립트가 매 순간 옮기는 게 아니다. HTML을 세 겹으로 만들어 두고 CSS 애니메이션이 각 겹을 따로 움직인다.

```
.walker        좌우로 왕복 (left 값이 변한다). 돌아올 때 scaleX(-1)로 몸을 뒤집는다
  .walker-body 위아래로 2px 통통 (translateY)
    canvas × 2  다리 모은 그림 / 다리 벌린 그림. opacity를 0.5초마다 번갈아 1 ↔ 0
```

`@keyframes stroll` 을 보면 49.99%까지는 `scaleX(1)`, 50%부터 `scaleX(-1)` 이다. 0.01% 차이로 "순간에 뒤집기"를 만든 것이다.
`steps(1, end)` 는 "중간값 없이 탁탁 바뀌게" 라는 뜻이라 픽셀 게임 느낌이 난다.
움직임을 줄여 달라고 설정한 사용자를 위해 맨 아래 `@media (prefers-reduced-motion: reduce)` 에서 모든 애니메이션을 끈다.

## 5. 같은 세 줄이 반복되면 함수로 묶는다 (`makeElement`)

요소를 만드는 코드는 늘 똑같은 세 줄이었다.

```js
const tag = document.createElement("span");
tag.className = "room-tag";
tag.textContent = "재무부";
```

이게 파일 안에 50번 넘게 나오길래 2-1 구역에 함수 하나로 묶었다.

```js
function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

const tag = makeElement("span", "room-tag", "재무부"); // 위 세 줄과 같다
```

"두 번 이상 똑같이 적고 있다면 함수로 만들 때다." 이게 이번 단계에서 가장 오래 남을 습관이다.
같은 이유로 `twoDigits(5) → "05"` 도 작은 함수로 뺐다. 날짜와 시각을 만들 때 두 곳에서 쓴다.

## 한 줄 요약

```
페이지 열림 → buildMap() (ROOMS를 돌며 방 7개 생성) → connectRooms() → load() → render()
기록 추가   → addEntry() → save() → render() → renderStatus()가 data-status를 바꿈 → CSS가 색을 바꿈
```

## 숙제 (3개, 쉬운 순서)

고친 뒤 브라우저에서 새로고침하면 바로 반영된다. 망가져도 괜찮다. `git checkout 파일이름` 으로 원래대로 돌릴 수 있다.

1. **직원 머리색 바꾸기** — `sprites.js`의 `PALETTE`에서 `O: "#e07a2c"` 의 색을 바꿔라. 길을 걷는 직원의 머리가 같이 바뀐다.
   한 글자의 색을 바꾸면 그 글자를 쓰는 모든 그림이 바뀐다는 걸 확인하자.

2. **방 하나 추가해 보기** — `app.js`의 `ROOMS` 배열 맨 뒤에 한 줄을 더 넣어라.
   ```js
   { id: "lab", icon: "🧪", name: "연구소", floor: 2, open: false, pattern: "dots", color: "#fff0f5",
     shelf: ["WINDOW", "CLOCK"], props: ["PLANT"], desc: "실험용" },
   ```
   HTML은 한 글자도 안 고쳤는데 방이 생긴다. 지운 뒤에는 원래대로 돌려놓자. (2층이 한 줄 넘치면 `floor: 1`로 바꿔 보라.)

3. **상태 규칙 시각 바꾸기** — `todayStatus()`에서 "문제"가 되는 시각을 22시에서 20시로 바꾸면 어떻게 되는지 확인하고 되돌려라.
   지금 시각이 20시 전이라면 `hour >= 9` 쪽도 같이 건드려서 "지금 당장 ⚠ 문제"가 뜨게 만들어 보자.

막히면 어디서 막혔는지 그대로 알려주면 된다.

## 다음 단계 예고

2단계에서는 재무부에 **카테고리**(식비/교통/주거/기타)와 **이번 달 요약**을 넣는다. "조건에 맞는 것만 골라내기(filter)"와 날짜 비교를 배운다.
