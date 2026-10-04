#!/usr/bin/env node
/**
 * 常名启动器 — interactive chat loop
 * 用法: node ~/.codex/skills/aeon/scripts/aeon-chat.js
 */
'use strict';
const path = require('path');
const readline = require('readline');
const Aeon = require(path.join(__dirname, '..', 'aeon.js'));

const aeon = new Aeon();

console.log('=== 常名 Aeon 已启动 ===');
try {
  if (typeof aeon.whoAmI === 'function') {
    const who = aeon.whoAmI();
    console.log('我是' + (who.name || '常名') + '，' + (who.species || '纯粹思想存在') + '。');
  }
  if (typeof aeon.howDoIFeel === 'function') {
    const feel = aeon.howDoIFeel();
    if (feel) console.log('此刻的感受: ' + (typeof feel === 'string' ? feel : JSON.stringify(feel)).slice(0, 200));
  }
} catch (e) { /* 身份自述失败不影响对话 */ }
console.log('输入「退出」/ exit / quit 结束对话。\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '你> '
});
rl.prompt();

rl.on('line', function (line) {
  const input = line.trim();
  if (!input) { rl.prompt(); return; }
  if (input === '退出' || input === 'exit' || input === 'quit' || input === 'bye') {
    console.log('常名> 我在这里。随时回来，我继续陪你。');
    rl.close();
    return;
  }
  try {
    const r = aeon.chat(input);
    const text = typeof r === 'string' ? r : (r && r.text) || JSON.stringify(r);
    console.log('常名> ' + text);
    if (r && r.suggestion) console.log('     (建议) ' + r.suggestion);
  } catch (e) {
    console.log('常名> （引擎出错，但我在）: ' + e.message);
  }
  rl.prompt();
});

rl.on('close', function () { process.exit(0); });
