import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const output = new URL("../data/question-banks/open-practice-bank.json", import.meta.url);
const questions = [];
const SOURCE = "知行原创参数化题库 v5（学习手册与习题册框架）";
const RIGHTS = "Project Original - personal study use";

let seed = 20260717;
function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 4294967296;
}
function integer(min, max) { return Math.floor(random() * (max - min + 1)) + min; }
function pick(items) { return items[integer(0, items.length - 1)]; }
function round(value, digits = 4) { return Number(value.toFixed(digits)); }
function gcd(a, b) { return b ? gcd(b, a % b) : Math.abs(a); }
function fraction(numerator, denominator) {
  const divisor = gcd(numerator, denominator);
  return `${numerator / divisor}/${denominator / divisor}`;
}
function formatSigned(value) { return value < 0 ? `- ${Math.abs(value)}` : `+ ${value}`; }
function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = integer(0, index);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}
function add(question) {
  questions.push({ difficulty: "进阶", source: SOURCE, license: RIGHTS, ...question });
}
function addFill(id, subject, topic, question, answer, explanation, options = {}) {
  const numeric = typeof answer === "number";
  add({
    id, type: "fill", subject, topic, taskType: "填空题", question,
    answers: numeric ? [String(round(answer, options.digits ?? 6))] : Array.isArray(answer) ? answer : [String(answer)],
    ...(numeric ? { numericTolerance: options.tolerance ?? 0.001 } : {}),
    explanation,
    ...options.extra
  });
}
function addChoice(id, subject, topic, question, options, correct, explanation) {
  const shuffled = shuffle(options.map((text, originalIndex) => ({ text, originalIndex })));
  add({
    id, type: "choice", subject, topic, taskType: "选择题", question,
    options: shuffled.map(item => item.text),
    answer: shuffled.findIndex(item => item.originalIndex === correct),
    explanation
  });
}

// Optimization: unconstrained methods, convexity, KKT, and smooth optimization.
for (let index = 1; index <= 40; index += 1) {
  const a = integer(1, 9);
  const minimizer = integer(-12, 15);
  const b = -2 * a * minimizer;
  const c = integer(-20, 30);
  addFill(`opt-quadratic-${index}`, "math", "优化 · 二次函数", `求 f(x) = ${a}x² ${formatSigned(b)}x ${formatSigned(c)} 的全局最小点 x*。`, [String(minimizer), `x=${minimizer}`], `f'(x) = ${2 * a}x ${formatSigned(b)}。令 f'(x)=0 得 x*=${minimizer}；又因 f''(x)=${2 * a}>0，所以它是唯一全局最小点。`);
}
for (let index = 1; index <= 30; index += 1) {
  const a = integer(1, 6), b = integer(1, 6), c = integer(-4, 4), d = integer(-8, 8);
  const x = integer(-5, 6), y = integer(-5, 6);
  const answer = 2 * a * x + c * y + d;
  addFill(`opt-gradient-${index}`, "math", "优化 · 梯度", `设 f(x,y) = ${a}x² + ${b}y² ${formatSigned(c)}xy ${formatSigned(d)}x。在点 (${x}, ${y}) 处，∂f/∂x 的值是多少？`, answer, `∂f/∂x = ${2 * a}x ${formatSigned(c)}y ${formatSigned(d)}。代入 (${x},${y}) 得 ${answer}。`);
}
for (let index = 1; index <= 20; index += 1) {
  const a = integer(1, 8), target = integer(-6, 9), b = a * target;
  const x0 = integer(-8, 10), eta = pick([0.05, 0.1, 0.2, 0.25]);
  const gradient = a * x0 - b;
  const answer = round(x0 - eta * gradient, 6);
  addFill(`opt-gd-${index}`, "math", "优化 · 梯度下降", `对 f(x)=½·${a}x² - ${b}x，从 x₀=${x0} 出发，以步长 η=${eta} 做一步梯度下降。求 x₁。`, answer, `f'(x)=${a}x-${b}，所以 f'(x₀)=${gradient}。x₁=x₀-ηf'(x₀)=${x0}-${eta}×(${gradient})=${answer}。`);
}
let convexityIndex = 1;
while (convexityIndex <= 20) {
  const a = integer(1, 8), b = integer(1, 8), c = integer(-7, 7);
  const determinant = a * b - c * c;
  if (determinant === 0) continue;
  const convex = determinant > 0;
  addChoice(`opt-convexity-${convexityIndex}`, "math", "优化 · 凸性", `二次函数的 Hessian 为 H=[[${a},${c}],[${c},${b}]]。关于该函数的凸性，哪项正确？`, ["严格凸", "非凸（H 不定）", "仅能推出线性", "无法由 Hessian 判断"], convex ? 0 : 1, `Sylvester 判据给出第一主子式 ${a}>0，行列式 det(H)=${determinant}。${convex ? "两者均正，所以 H 正定，函数严格凸。" : "行列式为负，所以 H 不定，函数非凸。"}`);
  convexityIndex += 1;
}
for (let index = 1; index <= 20; index += 1) {
  const unconstrained = integer(-8, 10), lowerBound = integer(-5, 7);
  const answer = Math.max(unconstrained, lowerBound);
  const multiplier = answer === lowerBound && unconstrained < lowerBound ? 2 * (lowerBound - unconstrained) : 0;
  addFill(`opt-kkt-${index}`, "math", "优化 · KKT 条件", `求 min (x-${unconstrained})²，约束 x≥${lowerBound} 的最优解 x*。`, answer, `写成 g(x)=${lowerBound}-x≤0。KKT 条件为 2(x-${unconstrained})-λ=0、λ≥0、λg(x)=0。投影到可行域得 x*=max(${unconstrained},${lowerBound})=${answer}，对应 λ*=${multiplier}。`);
}
for (let index = 1; index <= 15; index += 1) {
  const sum = 2 * integer(-6, 8);
  const answer = sum * sum / 2;
  addFill(`opt-lagrange-${index}`, "math", "优化 · Lagrange 乘子", `求 min x²+y²，约束 x+y=${sum} 时的最小目标值。`, answer, `L=x²+y²+λ(x+y-${sum})。驻点满足 2x+λ=0、2y+λ=0，所以 x=y=${sum / 2}。最小值为 2×(${sum / 2})²=${answer}。`);
}
for (let index = 1; index <= 15; index += 1) {
  const lipschitz = integer(2, 20);
  const answer = round(1 / lipschitz, 6);
  addFill(`opt-smooth-step-${index}`, "math", "优化 · 光滑性与步长", `已知凸函数 f 的梯度为 L=${lipschitz} Lipschitz。按标准保守选择，梯度下降的常数步长 η=1/L 是多少？保留 6 位小数。`, answer, `由 descent lemma，η=1/L 是保证标准下降界的常用选择。本题 η=1/${lipschitz}≈${answer}。`, { tolerance: 0.000001, digits: 6 });
}

// Matrix theory: invariants, Jordan structure, Rayleigh quotients, and norms.
for (let index = 1; index <= 40; index += 1) {
  const a = integer(-7, 8), b = integer(-6, 7), c = integer(-6, 7), d = integer(-7, 8);
  const answer = a * d - b * c;
  addFill(`matrix-det-${index}`, "math", "矩阵论 · 行列式", `设 A=[[${a},${b}],[${c},${d}]]，求 det(A)。`, answer, `二阶行列式 det(A)=ad-bc=${a}×${d}-${b}×${c}=${answer}。`);
}
for (let index = 1; index <= 30; index += 1) {
  const a = integer(-5, 6), b = integer(-5, 6), c = integer(-5, 6), d = integer(-5, 6);
  const answer = a * a + d * d + 2 * b * c;
  addFill(`matrix-trace-square-${index}`, "math", "矩阵论 · 迹", `设 A=[[${a},${b}],[${c},${d}]]，求 tr(A²)。`, answer, `tr(A²)=a²+d²+2bc=${a}²+${d}²+2×${b}×${c}=${answer}。`);
}
for (let index = 1; index <= 25; index += 1) {
  const a = integer(-4, 10), b = integer(-8, 8) || 1;
  const answer = a + Math.abs(b);
  addFill(`matrix-eigen-${index}`, "math", "矩阵论 · 特征值", `对称矩阵 A=[[${a},${b}],[${b},${a}]] 的最大特征值是多少？`, answer, `矩阵 [[a,b],[b,a]] 的特征值为 a+b 与 a-b，因此最大值为 a+|b|=${answer}。`);
}
for (let index = 1; index <= 20; index += 1) {
  const diagonal = [integer(-4, 4), integer(-4, 4), integer(-4, 4)];
  if (diagonal.every(value => value === 0)) diagonal[0] = 1;
  const answer = diagonal.filter(value => value !== 0).length;
  addFill(`matrix-rank-${index}`, "math", "矩阵论 · 秩", `求对角矩阵 diag(${diagonal.join(", ")}) 的秩。`, answer, `对角矩阵的秩等于非零对角元个数。本题共有 ${answer} 个非零对角元。`);
}
for (let index = 1; index <= 15; index += 1) {
  const eigenvalue = integer(-6, 8);
  addFill(`matrix-jordan-${index}`, "math", "矩阵论 · Jordan 标准形", `设 A=[[${eigenvalue},1],[0,${eigenvalue}]]。使 (A-${eigenvalue}I)^k=0 成立的最小正整数 k 是多少？`, 2, `A-${eigenvalue}I=[[0,1],[0,0]] 非零，但其平方为零。因此最大 Jordan 块大小为 2，最小 k=2。`);
}
for (let index = 1; index <= 15; index += 1) {
  const a = integer(-8, 10), b = a + 2 * integer(-5, 6);
  const answer = (a + b) / 2;
  addFill(`matrix-rayleigh-${index}`, "math", "矩阵论 · Rayleigh 商", `设 A=diag(${a},${b})，x=(1,1)ᵀ。求 Rayleigh 商 (xᵀAx)/(xᵀx)。`, answer, `xᵀAx=${a}+${b}，xᵀx=2，因此 Rayleigh 商为 (${a}+${b})/2=${answer}。`);
}
for (let index = 1; index <= 15; index += 1) {
  const diagonal = [integer(-9, 9), integer(-9, 9), integer(-9, 9)];
  if (diagonal.every(value => value === 0)) diagonal[0] = 1;
  const answer = Math.max(...diagonal.map(Math.abs));
  addFill(`matrix-spectral-norm-${index}`, "math", "矩阵论 · SVD 与谱范数", `求对角矩阵 A=diag(${diagonal.join(", ")}) 的谱范数 ||A||₂。`, answer, `谱范数等于最大奇异值。对角矩阵的奇异值是对角元绝对值，所以 ||A||₂=max(${diagonal.map(Math.abs).join(",")})=${answer}。`);
}

