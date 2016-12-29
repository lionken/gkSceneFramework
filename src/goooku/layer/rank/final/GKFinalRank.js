/**
 * 使用例子：
 * var finalRankLayer = new GK_FinalRankLayer();
 * xxx.addChild(finalRankLayer, 0);
 * finalRankLayer.showResult(......);
 * ......
 * finalRankLayer.removeResult();
 */
var GK_FinalRankLayer = cc.Layer.extend({
    /**
     * 构造函数
     */
    ctor: function() {
        this._super();
    },

    /**
     * 显示榜单
     * @param aUserInfoArr 入榜的玩家信息数组，必须排好序，包括用户头像(userIcon)和用户昵称(nickname)
     * @param aCellSum 要显示的榜单条目数量
     */
    showResult: function(aUserInfoArr, aCellSum) {
    },

    /**
     * 删除榜单
     */
    removeResult: function() {
    }
});