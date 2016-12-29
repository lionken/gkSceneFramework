var GK_MvpLayerV2 = GK_MvpLayer.extend({
    //***********变量*************
    mOssImgUtil: null,

    //**************公有函数***********
    /**
     * 构造函数
     * @returns {Boolean}
     */
    ctor: function() {
        this._super();
        cc.spriteFrameCache.addSpriteFrames("res/mvp_V2.plist");

        this.mainNode = new cc.LayerColor(cc.color(255, 255, 255, 0), 1920, 1080);
        this.mainNode.setPosition(cc.p(0, 0));
        this.addChild(this.mainNode, 0, 1);
        this.mainNode.setAnchorPoint(cc.p(0, 0));
        this.mainNode.setScale(GK.const.WIDTH / 1920);

        this.mOssImgUtil = new GK_OSSImageUtil();

        return true;
    },

    /**
     * 显示MVP界面
     * @param aMVPs MVP用户信息数组，MVP用户信息为userIcon(头像), sex(性别), nickname(昵称)
     * @param aLogoUrl 商家logo
     * @param aPostUrls 商家海报URL数组
     */
    showMVP: function(aMVPs, aLogoUrl, aPostUrls) {
        var icon1, icon2;

        var layer = new cc.LayerColor(cc.color(102, 102, 102, 200), 1920, 1080);
        this.mainNode.addChild(layer, 2, 2);
        layer.setPosition(0, 0);

        this.addSprite("fw_mvp_v2_bgHeader", 1.1, 1.1, 1920 / 2, 1080 * 1.6, 2, 3, this.mainNode);
        this.addSprite("fw_mvp_v2_bgFooter", 1.1, 1.1, 1920 / 2, 1080 * -1.07, 2, 4, this.mainNode);
        this.addSprite("fw_mvp_v2_sponsorBg", 1, 1, 1920 / 2, 1080 * -0.2, 2, 5, this.mainNode);
        this.addSprite("fw_mvp_v2_sponsorLogo", 1, 1, 1920 / 2, 1080 * -0.25, 2, 6, this.mainNode);

        var mvpBG1 = this.mainNode.getChildByTag(3);
        var mvpBG2 = this.mainNode.getChildByTag(4);
        var sponsorBg = this.mainNode.getChildByTag(5);
        var sponsorLogo = this.mainNode.getChildByTag(6);

        mvpBG1.runAction(cc.sequence(cc.moveTo(0.3, cc.p(1920 / 2, 1080 * 0.57))));
        mvpBG2.runAction(cc.sequence(cc.moveTo(0.3, cc.p(1920 / 2, 1080 * 0.075))));

        //重设置图片大小，以适应MVP界面
        aLogoUrl = this.mOssImgUtil.resize(aLogoUrl, 200, 200);
        if(aPostUrls && aPostUrls.length > 0) {
            for(var i = 0; i < aPostUrls.length; i++) {
                aPostUrls[i] = this.mOssImgUtil.resize(aPostUrls[i], 460, 280);
            }

            //若只存在一张海报，则两张显示相同的
            if(aPostUrls.length == 1) {
                aPostUrls[1] = aPostUrls[0];
            }
        } else {
            aPostUrls = null;
        }

        if(aLogoUrl) {
            this.addPicSprite(aLogoUrl, 1, 1, sponsorLogo.getContentSize().width / 2,
                sponsorLogo.getContentSize().height / 2, 3, 7, sponsorLogo);
        }

        if(aPostUrls) {
            this.addPicSprite(aPostUrls[0], 1, 1, sponsorBg.getContentSize().width * 0.18,
                sponsorBg.getContentSize().height / 2, 3, 8, sponsorBg);
            this.addPicSprite(aPostUrls[1], 1, 1, sponsorBg.getContentSize().width * 0.82,
                sponsorBg.getContentSize().height / 2, 3, 9, sponsorBg);
        }

        sponsorBg.runAction(cc.sequence(cc.moveTo(0.5, cc.p(1920 / 2, 1080 * 0.2))));
        sponsorLogo.runAction(cc.sequence(cc.moveTo(0.5, cc.p(1920 / 2, 1080 * 0.25))));

        if(aMVPs && aMVPs.length > 1) {
            this.addSprite("fw_mvp_v2_mvpBg", 1, 1, 1920 * 0.35, 1080 * 1.7, 2, 10, this.mainNode);
            this.addSprite("fw_mvp_v2_mvpBg", 1, 1, 1920 * 0.65, 1080 * 1.7, 2, 11, this.mainNode);

            icon1 = this.mainNode.getChildByTag(10);
            icon2 = this.mainNode.getChildByTag(11);

            var iconArray = [icon1, icon2];

            var self = this;
            aMVPs.forEach(function(index, idx) {
                if(index.userIcon) {
                    var clip = new cc.ClippingNode();
                    var stencil = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame("fw_mvp_v2_headMask" +
                        ".png"));
                    var content = new cc.Sprite(index.userIcon);
                    content.setScale(4.3);
                    clip.setStencil(stencil);
                    clip.setInverted(false);
                    clip.setAlphaThreshold(0);
                    clip.addChild(content);
                    iconArray[idx].addChild(clip, 1, 12);
                    clip.setPosition(cc.p(iconArray[idx].getContentSize().width / 2,
                        iconArray[idx].getContentSize().height * 0.39));
                }

                if(index.sex) {
                    if(index.sex == 1) {
                        self.addSprite("fw_mvp_v2_man", 1, 1, iconArray[idx].getContentSize().width * 0.15,
                            iconArray[idx].getContentSize().height * 0.07, 1, 13, iconArray[idx]);
                    } else if(index.sex == 2) {
                        self.addSprite("fw_mvp_v2_wom", 1, 1, iconArray[idx].getContentSize().width * 0.15,
                            iconArray[idx].getContentSize().height * 0.07, 1, 14, iconArray[idx]);
                    } else {
                        self.addSprite("fw_mvp_v2_wom", 1, 1, iconArray[idx].getContentSize().width * 0.15,
                            iconArray[idx].getContentSize().height * 0.07, 1, 14, iconArray[idx]);
                    }
                } else {
                    self.addSprite("fw_mvp_v2_wom", 1, 1, iconArray[idx].getContentSize().width * 0.15,
                        iconArray[idx].getContentSize().height * 0.07, 1, 14, iconArray[idx]);
                }

                if(index.nickname) {
                    var nickName = index.nickname;
                    if(self.getStringLength(nickName) > 10) {
                        nickName = nickName.substring(0, self.getStringIndex(nickName)) + "..";
                    }
                    self.addLabel("" + nickName, "Microsoft YaHei", 50, cc.color(0, 0, 0), 1, 1,
                        iconArray[idx].getContentSize().width * 0.6, iconArray[idx].getContentSize().height * 0.07,
                        2, 15, iconArray[idx]);
                } else {
                    self.addLabel("感快互动", "Microsoft YaHei", 50, cc.color(0, 0, 0), 1, 1,
                        iconArray[idx].getContentSize().width * 0.6, iconArray[idx].getContentSize().height * 0.07,
                        2, 15, iconArray[idx]);
                }
            });

            icon1.runAction(cc.sequence(cc.moveTo(0.5, cc.p(1920 * 0.35, 1080 * 0.7))));
            icon2.runAction(cc.sequence(cc.moveTo(0.5, cc.p(1920 * 0.65, 1080 * 0.7))));
        } else if(aMVPs && aMVPs.length == 1) {
            this.addSprite("fw_mvp_v2_mvpBg", 1, 1, 1920 / 2, 1080 * 1.7, 2, 10, this.mainNode);
            icon1 = this.mainNode.getChildByTag(10);
            //判断mvpObj对象是否存在，如果不存在给默认性别和昵称
            if(aMVPs[0].userIcon) {
                var clip = new cc.ClippingNode();
                var stencil = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame("fw_mvp_v2_headMask" +
                    ".png"));
                var content = new cc.Sprite(aMVPs[0].userIcon);
                content.setScale(4.3);
                clip.setStencil(stencil);
                clip.setInverted(false);
                clip.setAlphaThreshold(0);
                clip.addChild(content);
                icon1.addChild(clip, 1, 12);
                clip.setPosition(cc.p(icon1.getContentSize().width / 2, icon1.getContentSize().height * 0.39));
            }
            if(aMVPs[0].sex) {
                if(aMVPs[0].sex == 1) {
                    this.addSprite("fw_mvp_v2_man", 1, 1, icon1.getContentSize().width * 0.15,
                        icon1.getContentSize().height * 0.07, 1, 13, icon1);
                } else if(aMVPs[0].sex == 2) {
                    this.addSprite("fw_mvp_v2_wom", 1, 1, icon1.getContentSize().width * 0.15,
                        icon1.getContentSize().height * 0.07, 1, 14, icon1);
                } else {
                    this.addSprite("fw_mvp_v2_wom", 1, 1, icon1.getContentSize().width * 0.15,
                        icon1.getContentSize().height * 0.07, 1, 14, icon1);
                }
            } else {
                this.addSprite("fw_mvp_v2_wom", 1, 1, icon1.getContentSize().width * 0.15,
                    icon1.getContentSize().height * 0.07, 1, 14, icon1);
            }

            if(aMVPs[0].nickname) {
                var nickName = aMVPs[0].nickname;
                if(this.getStringLength(nickName) > 10) {
                    nickName = nickName.substring(0, this.getStringIndex(nickName)) + "..";
                }
                this.addLabel("" + nickName, "Microsoft YaHei", 50, cc.color(0, 0, 0), 1, 1,
                    icon1.getContentSize().width * 0.6, icon1.getContentSize().height * 0.07, 2, 15, icon1);
            } else {
                this.addLabel("感快互动", "Microsoft YaHei", 50, cc.color(0, 0, 0), 1, 1,
                    icon1.getContentSize().width * 0.6, icon1.getContentSize().height * 0.07, 2, 15, icon1);
            }
            icon1.runAction(cc.sequence(cc.moveTo(0.5, 1920 / 2, 1080 * 0.7)));
        } else {
            this.addSprite("fw_mvp_v2_mvpBg", 1, 1, 1920 / 2, 1080 * 1.7, 2, 10, this.mainNode);
            icon1 = this.mainNode.getChildByTag(10);
            icon1.runAction(cc.sequence(cc.moveTo(0.5, 1920 / 2, 1080 * 0.7)));
            this.addSprite("fw_mvp_v2_wom", 1, 1, icon1.getContentSize().width * 0.15, icon1.getContentSize().height * 0.07,
                1, 14, icon1);
            this.addLabel("感快互动", "Microsoft YaHei", 50, cc.color(0, 0, 0), 1, 1, icon1.getContentSize().width * 0.6,
                icon1.getContentSize().height * 0.07, 2, 15, icon1);
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

    addLabel: function(aText, aFont, aSize, aColor, aScaleX, aScaleY, aPosX, aPosY, aZorder, aTag, aParent) {
        var label = cc.LabelTTF.create(aText, aFont, aSize);
        label.setColor(aColor);
        label.setScale(aScaleX, aScaleY);
        label.setPosition(cc.p(aPosX, aPosY));
        aParent.addChild(label, aZorder, aTag);
        return label;
    },

    addSprite: function(aName, aScaleX, aScaleY, aPosX, aPosY, aZorder, aTag, aParent) {
        var sprite = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame(aName + ".png"));
        sprite.setScale(aScaleX, aScaleY);
        sprite.setPosition(cc.p(aPosX, aPosY));
        aParent.addChild(sprite, aZorder, aTag);
        return sprite;
    },

    addPicSprite: function(aName, aScaleX, aScaleY, aPosX, aPosY, aZorder, aTag, aParent) {
        var sprite = new cc.Sprite(aName);
        sprite.setScale(aScaleX, aScaleY);
        sprite.setPosition(cc.p(aPosX, aPosY));
        aParent.addChild(sprite, aZorder, aTag);
        return sprite;
    }
});
