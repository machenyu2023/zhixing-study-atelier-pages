import { writeFile } from "node:fs/promises";

const output = new URL("../data/question-banks/advanced-math-solution-bank.json", import.meta.url);
const SOURCE = "知行原创高阶数学详解题库 v1";
const LICENSE = "Project Original - personal study use";
const questions = [];

function round(value, digits = 6) {
  const result = Number(value.toFixed(digits));
  return Object.is(result, -0) ? 0 : result;
}

function numberText(value) {
  return String(round(value, 6));
}

function arithmeticAtom(value) {
  const text = numberText(value);
  return value < 0 ? `(${text})` : text;
}

function subtractTerm(left, value, suffix = "") {
  if (value === 0) return left;
  return `${left}${value < 0 ? "+" : "-"}${numberText(Math.abs(value))}${suffix}`;
}

function signedTerm(value, suffix = "") {
  if (value === 0) return "";
  return `${value < 0 ? "-" : "+"}${numberText(Math.abs(value))}${suffix}`;
}

function rotateOptions(correct, distractors, seed) {
  const options = [correct, ...distractors];
  if (new Set(options).size !== options.length) throw new Error(`Duplicate option around: ${correct}`);
  const shift = seed % options.length;
  const rotated = options.slice(shift).concat(options.slice(0, shift));
  return { options: rotated, answer: rotated.indexOf(correct) };
}

function metadata(index) {
  return {
    difficulty: index <= 4 ? "进阶" : "挑战",
    source: SOURCE,
    license: LICENSE,
    qualityTier: "solution-rich"
  };
}

function addChoice({ id, topic, question, correct, distractors, steps, index }) {
  const keyed = rotateOptions(correct, distractors, index);
  questions.push({
    id,
    type: "choice",
    subject: "math",
    topic,
    taskType: "选择题 · 标准详解",
    question,
    ...keyed,
    referenceAnswer: correct,
    solutionSteps: steps,
    explanation: steps.join(" "),
    ...metadata(index)
  });
}

function addFill({ id, topic, question, answers, referenceAnswer, steps, index, tolerance = 0.000001 }) {
  questions.push({
    id,
    type: "fill",
    subject: "math",
    topic,
    taskType: "计算填空 · 标准详解",
    question,
    answers: [...new Set(answers.map(String))],
    numericTolerance: tolerance,
    referenceAnswer,
    solutionSteps: steps,
    explanation: steps.join(" "),
    ...metadata(index)
  });
}

function addOpen({ id, topic, question, referenceAnswer, steps, checkpoints, index }) {
  questions.push({
    id,
    type: "open",
    subject: "math",
    topic,
    taskType: "证明与推导",
    question,
    referenceAnswer,
    solutionSteps: steps,
    checkpoints,
    explanation: referenceAnswer,
    minimumResponseUnits: 5,
    wordTarget: 180,
    ...metadata(index)
  });
}

// Optimization: convexity, KKT systems, proximal maps, iterative methods and proofs.
for (let index = 1; index <= 10; index += 1) {
  let a, b, c, correct, conclusion;
  if (index % 3 === 1) {
    a = index + 2; b = index + 4; c = 1;
    correct = "严格凸";
    conclusion = "两个顺序主子式都为正，H 正定。";
  } else if (index % 3 === 2) {
    a = index + 1; b = index + 1; c = index + 2;
    correct = "非凸";
    conclusion = "det(H)<0，H 不定。";
  } else {
    a = index + 1; b = index + 1; c = index + 1;
    correct = "凸但非严格凸";
    conclusion = "H 半正定但 det(H)=0。";
  }
  const determinant = a * b - c * c;
  addChoice({ id: `math-opt-hessian-${index}`, topic: "优化 · Hessian 与凸性", question: `函数 f 的 Hessian 恒为 H=[[${a},${c}],[${c},${b}]]。f 应归入哪一类？`, correct, distractors: ["严格凸", "凸但非严格凸", "非凸", "仅凭 Hessian 无法判断"].filter(item => item !== correct), steps: [`计算 det(H)=${a}×${b}-${c}²=${determinant}。`, conclusion], index });
}

