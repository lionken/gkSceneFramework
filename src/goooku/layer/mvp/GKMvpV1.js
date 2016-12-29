var GK_MvpLayerV1 = GK_MvpLayer.extend({
    //***********变量*************
    mImgIndex: 0,//当前播放的商家海报图片索引
    mUserInfo: null,
    mLogoUrl: null,
    mPostUrls: null,
    mOssImgUtil: null,

    //**************公有函数***********
    /**
     * 构造函数
     * @returns {Boolean}
     */
    ctor: function() {
        this._super();
        cc.spriteFrameCache.addSpriteFrames("res/mvp_V1.plist");
        //基层
        this.mainNode = new cc.LayerColor(cc.color(255, 255, 255, 0), 1920, 1080);
        this.mainNode.setPosition(cc.p(0, 0));
        this.addChild(this.mainNode, 0, 1);
        this.mainNode.runAction(cc.sequence(cc.delayTime(0.5), cc.fadeTo(0.5, 80)));
        this.mainNode.setAnchorPoint(cc.p(0, 0));
        this.mainNode.setScale(GK.screen_width / 1920);

        this.mOssImgUtil = new GK_OSSImageUtil();

        return true;
    },

    /**
     * 显示MVP界面
     * @param aMVPs MVP用户信息数组，MVP用户信息为userIcon, sex, nickname
     * @param aLogoUrl 商家logo
     * @param aPostUrls 商家海报URL数组
     */
    showMVP: function(aMVPs, aLogoUrl, aPostUrls) {
        this.mUserInfo = {};

        if(aMVPs && aMVPs.length > 0 && aMVPs[0] && aMVPs[0].userIcon && aMVPs[0].sex && aMVPs[0].nickname) {
            this.mUserInfo.userIcon = aMVPs[0].userIcon;
            this.mUserInfo.sex = aMVPs[0].sex;
            this.mUserInfo.nickname = aMVPs[0].nickname;
        } else {
            this.mUserInfo.sex = 2; //默认女性
            this.mUserInfo.nickname = "感快互动";
        }

        if(aLogoUrl) {
            this.mLogoUrl = this.mOssImgUtil.resize(aLogoUrl, 145, 193);
        }

        if(aPostUrls && aPostUrls.length > 0) {
            for(var i = 0; i < aPostUrls.length; i++) {
                aPostUrls[i] = this.mOssImgUtil.resize(aPostUrls[i], 460, 280);
            }
        }

        this.mPostUrls = aPostUrls;

        this.setLayer();
    },

    //设置场景初始化
    setLayer: function() {
        //感快之星
        var mvp = this.addSprite("fw_mvp_v1_mvpBg", 1.4, 1.4, 1920 * -0.5, 1080 / 2, 1, 2,
            this.mainNode);

        //头像
        if(this.mUserInfo.userIcon) {
            var url = this.mUserInfo.userIcon;
            var clipp = new cc.ClippingNode();
            var stencil = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame("fw_mvp_v1_headMask.png"));
            var content = new cc.Sprite(url);
            content.setScale(5);
            clipp.setStencil(stencil);
            clipp.setInverted(false);
            clipp.setAlphaThreshold(0);
            clipp.addChild(content);
            mvp.addChild(clipp, 1);
            clipp.setPosition(cc.p(mvp.getContentSize().width * 0.46, mvp.getContentSize().height * 0.38));
        }

        //性别
        var sex = ["fw_mvp_v1_man", "fw_mvp_v1_wom"];
        if(this.mUserInfo.sex) {
            this.addSprite(sex[this.mUserInfo.sex - 1], 1, 1, mvp.getContentSize().width * 0.25,
                mvp.getContentSize().height * 0.07, 0, 3, mvp);
        }

        //昵称
        if(this.mUserInfo.nickname) {
            var nickName = this.mUserInfo.nickname;
            if(this.getStringLength(nickName) > 10) {
                nickName =
                    nickName.substring(0, this.getStringIndex(nickName)) + "..";
            }
            this.addLabel(nickName, "Arial", 35, cc.color(0, 0, 0), 1, 1, mvp.getContentSize().width * 0.5,
                mvp.getContentSize().height * 0.07, 1, 4, mvp);
        }

        //mvp移动
        mvp.runAction(cc.sequence(cc.delayTime(1), cc.moveTo(0.5, cc.p(1920 * 0.3, 1080 / 2))));

        //商家广告海报
        var post = this.addSprite("fw_mvp_v1_sponsorBg", 1.4, 1.4, 1920 * 1.5, 1080 / 2, 1, 6,
            this.mainNode);

        //上方商家logo
        if(this.mLogoUrl) {
            var logo = this.mLogoUrl;
            var clipp = new cc.ClippingNode();
            var stencil = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame("fw_mvp_v1_sponsorLogo.png"));
            var content = new cc.Sprite(logo);
            content.setScale(1);
            clipp.setStencil(stencil);
            clipp.setInverted(false);
            clipp.setAlphaThreshold(0);
            clipp.addChild(content);
            post.addChild(clipp, 1);
            clipp.setPosition(cc.p(post.getContentSize().width * 0.745, post.getContentSize().height * 0.87));
        }

        //下方商家海报
        if(this.mPostUrls && this.mPostUrls[0]) {
            this.addUrlSprite(this.mPostUrls[0], 1, 1, post.getContentSize().width * 0.5,
                post.getContentSize().height * 0.35, 1, 8, post);
        }

        //海报移动
        post.runAction(cc.sequence(cc.delayTime(1), cc.moveTo(0.5, cc.p(1920 * 0.7, 1080 / 2))));

        //下方商家海报轮播
        if(this.mPostUrls) {
            this.changeImg("", this.mPostUrls);
        }
    },

    //aObject参数为回调中用到的参数，本函数未用到，仅占一个位置
    changeImg: function(aObject, aPostUrls) {
        var post = this.mainNode.getChildByTag(6);
        var img = post.getChildByTag(8);
        if(img) {
            img.removeFromParent(true);
        }
        this.mImgIndex = (this.mImgIndex + 1) % (aPostUrls.length);
        if(aPostUrls[this.mImgIndex]) {
            this.addUrlSprite(aPostUrls[this.mImgIndex], 1, 1, post.getContentSize().width * 0.5,
                post.getContentSize().height * 0.35, 1, 8, post);
            var callFunc = cc.callFunc(this.changeImg, this, aPostUrls);
            this.mainNode.runAction(cc.sequence(cc.delayTime(2), callFunc));
        }
    },

    getStringLength: function(aStr) {
        var len = 0;
        for(var i = 0; i < aStr.length; i++) {
            if(aStr.charCodeAt(i) > 127 || aStr.charCodeAt(i) == 94) {
                len += 2;
            } else {
                len++;
            }
        }
        return len;
    },

    getStringIndex: function(aStr) {
        var len = 0;
        for(var i = 0; i < aStr.length; i++) {
            if(aStr.charCodeAt(i) > 127 || aStr.charCodeAt(i) == 94) {
                len += 2;
            } else {
                len++;
            }
            if(len >= 10)return i;
        }
        return aStr.length;
    },

    //场景中添加文本方法
    addLabel: function(aText, aFont, aSize, aColor, aScaleX, aScaleY, aPosX, aPosY, aZorder, aTag, aParent) {
        var label = cc.LabelTTF.create(aText, aFont, aSize);
        label.setColor(aColor);
        label.setScale(aScaleX, aScaleY);
        label.setPosition(cc.p(aPosX, aPosY));
        aParent.addChild(label, aZorder, aTag);
    },

    //场景中添加精灵方法
    addSprite: function(aName, aScaleX, aScaleY, aPosX, aPosY, aZorder, aTag, aParent) {
        var sprite = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame(aName + ".png"));
        sprite.setScale(aScaleX, aScaleY);
        sprite.setPosition(cc.p(aPosX, aPosY));
        aParent.addChild(sprite, aZorder, aTag);
        return sprite;
    },

    addUrlSprite: function(aName, aScaleX, aScaleY, aPosX, aPosY, aZorder, aTag, aParent) {
        var sprite = new cc.Sprite(aName);
        sprite.setScale(aScaleX, aScaleY);
        sprite.setPosition(cc.p(aPosX, aPosY));
        aParent.addChild(sprite, aZorder, aTag);
        return sprite;
    }
});
