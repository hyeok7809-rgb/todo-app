// =====================================================
// 나의 1인 회사 - 1단계 (재무부: 가계부) + 1.5단계 (회사 지도) + 1.6단계 (픽셀 오피스)
// 회사 지도에서 재무부에 들어가면 수입/지출을 기록하고 잔액을 본다.
// 지도의 방·가구·캐릭터 그림은 sprites.js의 drawSprite()가 그려 준다.
// =====================================================

// ---------- 1. 데이터 ----------
// 모든 내역을 담는 "배열". 각 내역은 아래 모양의 "객체"다.
// { id: 1697000000000, type: "expense", title: "점심", amount: 9000, date: "2026-10-21" }
let entries = [];

// localStorage에 저장할 때 쓰는 이름표(키)
const STORAGE_KEY = "ledger-entries";

// ---------- 1-1. 방(부서) 목록 ----------
// 지도에 그릴 방 7개. 이 배열을 보고 buildMap()이 방을 자동으로 만든다.
//   icon    : 이름표 앞에 붙는 부서 아이콘
//   floor   : 1 = 위층(index.html의 #floor-1), 2 = 아래층(#floor-2)
//             실제 건물처럼 1층을 아래로 두려면 index.html의 floor 순서만 바꾸면 된다.
//   open    : 들어갈 수 있는 방인지 (false면 🔒 잠김)
//   pattern : 바닥 무늬 (check 체크, dots 점, stripes 줄무늬, grid 모눈, plain 없음)
//   color   : 바닥 색
//   shelf   : 위쪽 벽 띠에 걸 그림 이름 (sprites.js에 있는 이름)
//   props   : 아래쪽 널빤지 바닥에 놓을 소품 그림 이름
//   ceo     : true면 사장실 (책상 격자 대신 카펫과 소파)
const ROOMS = [
  { id: "ledger",  icon: "📒", name: "재무부",    floor: 1, open: true,  pattern: "check",   color: "#dcefff", shelf: ["WINDOW", "WHITEBOARD", "CLOCK"],              props: ["PLANT", "COPIER"],  desc: "가계부 · 잔액" },
  { id: "assets",  icon: "💰", name: "자산관리부", floor: 1, open: false, pattern: "dots",    color: "#ffe6c4", shelf: ["WINDOW", "BOOKSHELF", "CLOCK"],               props: ["CABINET", "PLANT"], desc: "3단계에서 열림" },
  { id: "report",  icon: "📊", name: "기획부",    floor: 1, open: false, pattern: "stripes", color: "#dff5dc", shelf: ["WHITEBOARD", "WINDOW", "CLOCK"],              props: ["COPIER", "COOLER"], desc: "4단계에서 열림" },
  { id: "routine", icon: "📋", name: "인사부",    floor: 1, open: false, pattern: "check",   color: "#ffdede", shelf: ["WINDOW", "BOOKSHELF", "WHITEBOARD"],          props: ["SOFA", "PLANT"],    desc: "5단계에서 열림" },
  { id: "study",   icon: "📚", name: "교육부",    floor: 2, open: false, pattern: "dots",    color: "#e9e0ff", shelf: ["BOOKSHELF", "WHITEBOARD", "WINDOW"],          props: ["PLANT", "CABINET"], desc: "6단계에서 열림" },
  { id: "ai",      icon: "🤖", name: "AI 직원실", floor: 2, open: false, pattern: "grid",    color: "#d8f5f0", shelf: ["WINDOW", "CLOCK", "WHITEBOARD"],              props: ["COOLER", "COPIER"], desc: "8단계에서 열림" },
  { id: "ceo",     icon: "👑", name: "사장실",    floor: 2, open: true,  pattern: "plain",   color: "#f6ecd2", shelf: ["WINDOW", "WHITEBOARD", "CLOCK", "WINDOW"],    props: ["CABINET", "PLANT"], desc: "사장 = 나", ceo: true },
];

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

// 상단 상태 바
const statusSummary = document.getElementById("status-summary");
const todayDateText = document.getElementById("today-date");
const todayCountText = document.getElementById("today-count");
const lastRecordText = document.getElementById("last-record");

// 건물의 두 층과 그 사이 길
const floor1 = document.getElementById("floor-1");
const floor2 = document.getElementById("floor-2");
const road = document.getElementById("road");