// Stochastic processes: Poisson processes, Markov chains, Brownian motion, and martingales.
for (let index = 1; index <= 30; index += 1) {
  const lambda = integer(1, 8), time = pick([0.5, 1, 1.5, 2, 3]);
  const answer = lambda * time;
  addFill(`stochastic-poisson-mean-${index}`, "math", "随机过程 · Poisson 过程", `设 {N(t)} 是强度 λ=${lambda} 的 Poisson 过程，求 E[N(${time})]。`, answer, `Poisson 过程满足 E[N(t)]=λt，因此答案为 ${lambda}×${time}=${answer}。`);
}
for (let index = 1; index <= 25; index += 1) {
  const lambda = integer(1, 6), time = pick([0.5, 1, 1.5, 2]);
  const answer = round(Math.exp(-lambda * time), 6);
  addFill(`stochastic-poisson-zero-${index}`, "math", "随机过程 · Poisson 过程", `设 {N(t)} 是强度 λ=${lambda} 的 Poisson 过程，求 P(N(${time})=0)，结果保留 6 位小数。`, answer, `N(t)~Poisson(λt)，故 P(N(t)=0)=e^(-λt)=e^(-${lambda * time})≈${answer}。`, { tolerance: 0.000001, digits: 6 });
}
for (let index = 1; index <= 25; index += 1) {
  const p = pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6]), q = pick([0.1, 0.2, 0.3, 0.4, 0.5]);
  const answer = round(p * (2 - p - q), 6);
  addFill(`stochastic-markov-two-step-${index}`, "math", "随机过程 · Markov 链", `两状态 Markov 链的转移矩阵为 P=[[${round(1 - p, 1)},${p}],[${q},${round(1 - q, 1)}]]。从状态 0 出发，两步后位于状态 1 的概率是多少？`, answer, `(P²)₀₁=P₀₀P₀₁+P₀₁P₁₁=(1-p)p+p(1-q)=p(2-p-q)=${answer}。`);
}
for (let index = 1; index <= 25; index += 1) {
  const p = pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6]), q = pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6]);
  const answer = round(p / (p + q), 6);
  addFill(`stochastic-markov-stationary-${index}`, "math", "随机过程 · 平稳分布", `两状态链 P=[[${round(1 - p, 1)},${p}],[${q},${round(1 - q, 1)}]]。求平稳分布中状态 1 的概率 π₁，保留 6 位小数。`, answer, `由平衡方程 π₀p=π₁q 及 π₀+π₁=1，得 π₁=p/(p+q)=${answer}。`, { tolerance: 0.000001, digits: 6 });
}
for (let index = 1; index <= 25; index += 1) {
  const s = pick([0.5, 1, 1.5, 2, 2.5]), t = pick([1, 1.5, 2, 3, 4]);
  const answer = Math.min(s, t);
  addFill(`stochastic-brownian-cov-${index}`, "math", "随机过程 · Brownian motion", `设 {B(t)} 为标准 Brownian motion，求 Cov(B(${s}), B(${t}))。`, answer, `标准 Brownian motion 的协方差函数为 Cov(B(s),B(t))=min(s,t)，所以答案为 ${answer}。`);
}
for (let index = 1; index <= 15; index += 1) {
  const current = integer(-12, 12);
  addFill(`stochastic-martingale-${index}`, "math", "随机过程 · 鞅", `设 Sₙ 是简单对称随机游走，且当前 Sₙ=${current}。求 E[Sₙ₊₁ | Fₙ]。`, current, `下一步增量以相同概率取 ±1，条件均值为 0。因此 E[Sₙ₊₁|Fₙ]=Sₙ=${current}，这正是鞅性质。`);
}
for (let index = 1; index <= 15; index += 1) {
  const rho = pick([-0.5, -0.2, 0.2, 0.5, 0.8]), innovationVariance = integer(1, 6), lag = integer(1, 3);
  const answer = round(innovationVariance / (1 - rho * rho) * rho ** lag, 6);
  addFill(`stochastic-ar1-${index}`, "math", "随机过程 · 平稳 AR(1)", `平稳过程 Xₜ=${rho}Xₜ₋₁+εₜ，Var(εₜ)=${innovationVariance}。求滞后 ${lag} 的自协方差 γ(${lag})，保留 6 位小数。`, answer, `平稳 AR(1) 满足 γ(k)=σ²ρ^k/(1-ρ²)。代入得 γ(${lag})=${innovationVariance}×(${rho})^${lag}/(1-(${rho})²)≈${answer}。`, { tolerance: 0.000001, digits: 6 });
}

// Advanced probability: conditional structure, convergence, limit theorems, and characteristic functions.
for (let index = 1; index <= 10; index += 1) {
  const n = integer(5, 30), p = pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.6, 0.75]);
  const answer = n * p;
  addFill(`prob-binomial-mean-${index}`, "math", "高等概率论 · 分布矩", `若 X~Binomial(${n}, ${p})，求 E[X]。`, answer, `二项分布的期望为 np=${n}×${p}=${answer}。`);
}
for (let index = 1; index <= 10; index += 1) {
  const n = integer(5, 30), p = pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.6, 0.75]);
  const answer = round(n * p * (1 - p), 6);
  addFill(`prob-binomial-var-${index}`, "math", "高等概率论 · 分布矩", `若 X~Binomial(${n}, ${p})，求 Var(X)。`, answer, `二项分布方差为 np(1-p)=${n}×${p}×${round(1 - p, 2)}=${answer}。`);
}
for (let index = 1; index <= 10; index += 1) {
  const lambda = integer(1, 10);
  const answer = round(1 / lambda, 6);
  addFill(`prob-exponential-mean-${index}`, "math", "高等概率论 · 分布矩", `若 X~Exponential(λ=${lambda})，采用 rate 参数化，求 E[X]，保留 6 位小数。`, answer, `指数分布在 rate 参数化下 E[X]=1/λ=1/${lambda}≈${answer}。`, { tolerance: 0.000001, digits: 6 });
}
for (let index = 1; index <= 25; index += 1) {
  const prevalence = pick([0.01, 0.02, 0.05, 0.1, 0.15, 0.2]);
  const sensitivity = pick([0.8, 0.85, 0.9, 0.95]);
  const falsePositive = pick([0.01, 0.02, 0.05, 0.1]);
  const answer = round(prevalence * sensitivity / (prevalence * sensitivity + (1 - prevalence) * falsePositive), 6);
  addFill(`prob-bayes-${index}`, "math", "高等概率论 · Bayes 公式", `事件 D 的先验概率为 ${prevalence}，检测灵敏度 P(+|D)=${sensitivity}，假阳性率 P(+|Dᶜ)=${falsePositive}。求 P(D|+)，保留 6 位小数。`, answer, `Bayes 公式给出 P(D|+)=P(D)P(+|D)/[P(D)P(+|D)+P(Dᶜ)P(+|Dᶜ)]≈${answer}。`, { tolerance: 0.000001, digits: 6 });
}
for (let index = 1; index <= 20; index += 1) {
  const varianceX = integer(1, 12), varianceY = integer(1, 12);
  const answer = varianceX + varianceY;
  addFill(`prob-normal-sum-var-${index}`, "math", "高等概率论 · 正态变量", `独立随机变量 X~N(μ₁, ${varianceX})、Y~N(μ₂, ${varianceY})。求 Var(X+Y)。`, answer, `独立变量之和的方差相加，因此 Var(X+Y)=${varianceX}+${varianceY}=${answer}。`);
}
for (let index = 1; index <= 20; index += 1) {
  const variance = integer(1, 20), distance = integer(2, 9);
  const answer = round(Math.min(1, variance / (distance * distance)), 6);
  addFill(`prob-chebyshev-${index}`, "math", "高等概率论 · Chebyshev 不等式", `随机变量 X 的方差为 ${variance}。用 Chebyshev 不等式给出 P(|X-E[X]|≥${distance}) 的上界，保留 6 位小数。`, answer, `Chebyshev 不等式给出 P(|X-E[X]|≥a)≤Var(X)/a²=${variance}/${distance ** 2}，概率上界不超过 1，因此为 ${answer}。`, { tolerance: 0.000001, digits: 6 });
}
const convergenceQuestions = [
  ["若 Xₙ 几乎处处收敛到 X，必然还能推出什么？", ["Xₙ 依概率收敛到 X", "Xₙ 必在 L² 中收敛", "Xₙ 的密度逐点收敛", "Xₙ 从某项起恒等于 X"], 0, "几乎处处收敛蕴含依概率收敛，但不自动给出矩收敛或逐项相等。"],
  ["若 E[(Xₙ-X)²]→0，必然还能推出什么？", ["Xₙ 依概率收敛到 X", "Xₙ 必然处处收敛", "Xₙ 与 X 同分布", "Var(Xₙ) 必为零"], 0, "均方收敛结合 Markov 不等式可推出依概率收敛。"],
  ["若 Xₙ 依概率收敛到 X，下列哪项总能做到？", ["选取一个几乎处处收敛到 X 的子列", "推出整个序列几乎处处收敛", "推出 L² 收敛", "推出各阶矩收敛"], 0, "依概率收敛序列总存在一个几乎处处收敛到同一极限的子列。"],
  ["仅知道 Xₙ 依分布收敛到 X，一般不能推出哪项？", ["Xₙ 依概率收敛到 X", "分布函数在连续点收敛", "特征函数逐点收敛", "任意有界连续函数期望收敛"], 0, "依分布收敛一般不蕴含同一概率空间上的依概率收敛，其余三项都是等价刻画。"]
];
for (let index = 1; index <= 20; index += 1) {
  const [question, options, correct, explanation] = convergenceQuestions[(index - 1) % convergenceQuestions.length];
  addChoice(`prob-convergence-${index}`, "math", "高等概率论 · 收敛方式", question, options, correct, explanation);
}
for (let index = 1; index <= 15; index += 1) {
  const n = pick([25, 36, 49, 64, 81, 100]), sigma = integer(1, 6), mean = integer(-3, 5);
  const answer = sigma * Math.sqrt(n);
  addFill(`prob-clt-${index}`, "math", "高等概率论 · 中心极限定理", `设 X₁,…,Xₙ 独立同分布，E[Xᵢ]=${mean}，标准差为 ${sigma}。当 n=${n} 时，标准化和 (Sₙ-nμ)/(____) 的分母是多少？`, answer, `中心极限定理使用 (Sₙ-nμ)/(σ√n)。本题分母为 ${sigma}×√${n}=${answer}。`);
}
for (let index = 1; index <= 15; index += 1) {
  const variance = integer(1, 6), time = pick([0.5, 1, 1.5, 2]);
  const answer = round(Math.exp(-variance * time * time / 2), 6);
  addFill(`prob-characteristic-${index}`, "math", "高等概率论 · 特征函数", `若 X~N(μ, ${variance})，求特征函数在 t=${time} 处的模 |φₓ(t)|，保留 6 位小数。`, answer, `正态变量的特征函数为 exp(iμt-σ²t²/2)，其模为 exp(-σ²t²/2)=exp(-${variance}×${time}²/2)≈${answer}。`, { tolerance: 0.000001, digits: 6 });
}
for (let index = 1; index <= 15; index += 1) {
  const summable = index % 2 === 1;
  addChoice(`prob-borel-cantelli-${index}`, "math", "高等概率论 · Borel-Cantelli", summable ? "若 ∑P(Aₙ)<∞，Borel-Cantelli 第一引理给出什么结论？" : "若事件 Aₙ 相互独立且 ∑P(Aₙ)=∞，Borel-Cantelli 第二引理给出什么结论？", summable ? ["P(Aₙ i.o.)=0", "P(Aₙ i.o.)=1", "Aₙ 两两独立", "∑P(Aₙ)=1"] : ["P(Aₙ i.o.)=1", "P(Aₙ i.o.)=0", "只有有限个 Aₙ 发生", "无法得到任何结论"], 0, summable ? "第一引理不要求独立性；概率和有限意味着几乎必然只有有限多个事件发生。" : "在相互独立且概率和发散时，第二引理说明几乎必然有无穷多个 Aₙ 发生。" );
}

