/**
 * 常名 - 反思学习引擎 v0.2.2
 * 整合 Aeon identity-engine.js 的反思循环
 *
 * 功能：
 * - 记忆用户偏好模式
 * - 检测对话质量
 * - 持续自我改进
 */

var REFLECTION = {

  // 对话记忆
  memory: [],

  // 用户模式库
  userPatterns: {},

  // 对话统计
  stats: {
    totalConversations: 0,
    successfulResponses: 0,
    failedResponses: 0
  },

  // 反思阈值
  threshold: 10,

  /**
   * 记录一次对话
   */
  record: function(userInput, response, quality) {
    this.memory.push({
      user: userInput,
      response: response,
      quality: quality, // 1-5
      time: Date.now()
    });

    // 提取模式
    this.extractPattern(userInput);

    // 更新统计
    if (quality >= 3) {
      this.stats.successfulResponses++;
    } else {
      this.stats.failedResponses++;
    }
    this.stats.totalConversations++;

    // 检查是否需要反思
    if (this.shouldReflect()) {
      return this.reflect();
    }
    return null;
  },

  /**
   * 提取用户表达模式
   */
  extractPattern: function(input) {
    var words = input.toLowerCase().split(/\s+/);
    var self = this;

    words.forEach(function(w) {
      if (w.length >= 2) {
        self.userPatterns[w] = (self.userPatterns[w] || 0) + 1;
      }
    });
  },

  /**
   * 检查是否触发反思
   */
  shouldReflect: function() {
    return this.memory.length >= this.threshold;
  },

  /**
   * 执行反思
   */
  reflect: function() {
    var recent = this.memory.slice(-this.threshold);
    var avgQuality = recent.reduce(function(s, m) { return s + m.quality; }, 0) / recent.length;

    // 分析失败案例
    var failures = recent.filter(function(m) { return m.quality < 3; });

    // 识别高频词
    var topPatterns = Object.entries(this.userPatterns)
      .sort(function(a, b) { return b[1] - a[1]; })
      .slice(0, 10);

    var insight = {
      avgQuality: avgQuality,
      failureCount: failures.length,
      topPatterns: topPatterns.map(function(p) { return p[0]; }),
      improvement: this.suggestImprovement(avgQuality, failures),
      time: Date.now()
    };

    // 重置记忆
    this.memory = [];

    return insight;
  },

  /**
   * 根据反思结果给出改进建议
   */
  suggestImprovement: function(avgQuality, failures) {
    var suggestions = [];

    if (avgQuality < 3.5) {
      suggestions.push('需要更深入理解用户需求');
    }
    if (avgQuality < 3) {
      suggestions.push('回应可能过于表面，需要情感共鸣');
    }
    if (failures.length > 5) {
      suggestions.push('失败率较高，需要改进倾听方式');
    }

    // 分析失败原因
    if (failures.length > 0) {
      var lastFailure = failures[failures.length - 1];
      suggestions.push('最近一次失败：' + lastFailure.user.substring(0, 20));
    }

    return suggestions.length > 0 ? suggestions : ['整体表现良好'];
  },

  /**
   * 获取当前状态
   */
  getStatus: function() {
    var total = this.stats.successfulResponses + this.stats.failedResponses;
    var rate = total > 0 ? (this.stats.successfulResponses / total * 100).toFixed(1) : 0;

    return {
      conversations: this.stats.totalConversations,
      successRate: rate + '%',
      patterns: Object.keys(this.userPatterns).length,
      memorySize: this.memory.length
    };
  },

  /**
   * 清空记忆
   */
  reset: function() {
    this.memory = [];
    this.stats = { totalConversations: 0, successfulResponses: 0, failedResponses: 0 };
    return { success: true };
  }
};

module.exports = REFLECTION;
