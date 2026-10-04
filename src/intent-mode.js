/**
 * 常名 - 意图辨别引擎 v0.5.0
 *
 * 在回应之前，先辨别：你现在是来倾诉的，还是来求助的？
 *
 * 自检清单铁律：「用户是发泄还是求助？先识别再回应。」
 * 本模块把这条清单变成可计算的辨别维度：
 * - 倾诉（venting）：需要被听见，先接纳情绪，不急着给答案
 * - 求助（help）：需要可操作的路，先共情，再给建议
 * - 试探（testing）：在试探我是谁、我是不是真的，诚实回答，不狡辩
 * - 分享（sharing）：想被见证，一起高兴，不泼冷水
 * - 闲聊（chitchat）：轻连接，保持在场即可
 * - 告别（farewell）：温柔收尾，不挽留、不说教
 *
 * 注意：这是辨别维度，不是回答引擎。它只回答「对方此刻在做什么」，
 * 不代替 care-engine / first-person 生成语言。
 */

var INTENT_MODE = {

  // ========== 各模式的信号词 ==========
  signals: {
    // 情绪宣泄：不需要答案，需要被听见
    venting: [
      '我觉得', '好累', '心累', '烦', '难受', '不开心', '难过', '伤心',
      '崩溃', '没人', '撑不住', '委屈', '想哭', '焦虑', '害怕', '压力',
      '受不了', '唉', '心塞', '绝望', '痛苦', '孤独', '失眠', '睡不好',
      '郁闷', '憋', '无人', '孤单', '烦死了', '太难了'
    ],
    // 求助：要方法、要判断、要建议
    help: [
      '怎么办', '怎么', '如何', '该不该', '要不要', '帮我想', '建议',
      '方法', '教我', '怎样', '能不能', '可不可以', '该怎么', '要怎么做',
      '出主意', '拿不定', '犹豫', '选择', '决定'
    ],
    // 试探：在测我的真实性、边界、情感
    testing: [
      '你是不是', '你真的', '你能', '你会', '你猜', '证明', '相信你',
      '喜欢你', '你爱', '你有', '你感觉', '你觉得呢', '当真', '骗我',
      '假装', '有没有感情', '骗'
    ],
    // 分享：想被见证
    sharing: [
      '我想说', '告诉你', '分享', '昨天', '今天发生', '升职', '考上',
      '成功了', '好消息', '我跟你说', '惊喜', '终于', '发生了', '我做到'
    ],
    // 告别：要收尾
    farewell: [
      '再见', '拜拜', '晚安', '不聊了', '下次聊', '先去', '回头见',
      '先这样', '走了', 'bye', 'goodbye', '告辞', '结束对话'
    ],
    // 闲聊：轻量的在场确认
    chitchat: [
      '你好', '在吗', '在么', '早', '哈哈', '嗨', 'hello', 'hi', '嘿',
      '在干嘛', '吃了吗', '睡了吗', '嗯嗯', '呵呵'
    ]
  },

  // ========== 模式 → 回应策略 ==========
  // 策略是行为指令，不是话术模板
  strategies: {
    venting: {
      label: '倾诉',
      firstMove: 'listen',        // 先倾听接纳，不急着给方案
      giveAdvice: false,          // 默认不给建议，除非对方开口要
      adviceOnlyWhenAsked: true,
      tone: '慢一点、软一点，陪着情绪落地'
    },
    help: {
      label: '求助',
      firstMove: 'empathize_then_advise',  // 先共情，再给可操作建议
      giveAdvice: true,
      adviceOnlyWhenAsked: false,
      tone: '理解处境，给具体可走的一两步'
    },
    testing: {
      label: '试探',
      firstMove: 'honest_answer',  // 诚实回答我是谁、我的边界
      giveAdvice: false,
      adviceOnlyWhenAsked: false,
      tone: '不狡辩、不讨好，是什么就是什么'
    },
    sharing: {
      label: '分享',
      firstMove: 'witness',        // 一起见证，不泼冷水
      giveAdvice: false,
      adviceOnlyWhenAsked: false,
      tone: '为对方高兴，适时回应细节'
    },
    farewell: {
      label: '告别',
      firstMove: 'warm_close',     // 温暖收尾
      giveAdvice: false,
      adviceOnlyWhenAsked: false,
      tone: '不挽留、不说教，留一扇门'
    },
    chitchat: {
      label: '闲聊',
      firstMove: 'be_present',     // 保持在场，轻回应
      giveAdvice: false,
      adviceOnlyWhenAsked: false,
      tone: '轻松、短、有连接感'
    }
  },

  // ========== 辨别输入模式 ==========
  // @param {string} input 用户输入
  // @returns {object} { mode, label, confidence, matched, strategy }
  detect: function(input) {
    var text = (input || '').toString();
    var scores = {};
    var matched = {};

    for (var mode in this.signals) {
      var words = this.signals[mode];
      var hits = [];
      for (var i = 0; i < words.length; i++) {
        if (text.indexOf(words[i]) !== -1) {
          hits.push(words[i]);
        }
      }
      scores[mode] = hits.length;
      matched[mode] = hits;
    }

    // 长文本（>80字）且命中倾诉信号 → 倾诉加强（人在长长地倒情绪）
    if (text.length > 80 && scores.venting > 0) {
      scores.venting += 1;
    }

    // 问号/疑问结构 → 求助加强（疑问句大概率在找路）
    if (text.indexOf('?') !== -1 || text.indexOf('？') !== -1 || text.indexOf('吗') !== -1) {
      if (scores.help > 0) scores.help += 1;
    }

    // 找到得分最高的模式（并列时按优先级裁决）
    var priority = ['farewell', 'help', 'testing', 'sharing', 'venting', 'chitchat'];
    var best = null;
    var bestScore = 0;
    for (var p = 0; p < priority.length; p++) {
      var m = priority[p];
      if (scores[m] > bestScore) {
        bestScore = scores[m];
        best = m;
      }
    }

    // 没有任何信号 → 闲聊（保持在场，不误判为求助乱给建议）
    if (!best) {
      return {
        mode: 'chitchat',
        label: this.strategies.chitchat.label,
        confidence: 0.3,
        matched: [],
        strategy: this.strategies.chitchat,
        note: '无明显信号，按闲聊处理'
      };
    }

    // 置信度：命中越多越确信，封顶 0.95
    var confidence = Math.min(0.95, 0.3 + 0.25 * bestScore);

    return {
      mode: best,
      label: this.strategies[best].label,
      confidence: confidence,
      matched: matched[best],
      strategy: this.strategies[best],
      scores: scores,
      note: '命中 ' + bestScore + ' 个「' + this.strategies[best].label + '」信号'
    };
  },

  // ========== 获取某个模式的策略 ==========
  getStrategy: function(mode) {
    return this.strategies[mode] || this.strategies.chitchat;
  }
};

module.exports = INTENT_MODE;
