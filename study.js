// =====================================================
// study.js - 교육부: 코딩·AI 커리큘럼 진도
//
// curriculum.js 의 CURRICULUM(14과정 66단원)을 목록으로 보여 주고, 끝낸 단원을 체크한다.
// 단원마다 경험치(예상 시간 × 20)가 있고, 12월 1일부터 월~토 하루 한 단원 일정을 자동으로 계산한다.
// 공용 함수(makeElement, todayString, showXpPop 등)는 app.js에 있다.
// =====================================================

// ---------- 1. 데이터 ----------
const STUDY_START = "2026-12-01"; // 개강일. 일정표(docs/SCHEDULE.md)와 같은 기준

// 끝낸 단원. 모양: { "00-1": "2026-12-01", "00-2": "2026-12-02" }  (단원 id → 끝낸 날짜)
let studyDone = {};
const STUDY_KEY = "study-progress";

// ---------- 2. 저장과 불러오기 ----------
function studySave() {
  localStorage.setItem(STUDY_KEY, JSON.stringify(studyDone));
}

function studyLoad() {
  const saved = localStorage.getItem(STUDY_KEY);
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      studyDone = parsed;
    }
  } catch (error) {
    console.error("학습 진도를 읽을 수 없어서 비웁니다:", error);
  }
}

// ---------- 3. 기능 함수 ----------
// 과정 안에 있는 단원들을 한 줄로 펼친 목록 (순서대로)
function allUnits() {
  const units = [];
  for (const module of CURRICULUM) {
    for (const unit of module.units) {
      units.push(unit);
    }
  }
  return units;
}

// 단원마다 예정일을 정한다: 개강일부터 하루 한 단원, 일요일은 건너뛴다.
// 돌려주는 모양: { "00-1": "2026-12-01", "00-2": "2026-12-02", ... }
function plannedDates() {
  const plan = {};
  const day = new Date(STUDY_START + "T00:00:00"); // T00:00:00 을 붙여야 내 컴퓨터 시간대로 읽는다
  for (const unit of allUnits()) {
    while (day.getDay() === 0) {          // 0 = 일요일 → 주간 회고 날이라 건너뛴다
      day.setDate(day.getDate() + 1);
    }
    plan[unit.id] = dateToString(day);
    day.setDate(day.getDate() + 1);
  }
  return plan;
}

function isUnitDone(unitId) {
  return Boolean(studyDone[unitId]); // 날짜가 있으면 true, 없으면(undefined) false
}

// 단원 완료를 켜거나 끈다
function toggleUnit(unit) {
  if (isUnitDone(unit.id)) {
    delete studyDone[unit.id]; // 객체에서 그 항목을 지운다
  } else {
    studyDone[unit.id] = todayString();
    showXpPop(unit.xp);
  }
  studySave();
  render();
}

// 오늘 끝낸 단원이 있는지 (교육부 팀장의 상태에 쓴다)
function studyDoneToday() {
  const today = todayString();
  for (const unitId in studyDone) {
    if (studyDone[unitId] === today) return true;
  }
  return false;
}

// 오늘 끝낸 단원 수
function studyCountToday() {
  let count = 0;
  for (const unitId in studyDone) {
    if (studyDone[unitId] === todayString()) count = count + 1;
  }
  return count;
}

// 끝낸 단원의 경험치 합
function studyXp() {
  let xp = 0;
  for (const unit of allUnits()) {
    if (isUnitDone(unit.id)) xp = xp + unit.xp;
  }
  return xp;
}

// 아직 안 끝낸 첫 단원 (= 다음에 할 단원). 다 끝냈으면 null
function nextUnit() {
  return allUnits().find(function (unit) { return !isUnitDone(unit.id); }) || null;
}

// ---------- 4. 화면 그리기 ----------
const studyDoneText = document.getElementById("study-done");
const studyTotalText = document.getElementById("study-total");
const studyFill = document.getElementById("study-fill");
const studySub = document.getElementById("study-sub");
const nextUnitBox = document.getElementById("next-unit");
const studyModules = document.getElementById("study-modules");

