const fs = require("node:fs");
const path = require("node:path");

const load = (f) => fs.readFileSync(path.join(__dirname, process.argv[2] || "", f), "utf8").trim().split("\n").map((l) => JSON.parse(l));
const r1 = (n) => Math.round(n * 10) / 10;

function slope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b) / n;
  const my = ys.reduce((a, b) => a + b) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - mx) * (ys[i] - my); den += (xs[i] - mx) ** 2; }
  return num / den;
}

for (const label of ["before", "after"]) {
  const rows = load(`${label}.jsonl`);
  if (rows.some((r) => r.error)) { console.log(label, "ERROR", rows.find((r) => r.error)); continue; }
  const base = rows[0];
  const it = rows.slice(1);
  const last = it[it.length - 1];
  const N = it.length;
  const get = (r, k) => (k === "total" ? r.total : k === "heap" ? r.heap : r.procs[k] ?? 0);
  console.log(`\n=== ${label} (${N}회, 창 ${base.size.join("x")}) ===`);
  for (const k of ["total", "GPU", "Tab", "Browser", "heap"]) {
    const s = get(base, k), e = get(last, k), first = get(it[0], k);
    const reg = slope(it.map((r) => r.iter), it.map((r) => get(r, k)));
    console.log(
      `${k.padEnd(8)} 시작 ${r1(s)} → 1회후 ${r1(first)} → ${N}회후 ${r1(e)} MB | 총 +${r1(e - s)} | (끝-시작)/${N} = ${r1((e - s) / N)} MB/회 | 회귀기울기(1~${N}회) ${r1(reg)} MB/회`,
    );
  }
  const avg = (a) => r1(a.reduce((x, y) => x + y) / a.length);
  console.log(`fps(결과화면) 처음5회 ${avg(it.slice(0, 5).map((r) => r.fps))} / 마지막5회 ${avg(it.slice(-5).map((r) => r.fps))}`);
  console.log(`1회 소요(ms) 처음5회 ${avg(it.slice(0, 5).map((r) => r.cycleMs))} / 마지막5회 ${avg(it.slice(-5).map((r) => r.cycleMs))}`);
  console.log(`결과화면 표시 중 총메모리 최대 ${Math.max(...it.map((r) => r.resultTotal))} MB`);
  console.log("10회 간격 total:", [0, 10, 20, 30, 40, 50, 60].filter((i) => rows[i]).map((i) => `${i}:${rows[i].total}`).join(" "));
}
