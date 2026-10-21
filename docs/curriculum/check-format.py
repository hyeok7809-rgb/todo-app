"""단원 문서 형식 검사. 저장소 루트에서  python3 docs/curriculum/check-format.py  로 실행한다.
제목(# N-M.), 메타표 4줄, 섹션 8개, 퀴즈 해설 5개, 경험치=시간×20, 숙제 3개 이상을 확인한다."""
import glob, re
SECTIONS = ["이 단원을 마치면", "왜 배우나", "핵심 개념", "따라하기", "흔한 실수와 해결", "확인 퀴즈", "더 보기", "숙제"]
files = sorted(glob.glob("docs/curriculum/[0-9][0-9]-*/[0-9][0-9]-[0-9].md"))
bad = 0
for f in files:
    t = open(f, encoding="utf-8").read()
    probs = []
    if not re.search(r'^# \d+-\d+\. ', t, re.M): probs.append("제목 형식")
    for key in ["과정", "예상 시간", "선수 단원", "경험치"]:
        if not re.search(r'^\| *' + key + r' *\|', t, re.M): probs.append("메타표 " + key)
    heads = re.findall(r'^## (.+)$', t, re.M)
    for s in SECTIONS:
        if not any(h.strip().startswith(s) or s in h for h in heads): probs.append("섹션 없음: " + s)
    n = t.count("<summary>정답과 해설")
    if n < 5: probs.append(f"퀴즈 해설 {n}개")
    # 경험치 = 시간 × 20
    m = re.search(r'^\| *예상 시간 *\| *([\d.]+)', t, re.M); x = re.search(r'^\| *경험치 *\| *(\d+)', t, re.M)
    if m and x and int(float(m.group(1)) * 20) != int(x.group(1)): probs.append(f"경험치 불일치 {m.group(1)}h vs {x.group(1)}")
    if "숙제" in heads[-1] if heads else False:
        hw = t.split("## " + heads[-1])[-1]
        if len(re.findall(r'^\s*(?:\d+\.|-)\s', hw, re.M)) < 3: probs.append("숙제 3개 미만")
    if probs:
        bad += 1; print(f, probs)
print(f"{len(files)}개 파일 검사, 문제 {bad}개")