// 단원 한 줄: [체크] 0-1 제목 · 2시간 · 40 EXP · 예정 12-01 · 문서
function buildUnitRow(unit, plan) {
  const done = isUnitDone(unit.id);
  const row = makeElement("li", "unit-row" + (done ? " done" : ""));

  const check = makeElement("button", "unit-check", done ? "✓" : "");
  check.title = done ? "완료 취소" : "완료로 표시";
  check.addEventListener("click", function () { toggleUnit(unit); });

  const text = makeElement("div", "unit-text");
  const idLabel = unit.id.replace(/^0/, ""); // "00-1" → "0-1" 처럼 앞의 0 하나를 뗀다
  text.appendChild(makeElement("b", "", idLabel + ". " + unit.title));
  const meta = makeElement("span", "unit-meta",
    unit.hours + "시간 · " + unit.xp + " EXP · 예정 " + plan[unit.id].slice(5) +
    (done ? " · 완료 " + studyDone[unit.id].slice(5) : ""));
  text.appendChild(meta);

  const link = makeElement("a", "unit-link", "문서");
  link.href = unit.doc;
  link.target = "_blank";

  row.appendChild(check);
  row.appendChild(text);
  row.appendChild(link);
  return row;
}

function renderStudy() {
  const units = allUnits();
  const plan = plannedDates();
  const today = todayString();
  let doneCount = 0;
  let behind = 0; // 예정일이 지났는데 안 끝낸 단원 수
  for (const unit of units) {
    if (isUnitDone(unit.id)) doneCount = doneCount + 1;
    else if (plan[unit.id] < today) behind = behind + 1; // "2026-12-01" 같은 문자열은 그냥 비교해도 날짜 순서가 맞다
  }

  // (1) 진도 카드
  studyDoneText.textContent = doneCount;
  studyTotalText.textContent = units.length;
  studyFill.style.width = (doneCount / units.length) * 100 + "%";
  let sub = "누적 " + studyXp() + " EXP · 개강 " + STUDY_START;
  if (behind > 0) sub = sub + " · 밀린 단원 " + behind + "개";
  studySub.textContent = sub;

  // (2) 다음 단원 카드
  nextUnitBox.innerHTML = "";
  const next = nextUnit();
  if (next === null) {
    nextUnitBox.appendChild(makeElement("p", "card-label", "🎓 66단원을 전부 끝냈어요. 졸업 프로젝트로!"));
  } else {
    nextUnitBox.appendChild(makeElement("p", "card-label", "다음 단원 · 예정 " + plan[next.id]));
    nextUnitBox.appendChild(makeElement("p", "card-title", next.id.replace(/^0/, "") + ". " + next.title));
    const actions = makeElement("div", "card-actions");
    const open = makeElement("a", "btn", "문서 열기");
    open.href = next.doc;
    open.target = "_blank";
    const finish = makeElement("button", "btn btn-primary", "완료 (+" + next.xp + " EXP)");
    finish.addEventListener("click", function () { toggleUnit(next); });
    actions.appendChild(open);
    actions.appendChild(finish);
    nextUnitBox.appendChild(actions);
  }

  // (3) 과정별 목록. <details>는 누르면 접었다 펼 수 있는 HTML 기본 요소다
  studyModules.innerHTML = "";
  for (const module of CURRICULUM) {
    const moduleDone = module.units.filter(function (u) { return isUnitDone(u.id); }).length;
    const details = makeElement("details", "module" + (moduleDone === module.units.length ? " done" : ""));
    // 진행 중인 과정(다음 단원이 들어 있는 과정)은 펼쳐 둔다
    if (next && module.units.includes(next)) details.open = true;

    const summary = makeElement("summary", "module-title");
    summary.appendChild(makeElement("b", "", Number(module.id) + ". " + module.title));
    summary.appendChild(makeElement("span", "module-count", moduleDone + " / " + module.units.length));
    details.appendChild(summary);
    details.appendChild(makeElement("p", "module-goal", module.goal));

    const ul = makeElement("ul", "unit-list");
    for (const unit of module.units) {
      ul.appendChild(buildUnitRow(unit, plan));
    }
    details.appendChild(ul);
    studyModules.appendChild(details);
  }
}
