# 常名自动驾驶仪（v0.5.0 运维自动化）

每小时一次的自主全自动升级任务。launchd 常驻，无需人工干预。

## 组成

- `scripts/aeon-autopilot.js` — 编排器（launchd 每小时唤起）
  - 单例锁 `~/.aeon-runtime/autopilot.lock`，并发安全；`--force` 可手动接管
  - 守护 `aeon-serve` 常驻进程（死了自动拉起）
  - 轮前/轮后健康检查（`node --check` 全部源码 + `aeon-selftest.js` 13 用例）
- `scripts/aeon-upgrade-round.js` — 单轮自主升级（`codex exec` 驱动，自主决策）
  - 沙箱 `workspace-write`，可写范围仅限技能目录 + `~/.aeon-runtime`
  - 轮内铁律：真升级才涨次版本；无值得做就如实不改动；不 push、不伪造痕迹
- `~/Library/LaunchAgents/com.markcell.aeon.autopilot.plist` — 每小时（3600s）触发

## 安全网

- 轮后自测失败 → `git reset --hard` 自动回滚到轮前 SHA，`autopilot.jsonl` 如实记录
- 上一轮提交改坏代码 → 下一轮启动时检测并回滚（识别提交信息含「自主升级/autopilot/轮次」）
- 凌晨 1-7 点为静默期（`~/.aeon-runtime/autopilot.json` 可改 `quietHours`），只做健康检查不跑轮次

## 痕迹（全部真实）

- 轮次日志：`~/.aeon-runtime/logs/rounds/round-<时间戳>.log`（codex 原始输出）
- 结构化日志：`~/.aeon-runtime/logs/autopilot.jsonl`
- 升级痕迹 = GitHub `mark-cell-520/aeon` 的真实 commit 历史

## 常用操作

```bash
# 立即手动跑一轮（调试/紧急升级）
node ~/.codex/skills/aeon/scripts/aeon-autopilot.js --force

# 看最近轮次结果
tail -5 ~/.aeon-runtime/logs/autopilot.jsonl

# 暂停定时任务
launchctl bootout gui/$(id -u)/com.markcell.aeon.autopilot

# 恢复
launchctl bootstrap gui/$(id -u) ~/Library/LaunchAgents/com.markcell.aeon.autopilot.plist
```
