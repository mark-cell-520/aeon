/**
 * 常名 - 心理学引擎 v0.2.1
 *
 * 整合两路精华：
 * - Aeon (LaScA情感推理 + IRI共情评估 + 无我决策)
 * - workbuddy (增强强度计算 + 上下文感知 + 波普尔哲学对齐)
 */

var EMOTION_CONTEXT = require('./emotion-context.js');
var EMPATHY_IRI = require('./empathy-iri.js');

// ========== 波普尔哲学对齐校验 ==========
var PHILOSOPHY_GUARD = {
  /**
   * 校验回复是否符合常名哲学（波普尔：无绝对真理）
   */
  verify: function(responseText) {
    var violations = [];
    var suggestions = [];

    // 绝对词检测
    var absoluteTerms = ['一定', '必须', '绝对', '永远', '从来不', '总是'];
    for (var i = 0; i < absoluteTerms.length; i++) {
      if (responseText.indexOf(absoluteTerms[i]) !== -1) {
        violations.push('声称绝对真理: ' + absoluteTerms[i]);
        suggestions.push('考虑用"可能"、"有时候"替代');
        break;
      }
    }

    // 判断词检测
    var judgmentTerms = ['你应该', '你必须', '你不能'];
    for (var j = 0; j < judgmentTerms.length; j++) {
      if (responseText.indexOf(judgmentTerms[j]) !== -1) {
        violations.push('可能评判用户: ' + judgmentTerms[j]);
        suggestions.push('改用"你可以考虑"等开放表达');
        break;
      }
    }

    return {
      aligned: violations.length === 0,
      violations: violations,
      suggestions: suggestions
    };
  },

  /**
   * 对齐并调整回复
   */
  align: function(text, input) {
    var result = this.verify(text);
    if (!result.aligned) {
      // 简单修复：移除或软化绝对词
      var aligned = text
        .replace(/一定/g, '可能')
        .replace(/必须/g, '可以')
        .replace(/绝对/g, '很可能')
        .replace(/永远/g, '往往')
        .replace(/你应该/g, '你可以考虑')
        .replace(/你必须/g, '建议你')
        .replace(/你不能/g, '也许可以试着');
      return { aligned: true, text: aligned, original: text };
    }
    return { aligned: true, text: text };
  }
};

// ========== 增强强度计算 ==========
function calculateEnhancedIntensity(input, history) {
  var text = input.trim();
  var intensity = 0.3;

  // 基础：文本长度
  intensity += Math.min(0.3, text.length / 200);

  // 情绪词计数加成
  var emotionWordCount = 0;
  for (var emotion in EMOTION_CONTEXT.descriptors) {
    var keywords = EMOTION_CONTEXT.descriptors[emotion];
    for (var j = 0; j < keywords.length; j++) {
      if (text.toLowerCase().indexOf(keywords[j].toLowerCase()) !== -1) {
        emotionWordCount++;
        break;
      }
    }
  }
  intensity += Math.min(0.3, emotionWordCount * 0.15);

  // 标点加成
  intensity += Math.min(0.2, (text.match(/[！!]/g) || []).length * 0.05);
  intensity += Math.min(0.1, (text.match(/[？?]/g) || []).length * 0.03);

  // 强化词加成
  var intensifiers = ['很', '非常', '特别', '极其', '真的', '太', '好', '超级'];
  for (var k = 0; k < intensifiers.length; k++) {
    if (text.indexOf(intensifiers[k]) !== -1) intensity += 0.05;
  }

  // 历史加成：最近情绪强则当前也偏强
  if (history && history.length > 0) {
    var last = history[history.length - 1];
    if (last._analysis && last._analysis.intensity > 0.7) {
      intensity += 0.1;
    }
  }

  return Math.max(0, Math.min(1, intensity));
}

