/**
 * 使用例子：
 * var dynamicRankLayer = new GK_DynamicRankLayer();
 * xxx.addChild(dynamicRankLayer, ZORDER, TAG);
 * dynamicRankLayer.setPosition(cc.p(xxx, xxx));
 * var layerParams = {
 *     scale: xxx
 * }
 * var users = xxx;
 * dynamicRankLayer.createRank(layerParams, users);
 * ......
 * users = xxx;
 * dynamicRankLayer.showResult(users);
 * ......
 * dynamicRankLayer.removeRank();
 */
var GK_DynamicRankLayer = cc.Layer.extend({
    /**
     * 构造函数
     */
    ctor: function() {
        this._super();
    },

    /**
     * 创建排行榜
     * @param aLayerParams 显示参数，包含scale, posX, posY
     * @param aUserArr 用户数组，包含nickname和userIcon，已排好序
     */
    createRank: function(aLayerParams, aUserArr) {
    },

    /**
     * 显示排行榜
     * @param aUserArr aUserArr 用户数组，包含nickname和userIcon，已排好序
     */
    showResult: function(aUserArr) {
    },

    /**
     * 删除榜单
     */
    removeRank: function() {
    }
});