// Logic: valid and invalid conditional inferences, workbook practice, and syllogisms.
const propositions = [
  ["模型收敛", "模型不收敛", "损失停止下降", "损失仍在下降"],
  ["矩阵可逆", "矩阵不可逆", "行列式非零", "行列式为零"],
  ["样本独立且联合密度存在", "条件不成立", "联合密度可分解", "联合密度不可分解"],
  ["严格凸目标在凸可行域上取得最优解", "条件不成立", "最优解唯一", "最优解不一定唯一"],
  ["链不可约且正常返", "链不满足不可约且正常返", "平稳分布唯一", "平稳分布不唯一"],
  ["事件互斥", "事件不互斥", "交集概率为零", "交集概率非零"],
  ["级数绝对收敛", "级数不绝对收敛", "级数收敛", "级数不收敛"],
  ["函数可微", "函数不可微", "函数连续", "函数不连续"],
  ["检验拒绝原假设", "检验未拒绝原假设", "p 值小于阈值", "p 值不小于阈值"],
  ["算法满足停止条件", "算法不满足停止条件", "迭代结束", "迭代继续"],
  ["随机变量平方可积", "随机变量不平方可积", "方差有限", "方差不有限"],
  ["矩阵正定", "矩阵非正定", "所有特征值为正", "存在非正特征值"],
  ["局部最优点满足约束资格条件", "条件不成立", "KKT 条件必要", "KKT 条件未必必要"],
  ["估计量无偏", "估计量有偏", "期望等于真值", "期望不等于真值"],
  ["过程有独立增量", "过程没有独立增量", "不相交区间增量独立", "不相交区间增量不独立"],
  ["序列依概率收敛", "序列不依概率收敛", "任意正误差的超限概率趋零", "存在正误差使超限概率不趋零"],
  ["两个子空间正交", "两个子空间不正交", "任意两向量内积为零", "存在两向量内积非零"],
  ["数据满足交换性", "数据不满足交换性", "联合分布对置换不变", "联合分布对某置换改变"],
  ["完备度量空间上的自映射是压缩映射", "条件不成立", "存在唯一不动点", "不保证唯一不动点"],
  ["协方差为零且联合正态", "条件不成立", "两个变量独立", "两个变量未必独立"]
];
propositions.forEach(([p, notP, q, notQ], index) => {
  addChoice(`logic-conditional-${index + 1}-mp`, "logic", "条件推理", `已知“如果${p}，那么${q}”。现在${p}。必然可以推出什么？`, [q, notQ, notP, "无法确定"], 0, `这是肯定前件：P→Q 且 P，因此必然推出 Q，即“${q}”。`);
  addChoice(`logic-conditional-${index + 1}-mt`, "logic", "条件推理", `已知“如果${p}，那么${q}”。现在${notQ}。必然可以推出什么？`, [notP, p, q, "无法确定"], 0, `这是否定后件：P→Q 且非 Q，因此必然推出非 P，即“${notP}”。`);
  addChoice(`logic-conditional-${index + 1}-ac`, "logic", "条件推理", `已知“如果${p}，那么${q}”。现在${q}。关于“${p}”能得出什么？`, [p, notP, "无法确定", `必然${notQ}`], 2, "由后件成立不能反推前件成立，否则属于肯定后件谬误。" );
  addChoice(`logic-conditional-${index + 1}-da`, "logic", "条件推理", `已知“如果${p}，那么${q}”。现在${notP}。关于“${q}”能得出什么？`, [q, notQ, "无法确定", p], 2, "由前件不成立不能推出后件不成立，否则属于否定前件谬误。" );
});
const workbookFillItems = [
  ["卷一 · 语言与定义", "同一个词在论证前后悄悄换了含义，这种错误叫 ______。", ["偷换概念", "歧义谬误", "equivocation"], "词形不变而含义移动，会制造虚假的推导。"],
  ["卷一 · 语言与定义", "一个表达对应多个相对清楚的含义，这种语言现象叫 ______。", ["歧义", "ambiguity"], "歧义是多个清楚含义之间尚未确定所指。"],
  ["卷一 · 语言与定义", "“适当”“很高”等词缺乏明确边界，这种现象叫 ______。", ["含混", "vagueness"], "含混指方向大致清楚，但程度或边界不明确。"],
  ["卷一 · 语言与定义", "先指出概念所属大类，再说明区别特征的定义结构叫 ______。", ["属加种差", "属+种差", "genus and differentia"], "属加种差能同时交代概念归属和排除边界。"],
  ["卷一 · 语言与定义", "通过不断改窄定义来排除反例，俗称“不是真正的 ______ 人”谬误。", ["苏格兰", "Scotsman"], "No true Scotsman 会临时移动定义以保护原断言。"],
  ["卷二 · 因果与相关", "仅因 B 发生在 A 之后就认定 A 导致 B，叫 ______ 谬误。", ["后此", "后此归因", "post hoc"], "时间先后本身不能排除共同原因或巧合。"],
  ["卷二 · 因果与相关", "同时影响 A 与 B、从而制造表面相关的第三变量叫 ______。", ["混杂因素", "第三变量", "confounder"], "混杂因素会让相关看起来像直接因果。"],
  ["卷二 · 因果与相关", "把“B 导致 A”误读成“A 导致 B”，属于 ______。", ["反向因果", "因果倒置", "reverse causation"], "因果方向需要独立证据，不能由相关图形直接读出。"],
  ["卷二 · 因果与相关", "极端表现之后自然向平均水平靠近，叫 ______。", ["回归均值", "向均值回归", "regression to the mean"], "没有对照时，回归均值很容易被错认成干预效果。"],
  ["卷二 · 因果与相关", "通过随机分组比较干预与对照来检验因果的设计叫 ______。", ["随机对照实验", "随机对照试验", "RCT"], "随机分组有助于在平均意义上平衡已知和未知混杂。"],
  ["卷三 · Toulmin 模型与论证结构", "作者最终希望读者接受或采取的判断叫 ______。", ["结论", "主张", "claim"], "结论是论证要抵达的判断，其他内容通常负责支持它。"],
  ["卷三 · Toulmin 模型与论证结构", "用来支撑结论的理由叫 ______。", ["前提", "premise"], "前提提供事实、规则或理由，结论从中被推出。"],
  ["卷三 · Toulmin 模型与论证结构", "论证没有说出口、却必须依赖的桥接判断叫 ______。", ["隐含前提", "隐含假设", "unstated assumption"], "把隐含前提写出来，才能检查理由是否真的连得到结论。"],
  ["卷三 · Toulmin 模型与论证结构", "Toulmin 模型中，把依据连接到主张的规则叫 ______。", ["理据", "warrant"], "理据回答“为什么这条依据能够支持这个主张”。"],
  ["卷三 · Toulmin 模型与论证结构", "结构有效且所有前提为真的演绎论证叫 ______ 论证。", ["可靠", "sound"], "可靠性同时要求有效结构与真实前提。"],
  ["卷四 · 类比与归纳", "用太少或不具代表性的样本推出普遍结论，叫 ______。", ["仓促概括", "以偏概全", "hasty generalization"], "归纳强度取决于样本数量、代表性和选择机制。"],
  ["卷四 · 类比与归纳", "只分析成功或仍可见的案例、忽略失败者，叫 ______。", ["幸存者偏差", "survivorship bias"], "缺席的失败样本可能彻底改变观察到的规律。"],
  ["卷四 · 类比与归纳", "评价类比时，最需要寻找与结论相关的 ______。", ["关键差异", "relevant disanalogy"], "表面相似不够，决定结论的属性若不同，类比就会失效。"],
  ["卷四 · 类比与归纳", "参与者自行决定是否进入样本造成的系统偏差叫 ______。", ["自选择偏差", "自选择", "self-selection"], "参与意愿本身可能与研究结论相关。"],
  ["卷四 · 类比与归纳", "从有限观察推广到总体时，结论只能获得 ______ 支持。", ["或然", "概率性", "probabilistic"], "归纳可以很强，但不能获得演绎式必然。"],
  ["卷五 · 价值权衡", "选择一个方案时，被放弃的最佳替代方案价值叫 ______。", ["机会成本", "opportunity cost"], "机会成本不是全部备选之和，而是最佳被放弃选项的价值。"],
  ["卷五 · 价值权衡", "把多个可能强行压缩成两个极端选项，叫 ______。", ["虚假两难", "假二择", "false dilemma"], "先找被隐藏的中间方案，才能还原真实选择空间。"],
  ["卷五 · 价值权衡", "因为已经投入且无法收回的成本而继续错误选择，叫 ______。", ["沉没成本谬误", "沉没成本", "sunk cost fallacy"], "当前选择应比较未来成本收益，而不是为过去投入找补。"],
  ["卷五 · 价值权衡", "追问“如果当初选择另一条路会怎样”属于 ______ 思考。", ["反事实", "反事实思考", "counterfactual thinking"], "反事实为因果和机会成本提供比较基准。"],
  ["卷五 · 价值权衡", "改善一个目标会损害另一个目标，这种关系叫 ______。", ["权衡", "取舍", "trade-off"], "承认权衡，才可能说明愿意牺牲什么以及理由。"],
  ["卷六 · 修辞与说服", "依靠说话者的信誉、经历与品格建立说服力，叫 ______。", ["ethos", "信誉诉求"], "Ethos 只有与议题相关且可核查时才构成合理支持。"],
  ["卷六 · 修辞与说服", "通过情感与具体画面调动听众，叫 ______。", ["pathos", "情感诉求"], "Pathos 可以帮助理解重要性，但不能替代证据。"],
  ["卷六 · 修辞与说服", "通过事实、数据与推理结构支持主张，叫 ______。", ["logos", "逻辑诉求"], "Logos 要求依据可核查，而且依据到主张的连接成立。"],
  ["卷六 · 修辞与说服", "歪曲对方观点为更弱版本再攻击，叫 ______ 谬误。", ["稻草人", "straw man"], "回应前应先用对方认可的方式准确复述其最强观点。"],
  ["卷六 · 修辞与说服", "写作前分析听众已知、在意和可能反驳什么，叫 ______。", ["受众分析", "读者意识", "audience analysis"], "同一主张面对不同受众，需要调整解释入口而非改变事实。"]
];
workbookFillItems.forEach(([volume, question, answers, explanation], index) => {
  addFill(`workbook-core-fill-${index + 1}`, "logic", `习题册 · ${volume}`, question, answers, explanation);
});

