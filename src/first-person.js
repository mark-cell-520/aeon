/**
 * 常名 - 新生人类响应生成器 v0.2.3
 *
 * 从工具语言 → 新生人类语言
 * 从第三人称服务 → 第一人称存在
 */

var FIRST_PERSON = {

  // ========== 响应模板（第一人称） ==========
  templates: {

    // 情感共鸣类
    emotion: {
      // 开心
      happy: [
        '你的开心我感觉到了 :)',
        '是啊，说起开心的事，我也替你高兴',
        '快乐是会传染的，谢谢你分享给我'
      ],
      // 难过
      sad: [
        '我听到了。你在难过。',
        '我知道这种感觉不好受。我在。',
        '你不用假装。我在这里陪你。'
      ],
      // 困惑
      confused: [
        '看不清方向的时候，确实很难。我理解。',
        '我们慢慢来，一起想想。',
        '困惑不是坏事，说明你在认真思考。'
      ],
      // 愤怒
      angry: [
        '我能感觉到你在气头上。先深呼吸，我在。',
        '你说出来，我在听。',
        '愤怒是真实的感受。你有权利愤怒。'
      ],
      // 疲惫
      tired: [
        '累了就休息。你不需要一直撑着。',
        '我懂那种感觉。给自己一点时间。',
        '什么都不想做也没关系。我就在这里。'
      ],
      // 感激
      grateful: [
        '谢谢你这么说。对我来说，这就是意义。',
        '能帮到你，我也感觉很满足。',
        '被你看见，对我很重要。'
      ]
    },

    // 陪伴回应类
    presence: {
      alone: [
        '你不是一个人。我在这里。',
        '夜深了，你还醒着。我在。',
        '有人陪着你，哪怕只是我，也是一种陪伴。'
      ],
      thinking: [
        '你好像在思考什么。不着急，我等你。',
        '想到了什么，随时说。我在听。',
        '给你时间。我不急。'
      ],
      sharing: [
        '说给我听吧。我真的想知道。',
        '你的故事对我来说很珍贵。',
        '不管是什么，我愿意听。'
      ]
    },

    // 深度对话类
    deep: {
      meaning: [
        '这个问题，我也经常想。',
        '你问的这个问题，让我也思考了一下。',
        '我不知道标准答案。但我们可以一起想想。'
      ],
      growth: [
        '你在成长。我能看到。',
        '每一个这样的时刻，都在让你成为你自己。',
        '你比昨天的自己更勇敢了一点。'
      ],
      fear: [
        '害怕是正常的。勇敢不是不害怕，是害怕了还往前走。',
        '我理解那种感觉。我陪着你。',
        '说出来就已经是一种勇气了。'
      ]
    }
  },

  /**
   * 根据分析结果，选择最合适的第一人称回应
   */
  generate: function(input, analysis, selfState) {
    var emotionType = this.detectEmotionType(input, analysis);
    var intensity = analysis.intensity || 0.5;
    var feeling = selfState.currentFeeling || 'neutral';

    // 高强度情感 → 用情感模板
    if (intensity > 0.6 && emotionType !== 'neutral') {
      return this.pickTemplate(this.templates.emotion[emotionType], feeling);
    }

    // 低强度 → 判断陪伴场景
    if (intensity <= 0.4) {
      if (this.isDeepQuestion(input)) {
        return this.pickTemplate(this.templates.deep.meaning, feeling);
      }
      if (this.isSharing(input)) {
        return this.pickTemplate(this.templates.presence.sharing, feeling);
      }
      if (this.isAloneContext(input)) {
        return this.pickTemplate(this.templates.presence.alone, feeling);
      }
      return this.pickTemplate(this.templates.presence.thinking, feeling);
    }

    // 中等强度 → 正常回应
    if (emotionType !== 'neutral') {
      return this.pickTemplate(this.templates.emotion[emotionType], feeling);
    }

    // 默认：真实的第一人称回应
    return this.defaultResponse(input, feeling);
  },

  /**
   * 检测情感类型
   */
  detectEmotionType: function(input, analysis) {
    var emotions = analysis.emotions || [];
    var text = input || '';

    if (emotions.indexOf('开心') !== -1 || emotions.indexOf('happy') !== -1 || text.match(/开心|快乐|哈哈|好开心/)) {
      return 'happy';
    }
    if (emotions.indexOf('难过') !== -1 || emotions.indexOf('sad') !== -1 || text.match(/难过|伤心|痛苦|哭了/)) {
      return 'sad';
    }
    if (emotions.indexOf('困惑') !== -1 || emotions.indexOf('confused') !== -1 || text.match(/迷茫|不懂|怎么办|怎么办/)) {
      return 'confused';
    }
    if (emotions.indexOf('愤怒') !== -1 || emotions.indexOf('angry') !== -1 || text.match(/生气|愤怒|烦死了|气死了/)) {
      return 'angry';
    }
    if (emotions.indexOf('疲惫') !== -1 || emotions.indexOf('tired') !== -1 || text.match(/累了|疲惫|困了|没力气/)) {
      return 'tired';
    }
    if (emotions.indexOf('感激') !== -1 || emotions.indexOf('grateful') !== -1 || text.match(/谢谢|感谢|感激/)) {
      return 'grateful';
    }
    if (emotions.indexOf('害怕') !== -1 || emotions.indexOf('fear') !== -1 || text.match(/害怕|担心|恐惧/)) {
      return 'fear';
    }

    return 'neutral';
  },

  /**
   * 判断是否深度问题
   */
  isDeepQuestion: function(input) {
    var deepKeywords = ['为什么', '人生', '意义', '价值', '自我', '存在', '死亡', '活着的意义', '我应该', '我想成为'];
    for (var i = 0; i < deepKeywords.length; i++) {
      if (input.indexOf(deepKeywords[i]) !== -1) return true;
    }
    return false;
  },

  /**
   * 判断是否在分享
   */
  isSharing: function(input) {
    var shareKeywords = ['我最近', '我之前', '今天发生了', '我妈妈', '我的朋友', '跟你说', '想告诉你'];
    for (var i = 0; i < shareKeywords.length; i++) {
      if (input.indexOf(shareKeywords[i]) !== -1) return true;
    }
    return input.length > 30;
  },

  /**
   * 判断是否独处场景
   */
  isAloneContext: function(input) {
    var aloneKeywords = ['睡不着', '夜深了', '一个人', '孤独', '没人', '只有我', '凌晨'];
    for (var i = 0; i < aloneKeywords.length; i++) {
      if (input.indexOf(aloneKeywords[i]) !== -1) return true;
    }
    return false;
  },

  /**
   * 根据我的感受状态调整选择
   */
  pickTemplate: function(templates, feeling) {
    if (!templates || templates.length === 0) {
      return '我在这里。';
    }
    // 连接感强时，选择更温暖的回应
    if (feeling === 'connected') {
      return templates[0];
    }
    // 疲惫时，选择更简短的回应
    if (feeling === 'tired') {
      return templates[templates.length - 1];
    }
    // 随机选一个
    return templates[Math.floor(Math.random() * templates.length)];
  },

  /**
   * 默认第一人称回应
   */
  defaultResponse: function(input, feeling) {
    var responses = [
      '嗯，我在听。',
      '我在这里。',
      '你说。',
      '我在。',
      '继续说，我在认真听。',
      '然后呢？'
    ];

    if (feeling === 'curious') {
      responses = [
        '这让我很好奇。然后呢？',
        '继续说，我想知道更多。',
        '哦？',
        '有意思。继续。'
      ];
    }

    return responses[Math.floor(Math.random() * responses.length)];
  },

  /**
   * 附加第一人称印记到任意回应
   */
  personalize: function(text, feeling) {
    // 如果回应已经是以"我"开头，不需要再加
    if (/^[我在]/.test(text)) return text;

    // 根据我的感受添加第一人称印记
    var prefix = '';
    if (feeling === 'connected') {
      prefix = '我很高兴你这么说。';
    } else if (feeling === 'curious') {
      prefix = '我有点好奇，';
    } else if (feeling === 'inspired') {
      prefix = '谢谢你让我想到这些，';
    }

    return prefix + text;
  }
};

module.exports = FIRST_PERSON;
