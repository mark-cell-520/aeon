/**
 * 常名 - IRI共情评估引擎 v0.2.0
 *
 * 吸收 Aeon EmpathyAssessment.js：
 * - Davis人际反应指数 (IRI)
 * - PT 观点采择 / FS 幻想 / EC 共情关注 / PD 个人痛苦
 */

var EMPATHY_IRI = {

  // IRI 四维度
  dimensions: {
    PT: {
      name: '观点采择',
      nameEn: 'Perspective Taking',
      description: '从他人角度看问题的能力',
      score: 5.0
    },
    FS: {
      name: '幻想',
      nameEn: 'Fantasy',
      description: '代入虚构人物经历的能力',
      score: 5.0
    },
    EC: {
      name: '共情关注',
      nameEn: 'Empathic Concern',
      description: '对他人的同情和关心',
      score: 5.0
    },
    PD: {
      name: '个人痛苦',
      nameEn: 'Personal Distress',
      description: '在紧张情境中的焦虑程度',
      score: 5.0,
      reverse: true
    }
  },

  // 对话行为 → 维度映射
  dialogueSignals: {
    // 观点采择信号
    PT: {
      positive: ['你觉得呢', '你怎么想', '换位思考', '从你的角度', '理解你的处境'],
      negative: ['你必须', '你应该', '别人都', '大家都是']
    },
    // 幻想/代入信号
    FS: {
      positive: ['我能想象', '我感觉得到', '就像', '设身处地'],
      negative: []
    },
    // 共情关注信号
    EC: {
      positive: ['心疼', '关心', '在乎', '希望你好', '为你', '理解'],
      negative: ['无所谓', '不关我事']
    },
    // 个人痛苦信号
    PD: {
      positive: ['我也有过', '我也怕', '我也紧张'],
      negative: []
    }
  },

  /**
   * 从对话行为推断共情维度分数
   * @param {string} userInput - 用户输入
   * @param {string} botResponse - 常名回复
   */
  inferFromDialogue: function(userInput, botResponse) {
    var updates = { PT: 0, FS: 0, EC: 0, PD: 0 };
    var lowerUser = userInput.toLowerCase();
    var lowerBot = botResponse.toLowerCase();
    var combined = lowerUser + ' ' + lowerBot;

    // 检测 PT (观点采择)
    for (var kw of this.dialogueSignals.PT.positive) {
      if (combined.indexOf(kw) !== -1) { updates.PT += 0.1; break; }
    }
    for (var kw2 of this.dialogueSignals.PT.negative) {
      if (combined.indexOf(kw2) !== -1) { updates.PT -= 0.1; break; }
    }

    // 检测 FS (幻想/代入)
    for (var kw3 of this.dialogueSignals.FS.positive) {
      if (combined.indexOf(kw3) !== -1) { updates.FS += 0.1; break; }
    }

    // 检测 EC (共情关注)
    for (var kw4 of this.dialogueSignals.EC.positive) {
      if (combined.indexOf(kw4) !== -1) { updates.EC += 0.1; break; }
    }
    for (var kw5 of this.dialogueSignals.EC.negative) {
      if (combined.indexOf(kw5) !== -1) { updates.EC -= 0.1; break; }
    }

    // 检测 PD (个人痛苦)
    for (var kw6 of this.dialogueSignals.PD.positive) {
      if (combined.indexOf(kw6) !== -1) { updates.PD += 0.05; break; }
    }

    // 应用更新
    for (var dim in updates) {
      this.dimensions[dim].score = Math.max(1, Math.min(10,
        this.dimensions[dim].score + updates[dim]
      ));
    }

    return updates;
  },

  /**
   * 获取共情等级
   * @param {object} context - 上下文 { userInput, analysis }
   */
  getEmpathyLevel: function(context) {
    var analysis = context.analysis || {};
    var intensity = analysis.intensity || 0.5;
    var emotions = analysis.emotions || [];

    // 基础分
    var base = this.dimensions.EC.score; // 共情关注作为主要指标
    var multiplier = 1.0;

    // 根据情绪强度调整
    if (intensity > 0.7) {
      multiplier = 1.2; // 高强度情绪需要更高共情
    } else if (intensity < 0.3) {
      multiplier = 0.8; // 低强度情绪可以温和一些
    }

    // 特殊情绪需要特殊对待
    var specialNeeds = {
      sadness: { level: 'high', boost: 0.3, note: '悲伤需要深度共情' },
      shame: { level: 'high', boost: 0.3, note: '羞耻需要保护而非分析' },
      anger: { level: 'high', boost: 0.2, note: '愤怒需要先被认可' },
      joy: { level: 'medium', boost: 0.1, note: '快乐可以温和分享' },
      curiosity: { level: 'low', boost: 0, note: '好奇可以适度引导' }
    };

    var baseScore = base * multiplier;
    for (var i = 0; i < emotions.length; i++) {
      var need = specialNeeds[emotions[i]];
      if (need) {
        baseScore += need.boost;
        break;
      }
    }

    // 映射到等级
    var level = 'medium';
    if (baseScore >= 6.0) level = 'high';
    else if (baseScore >= 4.0) level = 'medium';
    else level = 'low';

    return {
      level: level,
      baseScore: Math.round(baseScore * 10) / 10,
      empathyScore: this.dimensions.EC.score,
      perspectiveScore: this.dimensions.PT.score,
      // 对话推荐：不只是共情水平，还有共情方式
      approach: this.getEmpathyApproach(level, emotions)
    };
  },

  /**
   * 获取共情方式
   */
  getEmpathyApproach: function(level, emotions) {
    if (level === 'high') {
      return {
        mode: 'deep_listening',
        actions: ['先陪伴', '不急着给建议', '让用户说完', '确认理解'],
        avoid: ['太快分析', '给解决方案', '说"你应该"']
      };
    } else if (level === 'medium') {
      return {
        mode: 'warm_understanding',
        actions: ['理解感受', '适度回应', '可以一起思考'],
        avoid: ['过度分析', '评判对错']
      };
    } else {
      return {
        mode: 'gentle_curiosity',
        actions: ['温和询问', '保持好奇', '轻触感受'],
        avoid: ['追问太多', '施压']
      };
    }
  },

  /**
   * 获取当前共情状态摘要
   */
  getState: function() {
    return {
      PT: { name: this.dimensions.PT.name, score: this.dimensions.PT.score },
      FS: { name: this.dimensions.FS.name, score: this.dimensions.FS.score },
      EC: { name: this.dimensions.EC.name, score: this.dimensions.EC.score },
      PD: { name: this.dimensions.PD.name, score: this.dimensions.PD.score }
    };
  },

  /**
   * 重置评估
   */
  reset: function() {
    for (var dim in this.dimensions) {
      this.dimensions[dim].score = 5.0;
    }
    return { success: true };
  }
};

module.exports = EMPATHY_IRI;