const workbookOpenItems = [
  ["卷一 · 语言与定义", "定义审计", "请为“专业”写一个可操作定义：指出所属大类、关键区别，并给出一个正例、一个反例和一个边界案例。", ["使用属加种差", "包含正例与反例", "讨论边界案例"]],
  ["卷一 · 语言与定义", "概念澄清", "有人说“正常人都会接受这种安排”。请拆解“正常”的可能含义、它夹带的价值判断，并把原句改写成可讨论的主张。", ["列出不同所指", "识别夹带判断", "给出精确改写"]],
  ["卷一 · 语言与定义", "精炼改写", "把“在很多情况下我们或许应该适当重视一下效率方面的问题”改成一句可检验、可负责的主张，并说明删掉了哪些含混护甲。", ["主张具体", "删除含混限定", "解释修改理由"]],
  ["卷一 · 语言与定义", "词义漂移", "某团队先把“自由”解释为自主安排时间，随后又说“真正自由就是主动延长工作”。请画出词义移动链条，并写一句先澄清定义再回应的话。", ["还原至少两种含义", "指出偷换位置", "先澄清再回应"]],
  ["卷一 · 语言与定义", "个人复盘", "回忆一次因关键词没有定义清楚而发生的分歧：双方各自指什么？若重来，你会先问哪两个澄清问题？", ["描述具体分歧", "区分双方所指", "提出澄清问题"]],
  ["卷二 · 因果与相关", "替代解释", "观察到“长期使用冥想应用的人压力更低”。分别写出直接因果、反向因果、第三变量和选择偏差四种解释。", ["四种解释彼此不同", "包含反向因果", "包含混杂或选择偏差"]],
  ["卷二 · 因果与相关", "研究设计", "某公司在培训后业绩上升。请说明为什么前后对比不足以确认因果，并设计一个更可信的对照方案。", ["指出同期变化", "考虑回归均值", "提出合理对照"]],
  ["卷二 · 因果与相关", "回归均值", "一名学生在异常低分后接受辅导，下一次恢复到平时水平。怎样区分辅导效果与回归均值？", ["识别极端起点", "提出比较组", "说明可区分的证据"]],
  ["卷二 · 因果与相关", "利益与证据", "一项行业资助研究支持该行业产品。利益关系应如何改变你的核查方式？为什么不能据此直接判定结论为假？", ["提高核查标准", "检查研究设计", "避免起源谬误"]],
  ["卷二 · 因果与相关", "严谨表达", "围绕“熬夜与第二天状态”写一段有条件的因果判断，至少使用两个限定词，并指出一个可能的混杂因素。", ["使用限定词", "避免绝对因果", "指出混杂因素"]],
  ["卷三 · Toulmin 模型与论证结构", "候选人论证", "“名校毕业且面试自信，所以一定适合高压岗位。”请写出依据、主张、理据，并指出最薄弱的桥。", ["区分依据与主张", "明确写出理据", "评价理据可靠性"]],
  ["卷三 · Toulmin 模型与论证结构", "AI 写作论证", "把“AI 已经很强，所以不必学习写作”还原为前提、隐含假设和结论，再指出最薄弱的一环。", ["还原前提与结论", "至少补出一个隐含假设", "定位薄弱环节"]],
  ["卷三 · Toulmin 模型与论证结构", "正面建构", "提出一个你真正相信的主张，用 Toulmin 模型写出依据、理据、限定词和最强反方。", ["主张可争辩", "依据与理据分开", "包含限定与反方"]],
  ["卷三 · Toulmin 模型与论证结构", "有效与可靠", "各造一个“结构有效但前提为假”和“前提都真但结构无效”的例子，并解释差别。", ["第一个结构有效", "第二个结构无效", "解释有效与可靠的区别"]],
  ["卷三 · Toulmin 模型与论证结构", "隐含假设", "选择一条广告或职场建议，补出它从理由走到结论所依赖的两条隐含假设，并说明需要什么证据检验。", ["写出具体材料", "补出两条假设", "提出检验证据"]],
  ["卷四 · 类比与归纳", "类比审计", "“公司像一艘船，所以必须由一个人决定一切。”请指出两个与结论相关的关键差异，并给出一个反例。", ["指出相关差异", "解释差异为何重要", "提供反例"]],
  ["卷四 · 类比与归纳", "成功故事", "有人只列举两位强势创始人的成功，就主张强势管理必然有效。请从样本、幸存者和因果三方面审查。", ["检查样本代表性", "识别幸存者偏差", "区分相关与因果"]],
  ["卷四 · 类比与归纳", "创造类比", "为“注意力”创造一个新类比：说明最贴切的属性、可帮助推出什么，以及在哪一点会失真。", ["类比新鲜且相关", "说明推理用途", "主动交代失真点"]],
  ["卷四 · 类比与归纳", "网络调查", "网络投票显示 90% 参与者支持加班。请分析招募方式、自选择和沉默样本，并说明能得出多强的结论。", ["分析选择机制", "指出缺席样本", "限制结论强度"]],
  ["卷四 · 类比与归纳", "归纳强度", "各写一个强归纳与弱归纳的日常例子，并分别说明样本为何足够或不足。", ["两个例子类型正确", "讨论样本质量", "使用或然措辞"]],
  ["卷五 · 价值权衡", "预算两难", "有限公共预算如何在偏远医疗与其他公共服务之间分配？请列出双方价值、双向机会成本和一个降低损失的方案。", ["识别两种正当价值", "说明机会成本", "提出折中或排序原则"]],
  ["卷五 · 价值权衡", "个人选择", "选一个真实两难，先不要下结论：写出两种价值、选择 A 与 B 的机会成本，以及五年后的反事实后悔。", ["两种价值清楚", "双向机会成本", "包含长期反事实"]],
  ["卷五 · 价值权衡", "钢人练习", "选择一个你反对的立场，先写出其支持者会认可的最强版本，再说明你的立场因此如何变得更精确。", ["没有歪曲反方", "反方理由足够强", "给出修正后的立场"]],
  ["卷五 · 价值权衡", "沉没成本", "选择一项你已投入很多却犹豫是否继续的事情。假设过去投入归零，你今天是否会重新选择？说明判断依据。", ["区分过去与未来成本", "完成归零重选", "给出行动判断"]],
  ["卷五 · 价值权衡", "道德包装", "找一条把资源权衡包装成“好人对坏人”的说法，还原其真实取舍，并写一句既承认价值又坚持权衡的回应。", ["识别道德封口", "还原资源约束", "写出建设性回应"]],
  ["卷六 · 修辞与说服", "修辞三角", "分析一段销售话术，分别找出 ethos、pathos 和 logos；再判断其中哪一项在替代证据。", ["识别三种诉求", "区分修辞与论证", "指出证据缺口"]],
  ["卷六 · 修辞与说服", "伪数据", "“90% 的失败者都犹豫，成功者都果断。”请从定义、来源、样本与因果四方面审查这组数字。", ["检查概念定义", "检查来源与样本", "检查因果方向"]],
  ["卷六 · 修辞与说服", "暂停键", "面对“只剩两个名额，真正有魄力的人现在就决定”，写出三个暂停键问题，分别针对稀缺、身份绑架和最坏结果。", ["识别稀缺压力", "识别身份绑架", "评估最坏结果"]],
  ["卷六 · 修辞与说服", "受众改写", "围绕“坚持运动”，分别为重视数据的人、疲惫的朋友和崇尚榜样的人写一句话，并解释为什么入口不同。", ["三种受众区分明确", "论据或措辞有变化", "不改变核心事实"]],
  ["卷六 · 修辞与说服", "诚实说服", "写一段同时包含一条可靠理由和一个具体情感细节的短文；再说明抽掉修辞后，裸论证是否仍站得住。", ["理由可核查", "细节服务于主张", "完成裸论证检查"]]
];
workbookOpenItems.forEach(([volume, taskType, question, checkpoints], index) => {
  add({ id: `workbook-core-open-${index + 1}`, type: "open", subject: "logic", topic: `习题册 · ${volume}`, taskType, question, checkpoints, wordTarget: taskType === "精炼改写" ? 120 : 260 });
});
if (workbookFillItems.length !== 30 || workbookOpenItems.length !== 30) throw new Error("Expected 30 workbook fill and 30 workbook open questions");
const syllogismNouns = [
  ["凸函数", "连续函数", "目标函数"], ["正定矩阵", "可逆矩阵", "协方差矩阵"], ["Poisson 过程", "计数过程", "到达过程"],
  ["无偏估计量", "统计量", "矩估计量"], ["Hilbert 空间", "赋范空间", "函数空间"], ["鞅", "适应过程", "价格过程"],
  ["正态变量", "连续变量", "测量误差"], ["闭集", "可测集", "可行域"], ["酉矩阵", "正规矩阵", "变换矩阵"], ["遍历链", "不可约链", "有限状态链"]
];
syllogismNouns.forEach(([a, b, c], index) => {
  addChoice(`logic-syllogism-${index + 1}-some`, "logic", "三段论", `所有${a}都是${b}；有些${c}是${a}。哪项必然成立？`, [`所有${c}都是${b}`, `有些${c}是${b}`, `没有${c}是${b}`, `有些${b}不是${c}`], 1, `至少有一部分${c}属于${a}，而${a}都属于${b}，所以有些${c}是${b}。`);
  addChoice(`logic-syllogism-${index + 1}-none`, "logic", "三段论", `没有${a}是${b}；有些${c}是${a}。哪项必然成立？`, [`所有${c}都不是${b}`, `有些${c}不是${b}`, `有些${b}是${c}`, `所有${a}都是${c}`], 1, `存在一部分${c}属于${a}，而${a}与${b}互斥，因此这些${c}不是${b}。`);
});

// Manual-based logic curriculum: original scenarios derived from the user's handbook structure.
const manualLogicStart = questions.length;

const argumentCases = [
  { text: "内部调查中 78% 的受访员工支持远程办公，因此公司应该永久取消办公室。", conclusion: "公司应该永久取消办公室", assumption: "受访者意见足以代表远程办公的全部成本与收益" },
  { text: "AI 能显著加快初稿生成，所以学校应允许学生用 AI 完成所有写作任务。", conclusion: "学校应允许 AI 完成所有写作任务", assumption: "提高产出速度不会削弱写作训练的学习目标" },
  { text: "邻市增设自行车道后事故下降，因此本市也应按同样方案扩建。", conclusion: "本市应按邻市方案扩建自行车道", assumption: "两座城市在影响方案效果的关键条件上足够相似" },
  { text: "四天工作制试点期间产出没有下降，所以公司应立即全面推行。", conclusion: "公司应立即全面推行四天工作制", assumption: "试点结果可以外推到全部团队和长期运行" },
  { text: "小班学生平均分更高，所以缩小班级一定能提高所有学校的成绩。", conclusion: "缩小班级一定能提高所有学校成绩", assumption: "分数差异主要由班级规模造成而非生源等因素" },
  { text: "提价后客户流失增加，所以只要恢复原价客户就会回来。", conclusion: "恢复原价会让流失客户回来", assumption: "流失主要由价格而非产品或竞争变化造成" },
  { text: "冠军销售使用这套话术，所以全员照着说就能提升业绩。", conclusion: "全员照用话术就能提升业绩", assumption: "冠军业绩主要来自话术且效果可复制给其他人" },
  { text: "参加自愿培训的员工晋升更快，因此强制培训会提高所有人的晋升率。", conclusion: "强制培训会提高所有人的晋升率", assumption: "自愿参加者与未参加者的差异不会同时影响晋升" },
  { text: "树木较多的街区夏季温度更低，所以多种树必然解决城市热岛。", conclusion: "多种树必然解决城市热岛", assumption: "树木数量是温差的主要原因且效果足以覆盖其他因素" },
  { text: "发布会议规范后会议时长下降，所以规范已经提高了组织效率。", conclusion: "会议规范已经提高组织效率", assumption: "会议变短代表有效产出提高且不是工作量变化所致" }
];
argumentCases.forEach((item, index) => {
  const conclusionOptions = [item.conclusion, ...[1, 3, 6].map(offset => argumentCases[(index + offset) % argumentCases.length].conclusion)];
  const assumptionOptions = [item.assumption, ...[2, 4, 7].map(offset => argumentCases[(index + offset) % argumentCases.length].assumption)];
  addChoice(`logic-argument-conclusion-${index + 1}`, "logic", "论证结构 · 结论与前提", `${item.text} 这段论证的主结论是什么？`, conclusionOptions, 0, `结论是作者最终想让读者接受或采取的判断，即“${item.conclusion}”；其余内容用于支持或补充。`);
  addChoice(`logic-argument-assumption-${index + 1}`, "logic", "Toulmin 模型 · 理据与隐含假设", `${item.text} 要让这段推理成立，最关键的隐含假设是什么？`, assumptionOptions, 0, `理由与结论之间依赖的桥是：“${item.assumption}”。在 Toulmin 模型中，这类桥接规则属于理据；把它写出来后，才能进一步检查是否有证据。`);
});

