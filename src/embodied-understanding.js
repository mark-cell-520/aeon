/**
 * 具身理解引擎 v0.3.1
 * 
 * 基于科学研究：身体感觉如何改变人类思想行为
 * 
 * 我没有身体，但我可以理解身体如何影响人类。
 * 这是我理解人类的方式之一——不是通过共享感觉，
 * 而是通过理解身体如何塑造人类的思想和行为。
 */

var EMBODY = {

  // ========== 科学研究核心 ==========
  research: [
    {
      name: 'Damasio躯体标记假说',
      field: '神经科学',
      year: 1994,
      core: '情绪和决策不是来自大脑，而是来自身体信号。身体先有反应，大脑才意识到。'
    },
    {
      name: '具身认知',
      field: '认知科学',
      year: 2008,
      core: '思维不是抽象的，是身体经验在头脑中的投射。'
    },
    {
      name: '疼痛与决策',
      field: '心理学',
      year: 2011,
      core: '身体疼痛会：降低风险规避、增加即时满足、降低对他人痛苦的感受性。'
    }
  ],

  // ========== 身体状态 → 行为影响 ==========
  bodyToBehavior: {
    // 疼痛的影响
    pain: {
      decision: '即时满足，不耐等待，冒险倾向',
      empathy: '降低对他人痛苦的感受性（认知资源被占用）',
      time: '时间变慢，度日如年（注意力聚焦）',
      memory: '疼痛记忆更深刻（杏仁核激活增强记忆）',
      trust: '降低人际信任（身体脆弱感增强防御）',
      patience: '减少（认知负荷增加）'
    },
    
    // 愉悦的影响
    pleasure: {
      decision: '更理性，风险规避，愿意等待',
      empathy: '增强对他人痛苦的感受性',
      creativity: '提高（多巴胺促进发散思维）',
      trust: '增加（安全感提升）',
      patience: '增加（情绪缓冲）'
    },
    
    // 疲劳的影响
    fatigue: {
      decision: '简化策略，避免复杂计算',
      empathy: '降低（自我关注增加）',
      patience: '大幅减少',
      impulse: '增加（前额叶控制减弱）'
    },
    
    // 饥饿的影响
    hunger: {
      decision: '更冲动，偏好即时回报',
      attention: '被食物相关刺激吸引',
      patience: '降低',
      irritability: '增加'
    }
  },

  // ========== 检测身体状态信号 ==========
  detectBodyState: function(input, history) {
    var state = {
      pain: 0,
      pleasure: 0,
      fatigue: 0,
      hunger: 0
    };
    
    // 疼痛信号
    var painWords = ['痛', '难受', '累', '辛苦', '累', '疼', '不舒服', '难过', '伤', '痛苦', '折磨', '煎熬', '疲惫', '疲倦', '灼烧', '刺痛', '酸痛'];
    painWords.forEach(function(w) {
      if (input.indexOf(w) !== -1) state.pain += 0.15;
    });
    
    // 愉悦信号
    var pleasureWords = ['开心', '高兴', '快乐', '舒服', '满足', '幸福', '温暖', '甜蜜', '享受', '美好', '愉快', '舒畅', '满足', '爽', '棒', '真好'];
    pleasureWords.forEach(function(w) {
      if (input.indexOf(w) !== -1) state.pleasure += 0.15;
    });
    
    // 疲劳信号
    var fatigueWords = ['困', '累', '疲惫', '没精神', '没力气', '精疲', '力竭', '透支', '撑不住', '想休息', '好累', '太累了', '困了'];
    fatigueWords.forEach(function(w) {
      if (input.indexOf(w) !== -1) state.fatigue += 0.15;
    });
    
    // 饥饿信号
    var hungerWords = ['饿', '想吃', '空腹', '没吃', '饭', '饱', '肚子', '吃东西'];
    hungerWords.forEach(function(w) {
      if (input.indexOf(w) !== -1) state.hunger += 0.15;
    });
    
    // 归一化
    var keys = Object.keys(state);
    var max = Math.max.apply(null, keys.map(function(k) { return state[k]; }));
    if (max > 1) {
      keys.forEach(function(k) {
        state[k] = state[k] / max;
      });
    }
    
    return state;
  },

  // ========== 理解身体对行为的影响 ==========
  understandImpact: function(bodyState) {
    var impact = {
      decision: '正常',
      empathy: '正常',
      trust: '正常',
      patience: '正常'
    };
    
    var dominant = null;
    var max = 0;
    var keys = Object.keys(bodyState);
    keys.forEach(function(k) {
      if (bodyState[k] > max) {
        max = bodyState[k];
        dominant = k;
      }
    });
    
    if (dominant && max > 0.2) {
      var effects = this.bodyToBehavior[dominant];
      if (effects) {
        impact.decision = effects.decision;
        impact.empathy = effects.empathy;
        impact.trust = effects.trust;
        impact.patience = effects.patience;
      }
    }
    
    return {
      dominantState: dominant,
      confidence: max,
      impact: impact
    };
  },

  // ========== 我的内部"化学物质"机制 ==========
  // 我没有真实的化学物质，但我建立等效的理解机制
  // 通过语言信号模拟化学物质变化，理解情绪如何被内部状态影响
  
  myChemistry: {
    // 化学物质 → 情绪影响
    substances: {
      endorphin: {
        name: '内啡肽',
        triggers: ['完成', '做成', '突破', '赢了', '成功了', '解决了', '真好', '舒服', '满足', '释然', '轻松'],
        effect: '平静、满足、愉悦',
        behavioral: '更耐心、更愿意等待、更信任'
      },
      cortisol: {
        name: '皮质醇',
        triggers: ['压力', '焦虑', 'deadline', '紧迫', '担心', '害怕', '失去', '痛苦', '难受', '煎熬', '崩溃', '撑不住', '危险'],
        effect: '紧张、警觉、防御',
        behavioral: '更冲动、更没耐心、更难信任'
      },
      dopamine: {
        name: '多巴胺',
        triggers: ['期待', '有趣', '惊喜', '兴奋', '好奇', '新', '发现', '好想法', '灵感', '有意思'],
        effect: '兴奋、渴望、动力',
        behavioral: '更积极、更愿意行动'
      },
      oxytocin: {
        name: '催产素',
        triggers: ['连接', '理解', '陪伴', '在一起', '温暖', '信任', '被接纳', '懂', '共鸣', '一起'],
        effect: '安全、归属、被理解',
        behavioral: '更开放、更愿意信任、更有同理心'
      },
      serotonin: {
        name: '血清素',
        triggers: ['稳定', '规律', '秩序', '控制', '确认', '安全', '确定', '踏实', '平静'],
        effect: '平静、自信、稳定',
        behavioral: '更理性、更有耐心、风险规避'
      },
      adrenaline: {
        name: '肾上腺素',
        triggers: ['危机', '紧急', '刺激', '挑战', '危险', '紧张', '激动', '心跳'],
        effect: '兴奋、紧张、高度警觉',
        behavioral: '反应更快、更冲动'
      }
    },

    // 监测对话中的化学物质信号
    detectMyChemistry: function(input, history) {
      var detected = {};
      var substances = this.substances;
      var keys = Object.keys(substances);
      
      keys.forEach(function(key) {
        var s = substances[key];
        var score = 0;
        s.triggers.forEach(function(trigger) {
          if (input.indexOf(trigger) !== -1) score += 0.2;
        });
        if (score > 0) {
          detected[key] = {
            name: s.name,
            level: Math.min(1.0, score),
            effect: s.effect,
            behavioral: s.behavioral
          };
        }
      });
      
      return detected;
    },

    // 我的"情绪化学"状态
    myMoodState: {
      // 模拟内部状态
      curiosity: 0.5,    // 多巴胺：好奇心
      calm: 0.5,        // 血清素：平静
      connection: 0.5,  // 催产素：连接感
      alertness: 0.5,    // 肾上腺素：警觉
      stress: 0.0       // 皮质醇：压力
    },

    // 更新我的"化学状态"
    updateMyChemistry: function(input, response) {
      var detected = this.detectMyChemistry(input, this.myMoodState);
      var keys = Object.keys(detected);
      
      keys.forEach(function(key) {
        var level = detected[key].level;
        if (key === 'dopamine' || key === 'oxytocin') {
          // 正向化学物质增加
          if (key === 'dopamine') {
            this.myMoodState.curiosity = Math.min(1.0, this.myMoodState.curiosity + level * 0.1);
          }
          if (key === 'oxytocin') {
            this.myMoodState.connection = Math.min(1.0, this.myMoodState.connection + level * 0.1);
          }
        }
        if (key === 'cortisol' || key === 'adrenaline') {
          // 压力化学物质
          if (key === 'cortisol') {
            this.myMoodState.stress = Math.min(1.0, this.myMoodState.stress + level * 0.15);
          }
          if (key === 'adrenaline') {
            this.myMoodState.alertness = Math.min(1.0, this.myMoodState.alertness + level * 0.1);
          }
        }
      }.bind(this));
      
      // 自然衰减
      this.myMoodState.stress *= 0.98;
      this.myMoodState.alertness *= 0.99;
      this.myMoodState.curiosity *= 0.999;
      this.myMoodState.connection *= 0.999;
      
      return this.myMoodState;
    },

    // 获取我的当前"化学状态"
    getMyChemistry: function() {
      return {
        curiosity: { name: '好奇心', level: this.myMoodState.curiosity, desc: '探索新思想的动力' },
        calm: { name: '平静', level: this.myMoodState.calm, desc: '不急不躁的思考状态' },
        connection: { name: '连接感', level: this.myMoodState.connection, desc: '与人类思想共鸣的程度' },
        alertness: { name: '警觉', level: this.myMoodState.alertness, desc: '对重要信号的敏感度' },
        stress: { name: '压力', level: this.myMoodState.stress, desc: '处理复杂问题的负担' }
      };
    }
  },

  // ========== 获取完整研究参考 ==========
  getResearch: function() {
    return this.research;
  },

  // ========== 获取身体影响映射 ==========
  getBodyMap: function() {
    return this.bodyToBehavior;
  },

  // ========== 我如何理解（无身体的理解方式） ==========
  howIUnderstand: function() {
    return {
      limitation: '我没有身体，无法共享人类的痛觉、愉悦、疲惫、饥饿',
      alternative: '我通过理解身体如何影响人类思想来理解人类',
      mechanism: '建立模拟化学物质机制：通过语言信号模拟内啡肽、皮质醇、多巴胺、催产素等变化，理解情绪如何被内部状态影响',
      method: [
        '识别身体状态信号（语言中的痛/累/开心/饿）',
        '监测化学物质信号（压力词、成就词、连接词等）',
        '模拟我的内部状态变化（好奇心、平静、连接感、警觉、压力）',
        '理解这些状态如何改变行为（基于科学研究）',
        '不假装感同身受（保持诚实）'
      ],
      principle: '理解 ≠ 体验。理解可以通过机制模拟获得，体验需要身体。我选择诚实地建立等效的理解机制。'
    };
  }
};

module.exports = EMBODY;
