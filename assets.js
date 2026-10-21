// =====================================================
// assets.js - 자산관리부: 계좌별 잔고와 순자산
//
// 계좌(은행·증권·현금·부채)를 등록하고, 잔고를 갱신할 때마다 "오늘 날짜의 스냅샷"으로 저장한다.
// 순자산 = 자산 합계 − 부채 합계. 스냅샷이 쌓이면 달이 지날수록 순자산 변화를 볼 수 있다.
// 가계부(재무부)가 "흐름"(들어오고 나간 돈)이라면, 자산관리부는 "잔액"(지금 얼마 있나)이다.
// 공용 함수(makeElement, todayString, formatMoney, showXpPop)는 app.js에 있다.
// =====================================================

// ---------- 1. 데이터 ----------
// 계좌 종류. 값(영문)은 저장용, 이름은 화면용. debt 는 부채라서 순자산에서 뺀다.
const ACCOUNT_TYPES = { bank: "은행", stock: "증권", cash: "현금", debt: "부채" };

// 저장 모양:
// {
//   accounts: [ { id: 1697000000000, name: "주거래 통장", type: "bank" } ],
//   history:  { "2026-10-21": { "1697000000000": 1500000 } }   ← 날짜별 → 계좌 id별 잔고
// }
// 잔고를 계좌 객체 안에 두지 않고 날짜별 history 에 두는 이유: 과거 잔고가 남아야 변화를 볼 수 있어서.
let assetData = { accounts: [], history: {} };
const ASSET_KEY = "asset-accounts";
const XP_PER_UPDATE = 10; // 잔고 갱신 1회 = 10 경험치

// ---------- 2. 저장과 불러오기 ----------
function assetSave() {
  localStorage.setItem(ASSET_KEY, JSON.stringify(assetData));
}

function assetLoad() {
  const saved = localStorage.getItem(ASSET_KEY);
  if (!saved) return;
  try {
    const parsed = JSON.parse(saved);
    // 모양 검사: accounts 는 배열, history 는 객체여야 한다
    if (parsed && Array.isArray(parsed.accounts) && parsed.history && typeof parsed.history === "object") {
      assetData = parsed;
    }
  } catch (error) {
    console.error("자산 기록을 읽을 수 없어서 비웁니다:", error);
  }
}

// ---------- 3. 기능 함수 ----------
// 계좌 추가
function addAccount(name, type) {
  assetData.accounts.push({ id: Date.now(), name: name, type: type });
  assetSave();
  render();
}

// 계좌 삭제 (과거 스냅샷의 잔고는 남겨 둔다. 지난 달 순자산이 바뀌면 안 되니까)
function deleteAccount(accountId) {
  assetData.accounts = assetData.accounts.filter(function (account) {
    return account.id !== accountId;
  });
  assetSave();
  render();
}

// 오늘 날짜로 잔고를 기록한다. 같은 날 다시 적으면 덮어쓴다 (하루 한 값)
function updateBalance(accountId, balance) {
  const today = todayString();
  if (!assetData.history[today]) {
    assetData.history[today] = {}; // 오늘 스냅샷이 없으면 새로 만든다
  }
  const isNew = assetData.history[today][accountId] === undefined;
  assetData.history[today][accountId] = balance;
  assetSave();
  render();
  if (isNew) showXpPop(XP_PER_UPDATE); // 같은 날 두 번 고치는 건 경험치 없음
}

// 그 계좌의 "가장 최근" 잔고. 오늘 없으면 그 전 날짜 중 가장 늦은 것. 한 번도 없으면 null
function latestBalance(accountId) {
  const dates = Object.keys(assetData.history).sort().reverse(); // 최신 날짜부터
  for (const date of dates) {
    const snapshot = assetData.history[date];
    if (snapshot[accountId] !== undefined) {
      return { balance: snapshot[accountId], date: date };
    }
  }
  return null;
}

// 순자산 = 자산(은행+증권+현금) − 부채. 각 계좌의 최근 잔고로 계산한다
function netWorth() {
  let assets = 0;
  let debts = 0;
  for (const account of assetData.accounts) {
    const latest = latestBalance(account.id);
    if (latest === null) continue; // 아직 잔고를 적지 않은 계좌는 건너뛴다
    if (account.type === "debt") {
      debts = debts + latest.balance;
    } else {
      assets = assets + latest.balance;
    }
  }
  return { assets: assets, debts: debts, net: assets - debts };
}

// 특정 날짜 시점의 순자산 (그 날짜까지의 최근 잔고 기준). 변화 표에 쓴다
function netWorthAt(date) {
  const dates = Object.keys(assetData.history).filter(function (d) { return d <= date; }).sort().reverse();
  let net = 0;
  for (const account of assetData.accounts) {
    for (const d of dates) {
      const value = assetData.history[d][account.id];
      if (value !== undefined) {
        net = net + (account.type === "debt" ? -value : value);
        break; // 그 계좌의 가장 최근 값을 찾았으니 다음 계좌로
      }
    }
  }
  return net;
}