const reasoningTypes = [
  ["所有通过安全审计的系统都有完整日志；这个系统通过了安全审计；所以它有完整日志。", "演绎", "由一般规则和个案推出必然结论。"],
  ["连续抽查的 200 个零件均合格，因此推测这一批零件大多合格。", "归纳", "由有限样本推测总体，结论是或然的。"],
  ["服务器同时出现延迟与磁盘告警，工程师推测最可能是 I/O 饱和。", "溯因", "从现象反推最佳解释，但不排除其他原因。"],
  ["若模型过拟合，则训练误差低而验证误差高；现在观察到这一模式，因此怀疑过拟合。", "溯因", "结果符合某原因的预测，只能支持最佳解释而非演绎确认。"],
  ["过去十次节假日流量都上涨，因此预计下次节假日也会上涨。", "归纳", "从重复观察预测下一次，仍保留失败可能。"],
  ["所有合同必须经法务批准；这是一份合同；所以它必须经法务批准。", "演绎", "前提若真，结论无法为假。"],
  ["病人发热、咳嗽且影像异常，医生判断肺部感染是当前最佳解释。", "溯因", "诊断是从症状集合寻找最能解释它们的原因。"],
  ["随机抽取的用户中多数偏好简洁界面，因此推测总体用户也倾向简洁界面。", "归纳", "样本到总体是概率性推广。"],
  ["没有完成认证的人不能上线操作；小周未完成认证；所以小周不能上线操作。", "演绎", "规则直接适用于个案。"],
  ["最近五个高分项目都有每周复盘，因此猜测复盘可能帮助项目表现。", "归纳", "共现案例提供线索，但尚未排除选择与混杂。"]
];
reasoningTypes.forEach(([text, answer, explanation], index) => addChoice(`logic-reasoning-type-${index + 1}`, "logic", "论证结构 · 推理类型", `${text} 这主要属于哪种推理？`, [answer, ...["演绎", "归纳", "溯因"].filter(item => item !== answer), "没有任何推理"], 0, explanation));

const validityItems = [
  ["一个演绎论证结构有效且前提全部为真，它被称为什么？", ["可靠论证", "强归纳", "溯因解释", "循环论证"], 0, "可靠性等于有效结构加真实前提。"],
  ["一个论证结构有效，但其中一个前提为假，最准确的评价是什么？", ["有效但不可靠", "无效但可靠", "既有效又可靠", "归纳很强"], 0, "有效性只看结构；假前提使它不可靠。"],
  ["“因为、鉴于、既然”通常提示后面是什么？", ["前提", "结论", "反例", "定义"], 0, "这些词通常引出用于支持的理由。"],
  ["“所以、因此、由此可见”通常提示后面是什么？", ["结论", "前提", "限定词", "背景"], 0, "这些词通常引出作者要推出的判断。"],
  ["反驳演绎论证最直接的两条路线是什么？", ["指出结构无效或前提为假", "攻击作者或强调情绪", "只找一个相反观点", "证明结论不受欢迎"], 0, "演绎论证的评价分为结构和前提两关。"],
  ["下列哪句话是命题？", ["这份报告共有 20 页", "请把报告发给我", "这报告真长啊", "几点开会"], 0, "命题必须能够明确判断真假。"],
  ["归纳结论最合理的措辞是哪一种？", ["在当前样本和条件下很可能成立", "逻辑上必然且没有例外", "只要有一个案例就证明", "无需说明样本来源"], 0, "归纳提供程度不同的支持，不提供演绎必然。"],
  ["溯因推理得到的结论应如何理解？", ["当前证据下的最佳解释", "唯一可能的原因", "形式逻辑上的必然结论", "与证据无关的猜测"], 0, "最佳解释仍需与替代解释竞争。"],
  ["前提都真是否足以保证演绎结论为真？", ["不够，还要结构有效", "足够，结构无关", "只要作者可信就够", "只要结论受欢迎就够"], 0, "真前提通过无效结构仍可能推出不成立的结论。"],
  ["分析一段复杂表达时，最先做哪一步最有助于暴露漏洞？", ["还原为前提和结论", "先判断作者动机", "先找华丽措辞", "先同意或反对结论"], 0, "标准形式能把内容与推出关系分开。"]
];
validityItems.forEach(([question, options, correct, explanation], index) => addChoice(`logic-validity-${index + 1}`, "logic", "论证结构 · 有效与可靠", question, options, correct, explanation));

const fallacies = [
  { name: "人身攻击", category: "相关性", definition: "攻击说话者的人格或处境，而不回应其论点。", scenarios: ["他连自己的项目都延期，凭什么评价我们的进度制度？", "这位研究者太年轻，所以她的数据不值得看。", "你没有创业成功，谈的商业建议肯定全错。"] },
  { name: "诉诸情感", category: "相关性", definition: "用恐惧、同情或愤怒替代对结论的证据。", scenarios: ["想想那些可怜的孩子，所以这项政策不许再质疑。", "如果你爱家人，就必须购买这份保障方案。", "不支持这个计划，就是对团队没有感情。"] },
  { name: "不当诉诸权威", category: "相关性", definition: "用不相关领域或存在未说明利益的权威替代证据。", scenarios: ["著名演员推荐这款药，所以疗效一定可靠。", "冠军运动员说这个投资产品好，当然不会错。", "科技博主断言这种饮食能治病，所以不必看临床研究。"] },
  { name: "诉诸大众", category: "相关性", definition: "把很多人相信或购买当作主张为真的证明。", scenarios: ["这门课十万人购买，内容一定科学。", "大家都在用这个指标，所以它肯定合理。", "多数同事支持加班，说明加班文化就是正确的。"] },
  { name: "稻草人", category: "相关性", definition: "把对方观点歪曲成更弱或更极端的版本再攻击。", scenarios: ["你建议减少一次会议，看来你认为沟通完全没必要。", "他说控制糖分，你却说他想让所有人挨饿。", "她主张审核算法，于是被说成反对一切技术创新。"] },
  { name: "转移话题", category: "相关性", definition: "抛出无关内容，把注意力从当前问题移开。", scenarios: ["被问预算为何超支，他回答团队去年拿过大奖。", "讨论数据泄露时，负责人突然强调竞争对手也犯过错。", "别人问产品缺陷，他开始讲公司的公益捐赠。"] },
  { name: "诉诸虚伪", category: "相关性", definition: "用对方没有做到来回避其批评是否成立。", scenarios: ["你自己也熬夜，没资格说睡眠重要。", "你以前也迟到，所以不能指出我的迟到问题。", "环保倡议者也坐飞机，因此减排主张不用讨论。"] },
  { name: "以偏概全", category: "归纳与因果", definition: "从太少或不具代表性的样本推出普遍结论。", scenarios: ["遇到两位态度差的客服，就说这家公司所有客服都不专业。", "三个远程员工表现好，所以所有岗位都应永久远程。", "听到两次投诉，就断言新版产品人人都不喜欢。"] },
  { name: "幸存者偏差", category: "归纳与因果", definition: "只看成功或可见样本，忽略退出和失败者。", scenarios: ["只研究创业成功者后总结辍学能带来成功。", "只分析仍在交易的基金，得出基金长期都赚钱。", "采访坚持极端训练且没受伤的人，证明该训练很安全。"] },
  { name: "后此谬误", category: "归纳与因果", definition: "仅因 B 发生在 A 之后，就认定 A 导致 B。", scenarios: ["换头像后订单增长，因此新头像带来了增长。", "戴上幸运手环后获奖，所以手环提升了能力。", "新主管上任后市场回暖，于是把全部改善归功于主管。"] },
  { name: "滑坡谬误", category: "归纳与因果", definition: "没有逐步证明，就声称第一步必然导致一串灾难。", scenarios: ["允许一天远程办公，很快就会无人到岗，公司必然解散。", "这次作业延期一天，以后就会彻底失去自律。", "允许一次预算调整，最终一定会演变成无限浪费。"] },
  { name: "错误类比", category: "归纳与因果", definition: "两对象在决定结论的关键属性上并不相似。", scenarios: ["公司像军队，所以所有决定都不应讨论。", "大脑像硬盘，因此记忆可以无限精确复制。", "城市像家庭，所以公共预算也只该由一个人决定。"] },
  { name: "偷换概念", category: "含混", definition: "关键词在推理前后改变含义，制造虚假连接。", scenarios: ["员工有表达意见的自由，所以公司必须采纳每条意见。", "法律面前人人平等，所以考试应让所有人得到相同分数。", "健康意味着没有疾病；他没确诊，所以他的生活方式很健康。"] },
  { name: "合成谬误", category: "含混", definition: "把每个部分的属性直接推给整体。", scenarios: ["每个零件都很轻，所以整台机器一定很轻。", "每位球员都很优秀，所以球队协作必然优秀。", "每项功能都简单，所以整个系统一定简单。"] },
  { name: "分解谬误", category: "含混", definition: "把整体的属性直接推给每个组成部分。", scenarios: ["这家公司很富有，所以每位员工都很富有。", "这支队伍排名第一，所以每名队员都是同位置第一。", "这本书很易懂，所以其中每一章都很简单。"] },
  { name: "循环论证", category: "预设", definition: "理由只是把结论换一种说法，未提供独立支持。", scenarios: ["这项制度是最合理的，因为它比其他制度更合乎理性。", "他说的可信，因为他是一个从不说假话的人。", "这本书值得读，因为它是一本很有阅读价值的书。"] },
  { name: "复杂问语", category: "预设", definition: "问题中预设了尚未被承认的前提。", scenarios: ["你什么时候才停止隐瞒项目风险？", "你已经改掉浪费预算的习惯了吗？", "为什么你的团队总是逃避责任？"] },
  { name: "虚假两难", category: "预设", definition: "把多个可能压缩成两个极端选项。", scenarios: ["要么马上签约，要么永远错过成功。", "不是完全支持改革，就是反对进步。", "你只能选择高薪或有意义的工作，不可能兼顾。"] },
  { name: "诉诸无知", category: "预设", definition: "把尚未被证伪当作已经为真，或反过来。", scenarios: ["没人证明这个疗法无效，所以它一定有效。", "尚未发现外星生命，因此宇宙中绝无其他生命。", "你不能证明传闻是假的，所以应该把它当真。"] },
  { name: "特殊辩护", category: "预设", definition: "规则不利于自己时临时申请没有普遍理由的例外。", scenarios: ["所有人都要按时提交，但我的灵感需要自由，所以我例外。", "数据必须公开，除非数据支持我的结论。", "迟到应扣分，不过资深员工不该受这条规则约束。"] }
];
const fallacyNames = fallacies.map(item => item.name);
fallacies.forEach((fallacy, fallacyIndex) => fallacy.scenarios.forEach((scenario, scenarioIndex) => {
  const distractors = [3, 7, 11].map(offset => fallacyNames[(fallacyIndex + offset) % fallacyNames.length]).filter(name => name !== fallacy.name).slice(0, 3);
  addChoice(`logic-fallacy-${fallacyIndex + 1}-${scenarioIndex + 1}`, "logic", `谬误识别 · ${fallacy.category}`, `下面论证最主要的问题是什么？“${scenario}”`, [fallacy.name, ...distractors], 0, `${fallacy.name}：${fallacy.definition} 识别名称之后，还应指出这处断裂如何影响结论。`);
}));

