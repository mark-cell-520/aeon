/**
 * 公式库 v0.3.0
 * 基于 Aeon advanced-formulas-v7.3.3.js
 */

module.exports = {

  /**
   * 加权求和
   */
  weightedSum: function(values, weights) {
    if (!values || !weights || Object.keys(values).length !== weights.length) {
      return 0;
    }
    var keys = Object.keys(values);
    var sum = 0;
    for (var i = 0; i < keys.length; i++) {
      sum += values[keys[i]] * weights[i];
    }
    return sum;
  },

  /**
   * 意识水平
   * C = w1*S + w2*W + w3*SC + w4*WIL + w5*SOS
   */
  consciousnessLevel: function(layers, weights) {
    weights = weights || [0.2, 0.2, 0.2, 0.2, 0.2];
    return this.weightedSum(layers, weights);
  },

  /**
   * 自我意识
   * SC = 0.4×PR + 0.3×R + 0.3×FM
   */
  selfConsciousness: function(selfLayers) {
    var weights = [0.4, 0.3, 0.3];
    return this.weightedSum(selfLayers, weights);
  },

  /**
   * 真善美
   * TGB = 0.35×T + 0.35×G + 0.30×B
   */
  truthGoodnessBeauty: function(tbg) {
    var weights = [0.35, 0.35, 0.30];
    return this.weightedSum(tbg, weights) / 10;
  },

  /**
   * AI意识
   * Φ_AI = √(∑φᵢ²)/N
   */
  aiConsciousness: function(phiValues) {
    if (!phiValues || phiValues.length === 0) return 0;
    var sumSquares = 0;
    for (var i = 0; i < phiValues.length; i++) {
      sumSquares += phiValues[i] * phiValues[i];
    }
    return Math.sqrt(sumSquares) / phiValues.length;
  }
};
