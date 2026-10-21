// =====================================================
// sprites.js - 글자로 그리는 픽셀 그림
//
// 그림 파일을 하나도 쓰지 않는다. 그림은 이렇게 만든다.
//
//   1) 글자 격자  : 문자열 배열. 한 글자 = 픽셀 한 칸.  "." 은 투명(안 찍음)
//   2) 색 대응표  : PALETTE. 글자 하나에 색 하나.      "H" → 진한 갈색
//   3) 이중 반복문: 줄(y)마다, 글자(x)마다 네모를 하나씩 찍는다 (fillRect)
//
// 예) 아래 4줄은 "초록 잎이 달린 작은 화분"이다. 한 글자씩 세로로 읽어 보자.
//
//      "..EE.."      ← E = 잎
//      ".EEEE."
//      "..KK.."      ← K = 검은 윤곽선
//      ".KTTK."      ← T = 테라코타(화분)
//
// drawSprite("PLANT", 3) 을 부르면 한 글자를 3px × 3px 네모로 찍은
// <canvas> 요소를 돌려준다. app.js는 그걸 방 안에 appendChild 하면 끝.
// 글자를 바꾸면 그림이 바뀐다. 직접 고쳐 보는 게 가장 빠른 공부다.
// =====================================================

// ---------- 1. 색 대응표 ----------
// 글자 하나 = 색 하나. 없는 글자(예: ".")는 투명으로 처리한다.
const PALETTE = {
  K: "#1a1a1a", // 검정 (윤곽선, 바지)
  H: "#3a2a1a", // 진한 갈색 (사장·팀장 머리)
  O: "#e07a2c", // 주황 (직원 머리)
  S: "#f3c9a0", // 살색
  N: "#2b3a67", // 남색 (정장, 청바지)
  R: "#e84545", // 빨강 (넥타이, 머그컵, 책)
  W: "#ffffff", // 흰색 (셔츠 깃, 종이, 칠판)
  G: "#3fa34d", // 초록 (직원 스웨터, 책)
  E: "#2d7d46", // 진초록 (잎)
  g: "#8fe08a", // 연초록 (잎 반짝이)
  B: "#3d7dd8", // 파랑 (모니터 화면, 책)
  b: "#cfe8ff", // 하늘색 (유리창)
  D: "#7a4a22", // 진갈색 (나무 옆면, 문, 신발)
  d: "#c9a06a", // 밝은 갈색 (나무 윗면)
  Y: "#ffd84a", // 노랑 (해, 가로등, 표지판, 문손잡이)
  P: "#6f6f7a", // 회색 (의자)
  p: "#c8c8d0", // 연회색 (복사기)
  L: "#eeeef2", // 아주 연한 회색 (복사기 종이 받침)
  T: "#c2693a", // 테라코타 (화분)
  M: "#e58cb5", // 분홍 (소파)
};

// ---------- 2. 그림 목록 ----------
// 이름: 글자 격자. 줄 길이는 한 그림 안에서 모두 같아야 한다.
const SPRITES = {};

// --- 사람 (10칸 × 14칸, 3배로 찍으면 30px × 42px) ---

// 사장·팀장: 갈색 머리, 남색 정장, 빨간 넥타이. 서 있는 모습(다리 모음)
SPRITES.BOSS = [
  "...HHHH...",
  "..HHHHHH..",
  ".HHHHHHHH.",
  ".HSSSSSSH.",
  ".SSKSSKSS.",
  ".SSSSSSSS.",
  "..SSSSSS..",
  "..NNWWNN..",
  ".NNNRRNNN.",
  ".NNNRRNNN.",
  ".NNNNNNNN.",
  "..KKKKKK..",
  "..KK..KK..",
  ".DDD..DDD.",
];

// 사장·팀장 걷기 프레임: 윗부분(0~10줄)은 같고 다리만 벌어진다.
// slice(0, 11) = 앞 11줄만 복사. concat = 뒤에 새 줄을 이어 붙인다.
SPRITES.BOSS_WALK = SPRITES.BOSS.slice(0, 11).concat([
  "..KKKKKK..",
  ".KK....KK.",
  "DDD....DDD",
]);

// 직원: 주황 단발머리, 초록 스웨터, 청바지
SPRITES.STAFF = [
  "...OOOO...",
  "..OOOOOO..",
  ".OOOOOOOO.",
  ".OOSSSSOO.",
  ".OSKSSKSO.",
  ".OSSSSSSO.",
  "..SSSSSS..",
  "..GGWWGG..",
  ".GGGGGGGG.",
  ".GGGGGGGG.",
  ".GGGGGGGG.",
  "..NNNNNN..",
  "..NN..NN..",
  ".KKK..KKK.",
];

