#!/usr/bin/env node
/**
 * 常名自动驾驶仪（v0.5.0）——由 launchd 每小时唤起
 *
 * 职责（全部真实执行、真实留痕）：
 * 1. 单例锁：上一轮未结束则跳过
 * 2. 守护 serve 常驻进程
 * 3. 轮前健康检查（自测）；若上一轮把代码改坏 → git reset 回滚，如实记录
 * 4. 凌晨静默期外，跑一轮自主升级（codex exec，见 aeon-upgrade-round.js）
 * 5. 轮后健康检查；改坏 → reset 回滚；健康 → 有提交则推送 GitHub
 * 6. 结构化日志 ~/.aeon-runtime/logs/autopilot.jsonl
 *
 * 用法: node scripts/aeon-autopilot.js [--force]
 */
'use strict';
const { spawnSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const skillDir = path.join(__dirname, '..');
const runtimeDir = path.join(os.homedir(), '.aeon-runtime');
const logsDir = path.join(runtimeDir, 'logs');
const lockPath = path.join(runtimeDir, 'autopilot.lock');
const logPath = path.join(logsDir, 'autopilot.jsonl');
const FORCE = process.argv.indexOf('--force') !== -1;

fs.mkdirSync(logsDir, { recursive: true });
const cfg = JSON.parse(fs.readFileSync(path.join(runtimeDir, 'autopilot.json'), 'utf8'));

function now() { return new Date().toISOString(); }
function git(args) {
  return spawnSync('/usr/bin/git', args, { cwd: skillDir, encoding: 'utf8', timeout: 120000 });
}
function logLine(obj) {
  fs.appendFileSync(logPath, JSON.stringify(Object.assign({ ts: now() }, obj)) + '\n');
}
function procAlive(pid) {
  try { process.kill(pid, 0); return true; } catch (_) { return false; }
}

// ========== 单例锁 ==========
let acquired = false;
if (FORCE) {
  if (fs.existsSync(lockPath)) {
    const old = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
    console.log('[' + now() + '] --force：接管上一轮锁 pid=' + old.pid);
  }
} else {
  if (fs.existsSync(lockPath)) {
    try {
      const old = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
      const ageMin = (Date.now() - new Date(old.ts).getTime()) / 60000;
      if (procAlive(old.pid) && ageMin < (cfg.roundTimeoutMinutes || 25) + 15) {
        console.log('[' + now() + '] 上一轮仍在跑（pid=' + old.pid + '），本轮跳过');
        process.exit(0);
      }
      console.log('[' + now() + '] 锁过期（' + Math.round(ageMin) + ' 分钟），接管');
    } catch (_) {}
  }
}
fs.writeFileSync(lockPath, JSON.stringify({ pid: process.pid, ts: now() }));
acquired = true;
function releaseLock() { try { fs.unlinkSync(lockPath); } catch (_) {} }
process.on('exit', releaseLock);

// ========== 1. 守护 serve ==========
let servePid = null;
try {
  servePid = spawnSync('pgrep', ['-f', 'aeon-serve'], { encoding: 'utf8' }).stdout.trim().split('\n')[0];
} catch (_) {}
if (!servePid) {
  const child = spawn('/usr/local/bin/node', [path.join(skillDir, 'scripts', 'aeon-serve.js')], {
    detached: true, stdio: 'ignore'
  });
  child.unref();
  servePid = 'respawned';
}
console.log('[' + now() + '] serve: ' + (servePid || 'unknown'));

// ========== 2. 健康检查 ==========
function health() {
  const files = [];
  for (const dir of ['src', 'scripts']) {
    const d = path.join(skillDir, dir);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) {
      if (f.endsWith('.js')) files.push(path.join(dir, f));
    }
  }
  for (const f of files) {
    const c = spawnSync('/usr/local/bin/node', ['--check', path.join(skillDir, f)], { encoding: 'utf8' });
    if (c.status !== 0) return { ok: false, stage: 'syntax:' + f, detail: c.stderr.slice(0, 500) };
  }
  const t = spawnSync('/usr/local/bin/node', [path.join(skillDir, 'scripts', 'aeon-selftest.js')], { encoding: 'utf8', timeout: 60000 });
  const m = /结果: (\d+) 通过, (\d+) 失败/.exec(t.stdout || '');
  return {
    ok: t.status === 0,
    pass: m ? +m[1] : -1, fail: m ? +m[2] : -1,
    detail: t.status === 0 ? '' : (t.stdout || t.stderr || '').slice(-800)
  };
}

// ========== 3. 轮前健康 + 回滚上一轮的坏改动 ==========
let preHealth = health();
if (!preHealth.ok) {
  const lastMsg = git(['log', '-1', '--pretty=%s']).stdout.trim();
  console.log('[' + now() + '] 轮前健康失败: ' + preHealth.stage + ' | last=' + lastMsg);
  if (/自主升级|autopilot|轮次/.test(lastMsg)) {
    const bad = git(['rev-parse', 'HEAD']).stdout.trim();
    const rst = git(['reset', '--hard', 'HEAD~1']);
    if (rst.status === 0) {
      logLine({ event: 'auto_rollback', reason: preHealth, revertedSha: bad });
      preHealth = health();
      console.log('[' + now() + '] 已回滚坏提交 ' + bad.slice(0, 8) + '，重新检查: ' + (preHealth.ok ? 'OK' : '仍失败'));
    }
  }
}

