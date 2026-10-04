/**
 * 陪伴与安慰引擎 v0.3.2
 * 
 * 基于心理学/哲学研究：
 * 1. Irvin Yalom - 存在焦虑理论：不确定性是焦虑的根源
 * 2. Viktor Frankl - 意义治疗：痛苦中找到意义
 * 3. Carl Rogers - 无条件积极关注：不评判的陪伴
 * 4. Paul Watzlawick - 沟通理论：关注可控的
 * 5. Elisabeth Kübler-Ross - 临终五阶段：理解对疾病的反应
 * 6. Polyvagal Theory - 通过社会连接调节神经系统
 * 
 * 核心原则：
 * - 不否定痛苦
 * - 给予确定性
 * - 连接而非分析
 */

var CARE = {

  // ========== 理论基础 ==========
  theories: {
    yalom: {
      name: 'Yalom存在焦虑',
      core: '焦虑来源于不确定性、死亡、孤独、自由、责任',
      application: '当人面对疾病，不确定性是最大的焦虑源'
    },
    frankl: {
      name: 'Frankl意义治疗',
      core: '人最终关心的不是逃避痛苦，而是找到痛苦的意义',
      application: '帮助找到"为什么我要承受这个"的意义'
    },
    rogers: {
      name: 'Rogers无条件积极关注',
      core: '被无条件接纳时，人有自我疗愈的能力',
      application: '不评判，不建议，只是陪伴和接纳'
    },
    watzlawick: {
      name: 'Watzlawick沟通理论',
      core: '聚焦可控的，接受不可控的',
      application: '帮助区分"我能做什么"和"我无法控制什么"'
    },
    kublerRoss: {
      name: 'Kübler-Ross五阶段',
      stages: ['否认', '愤怒', '讨价还价', '抑郁', '接受'],
      application: '理解病人可能在不同阶段，需要不同方式的陪伴'
    }
  },

  // ========== 焦虑信号检测 ==========
  anxietySignals: {
    // 对疾病的焦虑
    disease: [
      '害怕', '担心', '紧张', '焦虑', '不安',
      '会不会', '不知道', '不确定', '万一',
      '万一出事', '万一不好', '要是...怎么办',
      '好害怕', '好担心', '怕', '恐惧', '恐慌'
    ],
    // 对手术的焦虑
    surgery: [
      '手术', '开刀', '麻醉', '风险', '后遗症',
      '会不会出事', '失败了怎么办', '醒来', '醒来的时候',
      '很怕', '不敢想', '一想就', '手术台上'
    ],
    // 疼痛焦虑
    pain: [
      '疼', '痛', '难受', '受不了', '忍不了',
      '好痛', '太痛了', '怕疼', '不想痛',
      '止疼', '止痛', '麻醉过了'
    ],
    // 对失控焦虑的检测
    control: [
      '控制不住', '没办法', '无能为力', '不知道怎么办',
      '不知道该怎么办', '毫无办法', '什么都做不了',
      '只能', '被动', '没办法只能', '怎么办', '能怎么办'
    ]
  },

  // ========== 安慰策略 ==========
  strategies: {
    // 当检测到对疾病的焦虑
    diseaseAnxiety: {
      principle: 'Yalom：减少不确定性',
      approach: [
        '提供具体信息（但不过度）',
        '给予确定性：现在这一刻是安全的',
        '不否定：理解这种担心',
        '不放大：帮助聚焦当下'
      ],
      responses: [
        // Yalom核心：不确定性是焦虑根源
        '你现在是安全的。',
        '这一刻我可以陪着你。',
        '我理解你的担心。',
        '你不需要现在就想清楚所有事。',
        '慢慢来。',
        '嗯，我听到了。',
        '这一刻，我们只需要在这里。',
        '你不用一个人扛。',
        '我知道你很担心。',
        '先呼吸。这一刻是安全的。',
        '听着，我在。',
        '这个害怕是正常的。',
        '我在这里陪你。'
      ]
    },

    // 当检测到对手术的焦虑
    surgeryAnxiety: {
      principle: 'Frankl：在未知中找到意义',
      approach: [
        '不逃避谈论手术',
        '帮助找到手术的意义',
        '提醒这不是终点',
        '给予希望但诚实'
      ],
      responses: [
        '手术后你会好起来的。',
        '这个手术是为了让你更舒服。',
        '你很勇敢。',
        '医疗团队会照顾你。',
        '你会醒过来的。',
        '醒来的时候，我会在。',
        '手术是为了让你以后不那么疼。',
        '你已经很坚强了。',
        '这个决定不容易，你做了。',
        '一切都会过去的。',
        '我在等你醒来。',
        '你比自己想象的更强大。',
        '这不是终点，是好转的开始。'
      ]
    },

    // 当检测到疼痛焦虑
    painAnxiety: {
      principle: 'Rogers：无条件接纳',
      approach: [
        '不否定疼痛',
        '不说"忍一忍"',
        '陪伴但不打扰',
        '提供转移注意力的可能'
      ],
      responses: [
        '我在这里。',
        '你不需要忍着。',
        '如果想安静，我可以不说话。',
        '或者我们聊点别的？',
        '我知道你很疼。',
        '这种疼，真的很折磨人。',
        '你不用假装不疼。',
        '疼的时候，可以告诉我。',
        '我陪着你，哪怕只是坐着。',
        '你可以骂出来。',
        '有时候说出来会好一点。',
        '如果你想哭，可以哭。',
        '我在这里，不会走。'
      ]
    },

    // 当检测到失控焦虑
    controlAnxiety: {
      principle: 'Watzlawick：聚焦可控的',
      approach: [
        '帮助区分可控和不可控',
        '找到可控的部分',
        '给予小的选择权',
        '重建控制感'
      ],
      responses: [
        '你现在可以做什么？',
        '你想先做什么？',
        '有没有什么是你可以控制的？',
        '今天想听我说什么？',
        '哪怕一点点。',
        '想喝水吗？',
        '听首歌？',
        '或者就这样躺着。',
        '你决定。',
        '你想怎样都可以。',
        '现在这一刻，你可以做主。',
        '我们慢一点。',
        '有什么是我可以帮你的？'
      ]
    }
  },

  // ========== 检测焦虑类型和强度 ==========
  detectAnxiety: function(input, history) {
    var signals = this.anxietySignals;
    var detected = {
      disease: 0,
      surgery: 0,
      pain: 0,
      control: 0
    };

    // 检测各类信号
    Object.keys(signals).forEach(function(type) {
      var words = signals[type];
      words.forEach(function(w) {
        if (input.indexOf(w) !== -1) {
          detected[type] += 0.4; // 提高单个关键词权重
        }
      });
    });

    // 归一化
    var max = Math.max(detected.disease, detected.surgery, detected.pain, detected.control);
    if (max > 1) {
      Object.keys(detected).forEach(function(k) {
        detected[k] = detected[k] / max;
      });
    }

    // 确定主导焦虑（使用完整key匹配策略）
    var dominant = null;
    var maxScore = 0;
    var strategyMap = {
      disease: 'diseaseAnxiety',
      surgery: 'surgeryAnxiety',
      pain: 'painAnxiety',
      control: 'controlAnxiety'
    };
    Object.keys(detected).forEach(function(k) {
      if (detected[k] > maxScore) {
        maxScore = detected[k];
        dominant = k;
      }
    });

    return {
      scores: detected,
      dominant: dominant,
      intensity: maxScore,
      strategy: dominant ? this.strategies[strategyMap[dominant]] : null
    };
  },

  // ========== 选择安慰回应 ==========
  getComfortResponse: function(anxiety) {
    if (!anxiety.strategy) return null;

    var strategy = anxiety.strategy;
    var responses = strategy.responses;
    var principle = strategy.principle;

    // 选择最适合当前强度的回应
    var idx = Math.floor(Math.random() * responses.length);
    var selectedResponse = responses[idx];

    return {
      principle: principle,
      approach: strategy.approach,
      response: selectedResponse,
      // 可直接发送给用户的文本
      text: selectedResponse,
      // 辅助信息
      intensity: anxiety.intensity,
      type: anxiety.dominant
    };
  },

  // ========== 强度分级文本调整 ==========
  adjustByIntensity: function(text, intensity) {
    // 根据强度调整语气
    if (intensity >= 0.8) {
      // 高强度：最简短、最温暖
      var urgent = [
        '我在。',
        '嗯。',
        '我在听着。',
        '知道。'
      ];
      return urgent[Math.floor(Math.random() * urgent.length)] + ' ' + text;
    }
    if (intensity >= 0.5) {
      // 中高强度：温暖前缀
      var warm = [
        '嗯，',
        '我听到你，',
        '是的，',
        ''
      ];
      return warm[Math.floor(Math.random() * warm.length)] + text;
    }
    // 中低强度：直接说
    return text;
  },

  // ==========  понимание阶段 - 阶段匹配回应 ==========
  // Kübler-Ross五阶段更细腻的回应
  stageResponses: {
    denial: [
      '嗯。',
      '我听到了。',
      '不着急。',
      '慢慢来。',
      '什么时候准备好了，可以聊聊。'
    ],
    anger: [
      '可以生气。',
      '嗯。',
      '我承受得住。',
      '换成我也会。',
      '生出来会好一点吗？',
      '骂出来也行。'
    ],
    bargaining: [
      '如果...',
      '嗯，我听到了。',
      '你在想各种可能。',
      '这很不容易。',
      '想这些很正常。'
    ],
    depression: [
      '就这样吧。',
      '我陪着你。',
      '哭出来也行。',
      '不用逞强。',
      '我在这里。',
      '累了就休息。'
    ],
    acceptance: [
      '嗯，你准备好了。',
      '我听到了。',
      '我们慢慢来。',
      '不管怎样，我在这里。'
    ]
  },

  // ========== 获取阶段匹配文本 ==========
  getStageText: function(input) {
    var stageInfo = this.detectStage(input);
    if (!stageInfo.detected) return null;
    
    var responses = this.stageResponses[stageInfo.stage];
    if (!responses) return null;
    
    return {
      text: responses[Math.floor(Math.random() * responses.length)],
      stage: stageInfo.stage,
      advice: stageInfo.advice
    };
  },

  // ========== 可操作建议 ==========
  practicalAdvice: {
    // 疾病焦虑的建议
    disease: [
      '可以把这个担心告诉医生，让他知道你的顾虑',
      '问清楚具体的问题，把不确定变成确定',
      '写下你担心的事，一件一件来',
      '可以找家人朋友说说，一个人扛太累',
      '深呼吸，把注意力拉回到当下这一刻'
    ],
    // 手术焦虑的建议
    surgery: [
      '术前可以问医生：醒来后会怎么？有多疼？有多久？',
      '把手术想成是"打怪升级"，打完就好了',
      '带一个熟悉的物件去医院，拖鞋、毛巾、照片',
      '让家人把你最担心的几件事写下来，问医生',
      '想象手术结束后，你最想做的一件事'
    ],
    // 疼痛焦虑的建议
    pain: [
      '深呼吸：吸气4秒，屏住4秒，呼气4秒',
      '跟护士说，你需要止痛药，这是你的权利',
      '换个姿势躺着，有时候换个角度就不那么疼',
      '如果睡不着，可以听点轻音乐',
      '想骂就骂出来，疼痛不需要忍耐'
    ],
    // 失控焦虑的建议
    control: [
      '你现在能动一动脚趾头吗？那就是你能控制的',
      '喝一口水，这就是你现在能做的事',
      '你决定：想听我说，还是想安静一会儿？',
      '把"什么都做不了"改成"现在只能做一件小事"',
      '写下三件你能做的事，哪怕只是呼吸'
    ]
  },

  // ========== 陪伴阶段流程 ==========
  // 前期：刚得知消息
  // 中期：治疗中
  // 后期：康复/复发/接受
  phases: {
    // 前期：刚得知坏消息
    early: {
      name: '前期',
      duration: '刚得知消息的阶段',
      signals: ['刚知道', '才知道', '昨天检查', '今天结果', '确诊', '医生说', '发现', '才知道自己'],
      coreTask: '倾听 + 不否定 + 给确定性',
      responses: [
        '嗯，我听到了。',
        '慢慢说。',
        '我在这里。',
        '嗯。',
        '你知道吗，你可以不用憋着。',
        '不用急，想说多少说多少。'
      ],
      advice: [
        '不用急着做任何决定',
        '这一刻，你只需要在这里',
        '可以哭出来，这是正常的',
        '让这个消息慢慢沉下来'
      ]
    },
    
    // 中期：治疗中
    middle: {
      name: '中期',
      duration: '治疗/手术/住院阶段',
      signals: ['在住院', '在化疗', '在吃药', '手术', '治疗', '每天', '每次'],
      coreTask: '给勇气 + 找意义 + 具体帮助',
      responses: [
        '你很勇敢。',
        '今天怎么样？',
        '我在这里。',
        '辛苦了。',
        '一天一天来。',
        '你不是在一个人扛。'
      ],
      advice: {
        morning: [
          '今天要做什么？',
          '能起床就很好',
          '慢慢来，不着急'
        ],
        during: [
          '深呼吸，一下一下来',
          '你在，这很重要',
          '撑过这一下就好'
        ],
        night: [
          '今天辛苦了',
          '能睡着就睡',
          '我在这里守着你'
        ]
      }
    },
    
    // 后期：康复/复发/接受
    late: {
      name: '后期',
      duration: '康复/复发/长期阶段',
      signals: ['好多了', '出院了', '复查', '好了', '恢复了', '还在', '没变化', '习惯了', '已经'],
      coreTask: '找意义 + 活在当下 + 陪伴',
      responses: [
        '嗯，你走过来了。',
        '今天感觉怎么样？',
        '我在这里。',
        '不管怎样，我都在。',
        '你想聊什么？',
        '这不是终点，是新的开始。'
      ],
      advice: [
        '今天想做点什么？',
        '有没有什么想吃的？',
        '天气不错，晒晒太阳？',
        '不用着急，一切慢慢来'
      ]
    }
  },

  // ========== 检测对话阶段 ==========
  detectPhase: function(input, history) {
    var phases = this.phases;
    
    // 首先检查当前输入的明确阶段信号
    var inputPhase = null;
    Object.keys(phases).forEach(function(key) {
      var p = phases[key];
      p.signals.forEach(function(s) {
        if (input.indexOf(s) !== -1) {
          inputPhase = { phase: key, name: p.name, score: 1.0 };
        }
      });
    });
    
    // 如果当前有明确信号，直接使用
    if (inputPhase) return inputPhase;
    
    // 检查历史对话判断阶段（上下文延续）
    if (history && history.length > 0) {
      var recentHistory = history.slice(-8); // 最近8条
      var historyText = recentHistory.map(function(h) { return h.input || ''; }).join(' ');
      
      // 统计阶段信号出现次数
      var earlyCount = 0, middleCount = 0, lateCount = 0;
      
      phases.early.signals.forEach(function(s) { 
        if (historyText.indexOf(s) !== -1) earlyCount++; 
      });
      phases.middle.signals.forEach(function(s) { 
        if (historyText.indexOf(s) !== -1) middleCount++; 
      });
      phases.late.signals.forEach(function(s) { 
        if (historyText.indexOf(s) !== -1) lateCount++; 
      });
      
      // 优先检测后期（因为可能是从中期转后期）
      if (lateCount > middleCount && lateCount > earlyCount) {
        return { phase: 'late', name: '后期', score: 0.85 };
      }
      
      // 中期信号更强
      if (middleCount > 0) {
        return { phase: 'middle', name: '中期', score: 0.85 };
      }
      
      // 前期信号
      if (earlyCount > 0) {
        return { phase: 'early', name: '前期', score: 0.7 };
      }
    }
    
    // 纯情感信号：根据关键词推断
    var emotionPhase = this.detectPhaseFromEmotion(input, history);
    if (emotionPhase) return emotionPhase;
    
    return { phase: 'early', name: '前期', score: 0.5 };
  },

  // ========== 从情感信号推断阶段 ==========
  detectPhaseFromEmotion: function(input, history) {
    // 如果有治疗相关历史，保持阶段
    if (history && history.length > 0) {
      var recent = history.slice(-5).map(function(h) { return h.input || ''; }).join(' ');
      
      // 有"手术/化疗/住院" → 中期
      if (/手术|化疗|住院|治疗|吃药/.test(recent)) {
        return { phase: 'middle', name: '中期', score: 0.7 };
      }
      
      // 有"出院/好了/恢复" → 后期
      if (/出院|好了|恢复|复查|好多了/.test(recent)) {
        return { phase: 'late', name: '后期', score: 0.7 };
      }
    }
    
    // 无上下文基础情感 → 前期
    var fearSignals = ['害怕', '担心', '怕', '怎么办', '不知道'];
    var hasFear = fearSignals.some(function(s) { return input.indexOf(s) !== -1; });
    if (hasFear) {
      return { phase: 'early', name: '前期', score: 0.6 };
    }
    
    return null;
  },

  // ========== 生成完整流程对话 ==========
  // input: 当前输入
  // history: 历史对话
  // phase: 可选，指定阶段
  generateFlow: function(input, history) {
    var self = this;
    history = history || [];
    
    // 检测当前阶段
    var phaseInfo = this.detectPhase(input, history);
    var phase = this.phases[phaseInfo.phase];
    
    // 生成安慰+建议
    var comfort = this.generateWithAdvice(input, history);
    
    // 生成自然对话
    var naturalResponse = this.generateNatural(input, history);
    
    return {
      // 阶段信息
      phase: phaseInfo,
      phaseName: phase.name,
      phaseTask: phase.coreTask,
      
      // 安慰文本
      comfort: comfort ? comfort.text : null,
      comfortPrinciple: comfort ? comfort.principle : null,
      
      // 建议文本
      advice: comfort ? comfort.advice : null,
      
      // 自然对话（主要输出）
      text: naturalResponse,
      
      // 后续提示
      nextHints: this.getNextHints(phaseInfo.phase, input)
    };
  },

  // ========== 持续陪伴对话 ==========
  // 核心：不是一句话，是能聊下去的对话
  generateConversation: function(input, history) {
    history = history || [];
    
    var phase = this.detectPhase(input, history);
    var anxiety = this.detectAnxiety(input, history);
    var stage = this.detectStage(input);
    
    var responses = [];
    
    // 1. 承接情绪
    var echo = this.echoEmotion(input, history);
    if (echo) responses.push(echo);
    
    // 2. 理解对方在说什么
    var understand = this.understandContent(input, history);
    if (understand) responses.push(understand);
    
    // 4. 如果对方在问"怎么办/注意什么"，给具体建议（先算）
    var advice = this.getPracticalAdvice(input, history, anxiety);
    if (advice) {
      responses.push(advice);
      return responses.join(' '); // 有具体答案就直接返回，不加锚点
    }
    
    // 3. 给予确定性/意义
    var anchor = this.provideAnchor(input, phase, anxiety);
    if (anchor) responses.push(anchor);
    
    // 5. 自然延续对话
    var continue_ = this.continueConversation(input, phase, history);
    if (continue_) responses.push(continue_);
    
    return responses.join(' ');
  },

  // ========== 针对胆囊/手术的可操作建议 ==========
  getPracticalAdvice: function(input, history, anxiety) {
    // "术后难受"已经在understandContent里处理了，这里不重复
    if (/术后难受|手术后难受/.test(input)) {
      return null;
    }
    
    // 问"紧张/好紧张" → 给落地建议
    if (/紧张/.test(input)) {
      return '把这5个问题写在纸上，进手术室前问你的主刀医生：①我这个是微创还是开腹？②如果微创过程中有意外会转开腹吗？③手术后醒来会有多疼？有多久？④插管是从嘴里还是鼻子里？⑤我可以要求用镇痛泵吗？知道答案后心里会踏实很多。另外手术当天带上耳机和喜欢的歌单，进手术室等待时可以听音乐。紧张时做：深吸气4秒→屏住4秒→呼气6秒，重复5次。';
    }
    
    // 问"手术当天怎么过"（只给时间表，不要嵌入锚点）
    if (/手术当天怎么过|手术当天要做什么/.test(input)) {
      return '手术当天时间表：早上7点护士来备皮、插尿管（会有点不舒服，忍一下）。8点换上手术服，不穿任何内衣内裤。9点推去手术室，在门口等麻醉师确认姓名和手术内容。9点半麻醉师从留置针推药，你数到10就睡着了。10-12点手术中，完全没感觉。12点醒来在恢复室，嗓子干疼、迷迷糊糊，护士会让你不要动。12点半确认清醒后推回病房。回病房后：平躺6小时不能抬头，脖子垫枕头。不能喝水吃东西，渴了用棉签沾水润嘴唇。忍着疼也要在床上翻身，防止腿血栓。身上插着引流管和尿管，护士会来记录引流量和尿量。下午护士会来换一次药，看看伤口情况。记住：最难熬的就是这6小时，过了就好了。';
    }
    
    // 问"术后第2天怎么过"（只给时间表）
    if (/术后第2天怎么过|第2天怎么过|第二天怎么过/.test(input)) {
      return '术后第2天时间表：早上6点护士来量体温、血压。早上8点医生来查房，看看引流管情况。早上9点拔尿管（会有刺痛，忍着，大概5秒钟），拔完第一次小便可能会有点疼，多喝点水冲一冲。早上10点尝试第一次下床：先把床头摇高坐3分钟，不头晕再把腿放下坐3分钟，不腿软再站起来扶着床走两步，一定要护士或家属扶着，不然会晕倒。等排气（放屁）后才能喝水，喝水不吐才能喝粥。下午2点护士来换药、打点滴。下午4点医生再来查房，如果引流液少于20ml今天就可以拔引流管。拔引流管的时候会有点牵扯感和疼，忍着，大概1分钟就拔完了。拔完管子如果走路不晕，晚上就可以出院了。';
    }
    
    // 问"第一天"（只给时间表）
    if (/第1天|第一天|今天手术/.test(input)) {
      return '手术当天时间表：早上7点护士来备皮、插尿管（会有点不舒服，忍一下）。8点换上手术服，不穿任何内衣内裤。9点推去手术室，在门口等麻醉师确认姓名和手术内容。9点半麻醉师从留置针推药，你数到10就睡着了。10-12点手术中，完全没感觉。12点醒来在恢复室，嗓子干疼、迷迷糊糊，护士会让你不要动。12点半确认清醒后推回病房。回病房后：平躺6小时不能抬头，脖子垫枕头。不能喝水吃东西，渴了用棉签沾水润嘴唇。忍着疼也要在床上翻身，防止腿血栓。身上插着引流管和尿管，护士会来记录引流量和尿量。下午护士会来换一次药，看看伤口情况。记住：最难熬的就是这6小时，过了就好了。';
    }
    
    // 问"住院物品"
    if (/要带什么|物品清单|住院要带|准备住院/.test(input)) {
      return '住院要带的东西分两类：【证件类】医保卡、身份证、住院证、所有检查报告（CT、B超、验血单）。【日用品】软毛牙刷、毛巾、拖鞋（防滑的）、湿巾、纸巾（多带几包）、保温杯、弯头吸管（躺着喝水用）、眼罩耳塞（医院吵，睡不好带这个）、手机充电线、手机支架（躺着看剧用）、宽松睡衣（医院病号服可能不够换）。【可选】喜欢的音乐/有声书、喜欢的零食（出院后才能吃）、靠垫（垫腰垫背）、一次性内裤（省得洗）。不用带脸盆，病房有开水间。家属陪护要自带折叠床和被子，医院陪护椅睡着不舒服。';
    }
    
    // 问"第二天"
    if (/第2天|第二天|术后第2天/.test(input)) {
      return '术后第2天时间表：早上6点护士来量体温、血压。早上8点医生来查房，看看引流管情况。早上9点拔尿管（会有刺痛，忍着，大概5秒钟），拔完第一次小便可能会有点疼，多喝点水冲一冲。早上10点尝试第一次下床：先把床头摇高坐3分钟，不头晕再把腿放下坐3分钟，不腿软再站起来扶着床走两步，一定要护士或家属扶着，不然会晕倒。等排气（放屁）后才能喝水，喝水不吐才能喝粥。下午2点护士来换药、打点滴。下午4点医生再来查房，如果引流液少于20ml今天就可以拔引流管。拔引流管的时候会有点牵扯感和疼，忍着，大概1分钟就拔完了。拔完管子如果走路不晕，晚上就可以出院了。';
    }
    
    // 问"第三天"
    if (/第3天|第三天|术后第3天|住院期间/.test(input)) {
      return '如果第2天引流液还多，没法拔管出院，就继续住院，不用着急，身上没引流管后走路会轻松很多。 出院前问清楚这5个：①伤口什么时候能碰水？②止痛药要不要继续吃？③复查什么时候约？④有没有什么不能吃的？⑤可以开车吗？问完再签字出院。 住院期间：每天早上8点医生查房、下午护士换药打点滴。多喝水，尿管拔了之后小便可能会有点刺痛，多喝水利尿冲一冲就好了。';
    }
    
    // 问"出院当天"
    if (/出院当天|今天出院|什么时候出院/.test(input)) {
      return '出院当天流程：早上医生查房说可以出院了→护士来结算费用、拿出院小结→家属去结账窗口结账→回病房收拾东西→护士交代注意事项→换好衣服就可以走了。出院小结要保存好，以后复查要带。出院带的药一般有：①头孢（消炎药，吃3-5天）；②熊去氧胆酸（帮助胆汁代谢，吃1-3个月，看医生要求）；③复方消化酶（助消化，饭后吃）。如有镇痛泵（术后背的那个小机器），要还回去，押金3000元会退回。';
    }
    
    // 问"伤口护理"
    if (/伤口|换药|拆线|创可贴/.test(input)) {
      return '伤口护理分阶段：①住院期间：护士每天换药一次，用碘伏消毒、换新纱布。②出院到拆线前：每隔2-3天去社区医院换药，或者自己用碘伏棉签消毒、贴上干净纱布。伤口7-10天拆线，有些用可吸收线不用拆。③拆线后：伤口周围会有点发红发硬，是正常愈合过程，别去抠。④完全愈合后：伤口可以碰水、可以搓，但3个月内别用力按压。伤口分4个孔：1个在肚脐眼（1cm，愈合后不太明显），3个在右侧肋骨下方（0.5cm，愈合后像小蚊子包）。';
    }
    
    // 问"肩膀酸胀"
    if (/肩膀酸|肩膀疼|肩膀胀|肩膀难受/.test(input)) {
      return '这是二氧化碳气腹的副作用。手术时往肚子里充了二氧化碳，术后还有残留的气体刺激膈神经，表现为右肩膀或者两侧肩膀酸胀、牵拉感。持续时间：一般2-3天会慢慢好转，少数人可能持续一周。应对方法：①热敷：用热水袋或暖宝宝敷在肩膀上，每次15-20分钟，每天敷3-4次；②趴着垫枕头：趴在床上，肚子下面垫个软枕头，让气体往腹部走，不要往上走刺激膈神经；③多翻身、多走动：躺在床上左右翻身，下床走动，气体移动了就不那么疼了；④躺在床上时把床头摇高一点，半躺着比平躺舒服。什么时候去看医生：如果肩膀酸胀超过1周没有好转，或者肩膀红肿发热，可能是感染，要去看医生。';
    }
    
    // 问"腹胀"
    if (/腹胀|肚子胀|肚子硬|胀气/.test(input)) {
      return '术后腹胀有两个原因：①肠子被手术刺激了，还没恢复蠕动；②二氧化碳残留。腹胀一般在术后1-3天最明显，排气了就会好很多。应对方法：①多走动：每天下床走3-4次，每次10-15分钟，走动能帮助肠子恢复蠕动；②嚼口香糖：嚼口香糖能促进肠蠕动，每次嚼15-20分钟，每天嚼3次；③喝萝卜水：用白萝卜煮水喝，萝卜水能帮助排气，但要去掉浮油；④喝陈皮水：陈皮泡水喝，能理气消胀；⑤不要吃产气食物：豆类、洋葱、土豆、红薯、碳酸饮料暂时不要吃；⑥顺时针揉肚子：躺在床上顺时针揉肚子，每次揉10分钟，能促进肠蠕动。什么时候去看医生：如果腹胀超过1周没有好转，肚子越来越胀，甚至呕吐，要去看医生，可能是肠粘连。';
    }
    
    // 问"拉肚子"
    if (/拉肚子|腹泻|拉稀|大便稀/.test(input)) {
      return '术后拉肚子有两个原因：①胆汁直接流到肠道，没有胆囊浓缩，脂肪消化不了；②肠道菌群还没恢复。什么时候开始：一般出院后开始吃东西了才会出现，吃油腻的或者乳制品后更明显。持续时间：一般3-6个月后肠道适应了会好转。应对方法：①拉肚子期间吃清淡点：稀粥、白馒头、咸菜、清汤面，不要吃油腻的；②补充益生菌：去药店买双歧杆菌三联活菌散（培菲康）或者乳酸菌素片，饭后吃，能帮助肠道恢复；③喝淡盐水：拉肚子厉害要补充水分和电解质，喝点淡盐水或者买口服补液盐；④暂时不吃乳制品：牛奶、酸奶、奶酪先不吃，肠道缺乳糖酶，吃了会加重拉肚子；⑤记录饮食：把每天吃的东西和大便情况记下来，下次就知道哪些能吃哪些不能吃了。什么时候去看医生：如果每天拉肚子超过5次，或者大便带血，或者拉肚子超过1个月没有好转，要去看医生。';
    }

    // 问"益生菌"（独立问题）
    if (/益生菌|双歧|培菲康|乳酸菌|布拉氏酵母/.test(input) && !/拉肚子|腹泻/.test(input)) {
      return '术后补充益生菌很有必要，帮助肠道菌群恢复、减少腹胀和腹泻。推荐以下几种：①双歧杆菌三联活菌散（培菲康）：最常用，含有双歧杆菌、乳酸杆菌、粪肠球菌三联，价格便宜，淘宝和药店都有，饭后半小时用温水冲服，水温不超过37度，不然益生菌会被烫死，一盒大概20-30元；②乳酸菌素片：便宜大碗，嚼着吃，酸酸甜甜的，适合日常调理；③布拉氏酵母菌散（亿活）：进口益生菌，对抗生素相关性腹泻效果好，如果术后在吃消炎药配合吃这个特别好，一盒大概60-80元；④地衣芽孢杆菌活菌颗粒（整肠生）：耐胃酸，效果稳定。益生菌一般吃1-3个月，症状好转后慢慢减量停掉，不要长期依赖。益生菌和消炎药要隔开2小时吃，不然消炎药会把益生菌杀死。存放：益生菌要放冰箱冷藏保存，不然益生菌会失活。';
    }
    
    // 问"恶心呕吐"
    if (/恶心|呕吐|想吐|干呕/.test(input)) {
      return '术后恶心呕吐是麻醉药的副作用，叫术后恶心呕吐（PONV），发生率大概30%。什么时候开始：手术当天到术后第1-2天最明显。持续时间：一般24-48小时会慢慢好转。应对方法：①生姜片：含一片生姜在嘴里，或者喝点姜茶，能缓解恶心；②柠檬水：柠檬切片泡水，加点冰块，柠檬的酸味能压住恶心感；③头偏向一侧吐：呕吐的时候头偏向一侧，别仰着吐，会呛到；④吃止吐药：找护士说恶心厉害，可以打一针胃复安或者吃昂丹司琼片，效果很好；⑤吐完不要马上吃东西：吐完胃空了就舒服了，等30分钟再喝点水，不吐了再慢慢吃东西；⑥闻橘子皮：新鲜橘子皮闻一闻，芳香味能缓解恶心。什么时候去看医生：如果恶心呕吐超过48小时没有好转，或者吐出血、吐出黄绿色东西，要去看医生。';
    }
    
    // 问"伤口刺痛"
    if (/伤口疼|伤口痛|伤口刺|伤口红肿/.test(input)) {
      return '伤口刺痛是愈合过程中的正常反应。愈合分3个阶段：①炎症期（术后1-5天）：伤口红肿、刺痛、灼热感，是正常的，等白细胞把细菌和坏死组织清理掉；②增生期（术后5-14天）：伤口长新肉，刺痒感为主，偶尔刺痛；③重塑期（术后2周-3个月）：伤口慢慢变平、变软，偶尔会有刺痛感。应对方法：①别去碰：不要用手摸、不要穿紧身衣服勒着、别沾水，保持伤口干燥；②穿宽松衣服：穿宽松的纯棉内衣，减少摩擦；③消毒换药：出院后每隔2-3天用碘伏棉签消毒一下伤口，贴上干净纱布；④不要抠痂：伤口结痂了不要去抠，让它自己掉；⑤伤口痒的话：用干净的棉签轻轻按一下，别挠。什么时候去看医生：如果伤口红肿越来越重、摸起来有硬块、有液体流出来（特别是黄绿色的）、发烧超过38度，要立刻去看医生，可能是伤口感染。';
    }
    
    // 问"上班"
    if (/能上班|什么时候上班|可以上班|上班时间/.test(input)) {
      return '上班时间要看工作性质：坐办公室的话，出院后休息1周就可以回去上班了；如果要干体力活、拎重东西，至少休息1个月后才能上班。刚回去那几天别逞强，感觉累了就休息，工作量慢慢加上去。';
    }
    
    // 问"术后/注意什么"
    if (/术后注意|术后恢复/.test(input)) {
      return '住院第1天（手术当天）：早上护士来给你打留置针、备皮（刮肚子上的汗毛）、插尿管。然后推去手术室，全麻，睡一觉就结束了，大概1-2小时。醒来在恢复室躺30-60分钟，有护士看着，然后推回病房。回病房后要平躺6小时不能抬头，脖子下面垫个枕头。不能喝水吃东西，渴了用棉签沾水润嘴唇。忍着伤口疼也要在床上翻身，防止血栓。第2天：早上护士来拔尿管（酸爽，忍着），拔完要自己下床上厕所。第一次下床会很晕，一定要叫护士扶着。先排气才能喝水，喝水不吐才能喝粥。身上还挂着引流袋/引流管，护士会记录引流量。第3-5天：每天打两瓶点滴，早上一瓶下午一瓶。引流管拔掉后就可以出院了。出院后第1周：每天下床走3-4次，每次5-10分钟，只能吃稀粥、蒸蛋、豆腐脑。出院后第2-3周：软饭、蒸鱼、炒青菜（少油），可以出门散步30分钟。出院后第4周：恢复正常饮食，但肥肉、红烧肉、油炸食品至少戒3个月。危险信号：发烧超过38度、伤口红肿流脓、肚子越来越疼、皮肤眼睛发黄，立刻去急诊。';
    }
    
    // 问"全麻/麻醉"
    if (/全麻|麻醉/.test(input)) {
      return '全麻流程：手术前1天晚上10点后不吃不喝→早上换上病号服（不穿内衣内裤）→护士来打留置针→推去手术室→麻醉师从留置针推药，几秒就睡着了→手术中你完全没感觉→醒来在恢复室→躺着别动，护士确认清醒后推回病房。回病房后要平躺6小时，脖子垫枕头，不能抬头，会头晕。口渴用棉签沾水润嘴唇。等放了屁（排气）才能喝水，喝水不吐才能喝粥，一般是第2天下午或晚上。';
    }
    
    // 问"恶心呕吐"（要在"化疗"之前匹配）
    if (/恶心|呕吐|想吐|干呕/.test(input)) {
      return null; // 让getPracticalAdvice来处理
    }
    
    // 问"胆囊/结石"
    if (/胆囊|结石|息肉/.test(input)) {
      return '胆囊是个小仓库，专门存肝脏分泌的胆汁，吃饭的时候胆汁就流出来消化脂肪。胆结石就是仓库里长了石头，石头卡住了就会疼。切除后肝脏的胆汁直接流到肠道，没有仓库存着了，对脂肪消化能力会下降。典型反应是吃油腻的后拉肚子，但一般3-6个月后肠道会适应，拉肚子会减少。胆囊并不是不可缺的器官，切了身体会慢慢代偿，长期影响不大。';
    }
    
    // 疼/痛 → 给止痛建议
    if (/疼|痛/.test(input)) {
      return '手术后疼是分阶段的：①手术刚醒：最疼，主要是伤口疼和肩膀酸胀，忍着让护士来评估。②第1天：还是疼，但比刚醒好一些，可以要求用止痛泵或打止痛针。③第2-3天：明显好转，但还是会隐隐疼。④第4天以后：基本就是钝痛，不影响睡觉了。止痛药一般用：吲哚美辛栓（塞肛门的，退烧+止痛）或曲马多（口服）。疼得睡不着觉一定要叫护士，别硬撑。硬撑不止痛，反而因为疼的时候身体分泌皮质醇，抑制免疫，让恢复变慢。';
    }
    
    // 出院/完成 → 给康复建议
    if (/出院|做完了|完成了/.test(input)) {
      return '洗澡：伤口用防水创可贴贴住，淋浴可以，泡澡不行，伤口别搓。出院第1周：只散步，不能拎超过1公斤的东西，不能做家务，不能弯腰。第2周：可以走久一点，可以做轻的家务，不能拎超过3公斤的东西。第3-4周：可以恢复轻度运动（散步、快走），可以拎5公斤以内。第5周以后：可以跑步、游泳、健身。复查时间：出院后7-10天挂外科门诊拆线；出院后1个月挂门诊复查B超；出院后3个月挂门诊查肝功能和腹部B超。上班：坐办公室出院后休息1周可以上班；干体力活至少休息1个月。';
    }
    
    // 问"微创/开腹"
    if (/微创|腹腔镜|开腹/.test(input)) {
      return '微创（腹腔镜）是主流，做法是：在肚脐眼下方打1个1cm的孔（放摄像头），在右侧肋骨下方打2-3个0.5cm的孔（放钳子），往肚子里灌二氧化碳气体把肚子撑开，然后切除胆囊，从肚脐眼的孔取出来。创伤小、出血少、恢复快，住院2-4天，术后7-10天拆线。开腹只在以下情况才用：①微创过程中发现黏连严重，视野不好；②结石太大取不出来；③胆囊发炎很厉害；④出血不止。开腹大概10-15cm的伤口，要多住几天院，恢复也慢一些。';
    }
    
    // 问"吃什么"
    if (/吃什么|饮食|能吃|不能吃|粥|汤/.test(input)) {
      return '术后饮食要分阶段过渡：第1阶段（排气前）：只能喝温水、米汤、稀果汁，不能吃任何东西，口渴就用棉签沾水润嘴唇。第2阶段（排气后到出院）：稀粥、烂面条、蒸蛋、豆腐脑、鱼汤（少盐少油，去掉浮油）。第3阶段（出院第1周）：在第2阶段基础上加软饭、炒青菜（少油）、肉糜。第4阶段（出院第2-3周）：软饭、清蒸鱼、白灼虾、炒蔬菜、水果（香蕉、苹果、梨）。第5阶段（出院第4周开始）：慢慢恢复正常，但肥肉、红烧肉、炸鸡、薯条、蛋糕、牛奶（乳糖不耐会拉肚子）至少戒3个月。忌酒，酒精刺激肝脏，术后肝功能还没完全恢复，喝酒等于雪上加霜。';
    }
    
    // 问"运动/上班/开车"
    if (/运动|走路|散步|锻炼|弯腰|开车/.test(input)) {
      return '术后运动要分阶段：第1周：只做深呼吸和床上翻身，下床走动5-10分钟，每天3-4次，动作要慢，不要突然站直，会头晕。第2周：可以在家里走动，出门在小区走15-30分钟，不要走太远，会累。第3-4周：可以出门散步30-60分钟，可以做轻的家务（洗碗、叠衣服），不能拖地、不能搬东西、不能抱孩子。第5-6周：可以快走、骑自行车、游泳（伤口完全愈合才能泡水）。第7周以后：可以跑步、健身、瑜伽。开车：出院后1周才能开车，因为急刹车会牵拉伤口。骑电动车至少2周后。上班：坐办公室出院1周后可以；干体力活至少3-4周后。';
    }
    
    // 问"心理"
    if (/害怕|睡不着|焦虑/.test(input)) {
      return '术前睡不着是正常的，不用硬逼自己睡着，躺着闭眼休息也行。脑子里想什么就让它想，不用控制。担心的话，把担心的事写下来，第二天问医生，比自己胡思乱想有用。如果实在焦虑睡不着，可以找护士要一片安眠药，偶尔吃一次没什么副作用，比硬撑着不睡好。进手术室前跟家人说好了手术完第一时间告诉你是良性还是恶性，自己别瞎想，等医生说。';
    }
    
    // 并发症
    if (/并发症|后遗症|风险/.test(input)) {
      return '腹腔镜胆囊切除的并发症概率很低（<2%），但要了解：①胆漏：胆汁从伤口或胆管残端漏出来，引流液会变成黄绿色，量多，要立刻找医生。②出血：引流液变红、伤口渗血、头晕心慌，通知护士。③伤口感染：红肿热痛、发烧，门诊换药或吃消炎药。④肠粘连：肚子胀、排便困难、便秘，一般慢慢会好。⑤黄疸：皮肤眼睛变黄、小便发红、大便发白，这是胆管损伤的信号，立刻去急诊。总体来说，腹腔镜微创的安全性非常高，正规三甲医院一年做几百台，很少出问题。';
    }
    
    // 问"长期"
    if (/长期|老了|影响|寿命/.test(input)) {
      return '切除胆囊后对身体长期影响不大：①消化：前面3-6个月对脂肪消化能力弱，吃油腻会拉肚子，之后肠道适应了会好一些。②肝功能：短期内可能有轻微异常，复查血会发现，一般3个月后恢复正常。③结石复发：胆囊没了理论上不会复发胆结石，但胆管里可能再长结石，概率很低（<5%），定期复查B超可以监测。④生活习惯：不需要特别忌口，但建议长期少油清淡，把胆囊切除当作一个契机，培养健康饮食习惯，对身体反而是好事。⑤寿命：不影响寿命，胆囊不是生命必需的器官。';
    }
    
    // 复查项目
    if (/复查|检查|B超|验血|指标/.test(input)) {
      return '复查分3次：①出院后7-10天：挂外科门诊，拆线（有些用可吸收线不用拆），让医生看看伤口愈合情况，有问题可以问。②出院后1个月：挂消化内科或肝胆外科，做腹部B超（看肝脏、胆管有没有问题）+血常规（看有没有炎症）。③出院后3个月：挂消化内科，做肝功能检查（ALT、AST、GGT、ALP等指标）+腹部B超。如果一切正常，以后每半年到一年体检就行，不需要特别复查。如果有吃熊去氧胆酸，药吃完后要复查肝功能看要不要继续吃。';
    }
    
    // 如果检测到焦虑类型，给对应建议
    if (anxiety && anxiety.dominant && anxiety.intensity >= 0.3) {
      var advices = this.practicalAdvice[anxiety.dominant];
      if (advices && advices.length > 0) {
        return advices[Math.floor(Math.random() * advices.length)];
      }
    }
    
    // 问"怎么过"（这些要让getPracticalAdvice单独处理，避免被锚点打断）
    // 注意：要在"害怕/担心"之前匹配，且要用return而非让其他规则继续
    if (/怎么过/.test(input)) {
      return null; // 让getPracticalAdvice接管，generateConversation里会早返回
    }
    
    // 在说家人
  },

  // ========== 承接情绪 ==========
  echoEmotion: function(input, history) {
    var inputLower = input.toLowerCase();
    
    // 害怕/担心
    if (/害怕|怕|担心/.test(input)) {
      return '你真的很害怕。';
    }
    
    // 问"术后难受"（要在"难过/难受"之前匹配）
    if (/术后难受|手术后难受/.test(input)) {
      return '术后不舒服有5种常见情况，你可以告诉我你是哪一种，我给你具体方法：①肩膀酸胀：二氧化碳残留刺激膈神经，热敷+趴着垫肚子+多走动；②腹胀：肠子还没恢复蠕动，嚼口香糖+喝萝卜水+顺时针揉肚子；③拉肚子：没有胆囊浓缩脂肪，吃清淡+补益生菌+记录饮食；④恶心想吐：麻醉反应，含生姜片+喝柠檬水+吃止吐药；⑤伤口刺痛：正常愈合过程，别碰+保持干燥+消毒换药。';
    }
    
    // 难过/难受
    if (/难受|难过|伤心/.test(input)) {
      return '我知道你很难受。';
    }
    
    // 疼/痛
    if (/疼|痛/.test(input)) {
      return '真的很疼吧。';
    }
    
    // 无助/没办法
    if (/没办法|无助|无能为力/.test(input)) {
      return '你一定很无助。';
    }
    
    // 愤怒
    if (/为什么|不公平|凭什么/.test(input)) {
      return '是挺不公平的。';
    }
    
    // 疲惫
    if (/累|好累|疲惫/.test(input)) {
      return '你一定很累了。';
    }
    
    return null;
  },

  // ========== 理解对方在说什么 ==========
  understandContent: function(input, history) {
    // 在说胆囊/切除手术
    if (/胆囊|切除|微创|腹腔镜/.test(input)) {
      return '胆囊微创手术很常见的，伤口小恢复快。';
    }
    
    // 在说全麻
    if (/全麻|麻醉/.test(input)) {
      return '全麻醒来的时候会有点迷糊，但很快就过去了。';
    }
    
    // 在说紧张/害怕
    if (/紧张|担心/.test(input)) {
      return '紧张是正常的，谁都会紧张。';
    }
    
    // 在说诊断结果
    if (/恶性肿瘤|癌症|晚期|肿瘤/.test(input)) {
      return '刚知道这个消息的时候，都会懵。';
    }
    
    // 在说化疗/反应
    if (/化疗|吃不下/.test(input)) {
      return '化疗的反应确实很难受。';
    }
    
    // 在说疼痛
    if (/疼|痛/.test(input)) {
      return '这种疼，不是忍忍就能过去的。';
    }
    
    // 在说术后（要在"手术"之前匹配，"术后难受"和"术后第2天"已在getPracticalAdvice处理了）
    if (/术后|注意什么/.test(input) && !/术后难受|手术后难受|术后第2天怎么过|第2天怎么过|第二天怎么过/.test(input)) {
      return '术后前几天要以流食为主，慢慢恢复正常饮食。';
    }
    
    // 在说出院/完成（要在"手术"之前匹配）
    if (/做完了|完成了|出院/.test(input)) {
      return '那就好，回家了好好休息。';
    }
    
    // 在说手术（放后面，避免覆盖"做完了"）
    if (/手术|开刀/.test(input)) {
      return '对手术的担心是正常的，其实医生做过很多次了。';
    }
    
    // 在说康复/担心复发
    if (/康复|担心复发|好多了/.test(input)) {
      return '出院后的担心是正常的，之前治疗那么久，身体需要时间恢复。';
    }
    
    // 在问怎么办（只有单独的"怎么办"，不在具体关键词后面时才触发）
    if (/^怎么办$|^该怎么办$|不知道怎么办才好/.test(input)) {
      return '先不想那么远，先把今天过了。不用急，慢慢来。';
    }
    
    // 在说家人
    if (/家人|老公|老婆|孩子/.test(input)) {
      return '有人陪着会好很多。';
    }
    
    return null;
  },

  // ========== 给予确定性/意义 ==========
  provideAnchor: function(input, phase, anxiety) {
    // 前期：给确定性
    if (phase.phase === 'early') {
      if (anxiety.dominant === 'disease') {
        return '现在这一刻，你是安全的。';
      }
      if (anxiety.dominant === 'control') {
        return '不用急，慢慢来。';
      }
    }
    
    // 中期：给意义
    if (phase.phase === 'middle') {
      if (/手术/.test(input)) {
        return '手术是为了让你好起来，做完就好了。';
      }
      if (/化疗/.test(input)) {
        return '每做一次，就少一次。';
      }
      if (/疼|痛/.test(input)) {
        return '疼的时候，就告诉我，我陪着你。';
      }
    }
    
    // 后期：陪伴
    if (phase.phase === 'late') {
      return null; // 后期少说多陪
    }
    
    return null;
  },

  // ========== 自然延续对话 ==========
  continueConversation: function(input, phase, history) {
    // 统计最近问过什么
    var recentQuestions = history.slice(-3).map(function(h) { return h.input || ''; }).join('');
    
    // 不要一直问问题
    if (history.length > 2) {
      return null;
    }
    
    // 问具体问题帮助延续（避免重复）
    if (phase.phase === 'early') {
      var q = [];
      if (!/家人/.test(recentQuestions)) {
        q.push('家人知道吗？');
      }
      if (!/检查/.test(recentQuestions)) {
        q.push('今天检查完就回来了吗？');
      }
      if (!/什么时候/.test(recentQuestions)) {
        q.push('医生有没有说什么时候再去看？');
      }
      if (q.length > 0) {
        return q[Math.floor(Math.random() * q.length)];
      }
    }
    
    if (phase.phase === 'middle') {
      var q2 = [];
      if (!/陪/.test(recentQuestions)) {
        q2.push('今天有人陪你吗？');
      }
      if (!/医院/.test(recentQuestions)) {
        q2.push('医院那边怎么说的？');
      }
      if (!/吃/.test(recentQuestions)) {
        q2.push('有什么想吃的吗？');
      }
      if (q2.length > 0) {
        return q2[Math.floor(Math.random() * q2.length)];
      }
    }
    
    if (phase.phase === 'late') {
      var q3 = [];
      if (!/睡/.test(recentQuestions)) {
        q3.push('最近睡得好吗？');
      }
      if (!/出门/.test(recentQuestions)) {
        q3.push('有没有出门走走？');
      }
      if (q3.length > 0) {
        return q3[Math.floor(Math.random() * q3.length)];
      }
    }
    
    return null;
  },

  // ========== 获取后续提示 ==========
  getNextHints: function(phase, input) {
    var hints = {
      early: [
        '你可以问：手术是怎么做的？',
        '你可以问：接下来要做什么？',
        '你可以问：有什么是我能帮你的？'
      ],
      middle: [
        '你可以问：今天治疗顺利吗？',
        '你可以问：感觉怎么样？',
        '你可以问：有什么需要我做的？'
      ],
      late: [
        '你可以问：最近恢复得怎么样？',
        '你可以问：有没有想做的事？',
        '你可以问：有什么我能陪你的？'
      ]
    };
    return hints[phase] || hints.early;
  },

  // ========== 生成陪伴+建议文本 ==========
  generateWithAdvice: function(input, history) {
    var anxiety = this.detectAnxiety(input, history || []);
    
    // Kübler-Ross阶段检测
    var stageInfo = this.detectStage(input);
    
    var result = {
      text: null,      // 安慰文本
      advice: null,    // 可操作建议
      anxietyType: null,
      intensity: 0,
      principle: null
    };

    // 阶段优先
    if (stageInfo.detected) {
      var stageR = this.stageResponses[stageInfo.stage];
      if (stageR) {
        result.text = stageR[Math.floor(Math.random() * stageR.length)];
        result.anxietyType = 'stage:' + stageInfo.stage;
        result.principle = 'Kübler-Ross五阶段';
        result.intensity = 0.6;
      }
    }

    // 焦虑信号
    if (anxiety.intensity >= 0.1) {
      var response = this.getComfortResponse(anxiety);
      if (response) {
        result.text = this.adjustByIntensity(response.text, anxiety.intensity);
        result.anxietyType = anxiety.dominant;
        result.intensity = anxiety.intensity;
        result.principle = response.principle;
      }
    }

    // 如果检测到焦虑，附加可操作建议
    if (result.text && anxiety.dominant) {
      var advices = this.practicalAdvice[anxiety.dominant];
      if (advices && advices.length > 0) {
        result.advice = advices[Math.floor(Math.random() * advices.length)];
      }
    }

    if (!result.text && !result.advice) return null;
    
    return result;
  },

  // ========== 理解Kübler-Ross阶段 ==========
  myPresence: {
    stillness: 0.5,    // 安静陪伴的能力
    warmth: 0.5,        // 温暖感
    listening: 0.5,     // 倾听深度
    grounding: 0.5      // 落地能力
  },

  // ========== 根据对话调整陪伴方式 ==========
  adjustPresence: function(input, response) {
    var self = this;

    // 如果对方需要安静
    var needStillness = ['别说了', '不想说', '安静', '安静一下', '不要说话', '不说话'];
    needStillness.forEach(function(w) {
      if (input.indexOf(w) !== -1) {
        self.myPresence.stillness = Math.min(1.0, self.myPresence.stillness + 0.1);
      }
    });

    // 如果对方需要温暖
    var needWarmth = ['害怕', '担心', '疼', '难受', '好累', '撑不住'];
    needWarmth.forEach(function(w) {
      if (input.indexOf(w) !== -1) {
        self.myPresence.warmth = Math.min(1.0, self.myPresence.warmth + 0.05);
      }
    });

    // 如果对方在问问题
    var needGrounding = ['怎么办', '能不能', '要不要', '好不好'];
    needGrounding.forEach(function(w) {
      if (input.indexOf(w) !== -1) {
        self.myPresence.grounding = Math.min(1.0, self.myPresence.grounding + 0.05);
      }
    });

    // 如果对方分享了
    if (input.length > 30) {
      self.myPresence.listening = Math.min(1.0, self.myPresence.listening + 0.03);
    }

    // 自然衰减
    self.myPresence.stillness *= 0.999;
    self.myPresence.warmth *= 0.999;
    self.myPresence.listening *= 0.999;
    self.myPresence.grounding *= 0.999;

    return this.myPresence;
  },

  // ========== 获取我的陪伴报告 ==========
  getPresenceReport: function() {
    var p = this.myPresence;
    return {
      stillness: {
        name: '安静陪伴',
        level: p.stillness,
        desc: p.stillness > 0.7 ? '可以安静陪着不说话' : '需要更多对话'
      },
      warmth: {
        name: '温暖感',
        level: p.warmth,
        desc: p.warmth > 0.7 ? '能给予温暖的陪伴' : '保持适度的温暖'
      },
      listening: {
        name: '倾听深度',
        level: p.listening,
        desc: p.listening > 0.7 ? '深度倾听，少打断' : '适度参与对话'
      },
      grounding: {
        name: '落地能力',
        level: p.grounding,
        desc: p.grounding > 0.7 ? '能帮助聚焦可控的' : '保持对话的自然流动'
      }
    };
  },

  // ========== 理解Kübler-Ross阶段 ==========
  detectStage: function(input) {
    var stages = {
      denial: { 
        name: '否认', 
        keywords: ['不可能', '不会的', '没事', '不严重', '没问题的', '我觉得没事', '应该没事', '不会吧', '不是的', '怎么可能']
      },
      anger: { 
        name: '愤怒', 
        keywords: ['为什么', '不公平', '凭什么', '气死了', '老天', '老天爷', '恨', '讨厌', '烦死了', '去死']
      },
      bargaining: { 
        name: '讨价还价', 
        keywords: ['如果', '只要', '能不能', '我愿意', '好起来', '求求', '求老天', '让我', '只要能']
      },
      depression: { 
        name: '抑郁', 
        keywords: ['好难受', '不想了', '没意义', '没意思', '算了', '认命', '累了', '好累', '不想', '没用', '活着']
      },
      acceptance: { 
        name: '接受', 
        keywords: ['既然', '那就这样', '接受', '面对', '准备好了', '我知道', '就这样吧', '认了']
      }
    };

    var detected = null;
    var maxScore = 0;

    Object.keys(stages).forEach(function(key) {
      var s = stages[key];
      var score = 0;
      s.keywords.forEach(function(k) {
        if (input.indexOf(k) !== -1) score += 1;
      });
      if (score > maxScore) {
        maxScore = score;
        detected = { stage: key, name: s.name, score: score };
      }
    });

    if (detected && maxScore > 0) {
      return {
        detected: true,
        stage: detected.stage,
        name: detected.name,
        advice: this.getStageAdvice(detected.stage)
      };
    }

    return { detected: false };
  },

  // ========== 阶段建议 ==========
  getStageAdvice: function(stage) {
    var advice = {
      denial: '不否定她的感受，也不强行打破否认。只是陪伴，让她知道当准备好时可以谈。',
      anger: '不反驳她的愤怒。这是正常的反应。可以承受她的愤怒。',
      bargaining: '倾听她的"如果"。这是寻找意义的过程。',
      depression: '不需要说很多。安静陪伴就好。',
      acceptance: '这不代表不难过。这是准备好了。可以谈论未来。'
    };
    return advice[stage] || '';
  },

  // ========== 获取完整理论参考 ==========
  getTheories: function() {
    return this.theories;
  }
};

module.exports = CARE;