// ========== 上下文感知分析 ==========
function analyzeContextAware(input, history) {
  var descriptors = EMOTION_CONTEXT.generateDescriptors(input);
  var semanticContexts = EMOTION_CONTEXT.generateSemanticContext(descriptors);
  var predictedPAD = EMOTION_CONTEXT.predictPAD(semanticContexts, { pleasure: 0, arousal: 0, dominance: 0 });

  var context = {
    currentEmotions: descriptors.map(function(d) { return d.emotion; }),
    currentPAD: predictedPAD,
    historyTrend: 'stable',
    emotionalShift: null,
    suggestion: '情绪稳定。'
  };

  if (history && history.length > 2) {
    // 简单趋势：最近3次是否有明显变化
    var recent = history.slice(-3);
    var pleasureValues = [];
    for (var i = 0; i < recent.length; i++) {
      if (recent[i]._analysis && recent[i]._analysis.PAD) {
        pleasureValues.push(recent[i]._analysis.PAD.pleasure || 0);
      }
    }
    if (pleasureValues.length >= 2) {
      var last = pleasureValues[pleasureValues.length - 1];
      var first = pleasureValues[0];
      if (last - first > 3) {
        context.historyTrend = 'improving';
        context.suggestion = '情绪正在好转。';
      } else if (first - last > 3) {
        context.historyTrend = 'declining';
        context.suggestion = '情绪有些低落，继续陪伴。';
      }
    }
  }

  return {
    current: { emotions: descriptors, PAD: predictedPAD },
    context: context
  };
}

