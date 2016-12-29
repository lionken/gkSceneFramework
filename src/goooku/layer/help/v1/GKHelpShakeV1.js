var GK_HelpShakeLayerV1 = GK_HelpLayerV1.extend({
    //**************公有函数***********
    /**
     * 设置操作说明层初始化
     */
    createLayer: function() {
        var bg = this.addSprite("fw_help_v1_frame", 1, 1, GK.screen_width / 2, GK.screen_height / 2, 0, 0, this.mainNode);
        //文字图片
        this.addSprite("fw_help_v1_shake_txt", 1, 1, bg.getContentSize().width * 0.4, bg.getContentSize().height * 0.35, 0, 1, bg);
        //手势图片
        var hand = this.addSprite("fw_help_v1_shake_pic", 1, 1, bg.getContentSize().width * 0.8, bg.getContentSize().height * 0.25, 1, 2, bg);

        hand.setAnchorPoint(cc.p(1, 0));
        hand.runAction(cc.sequence(cc.rotateBy(0.1, -20), cc.rotateBy(0.2, 40), cc.rotateBy(0.1, -20)).repeatForever());
    }
});
