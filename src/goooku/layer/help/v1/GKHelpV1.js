var GK_HelpLayerV1 = GK_HelpLayer.extend({
    //**************公有函数***********
    /**
     * 构造函数
     * @returns {Boolean}
     */
    ctor: function() {
        this._super();
        //加载图片资源
        cc.spriteFrameCache.addSpriteFrames("res/help_V1.plist");
        //基层
        this.mainNode = new cc.LayerColor(cc.color(255, 255, 255, 0), GK.screen_width, GK.screen_height);
        this.mainNode.setPosition(cc.p(0, 0));
        this.addChild(this.mainNode, 0, 1);
        this.mainNode.setAnchorPoint(cc.p(0, 0));
        this.mainNode.setScale(GK.screen_width / 1280);
        this.mainNode.setAnchorPoint(cc.p(0.5, 0.5));
        this.mainNode.setScale(0);
        this.createLayer();
        return true;
    },

    /**
     * 设置操作说明层初始化
     */
    createLayer: function() {
        this.addSprite("page", 1, 1, GK.screen_width / 2, GK.screen_height / 2, 0, 0, this.mainNode);
    },

    /**
     * 显示操作说明层
     */
    showLayer: function() {
        this.mainNode.runAction(cc.scaleTo(0.5, 0.7 * GK.screen_width / 1280));
    },

    /**
     * 移除操作说明层
     * @params aCallback 提示层结束回调
     */
    removeLayer: function(aCallback) {
        var callFunc = cc.callFunc(this.deleteLayer, this, aCallback);
        this.mainNode.runAction(cc.sequence(cc.scaleTo(0.5, 0), callFunc));
    },

    /**
     * 删除操作说明层
     * @params aLayer layer占位
     * @params aCallback 删除层后回调
     */
    deleteLayer: function(aLayer, aCallback) {
        this.mainNode.removeFromParent(true);
        aCallback();
    },

    /**
     * 场景中添加精灵方法
     * @param aResName 图片在res中的位置
     * @param aScaleX 缩放的X轴大小
     * @param aScaleY 缩放的Y轴大小
     * @param aPosX 起始X
     * @param aPosY 起始Y
     * @param aZorder Z大小
     * @param aTag 标签
     * @param aParent 父层
     * @returns {Sprite}
     */
    addSprite: function(aResName, aScaleX, aScaleY, aPosX, aPosY, aZorder, aTag, aParent) {
        var sprite = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame(aResName + ".png"));
        sprite.setScale(aScaleX, aScaleY);
        sprite.setPosition(cc.p(aPosX, aPosY));
        aParent.addChild(sprite, aZorder, aTag);
        return sprite;
    }
});
