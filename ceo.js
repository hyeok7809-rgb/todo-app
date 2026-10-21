// =====================================================
// ceo.js - 사장실: 회사 요약과 백업
//
// 모든 기록은 브라우저의 localStorage 안에만 있다. 브라우저 데이터를 지우거나 다른 컴퓨터로
// 옮기면 사라지므로, 사장실에서 JSON 파일로 내보내고(백업) 다시 가져올 수 있게 한다.
// 공용 함수(makeElement, totalXp 등)는 app.js에 있다.
// =====================================================

// ---------- 1. 데이터 ----------
// 백업에 넣을 localStorage 키 목록. 새 부서를 열어 키가 늘면 여기에 추가한다.
const BACKUP_KEYS = ["ledger-entries", "routine-checks", "study-progress"];

// ---------- 2. 기능 함수 ----------
// 세 저장소를 한 객체로 묶는다. 모양: { version: 1, savedAt: "...", data: { "ledger-entries": [...], ... } }
function collectBackup() {
  const data = {};
  for (const key of BACKUP_KEYS) {
    const raw = localStorage.getItem(key);
    data[key] = raw ? JSON.parse(raw) : null; // 저장된 게 없으면 null
  }
  return { version: 1, savedAt: new Date().toISOString(), data: data };
}

// 객체를 JSON 파일로 내려받게 한다. 브라우저에서 "파일 저장"은 이렇게 한다:
// 1) 글자를 Blob(파일 덩어리)으로 만들고 2) 임시 주소를 얻어 3) 보이지 않는 <a>를 눌러 다운로드한다.
function exportBackup() {
  const text = JSON.stringify(collectBackup(), null, 2); // null, 2 = 보기 좋게 들여쓰기
  const blob = new Blob([text], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = makeElement("a");
  link.href = url;
  link.download = "나의회사-백업-" + todayString() + ".json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url); // 임시 주소 정리
}

// 백업 파일을 읽어서 localStorage에 되돌려 넣는다. 끝나면 새로고침해서 전부 다시 불러온다.
function importBackup(file) {
  const reader = new FileReader();
  reader.onload = function () {
    let backup;
    try {
      backup = JSON.parse(reader.result);
    } catch (error) {
      alert("백업 파일을 읽을 수 없어요. JSON 형식이 아닙니다.");
      return;
    }
    if (!backup || !backup.data) {
      alert("이 앱의 백업 파일이 아닌 것 같아요.");
      return;
    }
    const ok = confirm("지금 기록을 백업 파일(" + (backup.savedAt || "날짜 없음").slice(0, 10) + ")의 내용으로 바꿀까요?");
    if (!ok) return;

    for (const key of BACKUP_KEYS) {
      if (backup.data[key] !== null && backup.data[key] !== undefined) {
        localStorage.setItem(key, JSON.stringify(backup.data[key]));
      }
    }
    location.reload();
  };
  reader.readAsText(file);
}

// 전부 지우기. 두 번 묻는다.
function resetAll() {
  if (!confirm("모든 기록(가계부·루틴·학습 진도)을 지울까요? 먼저 백업을 내려받는 걸 권합니다.")) return;
  if (!confirm("정말 지웁니다. 되돌릴 수 없어요.")) return;
  for (const key of BACKUP_KEYS) {
    localStorage.removeItem(key);
  }
  location.reload();
}

// ---------- 3. 화면 그리기 ----------
const ceoSummary = document.getElementById("ceo-summary");

function renderCeo() {
  const xp = totalXp();
  const level = Math.floor(xp / XP_PER_LEVEL) + 1;
  const lines = [
    "Lv." + level + " · 누적 " + xp + " EXP",
    "가계부 " + entries.length + "건 · 루틴 체크 " + (routineXp() / XP_PER_CHECK) + "개 · 완료 단원 " + Object.keys(studyDone).length + "개",
    "연속 달성일 " + routineStreak() + "일",
  ];
  ceoSummary.innerHTML = "";
  for (const line of lines) {
    ceoSummary.appendChild(makeElement("p", "ceo-line", line));
  }
}

// ---------- 4. 이벤트 연결 ----------
document.getElementById("backup-export").addEventListener("click", exportBackup);
document.getElementById("backup-reset").addEventListener("click", resetAll);
document.getElementById("backup-import").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (file) importBackup(file);
  event.target.value = ""; // 같은 파일을 다시 골라도 change가 나게 비운다
});
