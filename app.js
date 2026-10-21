// =====================================================
// 나의 1인 회사 - 1단계 (재무부: 가계부)
// 회사 지도에서 재무부에 들어가면 수입/지출을 기록하고 잔액을 본다.
// =====================================================

// ---------- 1. 데이터 ----------
// 모든 내역을 담는 "배열". 각 내역은 아래 모양의 "객체"다.
// { id: 1697000000000, type: "expense", title: "점심", amount: 9000, date: "2026-10-21" }
let entries = [];

// localStorage에 저장할 때 쓰는 이름표(키)
const STORAGE_KEY = "ledger-entries";

// ---------- 2. 화면 요소 가져오기 ----------
// HTML에서 id로 붙여둔 요소를 자바스크립트 변수로 가져온다.
const form = document.getElementById("entry-form");
const typeInput = document.getElementById("entry-type");
const titleInput = document.getElementById("entry-title");
const amountInput = document.getElementById("entry-amount");
const list = document.getElementById("entry-list");
const balanceText = document.getElementById("balance");
const levelText = document.getElementById("level");
const xpFill = document.getElementById("xp-fill");
const xpText = document.getElementById("xp-text");

// ---------- 3. 저장과 불러오기 ----------
// 배열을 문자열(JSON)로 바꿔서 localStorage에 저장한다.
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// localStorage에 저장된 문자열을 다시 배열로 바꿔서 가져온다.
function load() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    entries = JSON.parse(saved);
  }
}

// ---------- 4. 기능 함수 ----------
// 내역 한 건 추가
function addEntry(type, title, amount) {
  const entry = {
    id: Date.now(),                              // 지금 시각(밀리초)을 고유번호로 사용
    type: type,                                  // "income" 또는 "expense"
    title: title,
    amount: amount,
    date: new Date().toISOString().slice(0, 10), // "2026-10-21" 형태
  };
  entries.push(entry);   // 배열 맨 뒤에 넣는다
  save();
  render();
  showXpPop();
}

// 내역 한 건 삭제 (id가 같은 것만 빼고 나머지를 남긴다)
function deleteEntry(id) {
  entries = entries.filter(function (entry) {
    return entry.id !== id;
  });
  save();
  render();
}

// 잔액 계산: 수입은 더하고 지출은 뺀다
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

// 숫자를 "1,234,567원" 형태의 문자열로 바꾼다
function formatMoney(number) {
  return number.toLocaleString("ko-KR") + "원";
}

// ---------- 4-1. 경험치와 레벨 ----------
// 기록 한 건 = 10 경험치. 100 경험치마다 레벨이 하나 오른다.
const XP_PER_ENTRY = 10;
const XP_PER_LEVEL = 100;

function totalXp() {
  return entries.length * XP_PER_ENTRY;
}

function renderLevel() {
  const xp = totalXp();
  const level = Math.floor(xp / XP_PER_LEVEL) + 1; // 0~99 → Lv.1, 100~199 → Lv.2
  const xpInLevel = xp % XP_PER_LEVEL;             // 이번 레벨에서 채운 양

  levelText.textContent = level;
  xpText.textContent = xpInLevel + " / " + XP_PER_LEVEL;
  xpFill.style.width = (xpInLevel / XP_PER_LEVEL) * 100 + "%";
}

// "+10 EXP" 글자를 띄웠다가 1초 뒤에 지운다
function showXpPop() {
  const pop = document.createElement("div");
  pop.className = "xp-pop";
  pop.textContent = "+" + XP_PER_ENTRY + " EXP";
  document.body.appendChild(pop);
  setTimeout(function () {
    pop.remove();
  }, 1000);
}

// ---------- 5. 화면 그리기 ----------
// entries 배열의 내용을 보고 화면 전체를 다시 그린다.
function render() {
  // 레벨과 잔액
  renderLevel();
  balanceText.textContent = formatMoney(calculateBalance());

  // 목록을 비우고 처음부터 다시 만든다
  list.innerHTML = "";

  if (entries.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "아직 내역이 없어요. 위에서 추가해 보세요.";
    list.appendChild(empty);
    return;
  }

  // 최근 것이 위로 오도록 뒤집어서 보여준다
  const recentFirst = entries.slice().reverse();

  for (const entry of recentFirst) {
    const item = document.createElement("li");

    const title = document.createElement("span");
    title.className = "entry-title";
    title.textContent = entry.title;

    const date = document.createElement("span");
    date.className = "entry-date";
    date.textContent = entry.date;

    const amount = document.createElement("span");
    if (entry.type === "income") {
      amount.className = "amount-income";
      amount.textContent = "+" + formatMoney(entry.amount);
    } else {
      amount.className = "amount-expense";
      amount.textContent = "-" + formatMoney(entry.amount);
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "×";
    deleteBtn.title = "삭제";
    deleteBtn.addEventListener("click", function () {
      deleteEntry(entry.id);
    });

    item.appendChild(title);
    item.appendChild(date);
    item.appendChild(amount);
    item.appendChild(deleteBtn);
    list.appendChild(item);
  }
}

// ---------- 6. 화면 전환 ----------
// 지도 화면과 부서 화면 중 하나만 보여준다.
const mapScreen = document.getElementById("map-screen");
const ledgerScreen = document.getElementById("ledger-screen");

function showScreen(screen) {
  mapScreen.classList.add("hidden");
  ledgerScreen.classList.add("hidden");
  screen.classList.remove("hidden");
}

// 지도의 방 버튼을 누르면: 열린 방이면 들어가고, 잠긴 방이면 알려준다
for (const roomBtn of document.querySelectorAll(".room")) {
  roomBtn.addEventListener("click", function () {
    if (roomBtn.classList.contains("locked")) {
      alert("아직 잠겨 있어요. 다음 단계에서 열립니다!");
      return;
    }
    if (roomBtn.dataset.room === "ledger") {
      showScreen(ledgerScreen);
    }
  });
}

// "◀ 지도" 버튼을 누르면 지도로 돌아간다
for (const backBtn of document.querySelectorAll("[data-back]")) {
  backBtn.addEventListener("click", function () {
    showScreen(mapScreen);
  });
}

// ---------- 7. 이벤트 연결 ----------
// 폼에서 "추가" 버튼을 누르거나 엔터를 치면 실행된다.
form.addEventListener("submit", function (event) {
  event.preventDefault(); // 폼의 기본 동작(페이지 새로고침)을 막는다

  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);

  if (title === "" || amount <= 0) {
    return; // 내용이 비었거나 금액이 이상하면 아무것도 안 한다
  }

  addEntry(typeInput.value, title, amount);

  // 입력칸 비우고 커서를 내용 칸으로 되돌린다
  titleInput.value = "";
  amountInput.value = "";
  titleInput.focus();
});

// ---------- 8. 시작 ----------
// 페이지가 열리면 저장된 내역을 불러와서 화면에 그린다.
load();
render();
