var GK_DynamicRankLayerV1 = GK_DynamicRankLayer.extend({
    /**
     * 构造函数
     */
    ctor: function() {
        this._super();
        cc.spriteFrameCache.addSpriteFrames("res/dynamicRank_V1.plist");
        this.mainNode = new cc.LayerColor(cc.color(0, 0, 0, 0), GK.screen_width, GK.screen_height);
        this.mainNode.setAnchorPoint(cc.p(0, 0));
        this.mainNode.setScale(GK.screen_width / 1280);
        this.mainNode.setPosition(cc.p(0, 0));
        this.addChild(this.mainNode, 0, 0);

        return true;
    },

    /**
     * 创建排行榜
     * @param aLayerParams 显示参数，包含scale
     * @param aUserArr 用户数组，包含nickname和userIcon，已排好序
     */
    createRank: function(aLayerParams, aUserArr) {
        if(!aLayerParams || !aUserArr) {
            throw "无法创建动态排行榜，参数不正确";
        }

        if(!aLayerParams.scale) {
            aLayerParams.scale = 1;
        }

        var sprite = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame("fw_dynamicRank_v1_borad" +
            ".png"));
        var scale;
        var cellNum;
        if(aUserArr.length > 8) {
            scale = 0.8;
            cellNum = 8;
        } else {
            scale = (aUserArr.length + 2) / 10;
            cellNum = aUserArr.length;
        }

        var ranklayerWidth = sprite.getContentSize().width;
        var ranklayerHeight = sprite.getContentSize().height * scale;
        var rankLayer = new cc.LayerColor(cc.color(0, 0, 0, 0), ranklayerWidth, ranklayerHeight);
        this.mainNode.addChild(rankLayer, 1, 1);
        rankLayer.setScale(aLayerParams.scale, aLayerParams.scale);
        rankLayer.setAnchorPoint(cc.p(0, 0));
        rankLayer.setPosition(cc.p(0, 0));

        sprite.setPosition(cc.p(ranklayerWidth / 2, ranklayerHeight / 2));
        sprite.setScaleY(scale);
        rankLayer.addChild(sprite, 2, 1);

        var cellMode = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame("fw_dynamicRank_v1_first" +
            ".png"));
        this.addSprite("fw_dynamicRank_v1_title", 1, 1, ranklayerWidth / 2,
            ranklayerHeight * cellNum / (cellNum + 2) + cellMode.getContentSize().height * 1.4, 2, 2, rankLayer);

        for(var i = 0; i < aUserArr.length; i++) {
            if(i == 8) {
                break;
            }

            var cellTag = 2 + i + 1;

            var mvp = [
                "fw_dynamicRank_v1_first",
                "fw_dynamicRank_v1_second",
                "fw_dynamicRank_v1_third",
                "fw_dynamicRank_v1_four",
                "fw_dynamicRank_v1_five",
                "fw_dynamicRank_v1_six",
                "fw_dynamicRank_v1_seven",
                "fw_dynamicRank_v1_eight"
            ];

            this.addSprite(mvp[i], 1, 1, ranklayerWidth / 2,
                ranklayerHeight * cellNum / (cellNum + 2) - cellMode.getContentSize().height * i * 1.1, 3, cellTag,
                rankLayer);

            var cell = rankLayer.getChildByTag(cellTag);
            if(aUserArr[i].nickname) {
                var nickName = aUserArr[i].nickname;
                if(this.getStringLength(nickName) > 10) {
                    nickName =
                        nickName.substring(0, this.getStringIndex(nickName)) + "..";
                }
                this.addLabel(nickName, "Arial", 30, cc.color(51, 51, 51), 1, 1, cell.getContentSize().width * 0.7,
                    cell.getContentSize().height * 0.5, 0, 11, cell);
            } else {
                this.addLabel("感快互动", "Arial", 30, cc.color(51, 51, 51), 1, 1, cell.getContentSize().width * 0.7,
                    cell.getContentSize().height * 0.5, 0, 11, cell);
            }
        }
        this.showResult(aUserArr);
    },

    /**
     * 显示排行榜
     * @param aUserArr aUserArr 用户数组，包含nickname和userIcon，已排好序
     */
    showResult: function(aUserArr) {
        for(var p = 0; p < aUserArr.length; p++) {
            if(p == 8)break;
            if(aUserArr[p].userIcon) {
                var url = aUserArr[p].userIcon;
                var cell = this.mainNode.getChildByTag(1).getChildByTag(2 + p + 1);

                var tempAnyOneTag = this.mainNode.getChildByTag(1).getChildByTag(2 + p + 1).getChildByTag(12);

                if(tempAnyOneTag) {
                    this.mainNode.getChildByTag(1).getChildByTag(2 + p + 1).removeChildByTag(12, true);
                }
                var icon = this.mainNode.getChildByTag(1).getChildByTag(2 + p + 1);

                if(aUserArr[p].nickname) {
                    var nickName = aUserArr[p].nickname;
                    if(this.getStringLength(nickName) > 10) {
                        nickName =
                            nickName.substring(0, this.getStringIndex(nickName)) + "..";
                    }
                    cell.getChildByTag(11).setString(nickName);
                } else {
                    cell.getChildByTag(11).setString("感快互动");
                }

                var clipp = new cc.ClippingNode();
                var stencil = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame("fw_dynamicRank_v1_avatar" +
                    ".png"));
                var content = new cc.Sprite(url);
                content.setScale(0.7);
                clipp.setStencil(stencil);
                clipp.setInverted(false);
                clipp.setAlphaThreshold(0);
                clipp.addChild(content);
                icon.addChild(clipp, 1, 12);
                clipp.setPosition(cc.p(icon.getContentSize().width * 0.3, icon.getContentSize().height * 0.51));
                clipp.width = icon.getContentSize().width;
                clipp.height = icon.getContentSize().height;
            }
        }
    },

    /**
     * 删除榜单
     */
    removeRank: function() {
        this.mainNode.removeFromParent(true);
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

    addLabel: function(aText, aFont, aSize, aColor, aScaleX, aScaleY, aPosX, aPosY, aZorder, aTag, aParent) {
        var label = cc.LabelTTF.create(aText, aFont, aSize);
        label.setColor(aColor);
        label.setScale(aScaleX, aScaleY);
        label.setPosition(cc.p(aPosX, aPosY));
        aParent.addChild(label, aZorder, aTag);
        return label
    },

    addSprite: function(aName, aScaleX, aScaleY, aPosX, aPosY, aZorder, aTag, aParent) {
        var sprite = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame(aName + ".png"));
        sprite.setScale(aScaleX, aScaleY);
        sprite.setPosition(cc.p(aPosX, aPosY));
        aParent.addChild(sprite, aZorder, aTag);
        return sprite
    }
});