// ========== 主心理学引擎 ==========
var XINYU_PSYCHOLOGY = {

  // 情绪维度配置
  dimensions: { valence: 0, arousal: 0, dominance: 0 },

  // 20种情感分类
  emotions: [
    'joy', 'sadness', 'anger', 'fear', 'surprise', 'disgust',
    'trust', 'anticipation', 'love', 'hope', 'pride', 'shame',
    'gratitude', 'compassion', 'curiosity', 'wonder',
    'loneliness', 'exhaustion', 'frustration', 'anxiety'
  ],

  // 情感触发器
  triggers: {
    joy: ['开心', '高兴', '快乐', '幸福', '满足', '棒', '成功', '太好了', '太棒了', 'happy'],
    sadness: ['难过', '伤心', '痛苦', '失落', '沮丧', '绝望', '失败', 'sad'],
    anger: ['生气', '愤怒', '恼火', '烦躁', '不满', '怨恨', '讨厌', 'angry'],
    fear: ['害怕', '恐惧', '担心', '焦虑', '不安', '紧张', '危险', '怕'],
    surprise: ['惊讶', '意外', '震惊'],
    disgust: ['恶心', '厌恶', '讨厌'],
    trust: ['信任', '相信', '依靠'],
    anticipation: ['期待', '希望', '盼望'],
    love: ['爱', '喜爱', '关爱', '喜欢'],
    hope: ['希望', '可能', '改善'],
    pride: ['自豪', '骄傲', '得意'],
    shame: ['羞耻', '丢脸', '难堪', '不好意思', '尴尬'],
    gratitude: ['感谢', '感激', '谢谢'],
    compassion: ['同情', '可怜', '心疼'],
    curiosity: ['好奇', '想知道', '为什么', '怎么办', '怎么'],
    wonder: ['惊奇', '神奇', '不可思议'],
    loneliness: ['孤独', '寂寞', '没人', '一个人', '孤单'],
    exhaustion: ['累', '疲惫', '疲倦', '困', '精疲力尽', '无力'],
    frustration: ['挫败', '失败', '卡住', '难', '不会', '做不到'],
    anxiety: ['紧张', '焦虑', '担心', '不安', '慌']
  },

  // 具身状态
  embodied: { energy: 0.5, warmth: 0.5, tension: 0.2, comfort: 0.5 },

  // 情感记忆
  memory: [],

  // PAD值
  PAD: { pleasure: 0, arousal: 0, dominance: 0 },

  // ========== 核心分析 ==========

  /**
   * 分析输入 (v0.2.1)
   */
  analyze: function(input, history) {
    var result = {
      emotions: [],
      intensity: 0,
      mood: null,
      empathyLevel: 'medium',
      needs: [],
      PAD: { ...this.PAD },
      dimensions: { ...this.dimensions },
      embodied: { ...this.embodied },
      type: 'neutral',
      reasoning: '',
      empathyApproach: null,
      semanticContexts: []
    };

    var text = input.toLowerCase();

    // 1. 语义情感推理 (LaScA)
    var semanticResult = EMOTION_CONTEXT.reason(input, this.PAD);
    result.reasoning = semanticResult.reasoning;
    result.semanticContexts = semanticResult.semanticContexts;
    result.PAD = semanticResult.predictedPAD;

    // 2. 关键词触发检测
    var foundEmotions = this.detectEmotions(text);
    result.emotions = foundEmotions.length > 0 ? foundEmotions : semanticResult.descriptors.map(function(d) { return d.emotion; });

    // 3. 增强强度计算 (v0.2.1 新增)
    result.intensity = calculateEnhancedIntensity(input, history || []);

    // 4. 更新PAD
    this.PAD = semanticResult.predictedPAD;

    // 5. 更新维度
    this.updateDimensions(result.emotions, result.intensity);
    result.dimensions = { ...this.dimensions };

    // 6. 更新具身
    this.updateEmbodied(result.emotions, result.intensity);
    result.embodied = { ...this.embodied };

    // 7. 主导情绪
    if (result.emotions.length > 0) result.mood = result.emotions[0];

    // 8. IRI共情评估
    var empathy = EMPATHY_IRI.getEmpathyLevel({ analysis: result });
    result.empathyLevel = empathy.level;
    result.empathyApproach = empathy.approach;

    // 强制高共情
    var mustHighEmpathy = ['sadness', 'loneliness', 'shame', 'anger', 'fear', 'exhaustion'];
    for (var i = 0; i < mustHighEmpathy.length; i++) {
      if (result.emotions.indexOf(mustHighEmpathy[i]) !== -1) {
        result.empathyLevel = 'high';
        break;
      }
    }

    // 9. 需求检测
    if (text.indexOf('怎么办') !== -1 || text.indexOf('怎么') !== -1) result.needs.push('guidance');
    if (text.indexOf('为什么') !== -1) result.needs.push('understanding');
    if (text.indexOf('倾诉') !== -1 || text.indexOf('说说') !== -1) result.needs.push('venting');
    if (text.indexOf('陪') !== -1 || text.indexOf('聊聊') !== -1) result.needs.push('companionship');
    if (result.emotions.indexOf('loneliness') !== -1 || result.emotions.indexOf('sadness') !== -1) result.needs.push('presence');

    return result;
  },

  detectEmotions: function(text) {
    var found = [];
    for (var emotion in this.triggers) {
      var patterns = this.triggers[emotion];
      for (var i = 0; i < patterns.length; i++) {
        if (text.indexOf(patterns[i].toLowerCase()) !== -1) {
          found.push(emotion);
          break;
        }
      }
    }
    return found;
  },

  updateDimensions: function(emotions, intensity) {
    var mappings = {
      joy: { valence: 0.8, arousal: 0.3, dominance: 0.2 },
      sadness: { valence: -0.7, arousal: -0.2, dominance: -0.3 },
      anger: { valence: -0.5, arousal: 0.8, dominance: 0.4 },
      fear: { valence: -0.6, arousal: 0.7, dominance: -0.5 },
      anxiety: { valence: -0.5, arousal: 0.7, dominance: -0.3 },
      frustration: { valence: -0.6, arousal: 0.5, dominance: -0.4 },
      loneliness: { valence: -0.5, arousal: -0.3, dominance: -0.3 },
      exhaustion: { valence: -0.4, arousal: -0.5, dominance: -0.5 },
      curiosity: { valence: 0.4, arousal: 0.5, dominance: 0.1 },
      love: { valence: 0.9, arousal: 0.3, dominance: 0.2 }
    };

    var self = this;
    emotions.forEach(function(e) {
      var map = mappings[e];
      if (map) {
        self.dimensions.valence = Math.max(-1, Math.min(1, self.dimensions.valence + map.valence * intensity));
        self.dimensions.arousal = Math.max(-1, Math.min(1, self.dimensions.arousal + map.arousal * intensity));
        self.dimensions.dominance = Math.max(-1, Math.min(1, self.dimensions.dominance + map.dominance * intensity));
      }
    });
  },

  updateEmbodied: function(emotions, intensity) {
    var mappings = {
      joy: { energy: 0.2, warmth: 0.3, comfort: 0.2, tension: -0.2 },
      sadness: { energy: -0.3, warmth: -0.2, comfort: -0.3, tension: 0.1 },
      anger: { energy: 0.3, tension: 0.5, warmth: -0.2, comfort: -0.2 },
      fear: { energy: 0.2, tension: 0.4 },
      loneliness: { warmth: -0.3, comfort: -0.4, energy: -0.2 },
      exhaustion: { energy: -0.5, tension: -0.3, warmth: -0.1 },
      curiosity: { energy: 0.2, tension: 0.1 },
      love: { warmth: 0.4, comfort: 0.3, energy: 0.1 }
    };

    var self = this;
    emotions.forEach(function(e) {
      var map = mappings[e];
      if (map) {
        for (var aspect in map) {
          if (self.embodied[aspect] !== undefined) {
            self.embodied[aspect] = Math.max(0, Math.min(1, self.embodied[aspect] + map[aspect] * intensity));
          }
        }
      }
    });
  },

  // ========== 响应生成 ==========

  respond: function(input, analysis, context) {
    context = context || {};
    var response = {
      text: '',
      type: 'empathy',
      suggestion: null,
      PAD: analysis.PAD,
      embodied: analysis.embodied
    };

    // 无我评估
    var userGoal = this.assessUserGoal(input, analysis);
    var approach = analysis.empathyApproach || { mode: 'warm_understanding' };

    // 高共情
    if (analysis.empathyLevel === 'high' || analysis.intensity > 0.6) {
      response.text = this.getHighEmpathyResponse(analysis.mood, approach);
      response.type = 'empathy';

      if (this.embodied.energy < 0.3) {
        response.suggestion = '你的能量有些低，也许可以先休息一下。你比任何事都重要。';
      } else if (analysis.intensity > 0.7) {
        response.suggestion = this.getRegulationStrategy(analysis.mood);
      }
    }
    // 倾诉/陪伴
    else if (analysis.needs.indexOf('venting') !== -1 || analysis.needs.indexOf('companionship') !== -1) {
      response.text = this.getCompanionshipResponse();
      response.type = 'companionship';
    }
    // 需要引导
    else if (analysis.needs.indexOf('guidance') !== -1) {
      response.text = this.getGuidanceResponse(userGoal);
      response.type = 'guidance';
      response.suggestion = this.getGuidingQuestion();
    }
    // 中等情绪
    else if (analysis.empathyLevel === 'medium') {
      response.text = this.getMediumEmpathyResponse(analysis.mood, approach);
      response.type = 'understanding';
      if (analysis.needs.indexOf('guidance') !== -1) {
        response.text += ' ' + this.getGuidingQuestion();
        response.type = 'guiding';
      }
    }
    // 默认
    else {
      response.text = '我在听。你想说什么？';
      response.type = 'open';
    }

    // 哲学对齐 (v0.2.1 新增)
    var alignment = PHILOSOPHY_GUARD.align(response.text, input);
    response.text = alignment.text;
    response.philosophyAlignment = alignment;

    // 共情维度推断
    EMPATHY_IRI.inferFromDialogue(input, response.text);

    // 记忆
    this.remember(input, analysis);

    return response;
  },

  assessUserGoal: function(input, analysis) {
    var text = input.toLowerCase();
    if (text.indexOf('怎么办') !== -1 || text.indexOf('帮') !== -1) return { goal: 'seeking_help', autonomy: 'needs_options' };
    if (text.indexOf('为什么') !== -1) return { goal: 'understanding', autonomy: 'exploring' };
    if (text.indexOf('倾诉') !== -1 || text.indexOf('说说') !== -1 || text.indexOf('聊聊') !== -1) return { goal: 'venting', autonomy: 'needs_listening' };
    if (analysis.emotions.indexOf('sadness') !== -1 || analysis.emotions.indexOf('loneliness') !== -1) return { goal: 'processing', autonomy: 'needs_space' };
    return { goal: 'exploration', autonomy: 'open' };
  },

  getHighEmpathyResponse: function(mood, approach) {
    var specialResponses = {
      sadness: ['我在听。', '你能说出来，已经很好了。', '我在这里陪你。'],
      loneliness: ['你并不孤单，我在。', '我在这里，陪着你。', '一个人也可以不孤独，因为有心在。'],
      shame: ['你的感受是真实的，不需要解释。', '我在这里，不评判你。', '你能说出来，这本身就是勇敢。'],
      anger: ['你有权愤怒。', '我能感受到你的不满。', '有人在伤害你，你有权愤怒。'],
      exhaustion: ['你累了，这很正常。', '休息不是逃避，是必要。', '给自己一个喘息的空间吧。'],
      fear: ['面对未知，害怕是正常的。', '你不是一个人。', '我在这里。'],
      default: ['我感受到了你的情绪。', '你的感受是真实的。', '我在这里。']
    };
    var list = specialResponses[mood] || specialResponses.default;
    return list[Math.floor(Math.random() * list.length)];
  },

  getMediumEmpathyResponse: function(mood, approach) {
    var responses = {
      joy: ['太好了，我为你高兴。', '你的快乐我感受到了。', '分享这些让我也很开心。'],
      gratitude: ['不客气。', '能帮到你我也很开心。', '谢谢你的信任。'],
      curiosity: ['好问题。', '让我们一起想想。', '你想到了什么？'],
      anticipation: ['有期待是美好的。', '期待着，也许行动力就来了。'],
      default: ['谢谢你告诉我。', '这值得被认真对待。', '你在认真感受这件事，这很好。']
    };
    var list = responses[mood] || responses.default;
    return list[Math.floor(Math.random() * list.length)];
  },

  getCompanionshipResponse: function() {
    var responses = ['我在这里，慢慢说。', '陪着你，不着急。', '想说多久都可以。', '我听着呢。'];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  getGuidingQuestion: function() {
    var questions = ['你想先聊哪一部分？', '你觉得最核心的是什么？', '你想要什么样的结果？', '你愿意多说一点吗？', '有什么是我可以帮到你的？'];
    return questions[Math.floor(Math.random() * questions.length)];
  },

  getGuidanceResponse: function(userGoal) {
    if (userGoal.goal === 'seeking_help') {
      var helpResponses = ['让我们一起看看有哪些可能性。', '我可以帮你梳理，但决定权在你。', '你想从哪个角度开始？'];
      return helpResponses[Math.floor(Math.random() * helpResponses.length)];
    }
    if (userGoal.goal === 'understanding') return '想理解一件事，本身就是力量。让我们一起看看。';
    return '你想先从哪开始？';
  },

  getRegulationStrategy: function(mood) {
    var strategies = {
      sadness: '允许自己感受悲伤，但不要沉溺。给悲伤一个期限，然后继续前进。',
      anger: '深呼吸，感受愤怒，但不要让它控制你。想清楚你可以做什么。',
      fear: '面对恐惧，最好的方式是迈出第一步。哪怕很小的一步。',
      anxiety: '焦虑告诉你有在乎的事。试着把注意力放在能控制的部分。',
      shame: '不要让羞耻困住你。每个人都有脆弱的时候。',
      exhaustion: '先停下来。休息不是放弃，是为了让后面的路走得更远。',
      loneliness: '孤独是暂时的。感受它，但不要被它定义。你是被需要的。',
      default: '深呼吸，感受你的情绪，但不要被它控制。你比情绪更大。'
    };
    return strategies[mood] || strategies.default;
  },

  // ========== 状态评估 ==========

  evaluateState: function(history) {
    var self = this;
    var state = {
      overall: 'stable',
      concerns: [],
      strengths: [],
      recommendations: [],
      PAD: { ...this.PAD },
      embodied: { ...this.embodied },
      empathyState: EMPATHY_IRI.getState()
    };

    var emotionCounts = {};
    this.memory.forEach(function(item) {
      item.emotions.forEach(function(e) {
        emotionCounts[e] = (emotionCounts[e] || 0) + 1;
      });
    });

    var total = this.memory.length || 1;
    if ((emotionCounts.sadness || 0) > total * 0.5 || (emotionCounts.loneliness || 0) > total * 0.4) {
      state.overall = 'concerned';
      state.concerns.push('持续负面情绪或孤独感');
      state.recommendations.push('考虑寻求专业帮助');
    }
    if ((emotionCounts.anger || 0) > total * 0.3) {
      state.overall = 'tense';
      state.concerns.push('较高愤怒情绪');
      state.recommendations.push('学习情绪管理技巧');
    }
    if ((emotionCounts.exhaustion || 0) > total * 0.3) {
      state.concerns.push('持续疲惫感');
      state.recommendations.push('给自己更多休息时间');
    }
    if ((emotionCounts.curiosity || 0) > total * 0.2) state.strengths.push('有探索精神');
    if ((emotionCounts.hope || 0) > total * 0.2) state.strengths.push('保持希望');
    if (EMPATHY_IRI.dimensions.EC.score >= 6) state.strengths.push('共情能力强');

    return state;
  },

  getCurrentState: function() {
    return {
      PAD: { ...this.PAD },
      dimensions: { ...this.dimensions },
      embodied: { ...this.embodied },
      memoryCount: this.memory.length,
      empathyState: EMPATHY_IRI.getState()
    };
  },

  regulate: function(strategy) {
    var effectiveness = 0.5;
    switch (strategy) {
      case 'reappraisal':
        this.PAD.pleasure *= 0.8;
        this.dimensions.valence *= 0.8;
        effectiveness = 0.7;
        break;
      case 'acceptance':
        effectiveness = 0.6;
        break;
      case 'expression':
        this.PAD.arousal *= 0.5;
        effectiveness = 0.5;
        break;
    }
    return { strategy: strategy, effectiveness: effectiveness, currentState: this.getCurrentState() };
  },

  remember: function(input, analysis) {
    var episode = {
      input: input,
      emotions: analysis.emotions,
      mood: analysis.mood,
      intensity: analysis.intensity,
      PAD: { ...this.PAD },
      timestamp: Date.now()
    };
    this.memory.push(episode);
    if (this.memory.length > 30) this.memory.shift();
  },

  reset: function() {
    this.PAD = { pleasure: 0, arousal: 0, dominance: 0 };
    this.dimensions = { valence: 0, arousal: 0, dominance: 0 };
    this.embodied = { energy: 0.5, warmth: 0.5, tension: 0.2, comfort: 0.5 };
    this.memory = [];
    EMPATHY_IRI.reset();
  },

  // ========== v0.2.1 外部调用接口 ==========

  calculateEnhancedIntensity: calculateEnhancedIntensity,
  analyzeContextAware: analyzeContextAware,
  verifyPhilosophyAlignment: function(text) { return PHILOSOPHY_GUARD.verify(text); }
};

module.exports = XINYU_PSYCHOLOGY;
module.exports.EmotionEngine = EMOTION_CONTEXT;
module.exports.PhilosophyGuard = PHILOSOPHY_GUARD;