SPRITES.STAFF_WALK = SPRITES.STAFF.slice(0, 11).concat([
  "..NNNNNN..",
  ".NN....NN.",
  "KKK....KKK",
]);

// --- 가구 ---

// 직원 책상: 왼쪽에 모니터, 오른쪽에 종이. (20 × 12)
// 위 6줄은 모니터, 아래 6줄은 책상(윗면 2줄 + 앞판 2줄 + 다리).
// 책상 윗면이 7번째 줄(= 위에서 6칸 아래)에서 시작한다. app.js/style.css는 이 숫자로 캐릭터를 책상 뒤에 앉힌다.
SPRITES.DESK = [
  ".KKKKKK.............",
  ".KBBBBK.............",
  ".KBbBBK.............",
  ".KBBBBK.............",
  ".KKKKKK.............",
  "....KK..............",
  "KKKKKKKKKKKKKKKKKKKK",
  "KddddddddddddddddWWK",
  "KddddddddddddddddWWK",
  "KDDDDDDDDDDDDDDDDDDK",
  "KDDDDDDDDDDDDDDDDDDK",
  ".KK..............KK.",
];

// 팀장 책상: 조금 더 넓고 빨간 머그컵이 있다. (24 × 12)
SPRITES.BOSS_DESK = [
  ".KKKKKK.................",
  ".KBBBBK.................",
  ".KBbBBK.................",
  ".KBBBBK.................",
  ".KKKKKK.................",
  "....KK..................",
  "KKKKKKKKKKKKKKKKKKKKKKKK",
  "KddddddddddddddddWWdRRdK",
  "KddddddddddddddddWWdRRdK",
  "KDDDDDDDDDDDDDDDDDDDDDDK",
  "KDDDDDDDDDDDDDDDDDDDDDDK",
  ".KK..................KK.",
];

// 의자: 등받이가 보이는 뒷모습. 캐릭터 뒤에 두면 윗부분만 양옆으로 삐져나온다. (12 × 7)
SPRITES.CHAIR = [
  "..KKKKKKKK..",
  ".KPPPPPPPPK.",
  "KPPPPPPPPPPK",
  "KPPPPPPPPPPK",
  "KPPPPPPPPPPK",
  ".KKKKKKKKKK.",
  "..KK....KK..",
];

// 화분. (8 × 12)
SPRITES.PLANT = [
  "...EE...",
  "..EgEE..",
  ".EEgEEE.",
  ".EgEEgE.",
  "..EEEE..",
  "...KK...",
  "..KTTK..",
  ".KTTTTK.",
  ".KTTTTK.",
  ".KTTTTK.",
  "..KTTK..",
  "..KKKK..",
];

// 창문: 해와 구름이 보인다. (14 × 10)
SPRITES.WINDOW = [
  "KKKKKKKKKKKKKK",
  "KbYYbbbKbbbbbK",
  "KbYYbbbKbbWWbK",
  "KbbbbbbKbbbbbK",
  "KKKKKKKKKKKKKK",
  "KbbbbbbKbbbbbK",
  "KbbWWbbKbbbbbK",
  "KbbbbbbKbbbbbK",
  "KKKKKKKKKKKKKK",
  "..dddddddddd..",
];

// 화이트보드: 색깔 선 세 줄이 메모처럼 그려져 있다. (14 × 10)
SPRITES.WHITEBOARD = [
  "KKKKKKKKKKKKKK",
  "KWWWWWWWWWWWWK",
  "KWGGGGGWWWWWWK",
  "KWWWWWWWWWWWWK",
  "KWRRRRRRRRWWWK",
  "KWWWWWWWWWWWWK",
  "KWBBBBWWWWWWWK",
  "KWWWWWWWWWWWWK",
  "KKKKKKKKKKKKKK",
  "....KK....KK..",
];

// 벽시계. (8 × 8)
SPRITES.CLOCK = [
  "..KKKK..",
  ".KWWWWK.",
  "KWWWKWWK",
  "KWWWKWWK",
  "KWWWKKWK",
  "KWWWWWWK",
  ".KWWWWK.",
  "..KKKK..",
];

// 책장: 알록달록한 책이 세 단. (12 × 12)
SPRITES.BOOKSHELF = [
  "KKKKKKKKKKKK",
  "KRRGGBBYYRRK",
  "KRRGGBBYYRRK",
  "KRRGGBBYYRRK",
  "KDDDDDDDDDDK",
  "KBBYYRRddGGK",
  "KBBYYRRddGGK",
  "KBBYYRRddGGK",
  "KDDDDDDDDDDK",
  "KGGddRRBBYYK",
  "KGGddRRBBYYK",
  "KKKKKKKKKKKK",
];

