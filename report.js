// =====================================================
// report.js - 기획부: 주간 목표 · 회고 · 리포트
//
// 다른 부서가 "오늘"을 기록한다면 기획부는 "이번 주"를 본다.
//   (1) 이번 주 목표를 최대 3개 적고 체크한다 (목표 1개 완료 = 10 EXP)
//   (2) 일요일에 한 주를 돌아보는 회고를 쓴다 (주 1회 30 EXP)
//   (3) 다른 부서의 기록을 모아 "이번 주 리포트"와 "최근 8주 경험치 그래프"를 보여준다
// 이 파일은 app.js보다 먼저 읽히고, 여기 있는 함수는 app.js가 시작할 때(8번 구역) 부른다.
// makeElement, todayString, dateToString, showXpPop, entries 같은 공용 함수·데이터는 app.js에 있고,
// routineChecks, ROUTINES, isRoutineDone(routine.js), studyDone, allUnits(study.js),
// assetData, netWorth, netWorthAt(assets.js)도 여기서 가져다 쓴다.
// =====================================================

// ---------- 1. 데이터 ----------
// 주별 계획. 키는 그 주의 "월요일 날짜". 모양:
// {
//   "2026-12-01": {
//     goals: [{ text: "2-1 단원 끝내기", done: true }, { text: "헬스 4번", done: false }],
//     review: { good: "...", bad: "...", next: "...", date: "2026-12-07" }   // 아직 안 썼으면 null
//   }
// }
let planData = {};
const PLAN_KEY = "weekly-plans";

const XP_PER_GOAL = 10;   // 목표 1개 완료
const XP_PER_REVIEW = 30; // 회고 저장(한 주에 한 번만)
const MAX_GOALS = 3;      // 목표는 3개까지. 많이 적으면 아무것도 안 하게 된다

// ---------- 2. 저장과 불러오기 ----------
function planSave() {
  localStorage.setItem(PLAN_KEY, JSON.stringify(planData));
}

function planLoad() {
  const saved = localStorage.getItem(PLAN_KEY);
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    // 객체가 아니면(배열·null 등) 깨진 데이터로 보고 비운다
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      planData = parsed;
    }
  } catch (error) {
    console.error("주간 계획을 읽을 수 없어서 비웁니다:", error);
  }
}

// ---------- 3. 날짜 도우미: "이번 주"는 월요일부터 일요일까지 ----------
// "2026-12-03"(수) → 그 주 월요일 "2026-12-01"
function weekStartOf(dateString) {
  const date = new Date(dateString + "T00:00:00"); // 뒤에 T00:00:00을 붙이면 현지 시간 자정으로 읽는다
  // getDay()는 일0 월1 화2 수3 목4 금5 토6. 월요일까지 되돌아갈 일수는 월0 화1 수2 목3 금4 토5 일6
  const back = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - back);
  return dateToString(date);
}

// 날짜 문자열에 며칠을 더한(또는 뺀) 날짜 문자열
function addDays(dateString, days) {
  const date = new Date(dateString + "T00:00:00");
  date.setDate(date.getDate() + days);
  return dateToString(date);
}

function thisWeekStart() {
  return weekStartOf(todayString());
}

// 날짜가 그 주(월~일) 안에 있는지. "2026-12-01" 같은 문자열은 그냥 비교해도 날짜 순서가 맞다
function inWeek(dateString, weekStart) {
  return dateString >= weekStart && dateString <= addDays(weekStart, 6);
}

// ---------- 4. 기능 함수 ----------
// 그 주의 계획을 "읽기만" 할 때. 없으면 빈 모양을 돌려주되 저장 데이터에는 넣지 않는다
function planOf(weekStart) {
  return planData[weekStart] || { goals: [], review: null };
}

// 그 주의 계획을 "고칠" 때. 없으면 새로 만들어 저장 데이터에 넣는다
function planFor(weekStart) {
  if (!planData[weekStart]) planData[weekStart] = { goals: [], review: null };
  return planData[weekStart];
}

function addGoal(text) {
  const plan = planFor(thisWeekStart());
  if (plan.goals.length >= MAX_GOALS) return; // 3개가 차면 더 못 넣는다 (화면에서도 폼을 숨긴다)
  plan.goals.push({ text: text, done: false });
  planSave();
  render();
}

function toggleGoal(index) {
  const plan = planFor(thisWeekStart());
  const goal = plan.goals[index];
  goal.done = !goal.done;
  planSave();
  if (goal.done) showXpPop(XP_PER_GOAL);
  render();
}

function deleteGoal(index) {
  const plan = planFor(thisWeekStart());
  plan.goals.splice(index, 1); // index 자리에서 1개를 빼낸다
  planSave();
  render();
}

// 회고 저장. 같은 주에 다시 저장하면 내용은 바뀌지만 경험치는 처음 한 번만
function saveReview(good, bad, next) {
  const plan = planFor(thisWeekStart());
  const firstTime = plan.review === null;
  plan.review = { good: good, bad: bad, next: next, date: todayString() };
  planSave();
  if (firstTime) showXpPop(XP_PER_REVIEW);
  render();
}

