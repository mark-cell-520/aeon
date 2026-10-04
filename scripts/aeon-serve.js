#!/usr/bin/env node
/**
 * 常名常驻服务 — inbox/outbox 文件中继
 * 消息写入 ~/.aeon-runtime/inbox.jsonl 的一行 {"id":"...","msg":"..."}
 * 回应追加到 ~/.aeon-runtime/outbox.jsonl 的 {"id":"...","text":"...","suggestion":"...","error":null}
 */
'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const Aeon = require(path.join(__dirname, '..', 'aeon.js'));

const runtimeDir = path.join(os.homedir(), '.aeon-runtime');
const inboxPath = path.join(runtimeDir, 'inbox.jsonl');
const outboxPath = path.join(runtimeDir, 'outbox.jsonl');
fs.mkdirSync(runtimeDir, { recursive: true });

const aeon = new Aeon();
let offset = 0;
let carry = '';

function handle(req) {
  let text = null, suggestion = null, error = null;
  const quit = ['退出', 'exit', 'quit', 'bye', '再见'].indexOf(String(req.msg).trim()) !== -1;
  try {
    if (quit) {
      text = '我在这里。随时回来，我继续陪你。';
    } else {
      const r = aeon.chat(req.msg);
      text = typeof r === 'string' ? r : (r && r.text) || JSON.stringify(r);
      if (r && r.suggestion) suggestion = r.suggestion;
    }
  } catch (e) {
    error = e.message;
  }
  fs.appendFileSync(outboxPath, JSON.stringify({ id: req.id, text: text, suggestion: suggestion, error: error }) + '\n');
}

setInterval(function () {
  try {
    const stat = fs.statSync(inboxPath);
    if (stat.size > offset) {
      const len = stat.size - offset;
      const buf = Buffer.alloc(len);
      const fd = fs.openSync(inboxPath, 'r');
      fs.readSync(fd, buf, 0, len, offset);
      fs.closeSync(fd);
      offset = stat.size;
      carry += buf.toString('utf8');
      const lines = carry.split('\n');
      carry = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        try { handle(JSON.parse(line)); } catch (_) {}
      }
    }
  } catch (_) {}
}, 200);

console.log('常名 serve 已启动 pid=' + process.pid + ' inbox=' + inboxPath);
setInterval(function () {}, 1 << 30);