// 분홍 소파. (18 × 9)
SPRITES.SOFA = [
  ".KK............KK.",
  ".KMK..........KMK.",
  ".KMKKKKKKKKKKKKMK.",
  ".KMMMMMMMMMMMMMMK.",
  ".KMMMMMMMMMMMMMMK.",
  ".KMMMMMMKMMMMMMMK.",
  ".KKKKKKKKKKKKKKKK.",
  ".KMMMMMMMMMMMMMMK.",
  "..KK..........KK..",
];

// 복사기. (10 × 12)
SPRITES.COPIER = [
  "..KKKKKK..",
  "..KWWWWK..",
  "KKKKKKKKKK",
  "KppppppppK",
  "KpKKKKKppK",
  "KpKBBBKppK",
  "KpKKKKKppK",
  "KppppppppK",
  "KpLLLLLLpK",
  "KppppppppK",
  "KKKKKKKKKK",
  ".KK....KK.",
];

// 서류함: 서랍 세 칸, 노란 손잡이. (10 × 12)
SPRITES.CABINET = [
  "KKKKKKKKKK",
  "KppppppppK",
  "KpppYYpppK",
  "KppppppppK",
  "KKKKKKKKKK",
  "KppppppppK",
  "KpppYYpppK",
  "KppppppppK",
  "KKKKKKKKKK",
  "KppppppppK",
  "KpppYYpppK",
  "KKKKKKKKKK",
];

// 정수기: 위에 물통, 가운데 빨강·파랑 꼭지. (8 × 12)
SPRITES.COOLER = [
  "..KKKK..",
  ".KbbbbK.",
  ".KbbbbK.",
  ".KbbbbK.",
  ".KKKKKK.",
  "KppppppK",
  "KpRppBpK",
  "KppppppK",
  "KpKKKKpK",
  "KppppppK",
  "KppppppK",
  "KKKKKKKK",
];

// 가로등. (6 × 16)
SPRITES.LAMP = [
  ".KKKK.",
  "KYYYYK",
  "KYYYYK",
  ".KKKK.",
  "..KK..",
  "..KK..",
  "..KK..",
  "..KK..",
  "..KK..",
  "..KK..",
  "..KK..",
  "..KK..",
  "..KK..",
  "..KK..",
  ".KKKK.",
  "KKKKKK",
];

// 표지판. (10 × 12)
SPRITES.SIGN = [
  "KKKKKKKKKK",
  "KYYYYYYYYK",
  "KYKKYYKKYK",
  "KYYYYYYYYK",
  "KKKKKKKKKK",
  "....KK....",
  "....KK....",
  "....KK....",
  "....KK....",
  "....KK....",
  "...KKKK...",
  "..KKKKKK..",
];

// 방문. (8 × 12)
SPRITES.DOOR = [
  "KKKKKKKK",
  "KDDDDDDK",
  "KDddddDK",
  "KDddddDK",
  "KDDDDDDK",
  "KDDDDDYK",
  "KDDDDDDK",
  "KDddddDK",
  "KDddddDK",
  "KDDDDDDK",
  "KDDDDDDK",
  "KKKKKKKK",
];

// 길가 화단. (12 × 7)
SPRITES.BUSH = [
  "..EgEEEEgE..",
  ".EEEEgEEEEE.",
  "EEEEEEEEEEEE",
  "KKKKKKKKKKKK",
  "KTTTTTTTTTTK",
  "KTTTTTTTTTTK",
  "KKKKKKKKKKKK",
];

// ---------- 3. 그리기 ----------
// 이름과 배율을 받아서 <canvas>를 만들어 돌려준다.
// 배율 3이면 글자 한 칸이 3px × 3px 네모가 된다.
function drawSprite(name, scale) {
  const rows = SPRITES[name];
  if (!rows) {
    console.error("없는 그림 이름: " + name);
    return document.createElement("canvas");
  }

  // 캔버스 크기 = 가로 글자 수 × 배율, 세로 줄 수 × 배율
  const canvas = document.createElement("canvas");
  canvas.width = rows[0].length * scale;
  canvas.height = rows.length * scale;
  // 클래스 이름 예: "sprite sprite-chair" → CSS에서 .sprite-chair 로 위치를 잡는다
  canvas.className = "sprite sprite-" + name.toLowerCase();
  canvas.setAttribute("aria-hidden", "true"); // 장식 그림이라 화면 읽기 프로그램은 건너뛴다

  const ctx = canvas.getContext("2d");

  // 이중 반복문: 바깥은 줄(y), 안쪽은 그 줄의 글자(x)
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const letter = rows[y][x];
      const color = PALETTE[letter];
      if (!color) continue; // "." 처럼 대응표에 없는 글자는 건너뛴다(투명)
      ctx.fillStyle = color;
      ctx.fillRect(x * scale, y * scale, scale, scale);
    }
  }

  return canvas;
}
