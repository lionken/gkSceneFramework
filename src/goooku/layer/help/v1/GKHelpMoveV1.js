var GK_HelpMoveLayerV1 = GK_HelpLayerV1.extend({
    //**************公有函数***********
    /**
     * 设置操作说明层初始化
     */
    createLayer: function() {
        var bg = this.addSprite("fw_help_v1_frame", 1, 1, GK.screen_width / 2, GK.screen_height / 2, 0, 0, this.mainNode);
        //文字图片
        this.addSprite("fw_help_v1_move_txt", 1, 1, bg.getContentSize().width * 0.4, bg.getContentSize().height * 0.35, 0, 1, bg);
        //手机图片
        var phone = this.addSprite("fw_help_v1_move_pic", 1, 1, bg.getContentSize().width * 0.75, bg.getContentSize().height * 0.35, 1, 2, bg);
        //手势图片
        var hand = this.addSprite("fw_help_v1_finger", 1, 1, bg.getContentSize().width * 0.81, bg.getContentSize().height * 0.38, 1, 3, bg);
        hand.runAction(cc.sequence(cc.moveBy(0.5, cc.p(0, phone.getContentSize().height * -0.6)),
            cc.moveBy(0, cc.p(0, phone.getContentSize().height * 0.6))).repeatForever());
    }
});