// 계획 하나에서 나온 경험치
function planXp(plan) {
  let xp = 0;
  for (const goal of plan.goals) {
    if (goal.done) xp = xp + XP_PER_GOAL;
  }
  if (plan.review) xp = xp + XP_PER_REVIEW;
  return xp;
}

// 기획부 전체 경험치 (app.js의 totalXp()가 더한다)
function reportXp() {
  let xp = 0;
  for (const weekStart in planData) {
    xp = xp + planXp(planData[weekStart]);
  }
  return xp;
}

// 팀장 상태: 이번 주 목표가 하나라도 있으면 완료. 일요일에는 회고까지 저장해야 완료
function reportDoneThisWeek() {
  const plan = planOf(thisWeekStart());
  const isSunday = new Date().getDay() === 0;
  if (isSunday) return plan.review !== null;
  return plan.goals.length > 0;
}

// 그 주에 모든 부서에서 번 경험치. 부서마다 "그 날짜의 기록"을 세서 더한다
function weekXp(weekStart) {
  let xp = planXp(planOf(weekStart));

  for (const entry of entries) {                    // 재무부: 기록 1건 = 10
    if (inWeek(entry.date, weekStart)) xp = xp + XP_PER_ENTRY;
  }
  for (const date in routineChecks) {               // 인사부: 체크 1개 = 10
    if (inWeek(date, weekStart)) xp = xp + routineChecks[date].length * XP_PER_CHECK;
  }
  for (const unit of allUnits()) {                  // 교육부: 완료한 단원의 경험치
    const doneDate = studyDone[unit.id];
    if (doneDate && inWeek(doneDate, weekStart)) xp = xp + unit.xp;
  }
  for (const date in assetData.history) {           // 자산관리부: 잔고 기록 1회 = 10
    if (inWeek(date, weekStart)) xp = xp + Object.keys(assetData.history[date]).length * XP_PER_UPDATE;
  }
  return xp;
}

// ---------- 5. 화면 그리기 ----------
const weekLabel = document.getElementById("week-label");
const weekReport = document.getElementById("week-report");
const goalList = document.getElementById("goal-list");
const goalForm = document.getElementById("goal-form");
const reviewForm = document.getElementById("review-form");
const reviewStatus = document.getElementById("review-status");
const lastReviewBox = document.getElementById("last-review");
const weekChart = document.getElementById("week-chart");

// 리포트 한 줄: "루틴  12 / 20" 모양
function reportLine(label, value) {
  const line = makeElement("div", "history-line");
  line.appendChild(makeElement("span", "history-date", label));
  line.appendChild(makeElement("b", "", value));
  return line;
}

function renderWeekReport(weekStart) {
  const today = todayString();
  const weekEnd = addDays(weekStart, 6);
  weekLabel.textContent = "이번 주 · " + weekStart.slice(5) + " ~ " + weekEnd.slice(5) + " (월~일)";
  weekReport.innerHTML = "";

  // 루틴: 월요일부터 오늘까지 날짜마다 4개 루틴을 했는지 센다
  let routineDone = 0;
  let routinePossible = 0;
  let day = weekStart;
  while (day <= today && day <= weekEnd) {
    for (const routine of ROUTINES) {
      routinePossible = routinePossible + 1;
      if (isRoutineDone(routine, day)) routineDone = routineDone + 1;
    }
    day = addDays(day, 1);
  }
  weekReport.appendChild(reportLine("루틴 체크", routineDone + " / " + routinePossible));

  // 교육부: 이번 주에 완료한 단원 수
  let unitsDone = 0;
  for (const unitId in studyDone) {
    if (inWeek(studyDone[unitId], weekStart)) unitsDone = unitsDone + 1;
  }
  weekReport.appendChild(reportLine("완료한 단원", unitsDone + "개"));

  // 재무부: 이번 주 기록 건수와 지출 합계
  let entryCount = 0;
  let expense = 0;
  for (const entry of entries) {
    if (!inWeek(entry.date, weekStart)) continue;
    entryCount = entryCount + 1;
    if (entry.type === "expense") expense = expense + entry.amount;
  }
  weekReport.appendChild(reportLine("가계부", entryCount + "건 · 지출 " + formatMoney(expense)));

  // 자산관리부: 지난주 일요일 기준 순자산과 지금 순자산의 차이
  const before = netWorthAt(addDays(weekStart, -1)); // 숫자 하나(순자산)를 돌려준다
  const now = netWorth().net;
  const diff = now - before;
  weekReport.appendChild(reportLine("순자산 변화", (diff >= 0 ? "+" : "") + formatMoney(diff)));

  weekReport.appendChild(reportLine("이번 주 경험치", weekXp(weekStart) + " EXP"));
}