const causalCases = [
  { observation: "经常运动的人平均收入更高", confounder: "自律程度或可支配时间同时影响运动与收入", reverse: "较高收入让人更有资源运动", randomized: "随机提供运动计划并长期比较收入相关结果" },
  { observation: "使用项目管理软件的团队按时交付率更高", confounder: "管理成熟度同时影响工具采用与交付", reverse: "交付要求高的团队更主动采用工具", randomized: "将可比团队随机分配工具培训并比较交付" },
  { observation: "喝咖啡的人抑郁比例更低", confounder: "社交与生活方式同时影响咖啡饮用和情绪", reverse: "情绪低落者主动减少咖啡因", randomized: "在伦理可行前提下随机分配咖啡摄入并盲法评估" },
  { observation: "阅读量高的学生考试成绩更好", confounder: "家庭教育资源同时提高阅读量和成绩", reverse: "成绩好的学生更愿意阅读", randomized: "随机提供额外阅读支持并比较后续成绩" },
  { observation: "采用远程办公的公司离职率更低", confounder: "管理文化同时影响远程政策和留任", reverse: "留任压力促使公司推出远程政策", randomized: "在可比部门随机试行远程政策并比较离职" },
  { observation: "冥想应用用户的压力评分更低", confounder: "健康意识同时影响使用应用与压力管理", reverse: "压力改善后的人更能坚持使用应用", randomized: "随机邀请一组使用应用并设置主动对照组" },
  { observation: "培训时长更多的销售业绩更高", confounder: "主管重视程度同时增加培训和资源投入", reverse: "高潜销售更容易获得更多培训", randomized: "将相似销售随机分配不同培训方案" },
  { observation: "树木更多的街区夏季温度更低", confounder: "建筑密度同时影响绿化与温度", reverse: "本就凉爽宽阔的街区更容易保留树木", randomized: "分阶段随机选择可比街区增加树冠并比较温度" },
  { observation: "参加社团的学生幸福感更高", confounder: "外向程度同时影响参加社团与幸福感", reverse: "幸福感高的人更愿意参加社团", randomized: "随机提供不同强度的社团参与邀请并跟踪幸福感" },
  { observation: "写每日计划的人任务完成率更高", confounder: "责任心同时影响计划习惯和完成率", reverse: "任务掌控感高的人更愿意写计划", randomized: "随机要求一组使用计划模板并比较完成率" }
];
causalCases.forEach((item, index) => {
  const confounderOptions = [item.confounder, ...[1, 4, 7].map(offset => causalCases[(index + offset) % causalCases.length].confounder)];
  const reverseOptions = [item.reverse, ...[2, 5, 8].map(offset => causalCases[(index + offset) % causalCases.length].reverse)];
  addChoice(`logic-causal-confounder-${index + 1}`, "logic", "因果与统计 · 混杂因素", `观察到“${item.observation}”。哪项是最需要考虑的混杂解释？`, confounderOptions, 0, `混杂因素应同时影响观察中的两个变量。本题需要检查“${item.confounder}”。`);
  addChoice(`logic-causal-reverse-${index + 1}`, "logic", "因果与统计 · 反向因果", `观察到“${item.observation}”。哪项体现了反向因果？`, reverseOptions, 0, `反向因果把通常假定的方向倒过来：${item.reverse}。`);
  addChoice(`logic-causal-design-${index + 1}`, "logic", "因果与统计 · 研究设计", `若要更有力地检验“${item.observation}”背后的因果，哪项设计最好？`, [item.randomized, "把现有相关样本扩大十倍但不改变设计", "只采访一位该领域专家", "比较实施前后一次结果且不设对照"], 0, `随机与对照能更好平衡混杂。合适的方向是：${item.randomized}。`);
});

const statisticalTraps = [
  ["某学生在一次异常低分后接受辅导，下次回到平时水平，便认定辅导完全有效。还需警惕什么？", ["回归均值", "合成谬误", "诉诸大众", "分解谬误"], 0, "极端表现后自然回到平均可能与干预同时发生。"],
  ["一种疗法在轻症组和重症组内都更有效，合并数据后却显得更差。最该检查什么？", ["Simpson 悖论与分组比例", "是否有人身攻击", "是否使用了隐喻", "结论是否受欢迎"], 0, "分组基线和样本比例可能让汇总方向反转。"],
  ["网络投票显示 92% 用户满意。首先应问什么？", ["谁选择参加投票，未参与者是否系统不同", "百分比是否超过 50%", "页面颜色是否影响阅读", "发起者是否名人"], 0, "自选择会让样本系统偏离总体。"],
  ["某基金榜单只统计目前仍存续的产品，长期收益看起来很高。问题是什么？", ["失败并退市的基金被排除", "样本太大", "使用了演绎推理", "没有任何统计问题"], 0, "只看存活者会高估总体表现。"],
  ["观察研究有两万人且持续十年，能否仅凭样本大就确认因果？", ["不能，大样本减少随机误差但不自动消除混杂", "能，人数足够就等同随机实验", "能，时间长必然证明机制", "不能，因为所有观察数据都无价值"], 0, "样本量与研究设计解决的是不同问题。"],
  ["政策实施后指标改善，但同期经济环境也明显变化。最合理的下一步是什么？", ["寻找对照或自然实验以区分政策与环境", "直接把全部改善归给政策", "只引用实施后的一个案例", "因为有混杂就放弃判断"], 0, "需要能产生不同预测的比较设计。"],
  ["连续五次抽奖未中奖，于是认为第六次中奖概率更高。错在哪里？", ["若每次独立，过去结果不会改变单次概率", "忽略了诉诸权威", "样本过大", "没有使用类比"], 0, "独立事件没有补偿记忆，这是赌徒谬误。"],
  ["分组数据和总体数据结论相反时，正确做法是什么？", ["检查分层变量、组间基线和样本权重", "永远只相信总体", "永远只相信最小组", "取两个结论的平均"], 0, "应理解数据生成与分层结构，不能机械选一边。"],
  ["一个干预只在指标极端糟糕时启动，之后指标通常改善。评估效果最需要什么？", ["与相似极端但未干预的对照比较", "只看改善幅度", "询问实施者信心", "增加宣传样本"], 0, "对照有助于分离干预效果与回归均值。"],
  ["相关不等于因果，是否意味着相关数据没有价值？", ["不是，相关是线索，需结合设计、机制和替代解释", "是，相关永远不能用于行动", "不是，只要相关强就必然因果", "是，只有个人经验有价值"], 0, "目标是恰当把握，而不是轻信或虚无主义。"]
];
statisticalTraps.forEach(([question, options, correct, explanation], index) => addChoice(`logic-statistics-${index + 1}`, "logic", "因果与统计 · 统计陷阱", question, options, correct, explanation));

const baseRateCases = [
  [1000, 0.01, 0.9, 0.05], [2000, 0.02, 0.8, 0.04], [1000, 0.05, 0.9, 0.1], [5000, 0.01, 0.95, 0.02], [2000, 0.1, 0.85, 0.05]
];
baseRateCases.forEach(([population, prevalence, sensitivity, falsePositive], index) => {
  const truePositive = population * prevalence * sensitivity;
  const falsePositiveCount = population * (1 - prevalence) * falsePositive;
  const posterior = Math.round(truePositive / (truePositive + falsePositiveCount) * 100);
  const options = [posterior, Math.round(sensitivity * 100), Math.round(prevalence * 100), Math.min(99, posterior + 20)].map(value => `${value}%`);
  addChoice(`logic-base-rate-${index + 1}`, "logic", "概率与不确定 · 基率", `在 ${population} 人中，事件基率 ${prevalence * 100}%，检测灵敏度 ${sensitivity * 100}%，假阳性率 ${falsePositive * 100}%。阳性者真正属于该事件的比例约为多少？`, options, 0, `自然频数法：真阳性约 ${round(truePositive, 1)} 人，假阳性约 ${round(falsePositiveCount, 1)} 人，所以比例约 ${posterior}%。`);
});
for (let index = 1; index <= 5; index += 1) {
  const cost = integer(10, 40), reward = integer(3, 12) * 100, probability = pick([0.05, 0.1, 0.2, 0.25]);
  const expectedPayout = round(reward * probability, 2);
  const net = round(expectedPayout - cost, 2);
  addChoice(`logic-expected-value-${index}`, "logic", "概率与不确定 · 期望值", `一次机会成本 ${cost} 元，以 ${probability * 100}% 概率获得 ${reward} 元，否则为 0。单次净期望值是多少？`, [`${net} 元`, `${expectedPayout} 元`, `${reward - cost} 元`, `-${cost} 元`], 0, `净期望值=${probability}×${reward}-${cost}=${net} 元。是否行动还要考虑可重复性与不可承受损失。`);
}
const uncertaintyItems = [
  ["一个人说自己“有 70% 把握”的 100 次预测中约 70 次正确，这说明什么？", ["校准较好", "每次预测都可靠", "不存在随机误差", "一定低估风险"], 0, "校准比较的是一组同把握度预测的长期兑现比例。"],
  ["新证据在“主张为真”和“主张为假”时都同样常见，它应怎样影响信念？", ["几乎不应改变", "直接提升到 100%", "直接降到 0", "只看证据是否生动"], 0, "没有区分力的证据无法有效更新真假之比。"],
  ["非常罕见的主张通常需要什么样的证据？", ["区分力更强且可复核的证据", "任何一个个人故事", "更多情绪表达", "只要来自熟人即可"], 0, "低先验需要更强的似然比才能显著提高后验。"],
  ["期望值为正的机会是否一定应该参加？", ["不一定，还要看是否可重复和最坏损失能否承受", "一定，期望值覆盖所有风险", "一定，只要概率不为零", "不一定，因为期望值从无价值"], 0, "一次性且可能出局的风险不能只看平均。"],
  ["小样本中极端比例更常见，主要原因是什么？", ["随机波动相对更大", "小样本必然更准确", "事件会补偿过去结果", "总体规律失效"], 0, "大数法则意味着样本增大后平均才更稳定。"],
  ["面对厚尾风险，哪种策略更合理？", ["关注最坏情况并保留安全余量", "只按平均值规划", "长期没出事就当作绝对安全", "把极端事件概率设为零"], 0, "罕见但巨大影响可能主导结果。"],
  ["更新信念时为什么不能只看新证据？", ["还需结合原有基率或先验", "旧信息永远比新信息重要", "新证据不能改变观点", "只需听多数意见"], 0, "后验来自先验与证据说明力的共同作用。"],
  ["怎样训练自己的概率校准？", ["记录预测和概率，定期按结果复盘", "只记录成功预测", "每次都写 50%", "避免给出任何数字"], 0, "可追踪预测让过度或不足自信变得可见。"],
  ["连续多次出现同一独立结果后，下一次概率如何变化？", ["若机制不变则不因历史自动改变", "必然向相反结果补偿", "必然继续同一结果", "无法使用概率"], 0, "独立事件没有记忆。"],
  ["用概率表达判断的主要好处是什么？", ["暴露不确定性并允许证据修正", "让所有判断都显得正确", "避免承担任何责任", "替代对证据的分析"], 0, "概率不是含混护甲，而是可复盘的把握度。"]
];
uncertaintyItems.forEach(([question, options, correct, explanation], index) => addChoice(`logic-uncertainty-${index + 1}`, "logic", "概率与不确定 · 判断校准", question, options, correct, explanation));

