# 1단계: 가계부 기본

## 이번에 만든 것

- 지출/수입을 고르고, 내용과 금액을 넣고 추가 버튼을 누르면 목록에 쌓인다.
- 맨 위 카드에 현재 잔액이 나온다. (수입 합계 − 지출 합계)
- 항목 오른쪽 × 를 누르면 지운다.
- 브라우저를 닫았다 열어도, 새로고침해도 내역이 남는다.

## 파일 세 개의 역할

| 파일 | 역할 | 비유 |
|---|---|---|
| `index.html` | 화면에 뭐가 있는지 (제목, 입력칸, 버튼, 목록) | 건물의 뼈대 |
| `style.css` | 어떻게 보이는지 (색, 크기, 간격) | 인테리어 |
| `app.js` | 어떻게 움직이는지 (버튼 누르면 뭘 할지) | 전기 배선 |

웹 앱은 거의 다 이 세 가지의 조합이다. 지금은 셋 다 한 파일씩이지만, 커지면 여러 파일로 쪼갠다.

## 꼭 이해하고 넘어갈 개념 5가지

`app.js`를 열어놓고 같이 보자. 위에서부터 번호가 매겨져 있다.

### 1. 변수와 배열

```js
let entries = [];
```

`entries`는 내역을 전부 담아두는 **상자**다. `[]`는 "비어 있는 목록"이라는 뜻이고, 이걸 **배열**이라고 부른다.
내역이 하나 추가되면 `entries.push(entry)`로 맨 뒤에 넣는다.

`let`은 "나중에 내용이 바뀔 수 있는 상자", `const`는 "한 번 정하면 안 바뀌는 상자"다.

### 2. 객체

```js
const entry = {
  id: Date.now(),
  type: "expense",
  title: "점심",
  amount: 9000,
  date: "2026-10-21",
};
```

내역 한 건은 "제목, 금액, 날짜…" 처럼 여러 정보가 묶여 있다. 이렇게 **이름: 값** 쌍을 중괄호로 묶은 것이 **객체**다.
`entry.amount` 처럼 점을 찍으면 그 값을 꺼낼 수 있다.

### 3. 함수

```js
function calculateBalance() {
  let balance = 0;
  for (const entry of entries) {
    if (entry.type === "income") {
      balance = balance + entry.amount;
    } else {
      balance = balance - entry.amount;
    }
  }
  return balance;
}
```

**함수**는 "이름 붙여둔 작업 묶음"이다. `calculateBalance()` 라고 부르면 안의 코드가 실행되고 `return` 뒤의 값을 돌려준다.
이 함수 안에는 두 가지가 더 들어있다.

- `for (const entry of entries)` : 배열 안의 내역을 **하나씩 꺼내서** 반복한다. (**반복문**)
- `if (...) { } else { }` : 조건에 따라 **다른 일**을 한다. (**조건문**)

### 4. 화면 그리기 (`render`)

자바스크립트에서 화면을 바꾸는 방법은 "HTML 요소를 만들어서 붙이는 것"이다.

```js
const title = document.createElement("span"); // <span> 만들고
title.textContent = entry.title;               // 안에 글자 넣고
item.appendChild(title);                       // <li> 안에 붙인다
```

`render()`는 목록을 싹 비운 다음 `entries` 배열을 보고 처음부터 다시 만든다.
"데이터가 바뀌면 화면 전체를 다시 그린다"는 단순한 방식인데, 작은 앱에서는 이게 제일 실수가 적다.

### 5. 저장 (`localStorage`)

```js
localStorage.setItem("ledger-entries", JSON.stringify(entries)); // 저장
entries = JSON.parse(localStorage.getItem("ledger-entries"));    // 불러오기
```

`localStorage`는 브라우저가 가진 작은 메모장이다. 문자열만 저장할 수 있어서,
배열을 `JSON.stringify`로 문자열로 바꿔 저장하고, 꺼낼 때 `JSON.parse`로 다시 배열로 바꾼다.

직접 확인해 보기: 브라우저에서 F12 → Application(크롬) 탭 → Local Storage → 파일 주소를 누르면 저장된 내용이 보인다.

## 전체 흐름 한 줄 요약

```
페이지 열림 → load() → render()
추가 버튼   → addEntry() → entries에 넣고 → save() → render()
× 버튼     → deleteEntry() → entries에서 빼고 → save() → render()
```

## 숙제 (3개, 쉬운 순서)

코드를 고친 뒤 브라우저에서 새로고침하면 바로 반영된다. 망가져도 괜찮다. `git checkout app.js` 로 원래대로 돌릴 수 있다.

1. **색 바꾸기** — `style.css`에서 추가 버튼 색(`#2563eb`)을 원하는 색으로 바꿔라.
   힌트: 인터넷에서 "css color picker" 검색.

2. **빈 목록 문구 바꾸기** — `app.js`의 `render()` 안에 있는 "아직 내역이 없어요…" 문구를 내 말투로 바꿔라.
   찾기: Ctrl+F 로 "아직 내역이" 검색.

3. **내역 개수 보여주기** — 잔액 아래에 "총 N건"이 나오게 해라.
   힌트 3가지:
   - `index.html`의 잔액 카드 안에 `<p id="count"></p>` 를 하나 추가한다.
   - `app.js` 2번 구역처럼 `document.getElementById("count")` 로 가져온다.
   - `render()` 맨 앞에서 `.textContent = "총 " + entries.length + "건"` 으로 채운다.

막히면 어디서 막혔는지 그대로 알려주면 된다. 다음 세션에서 숙제 확인하고 2단계로 간다.

## 다음 단계 예고

2단계에서는 "식비 / 교통 / 주거 / 기타" 같은 **카테고리**를 추가하고, **이번 달에 어디에 얼마 썼는지** 합계를 보여준다.
그러면서 날짜 비교와 "조건에 맞는 것만 골라내기(filter)"를 배운다.
