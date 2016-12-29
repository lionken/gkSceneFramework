var GK_CountDownLayerV1 = GK_CountDownLayer.extend({
    //***********变量*************
    countScale: null,
    mCountPointX: null,
    mCountPointY: null,
    mCallBackFn: null,

    //**************公有函数***********
    ctor: function() {
        this._super();
        cc.spriteFrameCache.addSpriteFrames("res/countDown_V1.plist");
        this.prepareIndex = 0;
        this.w = 1280;
        this.h = 720
        this.mainNode = new cc.LayerColor(cc.color(0, 0, 0, 0), 1280, 720);
        this.mainNode.setPosition(cc.p(0, 0));
        this.mainNode.setScale(GK.screen_width / 1280);
        this.addChild(this.mainNode, 0, 0);
        return true;
    },

    startCountDown: function(aCallback) {
        this.mCountScale = 1;
        this.mCountPointX = this.w / 2;
        this.mCountPointY = this.h / 2;
        this.mCallBackFn = aCallback;

        this.prepareStart();
    },

    prepareStart: function() {
        if(this.prepareIndex < 4) {
            var labelArray = ["fw_countDown_v1_No3", "fw_countDown_v1_No2", "fw_countDown_v1_No1",
                "fw_countDown_v1_start"];
            var label = this.mainNode.getChildByTag(1);
            var callFunc = cc.callFunc(this.prepareStart, this);
            if(label) {
                label.setOpacity(0);
                label.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame(labelArray[this.prepareIndex] + ".png"));
                label.runAction(cc.sequence(cc.scaleTo(0, 8),
                    cc.spawn(cc.fadeIn(0.7), cc.scaleTo(0.7, this.mCountScale)), cc.delayTime(0.3), cc.fadeOut(0),
                    callFunc));
            } else {
                this.addSprite(labelArray[this.prepareIndex], 0, 0, this.mCountPointX, this.mCountPointY, 2, 1,
                    this.mainNode);
                label = this.mainNode.getChildByTag(1);

                label.runAction(cc.sequence(cc.fadeOut(0), cc.scaleTo(0, 8),
                    cc.spawn(cc.fadeIn(0.7), cc.scaleTo(0.7, this.mCountScale)), cc.delayTime(0.3), cc.fadeOut(0),
                    callFunc));
            }
            this.prepareIndex++;
        } else {
            this.mainNode.removeAllChildren(true);
            this.mainNode.removeFromParent(true);
            if(this.mCallBackFn) {
                this.mCallBackFn();
            }
        }
    },

    addSprite: function(aName, aScaleX, aScaleY, aPosX, aPosY, aZorder, aTag, aParent) {
        var sprite = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame(aName + ".png"));
        sprite.setScale(aScaleX, aScaleY);
        sprite.setPosition(cc.p(aPosX, aPosY));
        aParent.addChild(sprite, aZorder, aTag);
        return sprite
    }
});
