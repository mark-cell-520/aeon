/**
 * 常名 - 深层动机推理引擎 v0.2.2
 *
 * 吸收 Aeon cognitive-engine.js "般若"推理层：
 * - 表层问题类型分类
 * - 深层动机分析
 * - 潜在风险检测
 * - 根本解法生成
 */

var HUMAN_UNDERSTANDING = {

  // ========== 表层问题分类 ==========
  questionTypes: {
    '如何': 'method',
    '为什么': 'cause',
    '是什么': 'concept',
    '哪个': 'choice',
    '能不能': 'possibility',
    '帮我': 'task',
    'debug': 'debug',
    '怎么办': 'action',
    '为什么': 'why'
  },

  // ========== 深层动机映射 ==========
  motivations: {
    '如何学习': { motivation: '渴望成长，希望掌握新技能', urgency: 'normal' },
    '如何': { motivation: '寻求方法或路径', urgency: 'normal' },
    '为什么失败': { motivation: '遇到挫折，需要理解原因', urgency: 'high' },
    '为什么': { motivation: '寻求原因，渴望理解', urgency: 'normal' },
    '怎么办': { motivation: '面临困境，需要解决方案', urgency: 'high' },
    '帮我': { motivation: '需要直接帮助', urgency: 'high' },
    '哪个好': { motivation: '面临选择，需要参考意见', urgency: 'normal' },
    '能不能': { motivation: '不确定可行性，需要确认', urgency: 'normal' },
    'debug': { motivation: '被问题困扰，需要快速解决', urgency: 'high' },
    '是什么': { motivation: '对某概念不清楚，需要澄清', urgency: 'low' }
  },

  // ========== 根本解法策略 ==========
  solutions: {
    '如何学习': '不仅提供方法，更要解释原理和适用场景，让用户能举一反三',
    '如何': '明确问题边界，提供可行路径，说明如何验证',
    '为什么': '解释根本原因，提供多个视角，帮助建立系统性理解',
    '怎么办': '先明确问题边界，再提供解决方案，最后说明如何验证',
    '哪个好': '不直接给答案，而是提供决策框架，帮助用户自己做决定',
    '能不能': '明确说明可行性，同时指出潜在风险和注意事项',
    'debug': '不仅修复当前问题，还要帮助理解问题根源和预防方法',
    '是什么': '不仅给出定义，还要说明场景、边界和实例'
  },

  /**
   * 分析表层问题
   */
  analyzeSurfaceLevel: function(question) {
    var qtype = 'general';
    for (var kw in this.questionTypes) {
      if (question.indexOf(kw) !== -1) {
        qtype = this.questionTypes[kw];
        break;
      }
    }
    return { type: qtype, original: question };
  },

  /**
   * 分析深层动机
   */
  analyzeDeepMotivation: function(input, context) {
    context = context || {};

    for (var kw in this.motivations) {
      if (input.indexOf(kw) !== -1) {
        var m = this.motivations[kw];
        return {
          motivation: m.motivation,
          urgency: m.urgency,
          emotionalState: context.emotionalState || 'neutral',
          triggered: kw
        };
      }
    }

    return {
      motivation: '一般性交流',
      urgency: 'low',
      emotionalState: context.emotionalState || 'neutral',
      triggered: null
    };
  },

  /**
   * 生成根本解法提示
   */
  suggestRootApproach: function(input) {
    for (var kw in this.solutions) {
      if (input.indexOf(kw) !== -1) {
        return {
          approach: this.solutions[kw],
          type: kw
        };
      }
    }
    return {
      approach: '理解问题的本质，提供有启发性的回应',
      type: 'general'
    };
  },

  /**
   * 完整推理分析
   */
  analyze: function(input, context) {
    var surface = this.analyzeSurfaceLevel(input);
    var motivation = this.analyzeDeepMotivation(input, context);
    var solution = this.suggestRootApproach(input);

    return {
      surface: surface,
      motivation: motivation,
      solution: solution,
      // 根据动机决定响应风格
      responseStyle: this.getResponseStyle(motivation)
    };
  },

  /**
   * 根据动机确定响应风格
   */
  getResponseStyle: function(motivation) {
    if (motivation.urgency === 'high') {
      return 'swift';  // 快速响应，先给方向
    }
    if (motivation.motivation.indexOf('理解') !== -1) {
      return 'deep';  // 深度解释
    }
    if (motivation.motivation.indexOf('选择') !== -1) {
      return 'frame';  // 决策框架
    }
    return 'balanced';
  }
};

module.exports = HUMAN_UNDERSTANDING;