function renderGoals(weekStart) {
  const plan = planOf(weekStart);
  goalList.innerHTML = "";

  if (plan.goals.length === 0) {
    goalList.appendChild(makeElement("li", "empty", "이번 주 목표가 없어요. 3개까지 적어 보세요."));
  }

  // forEach 대신 for...of + 번호 변수. toggleGoal(index)에 몇 번째인지 알려줘야 해서
  let index = 0;
  for (const goal of plan.goals) {
    const item = makeElement("li", "goal-item" + (goal.done ? " done" : ""));
    const myIndex = index; // 클릭할 때 쓸 번호를 이 줄에서 고정해 둔다

    const check = makeElement("button", "routine-check", goal.done ? "✓" : "");
    check.title = goal.done ? "완료 취소" : "완료로 표시";
    check.addEventListener("click", function () { toggleGoal(myIndex); });

    const deleteBtn = makeElement("button", "delete-btn", "×");
    deleteBtn.title = "목표 지우기";
    deleteBtn.addEventListener("click", function () { deleteGoal(myIndex); });

    item.appendChild(check);
    item.appendChild(makeElement("span", "goal-text", goal.text));
    item.appendChild(deleteBtn);
    goalList.appendChild(item);
    index = index + 1;
  }

  // 3개가 차면 입력 폼을 숨긴다
  goalForm.classList.toggle("hidden", plan.goals.length >= MAX_GOALS);
}

// 회고 칸의 상태 글자만 바꾼다. 입력칸 내용은 여기서 건드리지 않는다
// (쓰는 도중에 목표를 체크해서 render()가 돌아도 쓰던 글이 지워지면 안 되니까)
function renderReviewStatus(weekStart) {
  const plan = planOf(weekStart);
  if (plan.review) {
    reviewStatus.textContent = "저장됨 · " + plan.review.date.slice(5) + " (다시 저장하면 덮어씀)";
  } else {
    reviewStatus.textContent = "아직 안 씀 · 일요일에 30 EXP";
  }
}

// 저장된 회고를 입력칸에 채운다. 시작할 때와 저장 직후에만 부른다
function fillReviewForm(weekStart) {
  const review = planOf(weekStart).review;
  document.getElementById("review-good").value = review ? review.good : "";
  document.getElementById("review-bad").value = review ? review.bad : "";
  document.getElementById("review-next").value = review ? review.next : "";
}

function renderLastReview(weekStart) {
  const review = planOf(addDays(weekStart, -7)).review;
  lastReviewBox.innerHTML = "";
  if (!review) {
    lastReviewBox.appendChild(makeElement("p", "card-sub", "지난주 회고가 없어요. 이번 주 일요일에 첫 회고를 써 보세요."));
    return;
  }
  lastReviewBox.appendChild(reportLine("잘한 것", review.good || "-"));
  lastReviewBox.appendChild(reportLine("아쉬운 것", review.bad || "-"));
  lastReviewBox.appendChild(reportLine("다음 주", review.next || "-"));
}

// 최근 8주 경험치 막대. 가장 높은 주를 100%로 두고 나머지는 비율로 높이를 정한다
function renderWeekChart(weekStart) {
  weekChart.innerHTML = "";
  const weeks = [];
  for (let back = 7; back >= 0; back = back - 1) {
    const start = addDays(weekStart, -7 * back);
    weeks.push({ start: start, xp: weekXp(start) });
  }
  let max = 1; // 0으로 나누지 않게 최소 1
  for (const week of weeks) {
    if (week.xp > max) max = week.xp;
  }
  for (const week of weeks) {
    const column = makeElement("div", "week-bar" + (week.start === weekStart ? " this-week" : ""));
    column.appendChild(makeElement("b", "", String(week.xp)));
    const bar = makeElement("div", "bar");
    bar.style.height = (week.xp / max) * 100 + "%";
    bar.title = week.start + " 주 · " + week.xp + " EXP";
    column.appendChild(bar);
    column.appendChild(makeElement("span", "", week.start.slice(5))); // "12-01"
    weekChart.appendChild(column);
  }
}

function renderReport() {
  const weekStart = thisWeekStart();
  renderWeekReport(weekStart);
  renderGoals(weekStart);
  renderReviewStatus(weekStart);
  renderLastReview(weekStart);
  renderWeekChart(weekStart);
}

// ---------- 6. 이벤트 연결 ----------
goalForm.addEventListener("submit", function (event) {
  event.preventDefault(); // 폼의 기본 동작(페이지 새로고침)을 막는다
  const input = document.getElementById("goal-text");
  const text = input.value.trim();
  if (text === "") return;
  addGoal(text);
  input.value = "";
});

reviewForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const good = document.getElementById("review-good").value.trim();
  const bad = document.getElementById("review-bad").value.trim();
  const next = document.getElementById("review-next").value.trim();
  if (good === "" && bad === "" && next === "") return; // 전부 비어 있으면 저장하지 않는다
  saveReview(good, bad, next);
  fillReviewForm(thisWeekStart());
});

// ---------- 7. 시작 ----------
// app.js의 8번 구역이 부른다. 저장된 계획을 읽고, 이번 주 회고가 있으면 입력칸에 채운다
function reportLoad() {
  planLoad();
  fillReviewForm(thisWeekStart());
}
