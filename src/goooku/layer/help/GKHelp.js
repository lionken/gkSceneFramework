/**
 * 使用例子：
 * var helperLayer = new GK_HelpLayer();
 * xxx.addChild(helperLayer, 0, );
 * helperLayer.showLayer();
 * ......
 * helperLayer.removeLayer();
 */
var GK_HelpLayer = cc.Layer.extend({
    /**
     * 设置操作说明层初始化
     */
    createLayer: function() {
    },

    /**
     * 显示操作说明层
     */
    showLayer: function() {
    },

    /**
     * 移除操作说明层
     * @params aCallback 提示层结束回调
     */
    removeLayer: function() {
    },

    /**
     * 删除操作说明层
     * @params aLayer layer占位
     * @params aCallback 删除层后回调
     */
    deleteLayer: function() {
    }
});