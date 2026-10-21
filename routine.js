// =====================================================
// routine.js - 인사부: 데일리 루틴
//
// 매일 할 일 4가지를 체크하고, 며칠 연속으로 다 했는지(연속 달성일)를 센다.
// 부서마다 파일 하나씩이다. 이 파일은 app.js보다 먼저 읽히지만, 여기 있는 함수는
// app.js가 시작할 때(8번 구역) 부른다. makeElement, todayString, dateToString,
// showXpPop, entries 같은 공용 함수·데이터는 app.js에 있다.
// =====================================================

// ---------- 1. 데이터 ----------
// 루틴 목록. auto 가 "ledger"인 것은 체크를 누르는 게 아니라 재무부에 오늘 기록이 있으면 자동으로 된다.
const ROUTINES = [
  { id: "trade",  icon: "📈", name: "주식 매매 복기", hint: "장 마감 후 오늘 매매를 한 줄로 정리" },
  { id: "gym",    icon: "🏋️", name: "헬스",          hint: "운동한 날 체크" },
  { id: "coding", icon: "💻", name: "코딩 공부",     hint: "오늘 공부했으면 체크 (교육부에서 단원 완료와 별개)" },
  { id: "ledger", icon: "📒", name: "가계부 기록",   hint: "재무부에 오늘 내역을 적으면 자동 체크", auto: "ledger" },
];

// 체크 1개 = 10 경험치 (자동 체크는 제외. 가계부 기록은 이미 경험치를 받으니까)
const XP_PER_CHECK = 10;

// 날짜별 체크 목록. 모양: { "2026-10-21": ["trade", "gym"], "2026-10-22": ["gym"] }
let routineChecks = {};
const ROUTINE_KEY = "routine-checks";

// ---------- 2. 저장과 불러오기 ----------
function routineSave() {
  localStorage.setItem(ROUTINE_KEY, JSON.stringify(routineChecks));
}

function routineLoad() {
  const saved = localStorage.getItem(ROUTINE_KEY);
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    // 객체가 아니면(배열·null 등) 깨진 데이터로 보고 비운다
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      routineChecks = parsed;
    }
  } catch (error) {
    console.error("루틴 기록을 읽을 수 없어서 비웁니다:", error);
  }
}

// ---------- 3. 기능 함수 ----------
// 특정 날짜에 그 루틴을 했는지
function isRoutineDone(routine, date) {
  if (routine.auto === "ledger") {
    // 가계부: 그 날짜로 적힌 내역이 한 건이라도 있으면 한 것
    return entries.some(function (entry) {
      return entry.date === date;
    });
  }
  const ids = routineChecks[date] || []; // 그 날 기록이 없으면 빈 배열
  return ids.includes(routine.id);
}

// 오늘 체크를 켜거나 끈다
function toggleRoutine(routineId) {
  const today = todayString();
  const ids = routineChecks[today] || [];

  if (ids.includes(routineId)) {
    routineChecks[today] = ids.filter(function (id) { return id !== routineId; });
  } else {
    routineChecks[today] = ids.concat([routineId]); // 기존 배열에 하나 더한 새 배열
    showXpPop(XP_PER_CHECK);
  }
  routineSave();
  render();
}

// 그 날짜에 루틴 4개를 전부 했는지
function allRoutinesDone(date) {
  return ROUTINES.every(function (routine) {
    return isRoutineDone(routine, date);
  });
}

// 오늘 전부 했는지 (인사부 팀장의 상태에 쓴다)
function routineDoneToday() {
  return allRoutinesDone(todayString());
}

// 오늘 한 개수 (상단 바 "오늘 기록"에 더한다)
function routineCountToday() {
  return (routineChecks[todayString()] || []).length;
}

// 지금까지 손으로 체크한 전체 개수 × 10 = 루틴으로 얻은 경험치
function routineXp() {
  let count = 0;
  for (const date in routineChecks) {
    count = count + routineChecks[date].length;
  }
  return count * XP_PER_CHECK;
}

// 연속 달성일: 오늘(또는 오늘이 아직 안 끝났으면 어제)부터 거꾸로 세며 전부 한 날이 이어지는 동안 센다
function routineStreak() {
  let streak = 0;
  const day = new Date();
  if (!allRoutinesDone(dateToString(day))) {
    day.setDate(day.getDate() - 1); // 오늘은 아직 진행 중이니 어제부터 센다
  }
  while (allRoutinesDone(dateToString(day))) {
    streak = streak + 1;
    day.setDate(day.getDate() - 1); // 하루 전으로
  }
  return streak;
}

// ---------- 4. 화면 그리기 ----------
const routineList = document.getElementById("routine-list");
const streakText = document.getElementById("streak");
const routineSummary = document.getElementById("routine-summary");
const routineHistory = document.getElementById("routine-history");

function renderRoutine() {
  const today = todayString();

  // (1) 연속 달성일과 요약
  streakText.textContent = routineStreak();
  let doneCount = 0;
  for (const routine of ROUTINES) {
    if (isRoutineDone(routine, today)) doneCount = doneCount + 1;
  }
  routineSummary.textContent = "오늘 " + doneCount + " / " + ROUTINES.length + " 완료 · 4개 다 하면 하루 달성";

  // (2) 오늘의 체크 목록
  routineList.innerHTML = "";
  for (const routine of ROUTINES) {
    const done = isRoutineDone(routine, today);
    const item = makeElement("li", "routine-item" + (done ? " done" : ""));

    const check = makeElement("button", "routine-check", done ? "✓" : "");
    check.title = routine.hint;
    if (routine.auto) {
      check.disabled = true; // 자동 항목은 누를 수 없다
    } else {
      check.addEventListener("click", function () {
        toggleRoutine(routine.id);
      });
    }

    const text = makeElement("div", "routine-text");
    text.appendChild(makeElement("b", "", routine.icon + " " + routine.name));
    text.appendChild(makeElement("span", "routine-hint", routine.hint));

    item.appendChild(check);
    item.appendChild(text);
    if (routine.auto) item.appendChild(makeElement("span", "routine-auto", "자동"));
    routineList.appendChild(item);
  }

  // (3) 최근 14일 표: 루틴마다 한 줄, 하루에 칸 하나
  routineHistory.innerHTML = "";
  const days = [];
  const cursor = new Date();
  cursor.setDate(cursor.getDate() - 13); // 13일 전부터 오늘까지 = 14칸
  for (let i = 0; i < 14; i++) {
    days.push(dateToString(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }

  // 맨 윗줄: 날짜의 "일" 부분만
  const head = makeElement("div", "history-row");
  head.appendChild(makeElement("span", "history-label", ""));
  for (const date of days) {
    head.appendChild(makeElement("span", "history-day", date.slice(8)));
  }
  routineHistory.appendChild(head);

  for (const routine of ROUTINES) {
    const row = makeElement("div", "history-row");
    row.appendChild(makeElement("span", "history-label", routine.icon));
    for (const date of days) {
      const cell = makeElement("span", "history-cell" + (isRoutineDone(routine, date) ? " done" : ""));
      cell.title = date + " " + routine.name;
      row.appendChild(cell);
    }
    routineHistory.appendChild(row);
  }
}
