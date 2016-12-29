/**
 * 使用例子：
 * var mvpLayer = new GK_MvpLayer();
 * xxx.addChild(mvpLayer, 0);
 * mvpLayer.showMVP(......);
 */
var GK_MvpLayer = cc.Layer.extend({
    /**
     * 构造函数
     */
    ctor: function() {
        this._super();
    },

    /**
     * 显示MVP界面
     * @param aMVPs MVP用户信息数组，MVP用户信息为userIcon(头像), sex(性别), nickname(昵称)
     * @param aLogoUrl 商家logo
     * @param aPostUrls 商家海报URL数组
     */
    showMVP: function(aMVPs, aLogoUrl, aPostUrls) {
    }
});
