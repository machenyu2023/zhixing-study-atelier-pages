# 题库扩充规范

题库批量导入使用 JSON 文件。参考 `data/question-banks/example-bank.json`。

## 顶层结构

- `schemaVersion`: 当前为 `1`。
- `bank`: 题库元数据，至少包含唯一 `id`、标题和版本。
- `questions`: 题目数组。

## 选择题

必须包含 `id`、`type: "choice"`、`subject`、`topic`、`question`、`options`、`answer` 和 `explanation`。`answer` 是从 0 开始的选项索引。

## 开放题

必须包含 `id`、`type: "open"`、`subject`、`topic`、`taskType`、`question`、至少三项 `checkpoints`，并建议设置 `wordTarget`。阅读理解题可以增加 `passage`。

## 扩充策略

1. 一个主题模块优先包含材料阅读、概念或论证简答、微写作三类题。
2. 选择题用于可客观判分的知识；价值判断和论证训练使用开放题。
3. 每道题应有稳定且不重复的 `id`，不要用数组序号作为长期标识。
4. 新题先以独立 JSON 题库导入和试做，通过后再合入内置题库。
5. 批量生成题目时，至少抽查重复率、答案索引、材料与题干对应关系，以及评分检查点是否可观察。