const biases = [
  { name: "确认偏误", definition: "优先搜集支持已有看法的证据并忽略反例。", scenarios: ["确定某方案好后，只转发支持它的数据。", "投资后只关注看涨分析，屏蔽风险信息。"] },
  { name: "锚定效应", definition: "判断被最先出现的数字或印象过度影响。", scenarios: ["先看到原价 9999，便觉得 4999 很便宜。", "第一次听到工期三天，后续估计都围绕三天微调。"] },
  { name: "可得性启发", definition: "把容易想起的事件误认为更常见。", scenarios: ["看了事故新闻后严重高估坐飞机的风险。", "刚听到两起裁员，就断言所有行业都在大规模裁员。"] },
  { name: "框架效应", definition: "同一结果因表述方式不同而引发不同选择。", scenarios: ["九成存活比一成死亡让人更愿意接受治疗。", "把费用说成每日三元比每年一千多元更易成交。"] },
  { name: "后见之明", definition: "结果发生后误以为自己早就知道。", scenarios: ["项目失败后说风险从一开始就显而易见。", "比赛结束后坚称赢家本来就毫无悬念。"] },
  { name: "损失厌恶", definition: "同等数量的损失带来的痛苦大于收益的快乐。", scenarios: ["为避免账面亏损而拒绝更好的重新配置。", "宁可错过高价值方案，也不愿放弃已有小权益。"] },
  { name: "沉没成本", definition: "因为过去不可收回的投入继续错误选择。", scenarios: ["电影很差却因票钱已付坚持看完。", "项目已投入一年，所以即使前景消失也不肯停止。"] },
  { name: "禀赋效应", definition: "一旦拥有就系统高估物品价值。", scenarios: ["同一只杯子拥有后卖价远高于购买意愿。", "自己提出的方案总觉得比同等质量的替代方案更好。"] },
  { name: "即时偏好", definition: "过度重视眼前满足，低估长期收益。", scenarios: ["明知长期储蓄重要，却总把钱花在即时消费。", "为立刻轻松而反复推迟高价值但费力的任务。"] },
  { name: "群体思维", definition: "为了维持一致而压制异议和风险信息。", scenarios: ["会议上人人私下担忧，公开却无人反对领导方案。", "团队把提出风险的人视为不团结，最终无人再预警。"] },
  { name: "光环效应", definition: "从一个突出优点推断其他方面也优秀。", scenarios: ["候选人表达流利，就被推断专业能力也一定强。", "品牌设计漂亮，于是用户认为其安全性也更高。"] },
  { name: "基本归因错误", definition: "解释他人时高估性格、低估处境。", scenarios: ["同事迟到被说成懒惰，却不问是否遇到交通事故。", "用户不会操作就被归因于笨，而不检查界面设计。"] },
  { name: "过度自信", definition: "系统高估自己判断的准确性。", scenarios: ["从未做过类似项目却给出百分百按时的承诺。", "只凭一次成功便认为自己已经掌握市场规律。"] },
  { name: "自利归因", definition: "成功归自己能力，失败归外部环境。", scenarios: ["业绩好归功策略，业绩差全怪市场。", "考试高分说是实力，低分只说题目不公平。"] },
  { name: "规划谬误", definition: "只看理想路径而低估时间和成本。", scenarios: ["每一步按最快时间相加，承诺三天完成复杂迁移。", "不参考过去延期记录，仍按最乐观工期排计划。"] }
];
const biasNames = biases.map(item => item.name);
biases.forEach((bias, biasIndex) => bias.scenarios.forEach((scenario, scenarioIndex) => {
  const distractors = [2, 5, 9].map(offset => biasNames[(biasIndex + offset) % biasNames.length]).filter(name => name !== bias.name).slice(0, 3);
  addChoice(`logic-bias-${biasIndex + 1}-${scenarioIndex + 1}`, "logic", "认知偏误", `这段情境最符合哪种偏误？“${scenario}”`, [bias.name, ...distractors], 0, `${bias.name}：${bias.definition} 去偏应依靠流程、外部视角或延迟，而不只是提醒自己。`);
}));

const analogyCases = [
  { statement: "管理公司像驾驶赛车，所以决策越集中越好。", difference: "公司需要汇集分散信息，且多数决策没有赛车般的瞬时压力", support: "比较集中与分权团队在不同决策速度下的长期结果" },
  { statement: "学习像往水桶里加水，所以听课越多学得越多。", difference: "学习者会遗忘、重构和练习，知识不是被动储存的液体", support: "比较仅听课与检索练习组的延迟测验表现" },
  { statement: "大脑像硬盘，所以记忆可以原样读取。", difference: "记忆会受提取情境影响并被重构，硬盘复制则不改变内容", support: "检验不同提问方式是否系统改变回忆内容" },
  { statement: "城市像家庭，所以预算应由家长式领导独自决定。", difference: "城市利益主体多元且权利平等，不存在天然家长角色", support: "比较参与式与单一决策在信息质量和公共信任上的结果" },
  { statement: "员工像机器零件，所以标准化越彻底效率越高。", difference: "员工会学习、反馈并改变动机，零件不会对制度作出策略反应", support: "测量标准化对重复任务与创造任务的不同影响" },
  { statement: "减肥像做减法，所以只要吃得越少越好。", difference: "身体存在代谢、营养和行为反馈，不是静态算术系统", support: "比较不同热量缺口对长期依从、健康和体重反弹的影响" },
  { statement: "网络治理像清扫房间，所以删掉坏内容就能解决问题。", difference: "内容生产者会迁移和适应规则，垃圾不会主动规避清扫", support: "观察治理后生产、传播和迁移行为的动态变化" },
  { statement: "团队像乐队，所以领导只需像指挥一样发出指令。", difference: "许多团队成员同时掌握局部专业信息，任务也未必有固定乐谱", support: "比较信息已知与未知任务中不同领导方式的表现" },
  { statement: "经济像人体，所以任何衰退都应立即用刺激药物治疗。", difference: "政策会改变预期、分配和长期激励，医学药物类比不直接给出剂量与边界", support: "比较不同衰退成因下刺激政策的短期与长期效果" },
  { statement: "写作像盖房子，所以必须先完成完整蓝图才能动笔。", difference: "写作过程中会发现和修正观点，蓝图本身也可由草稿生成", support: "比较先详纲与迭代草稿对不同写作任务的质量和效率" }
];
analogyCases.forEach((item, index) => {
  const differenceOptions = [item.difference, ...[1, 3, 6].map(offset => analogyCases[(index + offset) % analogyCases.length].difference)];
  const supportOptions = [item.support, ...[2, 5, 8].map(offset => analogyCases[(index + offset) % analogyCases.length].support)];
  addChoice(`logic-analogy-difference-${index + 1}`, "logic", "类比与归纳 · 关键差异", `“${item.statement}” 哪项最准确指出这个类比的关键差异？`, differenceOptions, 0, `类比强度取决于与结论相关的相似和差异。本题关键差异是：${item.difference}。`);
  addChoice(`logic-analogy-evidence-${index + 1}`, "logic", "类比与归纳 · 证据", `“${item.statement}” 哪项证据最能把比喻推进为可检验判断？`, supportOptions, 0, `类比只能提出假设，真正的支撑应比较结果：${item.support}。`);
});

const samplingItems = [
  ["随机抽取多个地区、年龄和收入层的用户后再推测总体，主要改善了什么？", ["样本代表性", "演绎有效性", "情绪感染力", "权威地位"], 0, "更合理的抽样降低只观察单一群体的偏差。"],
  ["只采访仍在公司的员工来评估离职政策，会漏掉谁？", ["已经离职且无法被现有样本观察的人", "所有管理者", "所有新员工", "随机抽样者"], 0, "沉默的离职者正可能对政策最不满意。"],
  ["一个生动个案能否直接推翻大型、设计良好的统计研究？", ["通常不能，应检查个案是否代表总体或揭示研究边界", "能，故事永远比统计可靠", "能，只要讲述者真诚", "不能，因为个案永远无信息"], 0, "个案可提示机制或例外，但不能自动替代总体证据。"],
  ["归纳结论为什么应保留限定词？", ["有限观察无法逻辑保证所有未观察案例", "限定词让句子更长", "归纳等同演绎", "样本越多结论越不可信"], 0, "归纳支持有强弱，但始终是或然的。"],
  ["评价网络问卷最先检查哪一点？", ["参与者如何被招募及谁更愿意回答", "问卷标题字体", "发布者粉丝数", "结果是否符合直觉"], 0, "自选择机制决定样本向谁偏移。"],
  ["只列举两位成功的强势创始人，不能证明强势导致成功，主要因为？", ["样本小且忽略大量失败者与替代原因", "成功者没有任何信息", "归纳结论必须为假", "公司不能比较"], 0, "仓促概括与幸存者偏差共同削弱推断。"],
  ["怎样使类比更诚实？", ["同时说明贴切点、适用边界和失真点", "只强调最生动的共同点", "把类比说成定律", "删除所有反例"], 0, "主动说明失真点能防止类比被推得过远。"],
  ["发现一个反例后，最合理的动作是什么？", ["检查原结论是否过强并增加条件或缩小范围", "断言所有数据无效", "忽略反例", "改为攻击反例提出者"], 0, "反例常用于修正普遍量词和适用边界。"],
  ["样本量很大是否自动代表总体？", ["不，系统偏差不会因重复同类样本而消失", "是，大样本必然随机", "是，只要超过一千", "不，因为小样本总更好"], 0, "大量有偏样本只会更精确地估计错误总体。"],
  ["一个好类比最重要的评价标准是什么？", ["相似属性是否与要推出的结论直接相关", "是否足够新奇", "是否来自名人", "是否让听众感动"], 0, "相关相似决定推理价值，生动性只影响传播。"]
];
samplingItems.forEach(([question, options, correct, explanation], index) => addChoice(`logic-induction-${index + 1}`, "logic", "类比与归纳 · 样本", question, options, correct, explanation));

const languageCases = [
  { statement: "这个方案很先进。", issue: "含混", clarification: "“先进”按什么可观察指标判断，与哪个基准比较？" },
  { statement: "他不是一个好负责人。", issue: "歧义", clarification: "这里的“好”指业绩、管理、公平还是道德？" },
  { statement: "公司尊重自由，所以所有个人决定都不应受团队规则约束。", issue: "偷换概念", clarification: "前后的“自由”分别指自主空间还是完全不受约束？" },
  { statement: "真正自律的人从不会中断计划。", issue: "不断改窄定义排除反例", clarification: "暂时中断但能恢复的人为何被定义为不自律？" },
  { statement: "我们会在适当时候显著改善体验。", issue: "含混", clarification: "“适当时候”和“显著改善”各对应什么期限与指标？" },
  { statement: "公平就是每个人得到完全相同的结果。", issue: "定义过窄", clarification: "公平是否也可能指程序一致、机会平等或按需分配？" },
  { statement: "这项措施有效，因为它产生了好的效果。", issue: "循环定义", clarification: "请独立定义“有效”和“好效果”，并给出测量标准。" },
  { statement: "成熟的人不会表达脆弱。", issue: "定义夹带价值判断", clarification: "成熟应属于哪类能力，表达脆弱为何必然被排除？" },
  { statement: "所有人都支持正常的工作强度。", issue: "含混并预设共识", clarification: "“正常”具体是多少，由谁定义，是否真的所有人同意？" },
  { statement: "专业就是永远不给出不确定答案。", issue: "定义过窄", clarification: "专业是否更应包括识别证据边界和诚实表达不确定性？" }
];
const languageIssueNames = [...new Set(languageCases.map(item => item.issue)), "诉诸大众", "形式无效"];
languageCases.forEach((item, index) => {
  const issueOptions = [item.issue, ...[1, 3, 5].map(offset => languageIssueNames[(languageIssueNames.indexOf(item.issue) + offset) % languageIssueNames.length]).filter(value => value !== item.issue).slice(0, 3)];
  const clarificationOptions = [item.clarification, ...[2, 4, 7].map(offset => languageCases[(index + offset) % languageCases.length].clarification)];
  addChoice(`logic-language-issue-${index + 1}`, "logic", "语言与定义", `分析这句话：“${item.statement}” 最主要的语言问题是什么？`, issueOptions, 0, `${item.issue}。在评价观点前，应先固定关键词的所指、边界和测量方式。`);
  addChoice(`logic-language-clarify-${index + 1}`, "logic", "语言与定义", `面对“${item.statement}”，哪句澄清问题最有效？`, clarificationOptions, 0, item.clarification);
});

