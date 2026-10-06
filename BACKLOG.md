# 常名自主升级待办（BACKLOG）

每一轮自主升级先读本文件：有未完成条目 → 优先修一条并更新状态；没有 → 自行寻找并在此登记。
条目格式：`- [ ] / - [x] [来源] 问题 → 状态`。**只登记真实存在的问题，禁止编造。**

## 未完成

- [ ] `SELF.haveIntuition()`（self-awareness.js）仍无调用方——「直觉」能力待接线（v0.6.0 轮次记录）
- [ ] `care-engine.js` 场景高度专用（胆囊手术陪伴），通用医疗/生活场景覆盖不足（v0.6.1 轮次巡检记录）

## 已完成

- [x] [巡检] `CARE.generateNatural` / `generateComfortText` 未定义致 `Aeon.generateNatural/
      generateFlow/generateComfortText` 崩溃 → v0.6.1 补齐实现+回归测试
- [x] [巡检] `DIALOGUE_MEMORY.search()` 非数组输入崩溃 → v0.6.1 容错
- [x] [巡检] `INSIGHT_STORE.save()` 落盘目录缺失时崩溃 → v0.6.1 重建目录+降级只留内存