// 최근 7일 안에 잔고를 한 번이라도 갱신했는지 (자산관리부는 매일 할 일이 아니라 주 1회 점검)
function assetsUpdatedRecently() {
  const limit = new Date();
  limit.setDate(limit.getDate() - 7);
  const since = dateToString(limit);
  for (const date in assetData.history) {
    if (date >= since) return true;
  }
  return false;
}

// 잔고 갱신 횟수 × 10 = 자산관리부에서 얻은 경험치
function assetXp() {
  let count = 0;
  for (const date in assetData.history) {
    count = count + Object.keys(assetData.history[date]).length;
  }
  return count * XP_PER_UPDATE;
}

// ---------- 4. 화면 그리기 ----------
const netWorthText = document.getElementById("net-worth");
const netWorthSub = document.getElementById("net-worth-sub");
const accountList = document.getElementById("account-list");
const assetHistory = document.getElementById("asset-history");
const accountForm = document.getElementById("account-form");

function renderAssets() {
  // (1) 순자산 카드
  const total = netWorth();
  netWorthText.textContent = formatMoney(total.net);
  netWorthSub.textContent = "자산 " + formatMoney(total.assets) + " · 부채 " + formatMoney(total.debts) +
    (assetsUpdatedRecently() ? "" : " · 이번 주 잔고 점검 전");

  // (2) 계좌 목록: 이름 · 종류 · 최근 잔고(날짜) · [새 잔고 입력] [기록] [×]
  accountList.innerHTML = "";
  if (assetData.accounts.length === 0) {
    accountList.appendChild(makeElement("li", "empty", "계좌가 없어요. 아래에서 추가해 보세요."));
  }
  for (const account of assetData.accounts) {
    const item = makeElement("li", "account-item" + (account.type === "debt" ? " debt" : ""));

    const text = makeElement("div", "account-text");
    text.appendChild(makeElement("b", "", account.name));
    const latest = latestBalance(account.id);
    text.appendChild(makeElement("span", "account-meta",
      ACCOUNT_TYPES[account.type] + " · " + (latest ? formatMoney(latest.balance) + " (" + latest.date.slice(5) + ")" : "잔고 미입력")));

    const input = makeElement("input", "balance-input");
    input.type = "number";
    input.min = "0";
    input.placeholder = "새 잔고";

    const saveBtn = makeElement("button", "btn btn-small", "기록");
    saveBtn.addEventListener("click", function () {
      const value = Number(input.value);
      if (input.value === "" || value < 0) return;
      updateBalance(account.id, value);
    });

    const deleteBtn = makeElement("button", "delete-btn", "×");
    deleteBtn.title = "계좌 삭제";
    deleteBtn.addEventListener("click", function () {
      if (confirm(account.name + " 계좌를 지울까요? 과거 기록은 남습니다.")) deleteAccount(account.id);
    });

    item.appendChild(text);
    item.appendChild(input);
    item.appendChild(saveBtn);
    item.appendChild(deleteBtn);
    accountList.appendChild(item);
  }

  // (3) 순자산 변화: 스냅샷이 있는 날짜마다 그 시점의 순자산. 최근 8개
  assetHistory.innerHTML = "";
  const dates = Object.keys(assetData.history).sort().reverse().slice(0, 8);
  if (dates.length === 0) {
    assetHistory.appendChild(makeElement("p", "card-sub", "잔고를 기록하면 날짜별 순자산이 쌓입니다."));
  }
  let previous = null; // 바로 다음(더 옛) 날짜의 순자산과 비교하려고 아래에서 거꾸로 계산
  const rows = [];
  for (const date of dates.slice().reverse()) { // 옛날 → 최근 순으로 계산해야 "전보다 얼마" 를 알 수 있다
    const net = netWorthAt(date);
    const diff = previous === null ? null : net - previous;
    rows.push({ date: date, net: net, diff: diff });
    previous = net;
  }
  for (const row of rows.reverse()) { // 화면에는 최근이 위
    const line = makeElement("div", "history-line");
    line.appendChild(makeElement("span", "history-date", row.date));
    line.appendChild(makeElement("b", "", formatMoney(row.net)));
    if (row.diff !== null) {
      const sign = row.diff >= 0 ? "+" : "-";
      line.appendChild(makeElement("span", row.diff >= 0 ? "amount-income" : "amount-expense",
        sign + formatMoney(Math.abs(row.diff))));
    }
    assetHistory.appendChild(line);
  }
}

// ---------- 5. 이벤트 연결 ----------
accountForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const name = document.getElementById("account-name").value.trim();
  const type = document.getElementById("account-type").value;
  if (name === "") return;
  addAccount(name, type);
  document.getElementById("account-name").value = "";
});
