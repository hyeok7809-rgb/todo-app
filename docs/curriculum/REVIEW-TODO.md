# 커리큘럼 검토에서 남은 일 (REVIEW-TODO)

2026-10-21 과정별 검토 에이전트(0~7과정, 14개 중 8개 완료 후 비용 때문에 중단)가 찾은 124건 중 약 118건을 반영했다.
아래는 코드 블록 전체를 다시 써야 해서 아직 못 고친 것과, 검토 자체를 못 한 과정이다. 하나 고칠 때마다 이 파일에서 지운다.

## 1. 검토는 됐지만 아직 못 고친 것

(2026-10-23 모두 반영: 02-3 선택자 예시 4규칙·`::before` 설명, 02-3 `.floor` 4열 격자, 02-3 `stroll`·`scaleX(-1)`·퀴즈 5 해설·따라하기 3(b) 18초, 02-4 `renderLedger()`·`makeElement()` 설명 2곳, 04-1 숙제 3개로. 남은 것 없음.)

## 2. 검토를 아직 안 한 과정: 8~13과정 (08-claude-code-basics ~ 13-monetize)

0~7과정에서 반복해서 나온 오류 유형이다. 8~13과정을 볼 때 같은 것을 먼저 찾는다.

1. **옛 app.js 기준 설명**: `addEntry(type, title, amount)`(실제는 `addEntry(type, category, title, amount)`), `load()`에 try/catch가 없다는 전제(실제는 있음), `render()` 안에 잔액·목록 코드가 있다는 설명(실제는 `renderLedger()`), 방 6개(실제 7개), `.sign`/`<h1>`/`.player`(없음. `.status-bar`, `.walker`).
2. **`toISOString()` 사용**: 날짜는 `todayString()`/`dateToString()`만. CLAUDE.md 규칙.
3. **로드맵 단계 번호**: 인사부·교육부는 2단계, 사장실 백업은 2.5단계, 자산관리부 3단계, 기획부 4단계. '5단계 루틴', '6단계 교육부'는 틀림.
4. **없는 단원·문서 참조**: 단원 번호는 `docs/curriculum/OUTLINE.md`에서 확인. '0과정 lesson-01' 같은 표현 금지.
5. **숙제 4개**: 공통 형식은 3개. 4번째는 `- 보너스(선택):`으로 바꾼다.
6. **entry 객체에 category 누락**: 실제 저장 모양은 `{id, type, category, title, amount, date}`.
7. **Claude·AI 사실**: 공식 문서에서 직접 확인한 것만 '확인일'을 남긴다. 못 연 주소는 '주소만 기재(작성 환경에서 접속 불가, 직접 확인)'.

검토 방법: 과정 하나를 통째로 Claude에게 주고 "이 체크리스트 7가지로 검토해서 파일·구절·고칠 문장을 표로 줘"라고 요청한 뒤, 한 건씩 원문을 열어 확인하고 고친다. `python3 docs/curriculum/check-format.py`로 형식을 다시 확인한다.

### 진행 (2026-10-23 · 로컬 Claude Code 단일 세션)

- 체크리스트 1~6을 8~13과정 29단원 전체에 grep으로 먼저 돌림: 옛 app.js 설명 0 · toISOString 1(12-4 에러 보고 시각 — 서버 로그용 UTC 라 그대로 두고 설명 주석 추가) · 로드맵 단계 1(11-4 "localStorage(2단계)" → 1단계부터) · 없는 단원 참조 0("5-5"는 모델 ID) · 숙제 4개 0 · entry category 누락 0.
- **8과정 끝**(공식 문서 overview·quickstart·costs·commands·memory·best-practices·permission-modes·checkpointing 대조, 확인일 2026-10-23): 8-1 확인일만 · 8-2 체크포인트 추적 범위(Claude가 편집한 적 없는 파일의 Bash 변경·외부·서브에이전트 변경 미추적)·Esc 두 번은 입력창 비었을 때 · 8-3 `/doctor prompt-audit` 한 줄 · 8-4 acceptEdits 는 작업 폴더 안 rm·rmdir·cp·sed 도 묻지 않음, 현재 모드는 상태 표시줄(`/status` 아님) · 8-5 "4단계 기획부" → 로드맵 6단계 자산관리부 확장 · 8-6 "(로드맵 4단계에서)" → 기획부 확장. 형식 검사 66/66.
- **9과정 끝**(sub-agents·skills·hooks-guide·mcp·claude-code-on-the-web·routines·settings 대조, 확인일 2026-10-23): 9-1 내장 도우미 에이전트 한 줄 · 9-2 claude.ai 스킬 동기화 폴더(synced · 내려받기만) · 9-3 훅 type 네 가지 한 줄 · 9-4 SSE 폐기 표현 · 9-5 **클라우드 세션에서 `/clear` 됨**(문서 바뀜) · Windows 는 번들 업로드 때 미커밋 비밀 파일 변경이 그대로 올라감 · 예약 작업은 auto 모드로 시작(승인 질문이 뜰 수 있음) · Run now/API 한도 · 9-6 확인일만.
- **10과정 끝**(platform.claude.com pricing·structured-outputs·prompt-caching·agent-sdk quickstart 대조 + Anthropic 공식 API 참고 자료(2026-10-06 판), 확인일 2026-10-23): 10-1 가격·모델 ID 확인(Haiku 5.5 는 10만 토큰까지 $0.10/M) · 10-2 구조화 출력 파라미터 `output_config.format`·`messages.parse()`(옛 `output_format` 폐기) · **10-3 `tool_choice` any/tool 강제는 지금 모델(Opus 5.5·Sonnet 5.5·Fable 5.1)에서 400** → auto+프롬프트·strict 로 · 10-4 퀵스타트 코드·도구 표·API 키 안내 그대로 맞음 · 10-5 캐시 최소 512 토큰·배율(읽기 0.05×)·배치 50% 맞음, log_usage 주석 한 줄.
- **11~13과정 끝**: 사실 검증 대상이 거의 없음(설계·운영·수익화) — 11-4 단계 번호 1건, 12-4 toISOString 주석, 확인일 갱신. 형식 검사 66/66.
- **남은 것 없음**(8~13과정 검토 완료 2026-10-23). 다음은 HANDOVER.md §5 의 3번부터(GitHub Pages 켜기 · 로드맵 6단계 · AI 직원실).
