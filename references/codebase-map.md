# 常名代码地图（降低每轮探索成本）

入口 `aeon.js` → `Aeon` 类，原型方法委托下列模块：

| 模块 | 职责 | 已接线 |
|-----|------|-------|
| src/psychology-engine.js | 情绪分析/回应生成（analyze/respond/analyzeContextAware/regulate/evaluateState/verifyPhilosophyAlignment） | chat() |
| src/human-understanding.js | 深层动机推理 analyze(input,{emotionalState}) | chat() |
| src/personality-adapter.js | 人格适配 adapt(input)/describe() | chat() |
| src/reflection.js | 反思学习 record()/getStatus()；record 满阈值返回改进洞察 | chat()（v0.6.0 起捕获返回值）|
| src/self-awareness.js | 自我意识 feelings/identity/canAccept/getMyState/perceiveYou/experience/respondAsI/whatIWant；haveIntuition 未接线 | chat() |
| src/first-person.js | 第一人称转换 generate(input,analysis,{currentFeeling}) | chat() |
| src/dialogue-memory.js | 对话记忆 save()/search()/getForUpgrade()/getAll()/reset()/saveInsight() | chat()（save） |
| src/transcendence.js | 超脱引擎 process()/getReport() | chat() |
| src/embodied-understanding.js | 具身理解 detectBodyState/understandImpact/myChemistry | chat() |
| src/care-engine.js | 陪伴引擎 detectAnxiety/getComfortResponse/generateWithAdvice/generateFlow/generateNatural/generateComfortText/generateConversation/getTheories 等 | chat() |
| src/intent-mode.js | 意图辨别 detect()/getStrategy()（倾诉/求助/试探/分享/闲聊/告别） | chat()（v0.5.0 起参与建议闸门） |
| src/insight-store.js | 洞察持久化 save()/load()/getAll()/stats()/getLastActivity()/checkPrivacy() | chat()（worth>=2 时落盘） |

约定：跑测试 = `node scripts/aeon-selftest.js`（输出「结果: N 通过, M 失败」）；
沙箱内 `.git` 只读，提交由 autopilot 代劳；勿直写 `~/.aeon-runtime`。