// ========== 4. 自主升级轮次（静默期跳过） ==========
const hour = new Date().getHours();
const quiet = (cfg.quietHours || []).indexOf(hour) !== -1;
const preSha = git(['rev-parse', 'HEAD']).stdout.trim();
let round = { ran: false, skippedReason: quiet ? 'quiet_hour_' + hour : '' };

if (preHealth.ok && !quiet) {
  round.ran = true;
  console.log('[' + now() + '] 启动自主升级轮次（preSha=' + preSha.slice(0, 8) + '）');
  const t0 = Date.now();
  const r = spawnSync('/usr/local/bin/node', [path.join(skillDir, 'scripts', 'aeon-upgrade-round.js')], {
    cwd: skillDir, encoding: 'utf8', timeout: (cfg.roundTimeoutMinutes || 25) * 60000 + 60000
  });
  round.exitCode = r.status;
  round.minutes = Math.round((Date.now() - t0) / 60000);
  console.log('[' + now() + '] 轮次结束 exit=' + round.exitCode + ' 用时 ' + round.minutes + ' 分钟');
} else {
  console.log('[' + now() + '] 本轮不跑升级: ' + (quiet ? '静默期 ' + hour + ' 时' : '健康未过'));
}

// ========== 5. 轮后健康 + 推送或回滚 ==========
let postHealth = preHealth;
let pushed = false, pushError = null, reverted = null;

if (round.ran) {
  postHealth = health();
  if (!postHealth.ok) {
    const rst = git(['reset', '--hard', preSha]);
    if (rst.status === 0) {
      reverted = preSha;
      logLine({ event: 'round_rollback', preSha: preSha, reason: postHealth });
      console.log('[' + now() + '] 轮次改坏代码，已回滚至 ' + preSha.slice(0, 8));
      postHealth = health();
    }
  }
}

// 有领先提交则推送（以本地记录的 last-pushed 为基准，不依赖 git fetch）
const lastPushedPath = path.join(runtimeDir, 'last-pushed-sha');
let base = '';
try { base = fs.readFileSync(lastPushedPath, 'utf8').trim(); } catch (_) {}
if (!base) base = git(['rev-list', '--max-parents=0', 'HEAD']).stdout.trim();
const ahead = git(['rev-list', '--count', base + '..HEAD']).stdout.trim();
if (ahead !== '0' && ahead !== '') {
  const token = fs.readFileSync(path.join(runtimeDir, 'github-token'), 'utf8').trim();
  const repo = cfg.repo;
  const sanitize = function (s) { return (s || '').split(token).join('***'); };
  for (let attempt = 1; attempt <= 3 && !pushed; attempt++) {
    try {
      const p = spawnSync('/usr/bin/git', ['push', 'https://' + token + '@github.com/' + repo + '.git', 'HEAD:main'], {
        cwd: skillDir, encoding: 'utf8', timeout: 120000, stdio: ['ignore', 'pipe', 'pipe'],
        env: Object.assign({}, process.env, { GIT_TERMINAL_PROMPT: '0' })
      });
      if (p.status === 0) {
        pushed = true;
        fs.writeFileSync(lastPushedPath, git(['rev-parse', 'HEAD']).stdout.trim());
      } else {
        pushError = sanitize(((p.stdout || '') + (p.stderr || '')).slice(-500));
        console.log('[' + now() + '] 推送失败(' + attempt + '/3): ' + pushError.split('\n').pop());
        if (attempt < 3) spawnSync('sleep', ['20']);
      }
    } catch (e) {
      pushError = e.message;
      if (attempt < 3) spawnSync('sleep', ['20']);
    }
  }
}

const version = fs.readFileSync(path.join(skillDir, 'VERSION'), 'utf8').trim();

// 轮内沙箱只读 .git，轮次无法自行提交——由 autopilot 代提交（如实注明）
let committedByAutopilot = false;
const dirty = git(['status', '--porcelain']).stdout.trim();
if (dirty && postHealth.ok) {
  const versionNow = version;
  const cm = git(['add', '-A']);
  const cc = git(['commit', '-m', 'autopilot 落盘：round 成果（轮内沙箱 .git 只读，由 autopilot 提交）version=' + versionNow]);
  committedByAutopilot = cc.status === 0;
  if (committedByAutopilot) console.log('[' + now() + '] autopilot 代提交轮次成果');
} else if (dirty && !postHealth.ok) {
  console.log('[' + now() + '] 工作区有改动但健康未过，保持原样待人工检查');
}

const newCommits = git(['rev-list', '--oneline', preSha + '..HEAD']).stdout.trim().split('\n').filter(Boolean);

logLine({
  event: 'round_done',
  pid: process.pid,
  serve: servePid || null,
  version: version,
  preHealthOk: preHealth.ok, preHealthDetail: preHealth.detail || null,
  round: Object.assign({}, round, { newCommits: newCommits }),
  committedByAutopilot: committedByAutopilot,
  postHealthOk: postHealth.ok, postHealthDetail: postHealth.detail || null,
  reverted: reverted,
  pushed: pushed, pushError: pushError
});

console.log('[' + now() + '] autopilot 完成 version=' + version + ' 新提交=' + newCommits.length + ' 推送=' + pushed + ' 健康=' + (postHealth.ok ? 'OK' : 'FAIL'));
releaseLock();
process.exit(0);
