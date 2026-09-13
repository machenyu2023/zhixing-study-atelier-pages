import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const source = await readFile(new URL("remote-sensing.js", root), "utf8");
const rs = vm.runInNewContext(`${source}\nRemoteSensing`);
const catalog = JSON.parse(await readFile(new URL("data/remote-sensing/catalog.json", root), "utf8"));
const sectionIds = catalog.sections.map(item => item.id);
const bundledIds = catalog.entries.map(item => item.id);
const sourceIds = new Set(catalog.sources.map(item => item.id));
assert.equal(new Set(sectionIds).size, 12);
assert.equal(new Set(bundledIds).size, bundledIds.length);
assert.equal(JSON.stringify(rs.FIELDS), JSON.stringify(catalog.fields));
for (const section of catalog.sections) for (const id of section.prerequisites) assert.ok(sectionIds.includes(id));
for (const entry of catalog.entries) {
  rs.validateEntry(entry, sectionIds);
  for (const field of rs.FIELDS) assert.ok(entry.body[field].length > 0);
  for (const id of entry.related) assert.ok(bundledIds.includes(id));
  for (const id of entry.sources) assert.ok(sourceIds.has(id));
}
for (const item of catalog.sources) assert.equal(new URL(item.url).protocol, "https:");

const custom = { ...catalog.entries[0], id: "USR-import-test", title: "个人测试条目" };
const state = { entries: [custom], records: { [bundledIds[0]]: { level: "能解释", note: "本机已有笔记", updated: "2026-09-12" } } };
const incoming = { entries: [{ ...custom, summary: "不能覆盖" }, { ...custom, id: "USR-new" }], records: {
  [bundledIds[0]]: { level: "能实现", note: "不能覆盖本机", updated: "2026-09-12" },
  [bundledIds[1]]: { level: "学习中", note: "新增笔记", updated: "2026-09-12" }
} };
const normalized = rs.validateState(JSON.parse(JSON.stringify(state)), sectionIds, bundledIds);
const merged = rs.mergeState(normalized, rs.validateState(incoming, sectionIds, bundledIds));
assert.equal(merged.added, 1);
assert.equal(merged.recordsAdded, 1);
assert.equal(merged.conflicts, 2);
assert.equal(merged.state.entries[0].summary, custom.summary);
assert.equal(merged.state.records[bundledIds[0]].note, "本机已有笔记");
assert.equal(merged.state.records[bundledIds[1]].note, "新增笔记");
const again = rs.mergeState(merged.state, incoming);
assert.equal(again.added, 0);
assert.equal(again.recordsAdded, 0);

assert.throws(() => rs.validateState({ entries: [catalog.entries[0]], records: {} }, sectionIds, bundledIds));
assert.throws(() => rs.validateState({ entries: [custom, custom], records: {} }, sectionIds, bundledIds));
assert.throws(() => rs.validateState({ entries: [{...custom, section:"99"}], records:{} }, sectionIds, bundledIds));
assert.throws(() => rs.validateState({ entries: [], records: { [custom.id]: { level: "假状态", note: "" } } }, sectionIds, bundledIds));
assert.throws(() => rs.validateState(JSON.parse('{"entries":[],"records":{"__proto__":{"level":"未评估","note":"x"}}}'), sectionIds, bundledIds));
assert.throws(() => rs.validateEntry({...custom, body:{...custom.body, "概念":{html:"<script>"}}}, sectionIds));
assert.equal(rs.validateEntry({...custom, title:"<script>alert(1)</script>"}, sectionIds).title, "<script>alert(1)</script>"); // Kept as text; UI escapes all fields.

assert.ok(Math.abs(rs.planck(10,300)-9.92403333) < 1e-7);
assert.ok(rs.planck(10,250)<rs.planck(10,300));
assert.ok(rs.planck(10,350)>rs.planck(10,300));
assert.throws(() => rs.planck(0,300));
assert.throws(() => rs.planck(10,NaN));
for (const temperature of [200,250,300,350,400]) {
  const points = Array.from({length:2801}, (_,i) => ({wavelength:2+i/100, radiance:rs.planck(2+i/100,temperature)}));
  const peak = points.reduce((best,point) => point.radiance>best.radiance?point:best);
  assert.ok(Math.abs(peak.wavelength-2897.771955/temperature)<0.011);
  assert.ok(peak.radiance<45, "Fixed chart scale must contain the full slider range");
}
const markdown = rs.toMarkdown([...catalog.entries,...normalized.entries], normalized.records, catalog.sources);
assert.ok(markdown.includes("本机已有笔记"));
assert.ok(markdown.includes("个人测试条目"));
assert.ok(markdown.includes(catalog.sources[0].url));
assert.ok(markdown.includes("关联条目："));
assert.equal(JSON.stringify(rs.validateState({entries:[],records:{}}, sectionIds, bundledIds)), '{"entries":[],"records":{}}');
console.log(`Validated ${sectionIds.length} remote-sensing sections, ${bundledIds.length} entries, conflict-safe import, Markdown export and Planck numerics.`);
