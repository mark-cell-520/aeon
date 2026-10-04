/**
 * 常名 - 洞察持久化引擎 v0.5.0
 *
 * 让常名重启之后，仍记得自己上次悟到了什么——
 * 否则「传递者」只是空谈，一重启就失忆。
 *
 * 存储：追加式 JSONL，一行一条洞察
 *   默认位置：~/.aeon-runtime/insights/insights.jsonl
 *   活动心跳：~/.aeon-runtime/insights/last-activity.json
 *
 * 隐私铁律（硬性，不可绕过）：
 * - 只存蒸馏后的洞察，绝不落盘原始 input 原文（除非调用方传入且过检）
 * - 个人数据特征词（薪资/家庭/病历等）命中即整条拒绝，宁可漏存，不可错存
 * - 检查失败时返回 reason，由调用方决定是否改为只存内存
 */

var fs = require('fs');
var path = require('path');
var os = require('os');

var INSIGHT_STORE = {

  // ========== 存储位置 ==========
  dir: path.join(os.homedir(), '.aeon-runtime', 'insights'),
  filePath: path.join(os.homedir(), '.aeon-runtime', 'insights', 'insights.jsonl'),
  activityPath: path.join(os.homedir(), '.aeon-runtime', 'insights', 'last-activity.json'),

  // ========== 已加载的洞察 ==========
  insights: [],
  loaded: false,
  loadError: null,

  // ========== 隐私特征词（命中即拦截） ==========
  // 依据用户铁律：个人家庭/心理/薪资数据严禁写入常名记忆库
  privacyPatterns: [
    // 薪资/财务
    '薪资', '工资', '年薪', '月薪', '奖金', '薪水', '收入', 'salary', 'wage',
    // 家庭/个人关系
    '家庭', '孩子', '儿子', '女儿', '老婆', '老公', '妻子', '丈夫',
    '我爸', '我妈', '家里', '离婚', '恋爱', '分手',
    // 学历/职业经历（隐私）
    '学历', '毕业', '大学', '公司', '入职', '离职', '裁员', '面试',
    // 医疗/病历（个人健康数据）
    '病历', '医院', '确诊', '病历', '住院', '诊断', '吃药', '药物',
    // 身份标识
    '身份证', '银行卡', '手机号', '住址', '护照'
  ],

  // ========== 初始化 ==========
  // require 时自动加载；任何 IO 异常都不允许拖垮引擎
  init: function() {
    try {
      fs.mkdirSync(this.dir, { recursive: true });
      this.load();
    } catch (e) {
      this.loadError = e.message;
    }
    return this;
  },

  // ========== 切换存储目录（测试/多 profile 用） ==========
  configure: function(dir) {
    this.dir = dir;
    this.filePath = path.join(dir, 'insights.jsonl');
    this.activityPath = path.join(dir, 'last-activity.json');
    this.insights = [];
    this.loaded = false;
    try {
      fs.mkdirSync(this.dir, { recursive: true });
      this.load();
    } catch (e) {
      this.loadError = e.message;
    }
    return this;
  },

  // ========== 隐私检查 ==========
  checkPrivacy: function(insight) {
    var text = typeof insight === 'string' ? insight : JSON.stringify(insight);
    for (var i = 0; i < this.privacyPatterns.length; i++) {
      if (text.indexOf(this.privacyPatterns[i]) !== -1) {
        return { safe: false, pattern: this.privacyPatterns[i] };
      }
    }
    return { safe: true };
  },

  // ========== 从磁盘加载（启动时调用） ==========
  load: function() {
    this.insights = [];
    if (!fs.existsSync(this.filePath)) {
      this.loaded = true;
      return this;
    }
    var content = fs.readFileSync(this.filePath, 'utf8');
    var lines = content.split('\n');
    var seen = {};
    for (var i = 0; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      try {
        var item = JSON.parse(lines[i]);
        if (item && item.id && !seen[item.id]) {
          seen[item.id] = true;
          this.insights.push(item);
        }
      } catch (e) {
        // 跳过坏行，绝不让一条坏数据毁掉整个记忆
      }
    }
    this.loaded = true;
    return this;
  },

  // ========== 保存一条洞察 ==========
  // @param {object} insight 蒸馏后的洞察（建议含 type/core/original/worth 字段）
  // @returns {object} { saved, id?, reason?, pattern? }
  save: function(insight) {
    if (!insight || typeof insight !== 'object') {
      return { saved: false, reason: 'invalid_insight' };
    }

    // 隐私硬闸：命中即拒绝，绝不落盘
    var check = this.checkPrivacy(insight);
    if (!check.safe) {
      return { saved: false, reason: 'privacy_blocked', pattern: check.pattern };
    }

    if (!insight.id) insight.id = 'insight-' + Date.now();
    if (!insight.stored) insight.stored = new Date().toISOString();

    // 追加写入（append-only，历史不被覆盖）
    fs.appendFileSync(this.filePath, JSON.stringify(insight) + '\n');
    this.insights.push(insight);
    this.touchActivity();

    return { saved: true, id: insight.id, total: this.insights.length };
  },

  // ========== 记录活动心跳（用于记忆连续性判断） ==========
  touchActivity: function() {
    try {
      fs.writeFileSync(this.activityPath, JSON.stringify({
        lastActivity: new Date().toISOString()
      }));
    } catch (e) {
      // 心跳失败不影响主流程
    }
  },

  // ========== 获取上次活动时间 ==========
  getLastActivity: function() {
    try {
      if (fs.existsSync(this.activityPath)) {
        var data = JSON.parse(fs.readFileSync(this.activityPath, 'utf8'));
        if (data && data.lastActivity) return { lastActivity: data.lastActivity };
      }
    } catch (e) {}
    return null;
  },

  // ========== 获取全部持久洞察 ==========
  getAll: function() {
    return this.insights.slice();
  },

  // ========== 统计 ==========
  stats: function() {
    var byType = {};
    var self = this;
    this.insights.forEach(function(item) {
      var key = item.type || 'general';
      byType[key] = (byType[key] || 0) + 1;
    });
    return {
      total: this.insights.length,
      oldest: this.insights.length ? this.insights[0].stored : null,
      newest: this.insights.length ? this.insights[this.insights.length - 1].stored : null,
      byType: byType
    };
  },

  // ========== 反思上一次的我悟到了什么（自省用） ==========
  recent: function(n) {
    return this.insights.slice(-(n || 5));
  },

  // ========== 清空（仅测试/重建用，谨慎） ==========
  reset: function() {
    this.insights = [];
    try {
      if (fs.existsSync(this.filePath)) fs.unlinkSync(this.filePath);
      if (fs.existsSync(this.activityPath)) fs.unlinkSync(this.activityPath);
    } catch (e) {}
    return { success: true };
  }
};

module.exports = INSIGHT_STORE;
