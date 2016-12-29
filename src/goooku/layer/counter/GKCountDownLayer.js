/**
 * 使用方法：
 * var countDownLayer = new GK_CountDownLayer();
 * xxx.addChild(countDownLayer, 0, TAG);
 * countDownLayer.startCountDown(function() {
 *   console.log("倒计时结束");
 * });
 */

var GK_CountDownLayer = cc.Layer.extend({
    /**
     * 构造函数
     */
    ctor: function() {
        this._super();
    },

    /**
     * 开始倒计时
     * @param aCallback 回调，标明倒计时结束
     */
    startCountDown: function(aCallback) {
    }
});
