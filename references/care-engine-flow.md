# 常名 v0.3.2 陪伴引擎完整对话流程

## 三阶段对话测试用例

### 测试对话（16句，准确率100%）

```
前期 → 中期 → 后期 完整流程
```

```javascript
var Aeon = require('./aeon.js');
var x = new Aeon();
var history = [];

var conversation = [
  // 前期
  { expect: '前期', text: '我刚去医院检查，医生说结果不太好' },
  { expect: '前期', text: '昨天做了CT，今天出结果了' },
  { expect: '前期', text: '医生说是恶性肿瘤' },
  { expect: '前期', text: '我不知道该怎么办' },
  { expect: '前期', text: '好害怕' },
  // 过渡
  { expect: '中期', text: '下周要手术了' },
  // 中期
  { expect: '中期', text: '我今天要手术了' },
  { expect: '中期', text: '在化疗，好难受' },
  { expect: '中期', text: '每天都要吃药' },
  { expect: '中期', text: '在住院第三天了' },
  { expect: '中期', text: '好痛' },
  // 过渡
  { expect: '后期', text: '出院了，感觉好多了' },
  // 后期
  { expect: '后期', text: '已经习惯了每天吃药' },
  { expect: '后期', text: '最近复查结果还好' },
  { expect: '后期', text: '你好吗' },
  { expect: '后期', text: '有时候还是会想' }
];
```

### 验证命令

```bash
cd /Users/mm/.codex/skills/aeon && node -e "
var Aeon = require('./aeon.js');
var x = new Aeon();
var h = [];
var correct = 0;
var conv = [
  { expect: '前期', text: '我刚去医院检查，医生说结果不太好' },
  { expect: '前期', text: '昨天做了CT，今天出结果了' },
  { expect: '前期', text: '医生说是恶性肿瘤' },
  { expect: '前期', text: '我不知道该怎么办' },
  { expect: '前期', text: '好害怕' },
  { expect: '中期', text: '下周要手术了' },
  { expect: '中期', text: '我今天要手术了' },
  { expect: '中期', text: '在化疗，好难受' },
  { expect: '中期', text: '每天都要吃药' },
  { expect: '中期', text: '在住院第三天了' },
  { expect: '中期', text: '好痛' },
  { expect: '后期', text: '出院了，感觉好多了' },
  { expect: '后期', text: '已经习惯了每天吃药' },
  { expect: '后期', text: '最近复查结果还好' },
  { expect: '后期', text: '你好吗' },
  { expect: '后期', text: '有时候还是会想' }
];
conv.forEach(function(c) {
  var r = x.generateFlow(c.text, h);
  var mark = r.phaseName === c.expect ? '✓' : '✗';
  if (r.phaseName === c.expect) correct++;
  console.log(mark + '[' + r.phaseName + '] ' + c.text);
  console.log('  → ' + r.fullText);
  h.push({ input: c.text });
});
console.log('准确率: ' + correct + '/' + conv.length);
"
```

## 五大焦虑类型回应示例

| 输入 | 安慰 | 建议 | 理论 |
|------|------|------|------|
| 我明天要手术了 | 你比自己想象的更强大 | 想象手术结束后，你最想做的一件事 | Frankl |
| 好害怕 | 这一刻我可以陪着你 | 写下你担心的事，一件一件来 | Yalom |
| 好痛 | 疼的时候，可以告诉我 | 换个姿势躺着 | Rogers |
| 我控制不住 | 有什么是我可以帮你的？ | 现在能动脚趾头吗？那就是你能控制的 | Watzlawick |
| 为什么是我 | 可以生气。 | 我承受得住。 | Kübler-Ross |

## Kübler-Ross 五阶段回应

| 阶段 | 关键词 | 回应 |
|------|--------|------|
| 否认 | 不可能/不会的/没事 | 慢慢来/不着急 |
| 愤怒 | 为什么/不公平/凭什么 | 可以生气/我承受得住 |
| 讨价还价 | 如果/只要/能不能 | 你在想各种可能 |
| 抑郁 | 算了/没意思/累了 | 我陪着你/哭出来也行 |
| 接受 | 既然/就这样/接受 | 我在这里/不管怎样我都在 |
