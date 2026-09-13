# 遥感物理知识库集成

入口：侧栏“遥感物理”、今日页面快捷入口，或 `#remote-sensing`。

## 已提供的内容

- 十二个板块与先修关系，中文/英文关键词检索。
- 十四个独立撰写的教学条目：覆盖立体角、光谱量、辐射传输、BRDF、TOA/SR、Planck/亮温、主动/被动微波、土壤水分、冠层、前向模型、反演和传感器定标。其来源支持范围与教学简化均分别标注，不视为完整课程或已完成 ATBD 审读。
- 十项标准条目新建/编辑、同名提醒、个人笔记和学习自评。
- 内置来源登记、资料入库/模型对比/科研问题模板。
- Planck 温度滑块、固定坐标光谱、CSV 导出、标准库 Python 实验。
- 新增 `data/remote-sensing/physics_demos.py`，包含辐射量半球积分、大气透过率/路径辐射、BRDF 方向性和土壤水分—介电—微波亮温四组可运行教学实验。

## 本轮整理基线

- `docs/remote-sensing/内容审计与修订清单.md` 记录现有三条目、九个空缺板块、证据门槛和首批八主题顺序。
- `docs/remote-sensing/符号、单位与几何约定.md` 统一辐射量、光谱域、几何方向、极化、温度量和前向模型记号；外部来源的原始约定仍需保留。
- `docs/remote-sensing/资料/来源登记.md` 将已核验来源与教材、官方 ATBD、经典论文候选队列分开，避免把“已定位”误写成“已阅读全文”。

## 内容与个人数据

`data/remote-sensing/catalog.json` 是网站主题、内置条目和来源登记的内容主文件。新增内置内容须保留稳定 ID、来源范围及关联关系；先运行 `npm run check:remote-sensing`。

`docs/remote-sensing/` 保存知识地图、工作约定和维护模板，随构建发布。此处是原独立 Markdown 资料库整合后的维护位置，不在两个位置平行编辑。

个人数据存于现有 `state.remoteSensing`：

```json
{ "entries": [], "records": {} }
```

内置条目随网站更新；个人条目使用 `USR-` 编号。记录按稳定条目 ID 保存 `note`、`level` 和 `updated`。它们使用现有 StudyStorage 的 IndexedDB/localStorage 回退，并包含在完整学习数据导出中；清空全部数据也会清空个人遥感数据。

单独备份的格式是 `kind: zhixing-remote-sensing`、`schemaVersion: 1`、`remoteSensing: { entries, records }`。导入也接受本站完整备份里的 `state.remoteSensing`。先验证全量内容，展示新增与冲突数量，再由用户应用。相同 ID 保留本机条目或整条笔记记录；不覆盖内置内容。冲突不代表资料已交叉验证，应结合原备份人工对比。同 ID 缺失的条目记录会保留，以兼容后续内容版本。

导入上限 20 MB；所有个人文本按纯文本安全显示，不执行 HTML。Markdown 导出包含所有内置与个人条目、关联来源、笔记和自评，可交给 Agent 整理。网页不自动解析 PDF、不运行 Python、也不会把本机个人数据提交至仓库。

公式使用随站点分发的 KaTeX 0.16.22 排版，支持 `\[...\]`、`$$...$$` 和 `\(...\)`；保留 LaTeX 文本用于导出。渲染启用非信任模式与表达式大小限制。依赖来源与 MIT 许可见 `vendor/katex/`。

## 运行和验证

```powershell
npm test
npm run build
python data/remote-sensing/planck_demo.py --output-dir tmp/planck-check
python data/remote-sensing/physics_demos.py --demo all --output-dir tmp/physics-check
```

数值检查包括 300 K、10 μm 处的辐射值、温度单调性、波长谱峰、前端滑块全范围的纵轴覆盖；物理实验检查半球积分、透过率极限、BRDF 方向性和微波亮温单调性；数据检查包括无效备份拒绝、冲突保留、重复导入和 Markdown 完整性。

Python Demo 只生成 CSV，用户可用任意绘图工具继续分析。它忽略大气、发射率与传感器响应，不能直接用于卫星 LST 反演。