// ---------- 2-1. 작은 도우미 함수 ----------
// 요소를 만들고, 클래스를 붙이고, 글자를 넣는 같은 세 줄이 50번 넘게 반복돼서 함수로 묶었다.
//   const tag = makeElement("span", "room-tag", "재무부");
// 는 아래 세 줄과 같다.
//   const tag = document.createElement("span");
//   tag.className = "room-tag";
//   tag.textContent = "재무부";
// 글자가 필요 없으면 세 번째 값은 비워 두면 된다.
function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

// 숫자를 두 자리 문자열로 만든다. 5 → "05", 12 → "12". 날짜와 시각을 만들 때 쓴다.
function twoDigits(number) {
  return String(number).padStart(2, "0");
}

// ---------- 3. 저장과 불러오기 ----------
// 배열을 문자열(JSON)로 바꿔서 localStorage에 저장한다.
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// localStorage에 저장된 문자열을 다시 배열로 바꿔서 가져온다.
function load() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return; // 저장된 게 없으면 빈 배열 그대로

  // 저장된 데이터가 깨졌을 때(예: 개발자 도구에서 잘못 고침) 앱이 죽지 않게 try/catch로 감싼다.
  // JSON.parse가 실패하면 catch 쪽이 실행되고, 빈 배열로 시작한다.
  let parsed = [];
  try {
    parsed = JSON.parse(saved);
  } catch (error) {
    console.error("저장된 내역을 읽을 수 없어서 비웁니다:", error);
  }
  if (!Array.isArray(parsed)) parsed = []; // 배열이 아닌 이상한 값이면 무시

  // 금액이 숫자가 아니거나 날짜가 없는 항목은 걸러낸다 (잔액 계산이 NaN이 되는 걸 막는다)
  entries = parsed.filter(function (entry) {
    return entry && typeof entry.amount === "number" && entry.date;
  });
}

// ---------- 4. 기능 함수 ----------
// 오늘 날짜를 "2026-10-21" 모양의 문자열로 만든다. (내 컴퓨터의 시간 기준)
function todayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = twoDigits(now.getMonth() + 1); // getMonth()는 0부터 시작해서 +1
  const day = twoDigits(now.getDate());
  return year + "-" + month + "-" + day;
}

