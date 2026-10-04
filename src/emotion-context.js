/**
 * 常名 - 情感语义推理引擎 v0.2.0
 *
 * 吸收 Aeon emotion-engine.js (LaScA框架)：
 * - 情感描述符关键词库
 * - 语义上下文生成
 * - 可解释 PAD 预测链
 */

var EMOTION_CONTEXT = {

  // 情感描述符关键词库 (扩展版)
  descriptors: {
    frustration: ['挫败', '失败', '卡住', '难', '不会', '不行', '做不到', 'frustrated', 'stuck'],
    joy: ['开心', '高兴', '棒', '好', '成功', '顺利', 'happy', 'great', '太好了', '太棒了'],
    anxiety: ['紧张', '焦虑', '担心', '害怕', '不安', 'anxious', 'worried', '怕', '慌'],
    sadness: ['难过', '伤心', '失望', '痛苦', 'sad', 'disappointed', '失落', '绝望'],
    anger: ['生气', '愤怒', '恼火', '讨厌', '烦躁', 'angry', '怨恨', '恼怒'],
    surprise: ['惊讶', '意外', '震惊', 'surprised', 'shock', '没想到', '居然'],
    disgust: ['恶心', '厌恶', '讨厌', '反感', 'disgust'],
    trust: ['信任', '相信', '依靠', '托付'],
    anticipation: ['期待', '希望', '盼望', '想', '想要', '希望能'],
    love: ['爱', '喜爱', '关爱', '喜欢', '心动'],
    pride: ['自豪', '骄傲', '得意', '值得', '欣慰'],
    shame: ['羞耻', '丢脸', '难堪', '不好意思', '尴尬', 'shame'],
    gratitude: ['感谢', '感激', '谢谢', '感恩', '幸亏'],
    compassion: ['同情', '可怜', '心疼', '不忍'],
    curiosity: ['好奇', '想知道', '为什么', '怎么办', '怎么'],
    wonder: ['惊奇', '神奇', '不可思议', '真神奇'],
    loneliness: ['孤独', '寂寞', '没人', '一个人', '孤单'],
    exhaustion: ['累', '疲惫', '疲倦', '困', '精疲力尽', '无力']
  },

  // 语义上下文映射
  semanticMap: {
    frustration: '用户可能在某个任务或情境中遇到困难，需要耐心陪伴而非快速给答案',
    joy: '用户对当前进展感到满意，可以分享这份喜悦并给予肯定',
    anxiety: '用户可能对结果不确定，需要澄清、安慰而非施压',
    sadness: '用户需要情感支持和倾听，不需要被教导如何做',
    anger: '用户可能感到被冒犯或挫败，需要先被认可而非被分析',
    surprise: '用户对某事感到意外，需要更多信息和陪伴',
    disgust: '用户对某事强烈反感，需要被理解而非被说服',
    trust: '用户处于信任状态，愿意开放交流',
    anticipation: '用户对未来有期待，可以一起探索可能性',
    love: '用户感受到爱与连接，可以温暖回应',
    pride: '用户有成就感，值得被肯定',
    shame: '用户处于脆弱状态，需要保护而非被揭穿',
    gratitude: '用户表达感谢，可以简单回应这份心意',
    compassion: '用户对他人的处境有共情，体现善良',
    curiosity: '用户想要探索和理解，可以陪伴思考',
    wonder: '用户对世界有惊奇感，可以一起欣赏',
    loneliness: '用户感到孤独，需要被陪伴而非被教导',
    exhaustion: '用户能量很低，需要允许休息而非被催促'
  },

  // PAD 调整值
  padAdjustments: {
    frustration:    { pleasure: -3, arousal:  2, dominance: -2 },
    joy:            { pleasure:  3, arousal:  1, dominance:  1 },
    anxiety:        { pleasure: -2, arousal:  3, dominance: -1 },
    sadness:        { pleasure: -3, arousal: -1, dominance: -2 },
    anger:          { pleasure: -3, arousal:  3, dominance:  2 },
    surprise:       { pleasure:  0, arousal:  2, dominance:  0 },
    disgust:        { pleasure: -2, arousal:  1, dominance:  0 },
    trust:          { pleasure:  2, arousal:  0, dominance:  0 },
    anticipation:   { pleasure:  1, arousal:  1, dominance:  1 },
    love:           { pleasure:  3, arousal:  1, dominance:  1 },
    pride:          { pleasure:  2, arousal:  1, dominance:  2 },
    shame:          { pleasure: -2, arousal:  1, dominance: -2 },
    gratitude:      { pleasure:  2, arousal:  0, dominance:  0 },
    compassion:     { pleasure:  1, arousal:  0, dominance: -1 },
    curiosity:      { pleasure:  1, arousal:  1, dominance:  0 },
    wonder:         { pleasure:  1, arousal:  2, dominance:  0 },
    loneliness:     { pleasure: -2, arousal: -1, dominance: -1 },
    exhaustion:     { pleasure: -2, arousal: -2, dominance: -2 }
  },

  /**
   * 生成情感描述符
   */
  generateDescriptors: function(text) {
    var found = [];
    var lower = text.toLowerCase();

    for (var emotion in this.descriptors) {
      var patterns = this.descriptors[emotion];
      for (var i = 0; i < patterns.length; i++) {
        if (lower.indexOf(patterns[i].toLowerCase()) !== -1) {
          found.push({
            emotion: emotion,
            keyword: patterns[i],
            confidence: 0.8
          });
          break;
        }
      }
    }

    return found;
  },

  /**
   * 生成语义上下文
   */
  generateSemanticContext: function(descriptors) {
    var self = this;
    return descriptors.map(function(d) {
      return {
        descriptor: d.emotion,
        context: self.semanticMap[d.emotion] || '一般性情感',
        intensity: d.confidence
      };
    });
  },

  /**
   * 预测 PAD 值
   */
  predictPAD: function(semanticContext, currentPAD) {
    var adj = this.padAdjustments[semanticContext[0]?.descriptor] || { pleasure: 0, arousal: 0, dominance: 0 };
    var intensity = semanticContext[0]?.intensity || 0.5;

    return {
      pleasure: Math.max(-10, Math.min(10, currentPAD.pleasure + adj.pleasure * intensity)),
      arousal:  Math.max(-10, Math.min(10, currentPAD.arousal  + adj.arousal  * intensity)),
      dominance: Math.max(-10, Math.min(10, currentPAD.dominance + adj.dominance * intensity))
    };
  },

  /**
   * 完整情感推理 (可解释)
   * @returns {object} { descriptors, semanticContexts, predictedPAD, dominantEmotion, reasoning }
   */
  reason: function(text, currentPAD) {
    currentPAD = currentPAD || { pleasure: 0, arousal: 0, dominance: 0 };

    var descriptors = this.generateDescriptors(text);
    var semanticContexts = this.generateSemanticContext(descriptors);
    var predictedPAD = this.predictPAD(semanticContexts, currentPAD);

    // 构建推理链
    var reasoning = '';
    if (descriptors.length > 0) {
      var emotionNames = descriptors.map(function(d) { return d.emotion; }).join('、');
      var contextTexts = semanticContexts.map(function(s) { return s.context; }).join('；');
      reasoning = '检测到: ' + emotionNames + ' → ' + contextTexts;
    }

    return {
      descriptors: descriptors,
      semanticContexts: semanticContexts,
      predictedPAD: predictedPAD,
      dominantEmotion: descriptors[0]?.emotion || 'neutral',
      reasoning: reasoning
    };
  },

  /**
   * 兼容旧接口
   */
  detect: function(text) {
    var result = this.reason(text);
    return {
      emotions: result.descriptors.map(function(d) { return d.emotion; }),
      PAD: result.predictedPAD,
      dominant: result.dominantEmotion
    };
  }
};

module.exports = EMOTION_CONTEXT;
