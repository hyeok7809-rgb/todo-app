"""docs/curriculum/modules.json → curriculum.js 를 만든다. 저장소 루트에서 실행:
   python3 docs/curriculum/make-curriculum-js.py
"""
import json, pathlib
root = pathlib.Path(__file__).resolve().parents[2]
mods = json.load(open(root / "docs/curriculum/modules.json", encoding="utf-8"))
out = []
for m in mods:
    out.append({"id": m["id"], "title": m["title"], "goal": m["goal"],
        "units": [{"id": f"{m['id']}-{u['n']}", "title": u["title"], "hours": u["hours"], "xp": u["hours"] * 20,
                   "doc": f"docs/curriculum/{m['dir']}/{m['id']}-{u['n']}.md"} for u in m["units"]]})
header = (root / "curriculum.js").read_text(encoding="utf-8").split("const CURRICULUM")[0]
(root / "curriculum.js").write_text(header + "const CURRICULUM = " + json.dumps(out, ensure_ascii=False, indent=2) + ";\n", encoding="utf-8")
print("curriculum.js 갱신:", sum(len(m["units"]) for m in out), "단원")
