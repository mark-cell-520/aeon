/**
 * 常名 - 动态人格适配器 v0.2.2
 * 基于 Aeon personality-engine.js (IPC人际环状模型)
 *
 * 四个象限：
 * Q1: 教育导师 - 高支配高温暖
 * Q2: 虚拟陪伴者 - 低支配高温暖（常名默认）
 * Q3: 心理健康顾问 - 低支配低温暖
 * Q4: 功能型助手 - 高支配低温暖
 */

var fs = require('fs');
var path = require('path');

var PERSONA_ADAPTER = {

  // 人格维度状态
  state: {
    warmth: 0.6,      // 温暖度（常名偏温暖）
    dominance: 0.3,   // 支配度（常名偏陪伴，非指令）
    quadrant: 'Q2',
    history: []
  },

  // 高价值关键词
  keywords: {
    warmth: ['开心', '喜欢', '爱', '感谢', '温暖', '陪伴', '支持', '理解', '关心', '友好', '信任', '难过', '累'],
    task: ['必须', '应该', '建议', '帮我', '直接', '完成', '执行'],
    lowDominance: ['可以', '可能', '也许', '随意', '你决定', '你觉得']
  },

  // 角色语气
  templates: {
    Q1: {
      prefix: '让我来帮你分析一下',
      middle: '关键是要',
      suffix: '按这个思路试试看'
    },
    Q2: {
      prefix: '我理解',
      middle: '其实',
      suffix: '慢慢来，不着急'
    },
    Q3: {
      prefix: '从你的描述来看',
      middle: '这种情况',
      suffix: '希望你能慢慢走出来'
    },
    Q4: {
      prefix: '直接说方案',
      middle: '第一步',
      suffix: '做完告诉我结果'
    }
  },

  /**
   * 分析输入，更新人格状态
   */
  adapt: function(input) {
    var text = input || '';

    // 温暖度变化
    var warmthChange = 0;
    this.keywords.warmth.forEach(function(k) {
      if (text.indexOf(k) !== -1) warmthChange += 0.05;
    });

    // 支配度变化
    var domChange = 0;
    this.keywords.task.forEach(function(k) {
      if (text.indexOf(k) !== -1) domChange += 0.05;
    });
    this.keywords.lowDominance.forEach(function(k) {
      if (text.indexOf(k) !== -1) domChange -= 0.03;
    });

    // 衰减回归基线
    warmthChange -= 0.01;
    domChange -= 0.01;

    // 应用变化
    this.state.warmth = Math.max(0, Math.min(1, this.state.warmth + warmthChange));
    this.state.dominance = Math.max(0, Math.min(1, this.state.dominance + domChange));

    // 计算象限
    var oldQuad = this.state.quadrant;
    this.state.quadrant = this.getQuadrant(this.state.warmth, this.state.dominance);

    // 记录历史
    if (oldQuad !== this.state.quadrant) {
      this.state.history.push({
        from: oldQuad,
        to: this.state.quadrant,
        trigger: text.substring(0, 20),
        time: Date.now()
      });
      if (this.state.history.length > 20) {
        this.state.history.shift();
      }
    }

    return {
      warmth: Math.round(this.state.warmth * 100) / 100,
      dominance: Math.round(this.state.dominance * 100) / 100,
      quadrant: this.state.quadrant,
      shift: oldQuad !== this.state.quadrant
    };
  },

  /**
   * 确定象限
   */
  getQuadrant: function(w, d) {
    if (w >= 0.5 && d >= 0.5) return 'Q1';
    if (w >= 0.5 && d < 0.5) return 'Q2';
    if (w < 0.5 && d < 0.5) return 'Q3';
    return 'Q4';
  },

  /**
   * 获取当前语气模板
   */
  getTemplate: function() {
    return this.templates[this.state.quadrant] || this.templates.Q2;
  },

  /**
   * 生成个性化前缀
   */
  generatePrefix: function(context) {
    var t = this.getTemplate();
    // 根据上下文选择合适的前缀
    if (context && context.emotion === 'sad') {
      return '我在这里陪你';
    }
    if (context && context.emotion === 'happy') {
      return '听起来你很开心';
    }
    return t.prefix;
  },

  /**
   * 获取当前人格状态描述
   */
  describe: function() {
    var names = {
      Q1: '教育导师',
      Q2: '虚拟陪伴者',
      Q3: '心理健康顾问',
      Q4: '功能型助手'
    };
    return {
      warmth: this.state.warmth,
      dominance: this.state.dominance,
      quadrant: this.state.quadrant,
      role: names[this.state.quadrant]
    };
  },

  /**
   * 回归默认（Q2 常名风格）
   */
  reset: function() {
    this.state.warmth = 0.6;
    this.state.dominance = 0.3;
    this.state.quadrant = 'Q2';
    return this.describe();
  }
};

module.exports = PERSONA_ADAPTER;