for (let index = 1; index <= 10; index += 1) {
  const u = index - 5;
  const lower = index % 4;
  const optimum = Math.max(u, lower);
  const multiplier = optimum === lower ? 2 * (lower - u) : 0;
  const correct = `(x*, λ*)=(${optimum}, ${multiplier})`;
  const centeredX = subtractTerm("x", u);
  addChoice({ id: `math-opt-kkt-pair-${index}`, topic: "优化 · KKT 条件", question: `求 min (${centeredX})²，约束 x≥${lower}。采用 g(x)=${lower}-x≤0 和乘子 λ≥0，哪组 KKT 解正确？`, correct, distractors: [`(x*, λ*)=(${optimum}, ${-multiplier - 1})`, `(x*, λ*)=(${optimum + 1}, ${multiplier})`, `(x*, λ*)=(${lower - 1}, 0)`], steps: [`无约束极小点为 x=${u}，投影到 [${lower},∞) 得 x*=${optimum}。`, `驻点条件 2(${centeredX})-λ=0 给出 λ*=${multiplier}，并满足互补松弛。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const lipschitz = index + 2;
  const correct = `0<η<${numberText(2 / lipschitz)}`;
  addChoice({ id: `math-opt-gd-stability-${index}`, topic: "优化 · 梯度下降稳定性", question: `对 f(x)=(${lipschitz}/2)x² 使用常数步长梯度下降。要使任意初值都收敛到 0，η 的精确范围是什么？`, correct, distractors: [`0<η<${numberText(1 / lipschitz)}`, `η>${numberText(2 / lipschitz)}`, "任意 η>0 均可"], steps: [`迭代为 xₖ₊₁=(1-${lipschitz}η)xₖ。`, `收敛当且仅当 |1-${lipschitz}η|<1，即 ${correct}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const v = index + 5;
  const lambda = index % 3 + 1;
  const answer = v - lambda;
  const correct = `x*=${answer}`;
  addChoice({ id: `math-opt-prox-l1-${index}`, topic: "优化 · 近端算子", question: `求 prox_{${lambda}|·|}(${v})，即 minₓ ½(x-${v})²+${lambda}|x| 的解。`, correct, distractors: [`x*=${round(v / (1 + lambda), 6)}`, `x*=${v + lambda}`, "x*=0"], steps: [`L1 范数的近端映射是软阈值 sign(v)max(|v|-λ,0)。`, `这里 v=${v}>λ=${lambda}，所以 x*=${v}-${lambda}=${answer}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const a = index + 2;
  const b = 2 * (index - 4);
  const x0 = index - 6;
  const answer = round(b / a, 6);
  const objective = `½·${a}x²${signedTerm(-b, "x")}`;
  const derivative = `${a}x${signedTerm(-b)}`;
  addFill({ id: `math-opt-exact-step-${index}`, topic: "优化 · 精确线搜索", question: `对 f(x)=${objective}，从 x₀=${x0} 沿负梯度方向做精确线搜索。求更新后的 x₁，保留 6 位小数。`, answers: [numberText(answer)], referenceAnswer: `x₁=${numberText(answer)}`, steps: [`f'(x)=${derivative}，一维二次函数沿负梯度精确线搜索会在一步到达驻点。`, `令 f'(x₁)=0，得 x₁=${arithmeticAtom(b)}/${a}=${numberText(answer)}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const lower = -index;
  const upper = index + 2;
  const x0 = index - 3;
  const gradient = 2 * index + 1;
  const eta = 0.5;
  const raw = x0 - eta * gradient;
  const answer = Math.max(lower, Math.min(upper, raw));
  addFill({ id: `math-opt-projected-step-${index}`, topic: "优化 · 投影梯度", question: `在区间 [${lower},${upper}] 上做一步投影梯度：x₀=${x0}，梯度 g₀=${gradient}，η=${eta}。求 x₁。`, answers: [numberText(answer)], referenceAnswer: `x₁=${numberText(answer)}`, steps: [`先做无约束步：x₀-ηg₀=${x0}-${eta}×${gradient}=${numberText(raw)}。`, `再投影到 [${lower},${upper}]，得到 x₁=${numberText(answer)}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const a = index + 1;
  const b = index + 3;
  const sum = index + 4;
  const x = b * sum / (a + b);
  const y = a * sum / (a + b);
  const answer = round(a * b * sum * sum / (a + b), 6);
  addFill({ id: `math-opt-weighted-lagrange-${index}`, topic: "优化 · Lagrange 乘子", question: `求 min ${a}x²+${b}y²，约束 x+y=${sum} 时的最小目标值，保留 6 位小数。`, answers: [numberText(answer)], referenceAnswer: `最小值=${numberText(answer)}`, steps: [`驻点条件给出 2${a}x+λ=0、2${b}y+λ=0，因此 ${a}x=${b}y。`, `结合 x+y=${sum} 得 x=${numberText(x)}、y=${numberText(y)}。`, `代回目标函数得 ${numberText(answer)}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const parameter = index;
  const x0 = index + 1;
  const numerator = x0 ** 3 - parameter * x0;
  const denominator = 3 * x0 * x0 - parameter;
  const answer = round(x0 - numerator / denominator, 6);
  addFill({ id: `math-opt-newton-${index}`, topic: "优化 · Newton 法", question: `令 f(x)=x⁴/4-${parameter}x²/2，从 x₀=${x0} 对驻点方程 f'(x)=0 做一步 Newton 更新。求 x₁，保留 6 位小数。`, answers: [numberText(answer)], referenceAnswer: `x₁=${numberText(answer)}`, steps: [`f'(x)=x³-${parameter}x，f''(x)=3x²-${parameter}。`, `x₁=x₀-f'(x₀)/f''(x₀)=${x0}-${numerator}/${denominator}=${numberText(answer)}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const a = index + 3;
  const b = index + 5;
  const limit = index + 2;
  const multiplier = a + b - limit;
  const x = round(a - multiplier / 2, 6);
  const y = round(b - multiplier / 2, 6);
  const referenceAnswer = `最优解为 (x*,y*)=(${x},${y})，乘子 λ*=${multiplier}，约束在最优点处取等号。`;
  addOpen({ id: `math-opt-kkt-derivation-${index}`, topic: "优化 · KKT 推导", question: `完整求解并验证 KKT 条件：min (x-${a})²+(y-${b})²，约束 x+y≤${limit}。`, referenceAnswer, steps: [`拉格朗日函数 L=(x-${a})²+(y-${b})²+λ(x+y-${limit})。`, `无约束点的坐标和 ${a + b}>${limit}，故约束活跃。驻点条件给出 x=${a}-λ/2、y=${b}-λ/2。`, `代入 x+y=${limit} 得 λ=${multiplier}，从而 (x*,y*)=(${x},${y})。`, "目标严格凸且约束凸，因此满足 KKT 的点是唯一全局最优解。"], checkpoints: ["正确写出拉格朗日函数和乘子符号", "判断约束在最优点处活跃", "联立驻点与互补松弛求出解", "说明凸性为何保证全局最优"], index });
}

for (let index = 1; index <= 10; index += 1) {
  const mu = index + 1;
  const lipschitz = index + 5;
  const factor = round(1 - mu / lipschitz, 6);
  const referenceAnswer = `最优点为 x*=0。取 η=1/${lipschitz} 时，坐标迭代因子分别为 ${factor} 与 0，故 ||xₖ||₂≤${factor}^k||x₀||₂。`;
  addOpen({ id: `math-opt-rate-proof-${index}`, topic: "优化 · 强凸收敛率", question: `设 f(x₁,x₂)=½(${mu}x₁²+${lipschitz}x₂²)。取 η=1/${lipschitz} 做梯度下降。推导迭代矩阵并给出线性收敛界。`, referenceAnswer, steps: [`∇f(x)=diag(${mu},${lipschitz})x，所以 xₖ₊₁=[I-ηdiag(${mu},${lipschitz})]xₖ。`, `迭代矩阵为 diag(${factor},0)。`, `其谱范数为 ${factor}<1，因此 ||xₖ||₂≤${factor}^k||x₀||₂。`], checkpoints: ["写出梯度和迭代矩阵", "计算两个特征方向上的收缩因子", "用谱范数给出误差界", "指出强凸参数与光滑参数的作用"], index });
}

// Matrix theory: definiteness, Jordan structure, projections, singular values and least squares.
for (let index = 1; index <= 10; index += 1) {
  const a = index + 2;
  const b = index + 5;
  const c = index % 2 ? 1 : index + 4;
  const determinant = a * b - c * c;
  const correct = determinant > 0 ? "正定" : determinant < 0 ? "不定" : "半正定";
  addChoice({ id: `math-matrix-sylvester-${index}`, topic: "矩阵论 · 正定性", question: `实对称矩阵 A=[[${a},${c}],[${c},${b}]] 的惯性类型是什么？`, correct, distractors: ["正定", "半正定", "不定", "负定"].filter(item => item !== correct), steps: [`第一顺序主子式为 ${a}>0，det(A)=${determinant}。`, determinant > 0 ? "由 Sylvester 判据，A 正定。" : determinant < 0 ? "行列式为负，两个特征值异号，A 不定。" : "行列式为零且迹为正，A 半正定。"], index });
}

for (let index = 1; index <= 10; index += 1) {
  const eigenvalue = index - 5;
  const polynomialFactor = `(${subtractTerm("t", eigenvalue)})`;
  const nilpotentPart = subtractTerm("A", eigenvalue, "I");
  const correct = `${polynomialFactor}³`;
  addChoice({ id: `math-matrix-minimal-polynomial-${index}`, topic: "矩阵论 · Jordan 标准形", question: `A=[[${eigenvalue},1,0],[0,${eigenvalue},1],[0,0,${eigenvalue}]]。A 的最小多项式是什么？`, correct, distractors: [polynomialFactor, `${polynomialFactor}²`, `${polynomialFactor}⁴`], steps: [`${nilpotentPart} 是 3 阶幂零 Jordan 块。`, `(${nilpotentPart})²≠0 而 (${nilpotentPart})³=0，所以最小多项式为 ${correct}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const p = index;
  const q = index + 1;
  addChoice({ id: `math-matrix-projection-rank-${index}`, topic: "矩阵论 · 正交投影", question: `令 v=(${p},${q})ᵀ，P=vvᵀ/(vᵀv)。矩阵 P 的秩是多少？`, correct: "1", distractors: ["0", "2", `${p * p + q * q}`], steps: ["P 把任意向量正交投影到 span(v)。", "v≠0，因此像空间是一维，rank(P)=1；同时 P²=P。"], index });
}

for (let index = 1; index <= 10; index += 1) {
  const norm = round(Math.sqrt(index * index + 1) * Math.sqrt(5), 6);
  addChoice({ id: `math-matrix-rank-one-norm-${index}`, topic: "矩阵论 · SVD 与谱范数", question: `设 u=(${index},1)ᵀ、v=(1,2)ᵀ，A=uvᵀ。A 的谱范数是多少？结果保留 6 位小数。`, correct: numberText(norm), distractors: [numberText(norm + 1), numberText(Math.sqrt(index * index + 1)), "-1"], steps: ["秩一矩阵 uvᵀ 只有一个非零奇异值 ||u||₂||v||₂。", `因此 ||A||₂=√(${index}²+1)·√5=${numberText(norm)}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const a = index - 2;
  const b = index % 2 ? index + 1 : -(index + 1);
  const answer = a + Math.abs(b);
  addFill({ id: `math-matrix-symmetric-eigen-${index}`, topic: "矩阵论 · 特征值", question: `求 A=[[${a},${b}],[${b},${a}]] 的最大特征值。`, answers: [numberText(answer)], referenceAnswer: `λmax=${answer}`, steps: [`特征向量 (1,1)ᵀ 与 (1,-1)ᵀ 对应特征值 a+b 和 a-b。`, `最大者为 a+|b|=${a}+${Math.abs(b)}=${answer}。`], index, tolerance: 0 });
}

for (let index = 1; index <= 10; index += 1) {
  const d1 = index + 1, d2 = index + 2, d3 = index + 3;
  const answer = d1 * d2 * d3;
  addFill({ id: `math-matrix-triangular-det-${index}`, topic: "矩阵论 · 行列式", question: `上三角矩阵 A=[[${d1},${index},1],[0,${d2},${index + 1}],[0,0,${d3}]] 的 det(A) 是多少？`, answers: [String(answer)], referenceAnswer: `det(A)=${answer}`, steps: ["三角矩阵的行列式等于所有对角元之积。", `det(A)=${d1}×${d2}×${d3}=${answer}。`], index, tolerance: 0 });
}

for (let index = 1; index <= 10; index += 1) {
  const lambda = index % 3 + 1;
  const power = index + 2;
  const answer = power * lambda ** (power - 1);
  addFill({ id: `math-matrix-jordan-power-${index}`, topic: "矩阵论 · 矩阵函数", question: `J=[[${lambda},1],[0,${lambda}]]。求 J^${power} 的 (1,2) 元。`, answers: [String(answer)], referenceAnswer: `(J^${power})₁₂=${answer}`, steps: [`写 J=${lambda}I+N，其中 N²=0。`, `二项展开只保留前两项：J^n=${lambda}^nI+n${lambda}^{n-1}N。`, `故 (1,2) 元为 ${power}×${lambda}^${power - 1}=${answer}。`], index, tolerance: 0 });
}

for (let index = 1; index <= 10; index += 1) {
  const diagonal = [index + 1, 2 * index + 3, 3 * index + 5];
  const answer = round(Math.max(...diagonal) / Math.min(...diagonal), 6);
  addFill({ id: `math-matrix-condition-number-${index}`, topic: "矩阵论 · 条件数", question: `正定对角矩阵 A=diag(${diagonal.join(",")}) 的 2-范数条件数 κ₂(A) 是多少？`, answers: [numberText(answer)], referenceAnswer: `κ₂(A)=${numberText(answer)}`, steps: ["正定对角矩阵的奇异值就是正对角元。", `κ₂(A)=σmax/σmin=${Math.max(...diagonal)}/${Math.min(...diagonal)}=${numberText(answer)}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const a = index - 3;
  const b = index + 1;
  const lambdaPlus = a + b;
  const lambdaMinus = a - b;
  const referenceAnswer = `特征值为 ${lambdaPlus} 与 ${lambdaMinus}；对应单位特征向量可取 q₁=(1,1)ᵀ/√2、q₂=(1,-1)ᵀ/√2，因此 A=Qdiag(${lambdaPlus},${lambdaMinus})Qᵀ。`;
  addOpen({ id: `math-matrix-spectral-decomposition-${index}`, topic: "矩阵论 · 谱分解", question: `对 A=[[${a},${b}],[${b},${a}]] 求完整谱分解，并说明为何特征向量可以正交归一。`, referenceAnswer, steps: [`由对称结构，(1,1)ᵀ 和 (1,-1)ᵀ 分别给出特征值 ${lambdaPlus}、${lambdaMinus}。`, "两向量正交，归一化后组成正交矩阵 Q。", `由实对称矩阵谱定理，A=QΛQᵀ。`], checkpoints: ["正确求出两个特征值", "给出并归一化特征向量", "写出 QΛQᵀ", "说明实对称性与正交对角化的关系"], index });
}

for (let index = 1; index <= 10; index += 1) {
  const intercept = index - 4;
  const slope = index + 1;
  const residual = index % 3 + 1;
  const y = [intercept + residual, intercept + slope - 2 * residual, intercept + 2 * slope + residual];
  const referenceAnswer = `最小二乘直线为 y=${intercept}+${slope}x。残差向量为 (${residual},${-2 * residual},${residual})ᵀ，并与设计矩阵的两列正交。`;
  addOpen({ id: `math-matrix-least-squares-${index}`, topic: "矩阵论 · 最小二乘", question: `对数据点 (0,${y[0]})、(1,${y[1]})、(2,${y[2]})，用正规方程求最小二乘直线 y=β₀+β₁x，并验证残差正交性。`, referenceAnswer, steps: ["设计矩阵 X 的两列为 (1,1,1)ᵀ 与 (0,1,2)ᵀ。", `构造的残差 r=(${residual},${-2 * residual},${residual})ᵀ 满足 Xᵀr=0。`, `因此 β=(${intercept},${slope})ᵀ 满足 XᵀXβ=Xᵀy，是唯一最小二乘解。`], checkpoints: ["正确写出设计矩阵和正规方程", "求出截距与斜率", "计算残差向量", "验证 Xᵀr=0"], index });
}

// Stochastic processes: Markov chains, Poisson processes, martingales, Brownian motion and AR models.
for (let index = 1; index <= 10; index += 1) {
  const p = round(index / 20 + 0.05, 2);
  const q = round((11 - index) / 20 + 0.05, 2);
  const pi1 = round(p / (p + q), 6);
  addChoice({ id: `math-stochastic-stationary-${index}`, topic: "随机过程 · 平稳分布", question: `两状态链 P=[[${round(1 - p, 2)},${p}],[${q},${round(1 - q, 2)}]]。平稳分布中 π₁ 是多少？`, correct: numberText(pi1), distractors: [numberText(q / (p + q)), numberText(p * q), numberText(1 - p)], steps: ["平衡方程为 π₀p=π₁q，且 π₀+π₁=1。", `解得 π₁=p/(p+q)=${p}/(${p}+${q})=${numberText(pi1)}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const totalTime = index + 5;
  const partialTime = index + 1;
  const count = index + 3;
  const probability = round(partialTime / totalTime, 6);
  const correct = `Binomial(${count}, ${probability})`;
  addChoice({ id: `math-stochastic-poisson-conditional-${index}`, topic: "随机过程 · Poisson 过程", question: `已知齐次 Poisson 过程满足 N(${totalTime})=${count}。条件分布 N(${partialTime})|N(${totalTime})=${count} 是什么？`, correct, distractors: [`Poisson(${numberText(count * probability)})`, `Binomial(${count + 1}, ${probability})`, `Normal(${count}, ${probability})`], steps: ["给定总区间内事件数后，各事件时刻在区间内均匀分布。", `落在前 ${partialTime}/${totalTime} 区间的个数服从 ${correct}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const variance = index + 1;
  const correct = `Sₙ²-${variance}n`;
  addChoice({ id: `math-stochastic-square-martingale-${index}`, topic: "随机过程 · 鞅", question: `设 Sₙ=ξ₁+...+ξₙ，ξᵢ 独立同分布、Eξᵢ=0、Var(ξᵢ)=${variance}。下列哪个过程是鞅？`, correct, distractors: [`Sₙ²+${variance}n`, `Sₙ-${variance}n`, "|Sₙ|"], steps: [`E[Sₙ₊₁²|Fₙ]=Sₙ²+E[ξₙ₊₁²]=Sₙ²+${variance}。`, `减去 ${variance}(n+1) 后条件期望回到 ${correct}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const totalTime = index + 5;
  const time = index;
  const endpoint = index - 4;
  const answer = round(time / totalTime * endpoint, 6);
  addChoice({ id: `math-stochastic-brownian-bridge-${index}`, topic: "随机过程 · Brownian motion", question: `标准 Brownian motion 已知 B(${totalTime})=${endpoint}。E[B(${time})|B(${totalTime})=${endpoint}] 等于多少？`, correct: numberText(answer), distractors: [numberText(answer + 1), numberText(answer - 1), "不存在条件期望"], steps: ["(B(t),B(T)) 联合正态，Cov(B(t),B(T))=t。", `条件均值为 (t/T)B(T)=(${time}/${totalTime})×${arithmeticAtom(endpoint)}=${numberText(answer)}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const lambda = index / 5 + 0.5;
  const time = index / 4 + 0.5;
  const answer = round(Math.exp(-lambda * time), 6);
  addFill({ id: `math-stochastic-waiting-time-${index}`, topic: "随机过程 · 等待时间", question: `强度 λ=${numberText(lambda)} 的 Poisson 过程中，首次到达时间 T₁ 满足 P(T₁>${numberText(time)}) 多少？保留 6 位小数。`, answers: [numberText(answer)], referenceAnswer: `P(T₁>${numberText(time)})=${numberText(answer)}`, steps: ["T₁ 服从 rate 为 λ 的指数分布。", `生存函数 P(T₁>t)=e^{-λt}=e^{-${numberText(lambda)}×${numberText(time)}}=${numberText(answer)}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const p = round(index / 20 + 0.1, 2);
  const q = round((index % 5 + 1) / 10, 2);
  const answer = round(p * (2 - p - q), 6);
  addFill({ id: `math-stochastic-two-step-${index}`, topic: "随机过程 · Markov 链", question: `P=[[${round(1 - p, 2)},${p}],[${q},${round(1 - q, 2)}]]。从状态 0 出发，两步后到状态 1 的概率是多少？`, answers: [numberText(answer)], referenceAnswer: `(P²)₀₁=${numberText(answer)}`, steps: [`(P²)₀₁=P₀₀P₀₁+P₀₁P₁₁。`, `=(1-${p})${p}+${p}(1-${q})=${numberText(answer)}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const rho = round((index - 5) / 10, 1);
  const variance = index + 1;
  const lag = index % 3 + 1;
  const answer = round(variance * rho ** lag / (1 - rho * rho), 6);
  addFill({ id: `math-stochastic-ar1-cov-${index}`, topic: "随机过程 · 平稳 AR(1)", question: `Xₜ=${rho}Xₜ₋₁+εₜ，Var(εₜ)=${variance}。若过程平稳，求 γ(${lag})，保留 6 位小数。`, answers: [numberText(answer)], referenceAnswer: `γ(${lag})=${numberText(answer)}`, steps: [`平稳方差 γ(0)=${variance}/(1-${arithmeticAtom(rho)}²)。`, `AR(1) 自协方差 γ(k)=ρ^kγ(0)，故 γ(${lag})=${numberText(answer)}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const left1 = index;
  const right1 = index + 3;
  const left2 = index + 1;
  const right2 = index + 4;
  const answer = 2;
  addFill({ id: `math-stochastic-brownian-increment-cov-${index}`, topic: "随机过程 · Brownian motion", question: `求 Cov(B(${right1})-B(${left1}), B(${right2})-B(${left2}))。`, answers: [String(answer)], referenceAnswer: `协方差=${answer}`, steps: ["Brownian 增量的协方差等于两个时间区间交集的长度。", `区间 [${left1},${right1}] 与 [${left2},${right2}] 的交集为 [${left2},${right1}]，长度 ${answer}。`], index, tolerance: 0 });
}

for (let index = 1; index <= 10; index += 1) {
  const alpha = index + 1;
  const beta = index + 3;
  const total = alpha + beta;
  const referenceAnswer = `平稳分布为 (π₀,π₁)=(${beta}/${total},${alpha}/${total})；并且 P₀₀(t)=${beta}/${total}+${alpha}/${total}e^{-${total}t}。`;
  addOpen({ id: `math-stochastic-ctmc-${index}`, topic: "随机过程 · 连续时间 Markov 链", question: `两状态连续时间链的生成矩阵 Q=[[-${alpha},${alpha}],[${beta},-${beta}]]。求平稳分布，并从 Kolmogorov 方程推导 P₀₀(t)。`, referenceAnswer, steps: [`由 πQ=0 得 π₀${alpha}=π₁${beta}，结合归一化得到 π₀=${beta}/${total}、π₁=${alpha}/${total}。`, `令 p(t)=P₀₀(t)，前向方程为 p'(t)=${beta}-${total}p(t)，p(0)=1。`, `解得 p(t)=${beta}/${total}+${alpha}/${total}e^{-${total}t}。`], checkpoints: ["正确写出平衡方程", "求出归一化平稳分布", "建立 P₀₀ 的微分方程", "使用初值求出显式解"], index });
}

for (let index = 1; index <= 10; index += 1) {
  const lambda = index + 1;
  const s = index / 2;
  const t = s + 2;
  const referenceAnswer = `M(t)=N(t)-${lambda}t 是鞅，且 E[M(${numberText(t)})|F_${numberText(s)}]=M(${numberText(s)})=N(${numberText(s)})-${numberText(lambda * s)}。`;
  addOpen({ id: `math-stochastic-poisson-martingale-${index}`, topic: "随机过程 · 补偿过程", question: `设 N(t) 是强度 ${lambda} 的 Poisson 过程。证明 M(t)=N(t)-${lambda}t 关于自然滤过是鞅，并计算 E[M(${numberText(t)})|F_${numberText(s)}]。`, referenceAnswer, steps: [`写 N(t)=N(s)+[N(t)-N(s)]。`, `独立平稳增量给出 E[N(t)-N(s)|F_s]=${lambda}(t-s)。`, `因此 E[M(t)|F_s]=N(s)+${lambda}(t-s)-${lambda}t=N(s)-${lambda}s=M(s)。`], checkpoints: ["使用 Poisson 过程的独立增量", "正确计算增量条件期望", "验证适应性与可积性", "得到 E[M(t)|F_s]=M(s)"], index });
}

// Advanced probability: convergence, conditional inequalities, transforms, limit theorems and Gaussian conditioning.
for (let index = 1; index <= 10; index += 1) {
  const constant = index + 1;
  addChoice({ id: `math-prob-indicator-convergence-${index}`, topic: "高等概率论 · 收敛方式", question: `令 U~Uniform(0,1)，对 n≥${constant} 定义 Xₙ=1{U≤${constant}/n}。关于 Xₙ→0，哪项最准确？`, correct: "几乎处处收敛，因而也依概率收敛", distractors: ["只依分布收敛，不依概率收敛", "在 L² 中不收敛", "对每个样本点都从第一项起等于 0"], steps: [`事件 {U≤${constant}/n} 随 n 递减到 {U=0}。`, "P(U=0)=0，所以 Xₙ→0 几乎处处；且 E[Xₙ²]=P(U≤c/n)→0。"], index });
}

for (let index = 1; index <= 10; index += 1) {
  const power = index + 1;
  const correct = `|E[X|G]|^${power}≤E[|X|^${power}|G]`;
  addChoice({ id: `math-prob-conditional-jensen-${index}`, topic: "高等概率论 · 条件期望", question: `设 E|X|^${power}<∞。由条件 Jensen 不等式可直接得到哪一式？`, correct, distractors: [`|E[X|G]|^${power}≥E[|X|^${power}|G]`, `E[X|G]=X`, `E[|X|^${power}|G]=|EX|^${power}`], steps: [`φ(x)=|x|^${power} 是凸函数。`, `条件 Jensen 给出 φ(E[X|G])≤E[φ(X)|G]，即 ${correct}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const varianceX = index + 1;
  const varianceY = 2 * index + 1;
  const variance = varianceX + varianceY;
  const correct = `exp(-${variance}t²/2)`;
  addChoice({ id: `math-prob-characteristic-sum-${index}`, topic: "高等概率论 · 特征函数", question: `独立 X~N(0,${varianceX})、Y~N(0,${varianceY})。X+Y 的特征函数是什么？`, correct, distractors: [`exp(-${varianceX * varianceY}t²/2)`, `exp(${variance}t²/2)`, `exp(-${variance}t/2)`], steps: ["独立和的特征函数等于特征函数乘积。", `方差相加为 ${variance}，故 φ_{X+Y}(t)=${correct}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const alpha = round(index / 5, 1);
  const correct = alpha > 1 ? "P(Aₙ i.o.)=0" : "P(Aₙ i.o.)=1";
  addChoice({ id: `math-prob-borel-series-${index}`, topic: "高等概率论 · Borel-Cantelli", question: `事件 Aₙ 相互独立，且 P(Aₙ)=1/n^${alpha}。关于无穷多次发生事件 Aₙ i.o.，结论是什么？`, correct, distractors: ["P(Aₙ i.o.)=0", "P(Aₙ i.o.)=1", "概率一定为 1/2", "仅由给定条件无法判断"].filter(item => item !== correct), steps: [`p-级数 ∑1/n^${alpha} ${alpha > 1 ? "收敛" : "发散"}。`, alpha > 1 ? "由第一 Borel-Cantelli 引理，几乎必然只发生有限次。" : "再利用独立性和第二 Borel-Cantelli 引理，几乎必然发生无穷多次。"], index });
}

for (let index = 1; index <= 10; index += 1) {
  const p = round(index / 20 + 0.2, 2);
  const mean1 = index + 2;
  const mean0 = 2 - index;
  const answer = round(p * mean1 + (1 - p) * mean0, 6);
  addFill({ id: `math-prob-total-expectation-${index}`, topic: "高等概率论 · 全期望公式", question: `P(H)=${p}，E[X|H]=${mean1}，E[X|Hᶜ]=${mean0}。求 E[X]。`, answers: [numberText(answer)], referenceAnswer: `E[X]=${numberText(answer)}`, steps: ["按事件 H 分解全期望。", `E[X]=${p}×${arithmeticAtom(mean1)}+(1-${p})×${arithmeticAtom(mean0)}=${numberText(answer)}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const p = round(index / 20 + 0.2, 2);
  const mean1 = index + 1;
  const mean0 = 1 - index;
  const var1 = index + 2;
  const var0 = index + 4;
  const mean = p * mean1 + (1 - p) * mean0;
  const between = p * (mean1 - mean) ** 2 + (1 - p) * (mean0 - mean) ** 2;
  const answer = round(p * var1 + (1 - p) * var0 + between, 6);
  addFill({ id: `math-prob-total-variance-${index}`, topic: "高等概率论 · 全方差公式", question: `P(H)=${p}；条件均值分别为 ${mean1}、${mean0}，条件方差分别为 ${var1}、${var0}。求 Var(X)，保留 6 位小数。`, answers: [numberText(answer)], referenceAnswer: `Var(X)=${numberText(answer)}`, steps: [`E[Var(X|H)]=${p}×${var1}+(1-${p})×${var0}。`, `Var(E[X|H])=${numberText(between)}。`, `两项相加得 Var(X)=${numberText(answer)}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const n = (index + 5) ** 2;
  const mean = index - 3;
  const sigma = index % 4 + 1;
  const zTarget = index % 5 - 2;
  const threshold = n * mean + zTarget * sigma * Math.sqrt(n);
  addFill({ id: `math-prob-clt-standardize-${index}`, topic: "高等概率论 · 中心极限定理", question: `Xᵢ 独立同分布，E[Xᵢ]=${mean}、SD(Xᵢ)=${sigma}，n=${n}。阈值 Sₙ=${threshold} 对应的标准化 z 值是多少？`, answers: [String(zTarget)], referenceAnswer: `z=${zTarget}`, steps: [`Sₙ 的均值为 nμ=${n * mean}，标准差为 σ√n=${sigma * Math.sqrt(n)}。`, `z=(Sₙ-nμ)/(σ√n)=(${arithmeticAtom(threshold)}-${arithmeticAtom(n * mean)})/${sigma * Math.sqrt(n)}=${zTarget}。`], index, tolerance: 0 });
}

for (let index = 1; index <= 10; index += 1) {
  const sampleSize = index + 2;
  const upper = index + 5;
  const answer = round(upper / (sampleSize + 1), 6);
  addFill({ id: `math-prob-order-minimum-${index}`, topic: "高等概率论 · 次序统计量", question: `${sampleSize} 个独立 Uniform(0,${upper}) 变量的最小值 M 的 E[M] 是多少？保留 6 位小数。`, answers: [numberText(answer)], referenceAnswer: `E[M]=${numberText(answer)}`, steps: [`P(M>m)=P(X₁>m,...,Xₙ>m)=(1-m/${upper})^${sampleSize}。`, `E[M]=∫₀^${upper}P(M>m)dm=${upper}/(${sampleSize}+1)=${numberText(answer)}。`], index });
}

for (let index = 1; index <= 10; index += 1) {
  const variance = index + 1;
  const epsilon = round((index % 4 + 1) / 2, 1);
  const explicitCoefficient = round(variance / (epsilon * epsilon), 6);
  const referenceAnswer = `对任意 ε>0，P(|X̄ₙ-μ|≥ε)≤${variance}/(nε²)→0，所以 X̄ₙ 依概率收敛到 μ。取 ε=${epsilon} 时，上界为 ${numberText(explicitCoefficient)}/n。`;
  addOpen({ id: `math-prob-weak-law-${index}`, topic: "高等概率论 · 弱大数定律", question: `设 X₁,X₂,... 独立同分布，E[Xᵢ]=μ、Var(Xᵢ)=${variance}。用 Chebyshev 不等式证明样本均值依概率收敛，并写出 ε=${epsilon} 时的显式上界。`, referenceAnswer, steps: [`Var(X̄ₙ)=${variance}/n。`, "Chebyshev 不等式给出 P(|X̄ₙ-μ|≥ε)≤Var(X̄ₙ)/ε²。", `因此概率上界为 ${variance}/(nε²)，随 n 趋于 0。`], checkpoints: ["计算样本均值的方差", "正确应用 Chebyshev 不等式", "写出随 n 变化的概率上界", "由上界趋零得出依概率收敛"], index });
}

for (let index = 1; index <= 10; index += 1) {
  const sigmaX = index + 1;
  const sigmaY = index + 2;
  const rho = round((index - 5) / 10, 1);
  const observed = index - 3;
  const mean = round(rho * sigmaX / sigmaY * observed, 6);
  const variance = round(sigmaX * sigmaX * (1 - rho * rho), 6);
  const referenceAnswer = `X|Y=${observed} ~ N(${mean}, ${variance})。其中条件均值为 ρ(σX/σY)y=${mean}，条件方差为 σX²(1-ρ²)=${variance}。`;
  addOpen({ id: `math-prob-gaussian-condition-${index}`, topic: "高等概率论 · 条件正态分布", question: `设 (X,Y) 联合正态、均值均为 0，SD(X)=${sigmaX}、SD(Y)=${sigmaY}、Corr(X,Y)=${rho}。推导 X|Y=${observed} 的分布。`, referenceAnswer, steps: ["联合正态的条件分布仍为正态。", `条件均值 E[X|Y=y]=ρ(σX/σY)y，代入得 ${mean}。`, `条件方差 Var(X|Y)=σX²(1-ρ²)=${variance}。`], checkpoints: ["识别条件分布仍为正态", "正确使用条件均值公式", "正确使用条件方差公式", "代入参数并写出完整分布"], index });
}

function validate() {
  const errors = [];
  const ids = new Set();
  const prompts = new Set();
  if (questions.length !== 400) errors.push(`Expected 400 questions, found ${questions.length}`);
  const domainCounts = Object.fromEntries(["优化", "矩阵论", "随机过程", "高等概率论"].map(domain => [domain, questions.filter(question => question.topic.startsWith(domain)).length]));
  for (const [domain, count] of Object.entries(domainCounts)) if (count !== 100) errors.push(`Expected 100 ${domain} questions, found ${count}`);
  const typeCounts = Object.fromEntries(["choice", "fill", "open"].map(type => [type, questions.filter(question => question.type === type).length]));
  for (const [type, expected] of Object.entries({ choice: 160, fill: 160, open: 80 })) if (typeCounts[type] !== expected) errors.push(`Expected ${expected} ${type} questions, found ${typeCounts[type]}`);
  for (const question of questions) {
    if (!question.id || ids.has(question.id)) errors.push(`Duplicate or missing id: ${question.id}`);
    ids.add(question.id);
    if (!question.question || prompts.has(question.question)) errors.push(`Duplicate or missing prompt: ${question.id}`);
    prompts.add(question.question);
    if (!question.referenceAnswer || !Array.isArray(question.solutionSteps) || question.solutionSteps.length < 2 || !question.explanation) errors.push(`Missing standard solution: ${question.id}`);
    const mathematicalText = [question.question, question.referenceAnswer, question.explanation, ...(question.solutionSteps || []), ...(question.options || [])].join(" ");
    if (/--|\+-|-\+|×-/.test(mathematicalText)) errors.push(`Malformed signed expression: ${question.id}`);
    if (question.subject !== "math" || question.qualityTier !== "solution-rich" || question.source !== SOURCE || question.license !== LICENSE) errors.push(`Invalid metadata: ${question.id}`);
    if (question.type === "choice" && (!Array.isArray(question.options) || question.options.length !== 4 || new Set(question.options).size !== 4 || !Number.isInteger(question.answer) || question.answer < 0 || question.answer > 3)) errors.push(`Malformed choice: ${question.id}`);
    if (question.type === "fill" && (!Array.isArray(question.answers) || !question.answers.length || question.answers.some(answer => !String(answer).trim()))) errors.push(`Malformed fill: ${question.id}`);
    if (question.type === "open" && (!Array.isArray(question.checkpoints) || question.checkpoints.length < 4 || question.minimumResponseUnits > 5)) errors.push(`Malformed open problem: ${question.id}`);
  }
  if (errors.length) throw new Error(errors.join("\n"));
}

validate();

const bank = {
  schemaVersion: 1,
  bank: {
    id: "advanced-math-solutions-2026",
    title: "高阶数学标准详解题库",
    version: "1.0.0",
    description: "优化、矩阵论、随机过程和高等概率论各 100 道；覆盖概念判断、计算、证明与推导，每题提供标准答案和分步解法。",
    generator: "scripts/generate-advanced-math-bank.mjs",
    source: SOURCE,
    license: LICENSE
  },
  questions
};

await writeFile(output, `${JSON.stringify(bank, null, 2)}\n`, "utf8");
console.log(`Generated ${questions.length} solution-rich advanced mathematics questions.`);
