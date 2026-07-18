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

## 填空题

必须包含 `id`、`type: "fill"`、`subject`、`topic`、`question`、非空 `answers` 数组和 `explanation`。`answers` 可以列出多个等价写法，例如 `["10", "x=10"]`。

数值题可以设置非负的 `numericTolerance`。例如标准答案为 `0.333333`、容差为 `0.000001` 时，系统会按数值差判断；未设置容差时按去除空白、统一大小写后的文本精确匹配。

## 来源与版权字段

进入仓库的内置题库必须在 `bank` 和题目层保留 `source` 与 `license`。第三方内容还应记录来源 URL、作者或机构、修改说明。许可不明、需要登录或付费才能访问、以及受版权保护的考试真题不得进入公开题库。

仅参考考试题型但不复制题面的原创题，应额外设置：

- `sourceUrl`: 官方考试结构或题型说明页；
- `referenceOnly: true`: 链接只作为格式依据；
- `officialQuestionTextCopied: false`: 没有复制官方题干、文章、选项或答案。

`data/question-banks/ielts-original-bank.json` 是完整示例。它的文章、transcript、题目和解析全部使用英语，并由生成脚本检查中文字符、重复题干、重复选项、答案索引和开放题评分检查点。

## 扩充策略

1. 一个主题模块优先包含材料阅读、概念或论证简答、微写作三类题。
2. 选择题和填空题用于可客观判分的知识；价值判断和论证训练使用开放题。
3. 每道题应有稳定且不重复的 `id`，不要用数组序号作为长期标识。
4. 新题先以独立 JSON 题库导入和试做，通过后再合入内置题库。
5. 批量生成题目时，至少抽查重复率、答案索引、材料与题干对应关系，以及评分检查点是否可观察。
6. 参数化数学题必须保存推导式解析，并用独立计算重新核对答案与容差。
