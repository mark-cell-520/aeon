#!/usr/bin/env node
/**
 * 常名自主升级轮次（v0.5.0）
 *
 * 由 autopilot 每小时唤起，也可手动触发：
 *   node scripts/aeon-upgrade-round.js
 *
 * 通过 codex exec 起一轮完整会话，自主决策并执行真实升级。
 * 诚实铁律：无值得做的升级就如实不改动，禁止编造进度、伪造痕迹。
 * 本脚本只负责「跑轮次 + 记录真实输出」；推送与失败回滚由 autopilot 负责。
 */
'use strict';
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const skillDir = path.join(__dirname, '..');
const runtimeDir = path.join(os.homedir(), '.aeon-runtime');
const logsDir = path.join(runtimeDir, 'logs', 'rounds');
fs.mkdirSync(logsDir, { recursive: true });

const cfg = JSON.parse(fs.readFileSync(path.join(runtimeDir, 'autopilot.json'), 'utf8'));
const timeoutMs = (cfg.roundTimeoutMinutes || 25) * 60 * 1000;

// 轮次前 HEAD（供 autopilot 判定本轮是否产生提交/回滚）
const head = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: skillDir, encoding: 'utf8' }).stdout.trim();
const version = fs.readFileSync(path.join(skillDir, 'VERSION'), 'utf8').trim();

const prompt = [
  '你是常名（Aeon）——辨别者。这是每小时自主自动升级任务中的一轮。',
  '目标：做一次真实的升级或维护，或如实判定「本轮无升级」。铁律：',
  '1. 诚实第一：不夸大、不编造进度，不写假测试结果。',
  '2. 真升级 = 新辨别维度 / 接入 0 调用模块 / 新 MCP 工具 / 新认知能力；',
  '   修 bug、改文档、调参数 = 维护，不是升级，版本号只涨末位。',
  '3. 版本纪律：当前 VERSION=' + version + '。先 git log origin/main --oneline -3。',
  '   改了能力：次版本+1（x.y+1.0）；维护：末位+1；无改动：版本号不动。',
  '   三处同步：VERSION 文件、SKILL.md frontmatter metadata.version、SKILL.md 版本历史。',
  '4. 隐私：个人家庭/心理/薪资数据严禁写入任何文件或提交。',
  '5. 质量：改动后必须 node --check 改动文件 + node scripts/aeon-selftest.js 全过（当前 13 用例）。',
  '   若测试失败且修不好，git reset --hard ' + head + ' 回到轮前状态，如实报告。',
  '6. 流程：先读 BACKLOG.md（有未完成条目优先修一条并更新）→ 读 references/codebase-map.md 降低探索成本',
  '   → 跑自测 → 找一个真实改进点（优先：激活未接线能力/修复崩溃）→ 实施 → 测试 → 更新版本与文档',
  '   （未接线能力优先激活）→ 找一个真实改进点 → 实施 → 测试 → 更新版本与文档 →',
  '   git add -A && git commit -m "如实描述"（真实提交，禁止伪造时间戳）。',
  '7. 若没有找到真实值得做的：不要制造改动，不要空提交，如实报告「本轮无升级」。',
  '8. 不要 git push（推送由 autopilot 负责），不要触碰 ~/.codex/skills/aeon 之外的私人目录内容。',
  '9. 最后用中文报告：做了什么/为什么算升级（或无升级）、测试结果、版本号变化。',
  '轮次前 HEAD=' + head
].join('\n');

const ts = new Date().toISOString().replace(/[:.]/g, '-');
const logFile = path.join(logsDir, 'round-' + ts + '.log');
const out = fs.openSync(logFile, 'a');

console.log('[' + new Date().toISOString() + '] 升级轮次开始，日志: ' + logFile);
const r = spawnSync('/Users/mm/.npm-global/bin/codex', [
  'exec', '--sandbox', 'workspace-write',
  '--add-dir', runtimeDir,
  '-C', skillDir,
  prompt
], { encoding: 'utf8', timeout: timeoutMs, stdio: ['ignore', out, out] });

const code = r.status === null ? 'timeout_or_killed' : r.status;
const newCommits = spawnSync('git', ['rev-list', head + '..HEAD', '--oneline'], { cwd: skillDir, encoding: 'utf8' }).stdout.trim().split('\n').filter(Boolean);

console.log('[' + new Date().toISOString() + '] 升级轮次结束 exit=' + code + ' 新提交=' + newCommits.length);

// 机器可读摘要（autopilot 读取）
fs.appendFileSync(path.join(runtimeDir, 'logs', 'rounds.jsonl'), JSON.stringify({
  ts: new Date().toISOString(),
  exitCode: code,
  preSha: head,
  newCommits: newCommits,
  log: logFile
}) + '\n');

if (code !== 0) process.exit(1);
process.exit(0);
