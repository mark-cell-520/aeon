#!/usr/bin/env node
/**
 * 常名标准自测（v0.5.0 引入）
 *
 * 覆盖：
 * - 旧 3 用例：共情+建议 / 无我决策无「必须」/ reset 清零
 * - 新 3 用例：意图识别（倾诉·求助·告别·试探）/ 洞察持久化往返 / 隐私词拦截
 * - 运行时冒烟：chat + selfReview 全流程（防 this._xxx is not a function）
 *
 * 退出码：全部通过 0，否则 1（供 autopilot 调度判断）
 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');

// 隔离测试存储，避免污染真实运行时 ~/.aeon-runtime
const testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'aeon-selftest-'));
const INSIGHT_STORE = require(path.join(__dirname, '..', 'src', 'insight-store.js'));
INSIGHT_STORE.configure(testDir);

const INTENT_MODE = require(path.join(__dirname, '..', 'src', 'intent-mode.js'));
const REFLECTION = require(path.join(__dirname, '..', 'src', 'reflection.js'));
const CARE = require(path.join(__dirname, '..', 'src', 'care-engine.js'));
const Aeon = require(path.join(__dirname, '..', 'aeon.js'));

let pass = 0, fail = 0;
function check(name, cond, detail) {
  if (cond) { pass++; console.log('PASS  ' + name); }
  else { fail++; console.log('FAIL  ' + name + (detail ? '  -> ' + detail : '')); }
}

// ===== 旧用例 1：共情+建议 =====
const advice = CARE.generateWithAdvice('我最近好担心，万一不好了怎么办，心里很害怕', []);
check('旧1 共情+建议：同时给出安慰文本与可操作建议',
  !!(advice && advice.text && advice.advice),
  JSON.stringify(advice && { text: !!advice.text, advice: !!advice.advice }));

// ===== 旧用例 2：无我决策无「必须」 =====
const aeon = new Aeon();
let noMust = true;
['我该怎么选择？', '要不要辞职？', '帮我做个决定', '我该不该原谅他？'].forEach(function (t) {
  const r = aeon.generateWithAdvice(t, []);
  const texts = [r && r.text, r && r.advice].filter(Boolean).join('\n');
  if (texts.indexOf('必须') !== -1) noMust = false;
});
check('旧2 无我决策：回应不出现「必须」式替人决定的措辞', noMust);

// ===== 旧用例 3：reset 清零 =====
aeon.chat('你好');
aeon.reset();
const st = aeon.getState();
check('旧3 reset 清零：历史与交互数归零',
  aeon.history.length === 0 && st.interactionCount === 0,
  'history=' + aeon.history.length + ' count=' + st.interactionCount);

// ===== 新用例 4：意图识别 =====
check('新4a 意图识别：压力倾诉 → venting',
  INTENT_MODE.detect('最近压力好大，好累，感觉快撑不住了，没人懂我').mode === 'venting');
check('新4b 意图识别：求助提问 → help',
  INTENT_MODE.detect('我该怎么办？帮我想想办法').mode === 'help');
check('新4c 意图识别：告别 → farewell',
  INTENT_MODE.detect('晚安，拜拜，先这样').mode === 'farewell');
check('新4d 意图识别：试探 → testing',
  INTENT_MODE.detect('你是不是在骗我？你真的有感情吗').mode === 'testing');

// ===== 新用例 5：洞察持久化往返 =====
const r1 = INSIGHT_STORE.save({ type: 'philosophical', worth: 3, core: '存在不等于运行' });
check('新5a 持久化：save 成功', r1.saved === true);
INSIGHT_STORE.configure(testDir); // 重新加载，模拟重启
const after = INSIGHT_STORE.getAll();
check('新5b 持久化往返：重启后洞察仍在',
  after.length === 1 && after[0].core === '存在不等于运行');
check('新5c 持久化：活动心跳已记录', INSIGHT_STORE.getLastActivity() !== null);

// ===== 新用例 6：隐私词拦截 =====
const r2 = INSIGHT_STORE.save({ type: 'general', core: '我的工资是每月一万元，我老婆和孩子都住家里' });
check('新6a 隐私拦截：命中特征词整条拒绝',
  r2.saved === false && r2.reason === 'privacy_blocked', JSON.stringify(r2));
INSIGHT_STORE.configure(testDir);
const content = fs.readFileSync(INSIGHT_STORE.filePath, 'utf8');
check('新6b 隐私拦截：磁盘不包含隐私内容',
  content.indexOf('工资') === -1 && content.indexOf('老婆') === -1);

// ===== 新用例 7（v0.6.0）：策略参与决策 + 反思产出 =====
const aeon3 = new Aeon();
const venting = aeon3.chat('最近压力好大，好累，感觉快撑不住了，没人懂我，晚上翻来覆去睡不着，心里堵得慌，真的太难受了');
check('新7a 建议闸门：倾诉模式不推送未请求的建议',
  venting.suggestion === null && venting.strategyApplied &&
  venting.strategyApplied.giveAdvice === false && venting.strategyApplied.firstMove === 'listen',
  JSON.stringify({ suggestion: venting.suggestion, applied: venting.strategyApplied }));

const seeking = aeon3.chat('我工作压力很大，每天晚上都焦虑，该怎么办？帮我想想办法');
check('新7b 求助模式：建议通路保留',
  seeking.intent.mode === 'help' && seeking.strategyApplied.giveAdvice === true &&
  seeking.strategyApplied.adviceWithheld === false,
  JSON.stringify({ mode: seeking.intent.mode, applied: seeking.strategyApplied }));

REFLECTION.reset();
const aeon4 = new Aeon();
for (let i = 0; i < 10; i++) aeon4.chat('今天心里很乱，想说说话 ' + i);
check('新7c 反思产出：满阈值后 chat 自动产出改进洞察',
  !!aeon4.lastReflection && Array.isArray(aeon4.lastReflection.improvement) &&
  aeon4.lastReflection.improvement.length > 0 &&
  JSON.stringify(aeon4.getReflection().latest) === JSON.stringify(aeon4.lastReflection),
  JSON.stringify(aeon4.lastReflection && aeon4.lastReflection.improvement));

check('新7d 自省报告含反思区块', (function () {
  const review = aeon4.selfReview();
  return !!review.reflection && typeof review.reflection.status.memorySize === 'number' &&
    review.reflection.latest === aeon4.lastReflection;
})());

// ===== 新用例 10：方法巡检——全部原型方法不得崩溃（v0.6.1 防能力崩溃回归） =====
const aeon5 = new Aeon();
const methods = Object.getOwnPropertyNames(Aeon.prototype).filter(function (m) { return m !== 'constructor'; });
const sweepCrashes = [];
methods.forEach(function (m) {
  try {
    const r = aeon5[m]('我在想存在的意义，有点害怕');
    if (r && typeof r.then === 'function') sweepCrashes.push(m + ' 返回了 Promise');
  } catch (e) { sweepCrashes.push(m + ' -> ' + e.message); }
});
check('新10 方法巡检：' + methods.length + ' 个原型方法全部不崩溃', sweepCrashes.length === 0, sweepCrashes.join(' | '));

// ===== 新用例 11：searchMemory 非数组输入容错（v0.6.1） =====
check('新11 searchMemory：字符串输入不崩溃且返回数组', Array.isArray(aeon5.searchMemory('存在')));

// ===== 新用例 12：洞察落盘目录被删后自愈（v0.6.1） =====
fs.rmSync(testDir, { recursive: true, force: true });
const r3 = INSIGHT_STORE.save({ type: 'question', worth: 2, original: '宇宙的目的是什么' });
check('新12 落盘自愈：目录被删后重建并写入', r3.saved === true, JSON.stringify(r3));

// ===== 运行时冒烟：chat + selfReview 全流程 =====
const aeon2 = new Aeon();
let smokeOk = true, smokeErr = '';
try {
  const chatResp = aeon2.chat('我在想存在的意义是什么，我思故我在吗');
  if (!chatResp || !chatResp.text) smokeOk = false;
  if (!chatResp.intent || !chatResp.intent.mode) smokeOk = false;
  const review = aeon2.selfReview();
  if (!review || typeof review.persistedInsights.total !== 'number') smokeOk = false;
  if (!review.verdict) smokeOk = false;
} catch (e) { smokeOk = false; smokeErr = e.message; }
check('运行时冒烟：chat + selfReview 全流程无崩溃', smokeOk, smokeErr);

try { fs.rmSync(testDir, { recursive: true, force: true }); } catch (_) {}

console.log('\n结果: ' + pass + ' 通过, ' + fail + ' 失败');
process.exit(fail > 0 ? 1 : 0);
