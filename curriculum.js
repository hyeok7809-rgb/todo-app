// =====================================================
// curriculum.js - 교육부가 읽는 커리큘럼 데이터 (자동 생성)
//
// 원본은 docs/curriculum/modules.json 이다. 거기를 고친 뒤 아래 명령으로 다시 만든다:
//   python3 docs/curriculum/make-curriculum-js.py
// 브라우저가 file:// 로 열린 페이지에서는 .json 파일을 fetch 로 못 읽기 때문에
// 데이터를 자바스크립트 변수(CURRICULUM)로 넣어 둔다.
// =====================================================

const CURRICULUM = [
  {
    "id": "00",
    "title": "준비: 개발 환경 만들기",
    "goal": "컴퓨터·터미널·도구 설치·Claude Code 첫 실행까지, 코딩을 시작할 수 있는 상태 만들기",
    "units": [
      {
        "id": "00-1",
        "title": "컴퓨터는 어떻게 일하는가: 파일, 폴더, 경로, 확장자, 프로그램과 프로세스",
        "hours": 2,
        "xp": 40,
        "doc": "docs/curriculum/00-setup/00-1.md"
      },
      {
        "id": "00-2",
        "title": "터미널 첫걸음: 기본 명령어, 경로 이동, 환경변수 개념, Windows(PowerShell)와 Mac 차이",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/00-setup/00-2.md"
      },
      {
        "id": "00-3",
        "title": "도구 설치: VS Code, Node.js, Python, Git 설치와 설치 확인, 버전이란",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/00-setup/00-3.md"
      },
      {
        "id": "00-4",
        "title": "Claude Code 설치와 첫 대화: 로그인, 프로젝트 폴더 열기, 첫 요청, 위험한 명령 주의",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/00-setup/00-4.md"
      }
    ]
  },
  {
    "id": "01",
    "title": "코딩의 기본 개념 (JavaScript로)",
    "goal": "모든 언어에 공통인 프로그래밍 사고방식을 이 프로젝트의 app.js를 재료로 익히기",
    "units": [
      {
        "id": "01-1",
        "title": "프로그램이란: 입력→처리→출력, 코드가 위에서 아래로 실행되는 순서, 브라우저 콘솔 사용법",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/01-coding-basics/01-1.md"
      },
      {
        "id": "01-2",
        "title": "변수와 자료형: 숫자, 문자열, 불리언, null/undefined, const와 let",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/01-coding-basics/01-2.md"
      },
      {
        "id": "01-3",
        "title": "조건문: if/else, 비교·논리 연산자, 참/거짓으로 취급되는 값",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/01-coding-basics/01-3.md"
      },
      {
        "id": "01-4",
        "title": "반복문: for, while, for...of, 반복 안에서 누적하기(합계·개수)",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/01-coding-basics/01-4.md"
      },
      {
        "id": "01-5",
        "title": "함수: 입력(매개변수)과 출력(return), 함수로 쪼개는 이유, 스코프",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/01-coding-basics/01-5.md"
      },
      {
        "id": "01-6",
        "title": "배열과 객체: 목록과 묶음, push/filter/map/find, JSON이란",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/01-coding-basics/01-6.md"
      },
      {
        "id": "01-7",
        "title": "에러와 디버깅: 에러 메시지 읽는 법, console.log, 브라우저 디버거, 검색하고 AI에게 묻는 법",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/01-coding-basics/01-7.md"
      }
    ]
  },
  {
    "id": "02",
    "title": "웹 기초 (HTML / CSS / JavaScript)",
    "goal": "브라우저에서 돌아가는 앱을 혼자 만들 수 있는 최소 지식",
    "units": [
      {
        "id": "02-1",
        "title": "웹은 어떻게 동작하나: 브라우저, HTML/CSS/JS의 역할 분담, URL, 클라이언트와 서버",
        "hours": 2,
        "xp": 40,
        "doc": "docs/curriculum/02-web-basics/02-1.md"
      },
      {
        "id": "02-2",
        "title": "HTML: 태그와 구조, 폼과 입력, 시맨틱 태그, 개발자 도구로 구조 보기",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/02-web-basics/02-2.md"
      },
      {
        "id": "02-3",
        "title": "CSS: 선택자, 박스 모델, flex와 grid, 반응형, transition/animation 맛보기",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/02-web-basics/02-3.md"
      },
      {
        "id": "02-4",
        "title": "DOM과 이벤트: 요소 찾기·바꾸기·만들기, 이벤트 리스너, '데이터가 바뀌면 화면을 다시 그린다' 패턴",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/02-web-basics/02-4.md"
      },
      {
        "id": "02-5",
        "title": "저장: localStorage, JSON 직렬화, 데이터 구조 설계(어떤 모양으로 저장할까)",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/02-web-basics/02-5.md"
      },
      {
        "id": "02-6",
        "title": "네트워크: fetch, 비동기(async/await, Promise), 공개 API 호출해 보기",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/02-web-basics/02-6.md"
      }
    ]
  },
  {
    "id": "03",
    "title": "Python 기초: 자동화의 언어",
    "goal": "매매·생활 자동화 스크립트를 쓸 수 있는 파이썬 기본기",
    "units": [
      {
        "id": "03-1",
        "title": "왜 파이썬인가, 설치·실행·가상환경(venv)·pip, 첫 스크립트",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/03-python/03-1.md"
      },
      {
        "id": "03-2",
        "title": "파이썬 문법 1: 변수, 조건, 반복, 함수 (JavaScript와 비교하며)",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/03-python/03-2.md"
      },
      {
        "id": "03-3",
        "title": "파이썬 문법 2: 리스트, 딕셔너리, 문자열 처리, 파일 읽기/쓰기(txt, csv, json)",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/03-python/03-3.md"
      },
      {
        "id": "03-4",
        "title": "모듈과 패키지: import, 표준 라이브러리(datetime, pathlib, os), pip 패키지 쓰기",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/03-python/03-4.md"
      },
      {
        "id": "03-5",
        "title": "requests로 API 호출, 예외 처리(try/except), 로그 남기기",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/03-python/03-5.md"
      },
      {
        "id": "03-6",
        "title": "pandas 맛보기: 표 데이터 다루기, 주가 csv 불러와 요약·그래프",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/03-python/03-6.md"
      }
    ]
  },
  {
    "id": "04",
    "title": "데이터와 API, 자동화",
    "goal": "외부 서비스와 데이터를 주고받고, 스크립트를 자동으로 돌리기",
    "units": [
      {
        "id": "04-1",
        "title": "HTTP와 REST API: 요청/응답, 메서드, 상태 코드, 헤더, JSON 본문",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/04-data-api/04-1.md"
      },
      {
        "id": "04-2",
        "title": "API 키와 보안: 환경변수, .env, .gitignore, 절대 공개하면 안 되는 것과 유출 시 대처",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/04-data-api/04-2.md"
      },
      {
        "id": "04-3",
        "title": "실전 API: 공공데이터포털, 한국투자증권 Open API(KIS) 개념(인증·시세 조회·모의투자), 자동매매의 법적·운영상 주의",
        "hours": 5,
        "xp": 100,
        "doc": "docs/curriculum/04-data-api/04-3.md"
      },
      {
        "id": "04-4",
        "title": "스케줄링과 알림: cron/작업 스케줄러로 스크립트 자동 실행, 텔레그램 봇으로 알림 받기",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/04-data-api/04-4.md"
      }
    ]
  },
  {
    "id": "05",
    "title": "Git과 GitHub",
    "goal": "코드 이력을 관리하고 안전하게 되돌리며, GitHub로 공개·배포하기",
    "units": [
      {
        "id": "05-1",
        "title": "Git 개념: 저장소, 커밋, 이력 보기, 되돌리기(checkout/restore/revert)",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/05-git-github/05-1.md"
      },
      {
        "id": "05-2",
        "title": "브랜치와 병합, 충돌 해결, 실험을 안전하게 하는 법",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/05-git-github/05-2.md"
      },
      {
        "id": "05-3",
        "title": "GitHub: 원격 저장소, push/pull, Pull Request, 이슈, README, GitHub Pages로 무료 배포",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/05-git-github/05-3.md"
      }
    ]
  },
  {
    "id": "06",
    "title": "AI 기초: LLM 이해하기",
    "goal": "AI가 무엇을 잘하고 못하는지 알고, 검증하며 쓰는 습관",
    "units": [
      {
        "id": "06-1",
        "title": "LLM이란: 토큰, 다음 단어 예측, 컨텍스트 윈도우, 학습 데이터와 지식 컷오프",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/06-ai-basics/06-1.md"
      },
      {
        "id": "06-2",
        "title": "환각과 한계, 검증하는 습관, 개인정보·보안·저작권 주의",
        "hours": 2,
        "xp": 40,
        "doc": "docs/curriculum/06-ai-basics/06-2.md"
      },
      {
        "id": "06-3",
        "title": "프롬프트 작성법: 역할·맥락·형식·예시 주기, 단계별로 시키기, 반복 개선",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/06-ai-basics/06-3.md"
      },
      {
        "id": "06-4",
        "title": "모델 비교와 선택: Claude 계열(Fable/Opus/Sonnet/Haiku), GPT, Gemini — 언제 무엇을 쓰나, 비용 구조",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/06-ai-basics/06-4.md"
      }
    ]
  },
  {
    "id": "07",
    "title": "클로드 제대로 쓰기 (claude.ai)",
    "goal": "claude.ai의 기능을 전부 알고 내 작업에 맞게 템플릿화하기",
    "units": [
      {
        "id": "07-1",
        "title": "claude.ai 기능 지도: 프로젝트, 아티팩트, 파일 업로드, 커넥터, 메모리, 모델 선택",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/07-claude-ai/07-1.md"
      },
      {
        "id": "07-2",
        "title": "스킬과 맞춤 지침: 반복 작업을 템플릿으로, 내 말투·형식 고정하기",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/07-claude-ai/07-2.md"
      },
      {
        "id": "07-3",
        "title": "실전 활용: 매매 복기 분석 템플릿, 문서 요약, 데이터 분석, 공부 도우미로 쓰기",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/07-claude-ai/07-3.md"
      }
    ]
  },
  {
    "id": "08",
    "title": "Claude Code 기초",
    "goal": "Claude Code로 프로젝트를 만들고 고치는 전체 흐름을 혼자 돌릴 수 있기",
    "units": [
      {
        "id": "08-1",
        "title": "Claude Code란: CLI/데스크톱/웹/IDE 확장, 세션과 컨텍스트, 요금(구독 vs API)",
        "hours": 2,
        "xp": 40,
        "doc": "docs/curriculum/08-claude-code-basics/08-1.md"
      },
      {
        "id": "08-2",
        "title": "첫 프로젝트: 폴더 열기, 요구사항 말하기, 변경 내용 확인, git 커밋 요청까지",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/08-claude-code-basics/08-2.md"
      },
      {
        "id": "08-3",
        "title": "CLAUDE.md와 메모리: 프로젝트 규칙 적어두기, 기억시키기",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/08-claude-code-basics/08-3.md"
      },
      {
        "id": "08-4",
        "title": "플랜 모드와 권한 모드: 먼저 계획 보고 승인하기, 위험한 명령 다루기",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/08-claude-code-basics/08-4.md"
      },
      {
        "id": "08-5",
        "title": "슬래시 명령과 컨텍스트 관리: /init, /clear, /compact, 비용·사용량 확인",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/08-claude-code-basics/08-5.md"
      },
      {
        "id": "08-6",
        "title": "좋은 요청 쓰는 법: 바이브 코딩에서 요구사항과 검증 기준 적기, 결과 검증 루틴",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/08-claude-code-basics/08-6.md"
      }
    ]
  },
  {
    "id": "09",
    "title": "Claude Code 심화",
    "goal": "반복 작업을 자동화하고 외부 도구를 연결해 Claude Code를 나만의 작업 환경으로 만들기",
    "units": [
      {
        "id": "09-1",
        "title": "서브에이전트: 병렬 작업과 역할 분담, 언제 쓰고 언제 안 쓰나",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/09-claude-code-advanced/09-1.md"
      },
      {
        "id": "09-2",
        "title": "스킬 만들기: 반복 작업을 /명령으로, SKILL.md 구조",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/09-claude-code-advanced/09-2.md"
      },
      {
        "id": "09-3",
        "title": "훅: 도구 실행 전후 자동 규칙(테스트, 포맷, 알림)",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/09-claude-code-advanced/09-3.md"
      },
      {
        "id": "09-4",
        "title": "MCP: 외부 도구 연결(GitHub, 구글, 데이터베이스), 설정과 보안",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/09-claude-code-advanced/09-4.md"
      },
      {
        "id": "09-5",
        "title": "웹/원격 세션과 스케줄 작업, GitHub 연동 자동화",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/09-claude-code-advanced/09-5.md"
      },
      {
        "id": "09-6",
        "title": "설정 파일과 권한 관리: settings.json, 허용 목록, 안전하게 쓰기",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/09-claude-code-advanced/09-6.md"
      }
    ]
  },
  {
    "id": "10",
    "title": "Claude API와 Agent SDK",
    "goal": "코드에서 클로드를 호출하고, 도구를 쓰는 나만의 에이전트를 만들기",
    "units": [
      {
        "id": "10-1",
        "title": "API 키 발급, 콘솔, 비용·한도, Python/JavaScript로 첫 호출",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/10-claude-api-agent-sdk/10-1.md"
      },
      {
        "id": "10-2",
        "title": "Messages API: 시스템 프롬프트, 멀티턴, 스트리밍, 구조화된 출력(JSON)",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/10-claude-api-agent-sdk/10-2.md"
      },
      {
        "id": "10-3",
        "title": "도구 사용(tool use): 함수 호출 흐름, JSON 스키마, 실제 함수 연결",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/10-claude-api-agent-sdk/10-3.md"
      },
      {
        "id": "10-4",
        "title": "Agent SDK: 에이전트 루프, 파일·명령 실행 에이전트 만들기",
        "hours": 5,
        "xp": 100,
        "doc": "docs/curriculum/10-claude-api-agent-sdk/10-4.md"
      },
      {
        "id": "10-5",
        "title": "프롬프트 캐싱, 배치, 비용 최적화, 로그와 모니터링",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/10-claude-api-agent-sdk/10-5.md"
      }
    ]
  },
  {
    "id": "11",
    "title": "AI 에이전트 조직 만들기 (최종 목표)",
    "goal": "여러 에이전트가 역할을 나눠 24시간 돌아가는 '나의 회사' 설계와 운영",
    "units": [
      {
        "id": "11-1",
        "title": "에이전트 설계: 역할·입력·출력·검증 정의, 에이전트 하나부터 제대로",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/11-ai-company/11-1.md"
      },
      {
        "id": "11-2",
        "title": "멀티 에이전트: 팀장-팀원 구조, 작업 큐, 결과 합치기, 실패 처리",
        "hours": 5,
        "xp": 100,
        "doc": "docs/curriculum/11-ai-company/11-2.md"
      },
      {
        "id": "11-3",
        "title": "24시간 운영: 스케줄러, 서버(VPS/클라우드), 로그, 실패 알림, 비용 관리",
        "hours": 5,
        "xp": 100,
        "doc": "docs/curriculum/11-ai-company/11-3.md"
      },
      {
        "id": "11-4",
        "title": "나의 회사 설계: 재무·루틴·학습·매매 부서에 AI 직원 배치 (이 프로젝트와 연결)",
        "hours": 5,
        "xp": 100,
        "doc": "docs/curriculum/11-ai-company/11-4.md"
      }
    ]
  },
  {
    "id": "12",
    "title": "바이브 코딩 실전과 배포",
    "goal": "AI와 함께 만든 코드를 검증·보호·배포·유지보수하는 실무 습관",
    "units": [
      {
        "id": "12-1",
        "title": "요구사항→작은 단위→검증 사이클, 테스트 기초(자동 테스트란)",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/12-vibe-coding-deploy/12-1.md"
      },
      {
        "id": "12-2",
        "title": "보안 기본: 입력 검증, 비밀 관리, 의존성 점검, AI 생성 코드의 흔한 실수",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/12-vibe-coding-deploy/12-2.md"
      },
      {
        "id": "12-3",
        "title": "배포: GitHub Pages/Vercel(정적), Render/Railway(서버), 도메인 연결",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/12-vibe-coding-deploy/12-3.md"
      },
      {
        "id": "12-4",
        "title": "유지보수: 에러 모니터링, 백업, 버전 관리, 업데이트 습관",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/12-vibe-coding-deploy/12-4.md"
      }
    ]
  },
  {
    "id": "13",
    "title": "수익화",
    "goal": "자동화·앱·외주로 실제 수익을 만드는 길 잡기",
    "units": [
      {
        "id": "13-1",
        "title": "포트폴리오: 자동화 사례 정리, GitHub 공개, 데모 만들기",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/13-monetize/13-1.md"
      },
      {
        "id": "13-2",
        "title": "앱/서비스 판매: 결제(토스페이먼츠/Stripe), 구독 모델, 사업자·세금 기초(개요, 전문가 확인 권고)",
        "hours": 4,
        "xp": 80,
        "doc": "docs/curriculum/13-monetize/13-2.md"
      },
      {
        "id": "13-3",
        "title": "외주·프리랜스: 플랫폼(크몽, 위시켓 등), 견적·계약, AI로 생산성 높이기",
        "hours": 3,
        "xp": 60,
        "doc": "docs/curriculum/13-monetize/13-3.md"
      },
      {
        "id": "13-4",
        "title": "로드맵 점검: 12월~2월 3개월 계획표, 주간 목표, 회고 방법",
        "hours": 2,
        "xp": 40,
        "doc": "docs/curriculum/13-monetize/13-4.md"
      }
    ]
  }
];