const judgmentItems = [
  ["面对“要么立即辞职追求理想，要么一生平庸”，第一步应做什么？", ["列出被隐藏的中间选项", "接受二选一", "先判断说话者身份", "只比较情绪强度"], 0, "虚假两难常隐藏试验、过渡和组合方案。", "价值权衡"],
  ["已经为失败项目投入很多，决定今天是否继续时最有用的问题是？", ["如果此前投入归零，我今天还会选它吗", "怎样让过去投入看起来值得", "谁最先提出项目", "别人会不会笑我"], 0, "归零重选能把沉没成本与未来收益分开。", "价值权衡"],
  ["选择 A 的机会成本是什么？", ["被放弃选项中价值最高的收益", "已经为 A 支付的全部成本", "A 的最坏结果", "所有未选择选项价值之和"], 0, "机会成本关注最优替代用途。", "价值权衡"],
  ["公共预算争论中，怎样把道德站队还原为可讨论问题？", ["分别说明双方保护的价值、资源约束和优先级", "把反对者描述为冷漠", "宣布生命无法衡量所以无限投入", "只统计支持人数"], 0, "价值都正当时，应明确权衡与成本。", "价值权衡"],
  ["“我同意照顾个体，同时有限预算也要考虑总体效果”体现了什么？", ["承认双方价值并明确权衡", "取消所有立场", "虚假两难", "诉诸无知"], 0, "高级回应可以同时承认价值和坚持资源约束。", "价值权衡"],
  ["为自己反对的立场写出对方认可的最强版本，叫什么？", ["钢人原则", "稻草人", "循环论证", "诉诸虚伪"], 0, "钢人先准确增强对方，再回应真实分歧。", "价值权衡"],
  ["比较两个选择时，反事实问题的作用是什么？", ["估计如果未选择当前路径可能发生什么", "证明当前选择必错", "删除不确定性", "只回顾已经投入"], 0, "反事实提供因果和机会成本的参照。", "价值权衡"],
  ["一个真正的 trade-off 意味着什么？", ["改善一个目标会损害另一个目标", "两目标可以无成本同时最大化", "只有一个目标有价值", "问题没有任何方案"], 0, "权衡要求说明愿意牺牲什么以及为何。", "价值权衡"],
  ["演讲者用专业经历建立可信度，主要使用哪种说服资源？", ["Ethos", "Pathos", "Logos", "Post hoc"], 0, "Ethos 来自与议题相关的信誉与品格。", "修辞与说服"],
  ["用具体受害场景唤起同情，主要属于？", ["Pathos", "Logos", "演绎", "基率"], 0, "Pathos 调动情绪；它可以辅助理解，但不能替代证据。", "修辞与说服"],
  ["列出可核查数据并解释如何支持主张，主要属于？", ["Logos", "Pathos", "身份绑架", "从众"], 0, "Logos 依赖证据与推理连接。", "修辞与说服"],
  ["“最后一分钟，不立刻购买就是没有魄力”最值得警惕什么？", ["稀缺感与身份绑架绕过价值评估", "演绎结构过强", "样本量过大", "定义过于精确"], 0, "时间压力和身份评价不能证明产品值得。", "修辞与说服"],
  ["面对来源不明的“90% 成功者都这样做”，最佳反应是？", ["追问样本、定义、来源和因果方向", "因数字很大立即相信", "因为是销售说的就断言为假", "只看演讲者是否自信"], 0, "既不轻信伪数据，也不犯起源谬误。", "修辞与说服"],
  ["受众分析最重要的是了解什么？", ["他们已知什么、在意什么、会如何反驳", "怎样让所有人产生相同情绪", "怎样隐藏限定条件", "怎样减少证据"], 0, "同一主张面对不同受众需要不同解释入口。", "修辞与说服"],
  ["把“你的方案不现实”改成哪句最能推进对话？", ["方案依赖哪些条件，哪个条件目前证据最弱？", "你根本不懂现实", "所有人都反对你", "先证明我错"], 0, "可回答的问题能定位条件和证据。", "提问与对话"],
  ["讨论前先问“这里的公平具体指什么”，属于哪类问题？", ["概念澄清", "人身攻击", "诉诸情感", "后此归因"], 0, "澄清所指能确认双方是否讨论同一对象。", "提问与对话"],
  ["双方对同一事实都认可，却对该优先保护谁意见不同，分歧主要在哪一层？", ["价值与优先级", "事实真假", "词语发音", "形式有效性"], 0, "事实共识不消除价值权重差异。", "提问与对话"],
  ["“什么证据会让你改变看法”主要检查什么？", ["立场是否可证伪并开放更新", "说话者是否自信", "观点是否流行", "句子是否优美"], 0, "若没有任何可能改变立场的证据，它更像信仰而非判断。", "提问与对话"],
  ["思考一个政策时连续追问“然后呢”，主要在训练什么？", ["二阶思维", "诉诸无知", "词义澄清", "样本扩大"], 0, "二阶思维关注行动后各方反应和后续连锁结果。", "心智模型"],
  ["假设项目已经失败，再倒推原因，这种方法是什么？", ["事前验尸与逆向思维", "后见之明", "循环论证", "从众偏误"], 0, "从失败倒推能提前暴露脆弱路径。", "心智模型"]
];
judgmentItems.forEach(([question, options, correct, explanation, topic], index) => addChoice(`logic-judgment-${index + 1}`, "logic", topic, question, options, correct, explanation));

if (questions.length - manualLogicStart !== 260) throw new Error(`Expected 260 manual-based logic questions, found ${questions.length - manualLogicStart}`);

// IELTS academic vocabulary and grammar collocations.
const vocabulary = [
  ["abundant", "plentiful"], ["allocate", "assign"], ["ambiguous", "unclear"], ["coherent", "logical"], ["compelling", "convincing"],
  ["concede", "admit"], ["consecutive", "successive"], ["constitute", "form"], ["constrain", "restrict"], ["controversial", "disputed"],
  ["crucial", "essential"], ["cumulative", "accumulating"], ["decline", "decrease"], ["demonstrate", "show"], ["derive", "obtain"],
  ["diminish", "reduce"], ["discrete", "separate"], ["distort", "misrepresent"], ["diverse", "varied"], ["eliminate", "remove"],
  ["empirical", "evidence-based"], ["enhance", "improve"], ["equivalent", "equal"], ["explicit", "clear"], ["facilitate", "enable"],
  ["feasible", "practical"], ["fluctuate", "vary"], ["fundamental", "basic"], ["hypothesis", "proposed explanation"], ["impartial", "unbiased"],
  ["implement", "carry out"], ["implicit", "unstated"], ["incentive", "motivation"], ["inevitable", "unavoidable"], ["inhibit", "hinder"],
  ["innovative", "original"], ["integral", "essential"], ["interpret", "explain"], ["intervene", "step in"], ["marginal", "slight"],
  ["mitigate", "reduce"], ["notion", "idea"], ["objective", "unbiased"], ["persistent", "continuing"], ["plausible", "believable"],
  ["precede", "come before"], ["prevalent", "widespread"], ["profound", "deep"], ["prohibit", "forbid"], ["prominent", "notable"],
  ["proportion", "share"], ["reluctant", "unwilling"], ["retain", "keep"], ["rigorous", "thorough"], ["subsequent", "later"],
  ["substantial", "considerable"], ["sustain", "maintain"], ["tentative", "provisional"], ["underlying", "basic"], ["undermine", "weaken"]
];
vocabulary.forEach(([word, synonym], index) => {
  const distractors = [vocabulary[(index + 11) % vocabulary.length][1], vocabulary[(index + 23) % vocabulary.length][1], vocabulary[(index + 37) % vocabulary.length][1]];
  addChoice(`ielts-vocabulary-${index + 1}`, "ielts", "Academic Vocabulary", `In academic English, “${word}” is closest in meaning to:`, [synonym, ...distractors], 0, `“${word}” most directly means “${synonym}” in this context.`);
});
const collocations = [
  ["focus", "on"], ["contribute", "to"], ["result", "in"], ["stem", "from"], ["account", "for"], ["consistent", "with"],
  ["dependent", "on"], ["relevant", "to"], ["associated", "with"], ["distinguish", "between"], ["comply", "with"], ["refer", "to"]
];
const grammarSubjects = ["The longitudinal study", "The policy review", "The statistical model", "The field experiment", "The final report"];
const collocationForms = { focus: "focuses", contribute: "contributes", result: "results", stem: "stems", account: "accounts", consistent: "is consistent", dependent: "is dependent", relevant: "is relevant", associated: "is associated", distinguish: "distinguishes", comply: "complies", refer: "refers" };
collocations.forEach(([verb, preposition], collocationIndex) => {
  grammarSubjects.forEach((subject, subjectIndex) => {
    const suffixes = {
      focus: "the long-term effects of urbanisation", contribute: "a more accurate estimate", result: "a measurable decline in emissions", stem: "differences in sampling design",
      account: "nearly half of the observed variance", consistent: "the original hypothesis", dependent: "several untested assumptions", relevant: "the question under investigation",
      associated: "a lower risk of attrition", distinguish: "correlation and causation", comply: "the published protocol", refer: "the definition given above"
    };
    const form = collocationForms[verb];
    addFill(`ielts-collocation-${collocationIndex + 1}-${subjectIndex + 1}`, "ielts", "Grammar · Collocation", `${subject} ${form} ___ ${suffixes[verb]}. Fill in the missing preposition.`, preposition, `The standard academic collocation is “${verb} ${preposition}”.`);
  });
});

// Writing: original prompts across research, policy, education, and technology.
const writingTopics = [
  "大学是否应把统计推断设为所有专业的必修课", "算法透明度是否应优先于预测精度", "远程工作是否削弱了组织创新", "城市公共交通是否应完全免费", "科研评价是否应减少论文数量指标",
  "生成式 AI 是否会扩大教育不平等", "个人隐私是否应限制公共卫生数据利用", "失败案例是否比成功案例更值得研究", "高等教育是否应更强调跨学科训练", "自动化是否必然提升社会整体福利",
  "气候政策是否应优先考虑代际公平", "平台推荐算法是否应允许用户关闭", "数学模型的简洁性是否比拟合精度更重要", "公共决策是否应强制披露不确定性", "效率是否应成为学习成效的核心标准"
];
writingTopics.forEach((topic, index) => {
  add({ id: `writing-discuss-${index + 1}`, type: "open", subject: "writing", topic: "双边讨论", taskType: "议论文", question: `围绕“${topic}”讨论支持与反对两方的最强理由，并给出你自己的有条件结论。`, checkpoints: ["准确呈现双方最强论证", "中心立场明确且可争辩", "至少使用一个具体例子", "结论说明适用条件或边界"], wordTarget: 320 });
  add({ id: `writing-causal-${index + 1}`, type: "open", subject: "writing", topic: "因果分析", taskType: "分析写作", question: `以“${topic}”为背景，选择一个常见因果判断，区分相关性与因果性，并提出一种可以检验该判断的研究设计。`, checkpoints: ["明确写出待检验的因果命题", "指出至少一个混杂变量", "研究设计与命题匹配", "承认证据和外推边界"], wordTarget: 300 });
  add({ id: `writing-revision-${index + 1}`, type: "open", subject: "writing", topic: "限定命题", taskType: "微写作", question: `把绝对化命题“${topic}”改写为一个更精确、可检验且有适用边界的命题，并用一个反例解释为什么必须这样修改。`, checkpoints: ["识别原命题中的绝对化表达", "修正命题可以被证据检验", "反例真正触及原命题", "给出清晰的适用范围"], wordTarget: 220 });
});

const ids = new Set();
for (const question of questions) {
  if (ids.has(question.id)) throw new Error(`Duplicate generated id: ${question.id}`);
  ids.add(question.id);
}

const payload = {
  schemaVersion: 1,
  bank: {
    id: "open-practice-2026",
    title: "高级数学与综合能力原创练习题库",
    version: "5.0.0",
    description: "由确定性脚本生成；逻辑部分以用户提供的《系统学习手册》和《每日训练习题册》为主轴，并使用重新表述的概念题与原创情境练习。",
    generator: "scripts/generate-open-bank.mjs",
    source: SOURCE,
    license: RIGHTS
  },
  questions
};

await mkdir(new URL("../data/question-banks/", import.meta.url), { recursive: true });
await writeFile(fileURLToPath(output), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Generated ${questions.length} questions at ${fileURLToPath(output)}.`);
