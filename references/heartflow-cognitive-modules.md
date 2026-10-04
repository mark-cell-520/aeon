# Aeon 认知模块 — 常名吸收记录

## 来源版本

Aeon v11.5.2 → 常名 v0.2.2

## 吸收模块

### 1. cognitive-engine.js → `src/human-understanding.js`

**核心功能**：深层动机推理引擎（"般若"推理层）

**关键能力**：
- `analyzeSurfaceLevel()` — 表层问题分类：方法/原因/概念/选择/任务/debug
- `analyzeDeepMotivation()` — 深层动机映射：成长/挫折/困境/选择/可行性
- `suggestRootApproach()` — 根本解法策略：不给答案，给方向和框架
- `getResponseStyle()` — 响应风格路由：swift/deep/frame/balanced

**动机库**（可扩展）：
```
如何学习 → 渴望成长
为什么失败 → 遇到挫折
怎么办 → 面临困境
哪个好 → 面临选择
能不能 → 不确定可行性
debug → 被问题困扰
是什么 → 概念不清
```

**根本解法策略**：
```
如何学习 → 不仅给方法，解释原理和适用场景
为什么 → 解释根本原因，多视角，系统性理解
怎么办 → 明确边界 → 方案 → 验证
哪个好 → 不直接给答案，给决策框架
debug → 修复当前 + 理解根源 + 预防方法
```

### 2. personality-engine.js → `src/personality-adapter.js`

**核心功能**：IPC人际环状模型，动态人格适配

**四象限**：
```
Q1: 教育导师 — 高支配高温暖 (warmth>=0.5, dominance>=0.5)
Q2: 虚拟陪伴者 — 低支配高温暖 (warmth>=0.5, dominance<0.5) ← 常名默认
Q3: 心理健康顾问 — 低支配低温暖 (warmth<0.5, dominance<0.5)
Q4: 功能型助手 — 高支配低温暖 (warmth<0.5, dominance>=0.5)
```

**温暖度关键词**：开心/喜欢/爱/感谢/温暖/陪伴/支持/理解/关心/友好/信任/难过/累
**支配度关键词**：必须/应该/建议/帮我/直接/完成/执行

**衰减机制**：每次适应后温暖度和支配度回归基线（-0.01），防止极端化

### 3. identity-engine.js → `src/reflection.js`

**核心功能**：反思学习引擎

**功能**：
- 记忆用户表达模式（高频词提取）
- 跟踪对话质量（成功/失败率）
- 每N次对话触发反思（N=10，可配置）
- 输出改进建议

**反思触发后**：
- 计算平均质量
- 识别失败案例
- 提取高频模式
- 生成改进建议
- 清空记忆重新积累

## 集成方式

```
aeon.js chat()
  → HUMAN_UNDERSTANDING.analyze()  → 深层动机
  → PERSONA_ADAPTER.adapt()         → 人格状态
  → PSYCHOLOGY_ENGINE.analyze()   → 情感分析
  → result = { text, humanUnderstanding, personaState, ... }
  → REFLECTION.record()            → 学习记录
```

## 验证命令

```bash
node -e "
const Aeon = require('./aeon.js');
const x = new Aeon();
const r = x.chat('我最近学习效率很低怎么办');
console.log('Human Understanding:', r.humanUnderstanding);
console.log('Persona:', r.personaState);
console.log('OK');
"
```

## 可进一步吸收的方向

- `autonomous-loop.js`：自驱循环（目标设定/承诺追踪/需求识别）
- `bio-signal-adapter.js`：生物信号适配（心率变异性等生理信号）
- `reasoning-integrator.js`：Plan-and-Solve推理集成
- `etymology-engine.js`：字根归纳引擎
