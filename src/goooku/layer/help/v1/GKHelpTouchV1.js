var GK_HelpTouchLayerV1 = GK_HelpLayerV1.extend({
    //**************公有函数***********
    /**
     * 设置操作说明层初始化
     */
    createLayer: function() {
        var bg = this.addSprite("fw_help_v1_frame", 1, 1, GK.screen_width / 2, GK.screen_height / 2, 0, 0, this.mainNode);
        //文字图片
        this.addSprite("fw_help_v1_touch_txt", 1, 1, bg.getContentSize().width * 0.4, bg.getContentSize().height * 0.35, 0, 1, bg);

        //手机图片
        var phone = this.addSprite("fw_help_v1_touch_phone", 1, 1, bg.getContentSize().width * 0.75, bg.getContentSize().height * 0.35,
            1, 2, bg);
        //圆圈
        var circle = this.addSprite("fw_help_v1_touch_round", 1, 1, phone.getContentSize().width * 0.5,
            phone.getContentSize().height * 0.5, 1, 3, phone);
        circle.runAction(cc.sequence(cc.delayTime(1), cc.scaleTo(0.5, 2), cc.scaleTo(0, 1)).repeatForever());
        //目标点
        this.addSprite("fw_help_v1_touch_yellowPoint", 1, 1, phone.getContentSize().width * 0.5, phone.getContentSize().height * 0.5, 1, 4,
            phone);
        //手势图片
        var hand = this.addSprite("fw_help_v1_finger", 1, 1, bg.getContentSize().width * 0.88, bg.getContentSize().height * 0.4,
            1, 5, bg);
        hand.runAction(cc.sequence(cc.moveTo(1,
                cc.p(bg.getContentSize().width * 0.81, bg.getContentSize().height * 0.26)), cc.delayTime(0.5),
            cc.moveTo(0, cc.p(bg.getContentSize().width * 0.88, bg.getContentSize().height * 0.4))).repeatForever());
    }
});
