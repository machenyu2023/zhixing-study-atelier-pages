import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const output = new URL("../data/question-banks/open-practice-bank.json", import.meta.url);
const questions = [];
const SOURCE = "知行原创参数化题库 v3";
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

// Logic: valid and invalid conditional inferences, number patterns, and syllogisms.
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
for (let index = 1; index <= 30; index += 1) {
  const start = integer(-10, 20), step = integer(2, 12), terms = [0, 1, 2, 3, 4].map(offset => start + offset * step);
  const answer = start + 5 * step;
  addFill(`logic-sequence-arithmetic-${index}`, "logic", "数列规律", `找出规律并填写下一项：${terms.join(", ")}, ___。`, answer, `相邻两项的差恒为 ${step}，所以下一项是 ${terms[4]}+${step}=${answer}。`);
}
for (let index = 1; index <= 30; index += 1) {
  const first = integer(1, 8), plus = integer(2, 8), times = integer(2, 4);
  const terms = [first];
  for (let offset = 1; offset < 6; offset += 1) terms.push(offset % 2 ? terms[offset - 1] + plus : terms[offset - 1] * times);
  addFill(`logic-sequence-alternating-${index}`, "logic", "数列规律", `数列按“+${plus}，×${times}”交替变化：${terms.slice(0, 5).join(", ")}, ___。`, terms[5], `第 5 项之后应执行“+${plus}”，所以答案为 ${terms[4]}+${plus}=${terms[5]}。`);
}
const syllogismNouns = [
  ["凸函数", "连续函数", "目标函数"], ["正定矩阵", "可逆矩阵", "协方差矩阵"], ["Poisson 过程", "计数过程", "到达过程"],
  ["无偏估计量", "统计量", "矩估计量"], ["Hilbert 空间", "赋范空间", "函数空间"], ["鞅", "适应过程", "价格过程"],
  ["正态变量", "连续变量", "测量误差"], ["闭集", "可测集", "可行域"], ["酉矩阵", "正规矩阵", "变换矩阵"], ["遍历链", "不可约链", "有限状态链"]
];
syllogismNouns.forEach(([a, b, c], index) => {
  addChoice(`logic-syllogism-${index + 1}-some`, "logic", "三段论", `所有${a}都是${b}；有些${c}是${a}。哪项必然成立？`, [`所有${c}都是${b}`, `有些${c}是${b}`, `没有${c}是${b}`, `有些${b}不是${c}`], 1, `至少有一部分${c}属于${a}，而${a}都属于${b}，所以有些${c}是${b}。`);
  addChoice(`logic-syllogism-${index + 1}-none`, "logic", "三段论", `没有${a}是${b}；有些${c}是${a}。哪项必然成立？`, [`所有${c}都不是${b}`, `有些${c}不是${b}`, `有些${b}是${c}`, `所有${a}都是${c}`], 1, `存在一部分${c}属于${a}，而${a}与${b}互斥，因此这些${c}不是${b}。`);
});

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
    version: "3.0.0",
    description: "由确定性脚本生成，覆盖优化、矩阵论、随机过程、高等概率论、逻辑、雅思学术语言与写作。",
    generator: "scripts/generate-open-bank.mjs",
    source: SOURCE,
    license: RIGHTS
  },
  questions
};

await mkdir(new URL("../data/question-banks/", import.meta.url), { recursive: true });
await writeFile(fileURLToPath(output), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Generated ${questions.length} questions at ${fileURLToPath(output)}.`);
