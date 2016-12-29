var GK_ProgressLayerV1 = GK_ProgressLayer.extend({
    mTickCbFn: null,
    mCompleteCbFn: null,
    mTime: null,
    mProgressScale: null,
    mCompleteKeep: false,

    /**
     * 构造函数
     * @returns {Boolean}
     */
    ctor: function() {
        this._super();
        cc.spriteFrameCache.addSpriteFrames("res/progress_V1.plist");

        this.mainNode = new cc.LayerColor(cc.color(0, 0, 0, 0), GK.screen_width, GK.screen_height);
        this.mainNode.setPosition(cc.p(0, 0));
        this.mainNode.setAnchorPoint(cc.p(0, 0));
        this.mainNode.setScale(GK.screen_width / 1280);
        this.addChild(this.mainNode, 0, 0);

        return true;
    },

    /**
     * 开始进度条
     * @param aLayerParams 参数，包括进度条时间和进度条scale
     * @param aTickCbFn 每秒回调函数
     * @param aCompleteCbFn 全部结束回调函数
     * @param aCompleteKeep 是否在结束时消失
     */
    startProgress: function(aLayerParams, aTickCbFn, aCompleteCbFn, aCompleteKeep) {
        if(!aLayerParams || !aLayerParams.time || !aLayerParams.scale) {
            throw "层参数不正确";
        }


        this.mTime = aLayerParams.time;
        this.mProgressScale = aLayerParams.scale;
        this.mTickCbFn = aTickCbFn;
        this.mCompleteCbFn = aCompleteCbFn;
        this.mCompleteKeep = aCompleteKeep;



        var sprite1 = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame("fw_progress_v1_bar.png"));
        sprite1.setScale(this.mProgressScale, this.mProgressScale);
        this.mainNode.addChild(sprite1, 2, 2);

        var progressBg = this.mainNode.getChildByTag(2);

        var sprite = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame("fw_progress_v1_mask.png"));
        sprite.setScale(0, 1);
        progressBg.addChild(sprite, 3, 1);

        var sprite2 = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame("fw_progress_v1_round.png"));
        sprite2.setScale(1, 1);
        progressBg.addChild(sprite2,  4, 3);
        sprite2.setPosition( -(aLayerParams.scale * 100) * 0.55, progressBg.getContentSize().height / 2)

        this.mainNode.setPosition(cc.p((sprite1.getContentSize().width*this.mProgressScale)*0.66,sprite1.getContentSize().height*this.mProgressScale))
        this.startTime();
    },

    startTime: function() {
        this.time = this.mTime;
        this.step = this.mTime * 10;
        this.schedule(this.tick, 0.1);

        var CountDownCircle = this.mainNode.getChildByTag(2).getChildByTag(3);
        this.addLabel(this.step / 10, 'Microsoft YaHei', 50, cc.color(0, 0, 0), 1.5, 1.5,
            CountDownCircle.getContentSize().width / 2, CountDownCircle.getContentSize().height / 2, 3, 4,
            CountDownCircle);

        var progressMain = this.mainNode.getChildByTag(2);

        var progress = this.mainNode.getChildByTag(2).getChildByTag(1);
         progress.setAnchorPoint(cc.p(1, -0.63));
        progress.setPositionX(progressMain.getContentSize().width*0.965);
    },

    tick: function() {
        this.time -= 0.1;
        this.step--;
        if(this.step % 10 == 0) {
            this.mainNode.getChildByTag(2).getChildByTag(3).getChildByTag(4).setString(this.step / 10);

            if(this.mTickCbFn) {
                this.mTickCbFn();
            }
        }
        if(this.time < 0) {
            this.unschedule(this.tick);

            if(!this.mCompleteKeep) {
                this.removeAllChildren(true);
                this.removeFromParent(true);
            }

            if(this.mCompleteCbFn) {
                this.mCompleteCbFn();
            }
        } else {
            //倒计时进度条变化
            var progress = this.mainNode.getChildByTag(2).getChildByTag(1);
            progress.setScaleX((this.mTime - this.time)/this.mTime );
        }
    },

    addLabel: function(aText, aFont, aSize, aColor, aScaleX, aScaleY, aPosX, aPosY, aZorder, aTag, aParent) {
        var label = cc.LabelTTF.create(aText, aFont, aSize);
        label.setColor(aColor);
        label.setScale(aScaleX, aScaleY);
        label.setPosition(cc.p(aPosX, aPosY));
        aParent.addChild(label, aZorder, aTag);
        return label;
    }
});
