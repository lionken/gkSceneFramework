/**
 * 使用方法：
 * var progressLayer = new GK_ProgressLayer();
 * xxx.addChild(progressLayer, 0, TAG);
 * progressLayer = this.mainNode.getChildByTag(TAG);
 * progressLayer.setPosition(cc.p(X,Y)); //设置进度条在场景中的位置
 * progressLayer.runAction(cc.sequence(cc.moveTo(1,cc.p(x,y)))); //设置进度条进入场景的动画
 * var layerParams = {
 *   scale: 1,
 *   time:5
 * };
 * progressLayer.startProgress(layerParams, tickFunction, completeFunction); //设置回调函数
 */
var GK_ProgressLayer = cc.Layer.extend({
    /**
     * 构造函数
     */
    ctor: function() {
        this._super();
    },

    /**
     * 开始进度条
     * @param aLayerParams 参数，包括进度条时间(time)和进度条scale
     * @param aTickCbFn 每秒回调函数
     * @param aCompleteCbFn 全部结束回调函数
     * @param aCompleteKeep 是否在结束时消失
     */
    startProgress: function(aLayerParams, aTickCbFn, aCompleteCbFn, aCompleteKeep) {
    }
});