// 내역 한 건 추가
function addEntry(type, title, amount) {
  const entry = {
    id: Date.now(),        // 지금 시각(밀리초)을 고유번호로 사용. 나중에 "마지막 기록 시각"에도 쓴다
    type: type,            // "income" 또는 "expense"
    title: title,
    amount: amount,
    date: todayString(),   // "2026-10-21" 형태
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
  const pop = makeElement("div", "xp-pop", "+" + XP_PER_ENTRY + " EXP");
  document.body.appendChild(pop);
  setTimeout(function () {
    pop.remove();
  }, 1000);
}

// ---------- 4-2. 오늘 상태 계산 ----------
// 재무부 팀장(= 나)이 오늘 어떤 상태인지 네 가지 중 하나로 정한다.
//   done    ✅ 완료   : 오늘 기록이 1건 이상
//   working 💬 근무 중: 기록은 없지만 지금이 9시~21시 (아직 할 수 있는 시간)
//   problem ⚠ 문제   : 기록이 없는데 22시가 넘음
//   rest    💤 쉬는 중: 기록이 없고 아직 9시 전
// 상태마다 아이콘·라벨·요약 문구는 이 표 한 곳에만 적는다.
// 색은 style.css의 [data-status="done"] 같은 네 줄이 맡는다 (JS는 상태 이름만 붙인다).
const STATUS = {
  done:    { icon: "✅", label: "완료",   summary: "오늘 기록 완료" },
  working: { icon: "💬", label: "근무 중", summary: "근무 중 · 아직 오늘 기록 전" },
  problem: { icon: "⚠",  label: "문제",   summary: "22시가 지났는데 기록 없음" },
  rest:    { icon: "💤", label: "쉬는 중", summary: "출근 전 · 오늘 기록 없음" },
};

// 오늘 날짜로 적힌 내역만 골라낸다
function todayEntries() {
  const today = todayString();
  return entries.filter(function (entry) {
    return entry.date === today;
  });
}

// 위 규칙대로 상태 이름("done" 등)을 돌려준다
function todayStatus() {
  const count = todayEntries().length;
  const hour = new Date().getHours(); // 0 ~ 23

  if (count > 0) return "done";
  if (hour >= 22) return "problem";
  if (hour >= 9) return "working";
  return "rest";
}

// 오늘 내역 중 가장 늦게 적은 것의 시각을 "14:32" 모양으로 돌려준다.
// 배열 순서에 기대지 않고 id(= 저장 시각)가 가장 큰 것을 직접 찾는다.
function lastRecordTime(todayList) {
  let latest = todayList[0];
  for (const entry of todayList) {
    if (entry.id > latest.id) latest = entry; // id가 저장 시각(밀리초)이므로 클수록 나중 기록
  }
  const time = new Date(latest.id);
  return twoDigits(time.getHours()) + ":" + twoDigits(time.getMinutes());
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// ---------- 5. 화면 그리기 ----------
// 상단 상태 바, 방의 팀장 알약, 이름표 칩, 재무부 창 제목의 알약에 오늘 상태를 한 번에 반영한다.
// 상태가 붙는 요소에는 전부 data-status 속성을 넣는다. 색은 CSS가 그 값을 보고 정한다.
function renderStatus() {
  const status = todayStatus();
  const info = STATUS[status];
  const todayList = todayEntries();

  // (1) 상단 상태 바
  statusSummary.textContent = info.icon + " " + info.summary;
  statusSummary.dataset.status = status;
  todayDateText.textContent = todayString() + " (" + WEEKDAYS[new Date().getDay()] + ")";
  if (todayList.length === 0) {
    todayCountText.textContent = "오늘 기록 없음";
    lastRecordText.textContent = "";
  } else {
    todayCountText.textContent = "오늘 기록 " + todayList.length + "건";
    lastRecordText.textContent = " · 마지막 기록 " + lastRecordTime(todayList);
  }

  // (2) data-lead-status 가 붙은 알약 전부 (재무부 팀장, 사장님, 재무부 창 제목)
  for (const pill of document.querySelectorAll("[data-lead-status]")) {
    pill.textContent = info.icon + " " + info.label;
    pill.dataset.status = status;
  }

  // (3) data-status-chip 이 붙은 이름표 칩 전부 (열린 방의 상태 개수)
  for (const chip of document.querySelectorAll("[data-status-chip]")) {
    chip.textContent = info.icon + " 1";
    chip.dataset.status = status;
  }
}

// entries 배열의 내용을 보고 화면 전체를 다시 그린다.
function render() {
  // 레벨, 오늘 상태, 잔액
  renderLevel();
  renderStatus();
  balanceText.textContent = formatMoney(calculateBalance());

  // 목록을 비우고 처음부터 다시 만든다
  list.innerHTML = "";

  if (entries.length === 0) {
    list.appendChild(makeElement("li", "empty", "아직 내역이 없어요. 위에서 추가해 보세요."));
    return;
  }

  // 최근 것이 위로 오도록 뒤집어서 보여준다
  const recentFirst = entries.slice().reverse();

  for (const entry of recentFirst) {
    const item = makeElement("li");
    const title = makeElement("span", "entry-title", entry.title);
    const date = makeElement("span", "entry-date", entry.date);

    let amount;
    if (entry.type === "income") {
      amount = makeElement("span", "amount-income", "+" + formatMoney(entry.amount));
    } else {
      amount = makeElement("span", "amount-expense", "-" + formatMoney(entry.amount));
    }

    const deleteBtn = makeElement("button", "delete-btn", "×");
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

// ---------- 5-1. 회사 지도 만들기 ----------
// ROOMS 배열을 보고 방을 하나씩 만들어 층에 붙인다. 그림은 전부 drawSprite()로.
// 방 하나의 구조 (index.html의 주석과 같다):
//   .room
//     ├ .room-tag    이름표 (아이콘 · 부서명 · 인원 · 상태 칩)
//     ├ .room-shelf  위쪽 벽 띠 (창문·칠판·시계 + 오른쪽 끝에 문)
//     ├ .room-inside 바닥 (팀장 자리 → 직원 책상 격자, 사장실은 카펫)
//     └ .room-props  아래쪽 널빤지 바닥 띠 + 소품

// 자리 하나: 의자 → (캐릭터) → 책상 순서로 붙인다. 나중에 붙인 것이 위에 보이므로
// 책상이 캐릭터의 하체를 덮어서 "앉아 있는" 모습이 된다. 위치는 style.css의 .seat 가 잡는다.
//   person: "BOSS" 처럼 앉힐 캐릭터 이름. 비우면 빈 자리.
function buildSeat(deskName, person, extraClass) {
  const seat = makeElement("div", "seat " + (extraClass || ""));
  seat.appendChild(drawSprite("CHAIR", 3));
  if (person) seat.appendChild(drawSprite(person, 3));
  seat.appendChild(drawSprite(deskName, 3));
  return seat;
}

// "팀장 | 💤 쉬는 중" 알약. 열린 방은 data-lead-status 를 붙여서 renderStatus()가 내용을 바꿔 준다
function buildPill(role, open) {
  const pill = makeElement("span", "pill");
  pill.appendChild(makeElement("b", "", role));
  const status = makeElement("span", "pill-status", open ? "----" : "💤 채용 전");
  status.dataset.status = "rest";
  if (open) status.dataset.leadStatus = ""; // HTML로 치면 data-lead-status 속성
  pill.appendChild(status);
  return pill;
}

// 팀장 자리 + 알약. 잠긴 방은 자리가 비어 있고 "채용 예정" 팻말만 떠 있다
function buildBossArea(room) {
  const area = makeElement("div", "boss-area");
  const seat = buildSeat("BOSS_DESK", room.open ? "BOSS" : "", "seat-boss");
  if (!room.open) {
    seat.appendChild(makeElement("span", "hire-note", "채용 예정"));
  }
  area.appendChild(seat);
  area.appendChild(buildPill(room.ceo ? "사장님" : "팀장", room.open));
  return area;
}

// 직원 책상 격자: 3칸 × 2줄. 아직 직원이 없어서 빈 의자만 있다 (8단계에서 AI 직원이 앉는다)
function buildDeskGrid() {
  const grid = makeElement("div", "desk-grid");
  for (let i = 0; i < 6; i++) {
    grid.appendChild(buildSeat("DESK", ""));
  }
  return grid;
}

// 사장실 전용: 초록 카펫 위에 화분·사장 책상·화분, 그 아래 소파·책장·소파
function buildRug(room) {
  const rug = makeElement("div", "rug");

  const top = makeElement("div", "rug-row");
  top.appendChild(drawSprite("PLANT", 3));
  top.appendChild(buildBossArea(room));
  top.appendChild(drawSprite("PLANT", 3));
  rug.appendChild(top);

  const bottom = makeElement("div", "rug-row");
  bottom.appendChild(drawSprite("SOFA", 3));
  bottom.appendChild(drawSprite("BOOKSHELF", 3));
  bottom.appendChild(drawSprite("SOFA", 3));
  rug.appendChild(bottom);

  return rug;
}

// 방 하나를 통째로 만든다
function buildRoom(room) {
  const el = makeElement("div", "room " + (room.open ? "open" : "locked"));
  if (room.ceo) el.classList.add("room-ceo");
  el.dataset.room = room.id;          // 클릭했을 때 어느 방인지 알기 위한 표시
  el.style.setProperty("--floor", room.color); // CSS 변수로 바닥 색을 넘긴다
  el.title = room.desc;               // 마우스를 올리면 설명이 뜬다
  el.setAttribute("role", "button");  // 버튼처럼 쓰는 div라고 알려 준다
  el.tabIndex = 0;                    // 키보드 Tab으로도 갈 수 있게

  // (1) 이름표: 아이콘 + 부서명 + 인원 + 상태 칩 (잠긴 방은 칩 대신 🔒)
  const tag = makeElement("span", "room-tag");
  tag.appendChild(makeElement("b", "", room.icon + " " + room.name));
  tag.appendChild(makeElement("span", "tag-count", room.ceo ? "사장님" : (room.open ? "1명" : "0명")));
  if (room.open) {
    const chip = makeElement("span", "chip", "----");
    chip.dataset.status = "rest";
    chip.dataset.statusChip = ""; // data-status-chip: renderStatus()가 내용을 바꾼다
    tag.appendChild(chip);
  } else {
    tag.appendChild(makeElement("span", "lock-badge", "🔒"));
  }
  el.appendChild(tag);

  // (2) 위쪽 벽 띠: 창문·칠판·시계 + 오른쪽 끝의 문
  const shelf = makeElement("div", "room-shelf");
  for (const name of room.shelf) {
    shelf.appendChild(drawSprite(name, 3));
  }
  const door = makeElement("div", "room-door");
  door.appendChild(drawSprite("DOOR", 3));
  if (!room.open) door.appendChild(makeElement("span", "door-lock", "🔒"));
  shelf.appendChild(door);
  el.appendChild(shelf);

  // (3) 바닥: 팀장 자리 → 직원 책상 격자 (사장실은 카펫 하나로 대신한다)
  const inside = makeElement("div", "room-inside pattern-" + room.pattern);
  if (room.ceo) {
    inside.appendChild(buildRug(room));
  } else {
    inside.appendChild(buildBossArea(room));
    inside.appendChild(buildDeskGrid());
  }
  el.appendChild(inside);

  // (4) 아래쪽 널빤지 바닥 띠 + 소품
  const props = makeElement("div", "room-props");
  for (const name of room.props) {
    props.appendChild(drawSprite(name, 3));
  }
  el.appendChild(props);

  return el;
}

// 걸어다니는 캐릭터: 다리 모은 그림과 다리 벌린 그림 두 장을 겹쳐 두고
// CSS 애니메이션이 0.5초마다 번갈아 보여 준다 (= 걷는 것처럼 보인다).
// 가운데 .walker-body 는 위아래로 통통 튀는 역할만 맡는다.
function buildWalker(name, extraClass) {
  const walker = makeElement("div", "walker " + extraClass);
  const body = makeElement("div", "walker-body");
  body.appendChild(drawSprite(name, 3));           // 프레임 1
  body.appendChild(drawSprite(name + "_WALK", 3)); // 프레임 2
  walker.appendChild(body);
  return walker;
}

// 두 층 사이의 길: 화단·가로등·표지판을 놓고 캐릭터 두 명을 걷게 한다
function buildRoad() {
  const props = [
    { name: "BUSH", left: 2 },
    { name: "LAMP", left: 18 },
    { name: "BUSH", left: 33 },
    { name: "SIGN", left: 50 },
    { name: "BUSH", left: 65 },
    { name: "LAMP", left: 81 },
    { name: "BUSH", left: 93 },
  ];
  for (const prop of props) {
    const canvas = drawSprite(prop.name, 3);
    canvas.classList.add("road-prop");
    canvas.style.left = prop.left + "%"; // 길 너비 기준 위치
    road.appendChild(canvas);
  }
  road.appendChild(buildWalker("BOSS", "walker-1"));
  road.appendChild(buildWalker("STAFF", "walker-2"));
}

// 재무부 창(가계부)에도 방처럼 벽 띠와 팀장 자리를 그려 넣는다
function buildLedgerDeco() {
  const shelf = document.getElementById("ledger-shelf");
  for (const name of ["WINDOW", "WHITEBOARD", "CLOCK", "BOOKSHELF"]) {
    shelf.appendChild(drawSprite(name, 3));
  }
  const door = makeElement("div", "room-door");
  door.appendChild(drawSprite("DOOR", 3));
  shelf.appendChild(door);

  const deskArea = document.getElementById("ledger-desk");
  deskArea.appendChild(buildSeat("BOSS_DESK", "BOSS", "seat-boss"));
  deskArea.appendChild(makeElement("p", "desk-caption", "팀장 자리 (나). 기록 1건 = 10 EXP"));
}

// 지도 전체를 만든다. 8번 구역(시작)에서 부른다.
function buildMap() {
  for (const room of ROOMS) {
    const el = buildRoom(room);
    if (room.floor === 1) {
      floor1.appendChild(el);
    } else {
      floor2.appendChild(el);
    }
  }
  buildRoad();
  buildLedgerDeco();
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

// 지도의 방을 누르면: 열린 방이면 들어가고, 잠긴 방이면 알려준다.
// 방은 buildMap()이 만든 뒤에야 있으므로, 8번 구역에서 buildMap() 다음에 부른다.
function connectRooms() {
  for (const roomEl of document.querySelectorAll(".room")) {
    roomEl.addEventListener("click", function () {
      if (roomEl.classList.contains("locked")) {
        alert("아직 잠겨 있어요. 다음 단계에서 열립니다!");
        return;
      }
      if (roomEl.dataset.room === "ledger") {
        showScreen(ledgerScreen);
      }
      if (roomEl.dataset.room === "ceo") {
        alert("사장실은 나중에 꾸밉니다");
      }
    });

    // 키보드로 Enter나 Space를 눌러도 클릭한 것과 똑같이 동작한다
    roomEl.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        roomEl.click();
      }
    });
  }
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
// 페이지가 열리면 지도를 만들고, 저장된 내역을 불러와서 화면에 그린다.

// 지도 그리기는 try/catch로 감싼다. sprites.js에서 그림 이름을 잘못 적는 등 오류가 나도
// 가계부(저장·목록·잔액)는 그대로 동작해야 하기 때문이다. 원인은 콘솔(F12)에 찍힌다.
try {
  buildMap();
} catch (error) {
  console.error("지도를 그리다 오류가 났어요. 가계부는 그대로 쓸 수 있어요:", error);
}
connectRooms();

load();
render();

// 시간이 지나면 상태(근무 중 → 문제 등)가 바뀌니 1분마다 다시 계산한다
setInterval(renderStatus, 60 * 1000);
