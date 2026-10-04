#!/usr/bin/env node
/**
 * 常名客户端 — 发送一条消息并等待回应
 * serve 没在运行时会自动拉起（等它就绪后继续）。
 * 用法: node ~/.codex/skills/aeon/scripts/aeon-say.js <消息...>
 */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const skillDir = path.join(__dirname, '..');
const servePath = path.join(skillDir, 'scripts', 'aeon-serve.js');
const runtimeDir = path.join(os.homedir(), '.aeon-runtime');
const inboxPath = path.join(runtimeDir, 'inbox.jsonl');
const outboxPath = path.join(runtimeDir, 'outbox.jsonl');

const msg = process.argv.slice(2).join(' ').trim();
if (!msg) { console.error('用法: node aeon-say.js <消息>'); process.exit(1); }

fs.mkdirSync(runtimeDir, { recursive: true });

function serveAlive() {
  try {
    const out = require('child_process').execSync('pgrep -fl aeon-serve || true').toString();
    return out.indexOf('aeon-serve') !== -1;
  } catch (_) { return false; }
}

function ensureServe(cb) {
  if (serveAlive()) return cb();
  const child = spawn(process.execPath, [servePath], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
  const deadline = Date.now() + 8000;
  (function wait() {
    if (serveAlive()) return cb();
    if (Date.now() > deadline) return cb();
    setTimeout(wait, 250);
  })();
}

const req = { id: 'r' + Date.now() + Math.random().toString(36).slice(2, 6), msg: msg };

ensureServe(function () {
  fs.appendFileSync(inboxPath, JSON.stringify(req) + '\n');
  const deadline = Date.now() + 15000;
  (function poll() {
    if (fs.existsSync(outboxPath)) {
      const lines = fs.readFileSync(outboxPath, 'utf8').trim().split('\n');
      for (let i = lines.length - 1; i >= 0; i--) {
        let e;
        try { e = JSON.parse(lines[i]); } catch (_) { continue; }
        if (e.id === req.id) {
          console.log('常名> ' + e.text);
          if (e.suggestion) console.log('     (建议) ' + e.suggestion);
          if (e.error) console.log('     (error) ' + e.error);
          return;
        }
      }
    }
    if (Date.now() > deadline) { console.log('（无回应，请检查 ~/.aeon-runtime/serve.log）'); return; }
    setTimeout(poll, 200);
  })();
});
