# Project workflow

- 不安装、启用、加载或调用 sol-advisor、gpt-5.6-instruct（含相关 unrestricted prompts），除非用户明确重新授权；不沿用其旧模型限制或自动代理分工。
- 维护遥感物理模块时先读取 `docs/remote-sensing/AGENTS.md`。网站内置内容以 `data/remote-sensing/catalog.json` 为主；模板和知识地图位于 `docs/remote-sensing/`。
- 个人条目、笔记、自评存于浏览器本地，不作为内置内容提交。旧学习数据迁移须保留其他学科学习记录。
- 运行 `npm test` 与 `npm run build`；遥感数值实验另运行 `python data/remote-sensing/planck_demo.py --output-dir tmp/planck-check`。
