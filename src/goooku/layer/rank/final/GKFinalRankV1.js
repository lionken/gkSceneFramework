var GK_FinalRankLayerV1 = GK_FinalRankLayer.extend({
    mUserInfo: null,
    mCellSum: null,

    ctor: function() {
        this._super();

        //加载图片资源
        cc.spriteFrameCache.addSpriteFrames("res/finalRank_V1.plist");

        //基层
        this.mainNode = new cc.LayerColor(cc.color(255, 255, 255, 0), 1920, 1080);
        this.mainNode.setPosition(cc.p(0, 0));
        this.mainNode.setAnchorPoint(cc.p(0, 0));
        this.mainNode.setScale(GK.screen_width / 1920);
        this.addChild(this.mainNode, 0, 1);

        return true;
    },

    /**
     * 显示榜单层
     * @param aUserInfoArr 入榜的玩家信息数组
     * @param aCellSum 要显示的榜单条目数量
     */
    //设置结束榜单层初始化
    showResult: function(aUserInfoArr, aCellSum) {
        if(!aUserInfoArr || aUserInfoArr.length <= 0 || aCellSum == undefined || aCellSum <= 0) {
            throw "showResult 参数错误";
        }

        this.mUserInfo = aUserInfoArr;
        this.mCellSum = aCellSum;

        //榜单底图
        var page = this.addSprite("fw_finalRank_v1_rankBg", 0, 0, 1920 / 2, 1080 / 2, 1, 100, this.mainNode);
        page.runAction(cc.sequence(cc.scaleTo(0.2, 1.7), cc.scaleTo(0.1, 1.5)));

        var clipp = new cc.ClippingNode();
        var stencil = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame("fw_finalRank_v1_board.png"));
        var listBg = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame("fw_finalRank_v1_board.png"));
        clipp.setStencil(stencil);
        clipp.setInverted(false);
        clipp.setAlphaThreshold(0);
        clipp.addChild(listBg);
        page.addChild(clipp, 1, 1);
        clipp.setPosition(cc.p(page.getContentSize().width / 2, page.getContentSize().height * 0.45));
        this.listLayer =
            new cc.LayerColor(cc.color(0, 0, 0, 0), listBg.getContentSize().width, listBg.getContentSize().height);
        listBg.addChild(this.listLayer, 0, 0);

        for(var i = 0; i < aCellSum; i++) {
            //名次条目
            var cell = this.addSprite("fw_finalRank_v1_positionBg", 1, 1,
                this.listLayer.getContentSize().width * (0.28 + 0.44 * (Math.floor(i / 5) % 2)),
                this.listLayer.getContentSize().height * (0.9 - (5 * Math.floor(i / 10) + (i % 5)) * 0.2), 1, i,
                this.listLayer);
            //名次数字
            var label_num = new cc.LabelBMFont(i + 1, res.num_fnt);
            label_num.setPosition(cc.p(cell.getContentSize().width * 0.1, cell.getContentSize().height * 0.6));
            cell.addChild(label_num, 0, 1);
            this.addLabel("", "Arial", 35, cc.color(0, 0, 0), 1, 1, cell.getContentSize().width * 0.65,
                cell.getContentSize().height * 0.5, 1, i * 2, cell);
        }

        if(aCellSum > 10) {
            var action1 = cc.sequence(cc.delayTime(5),
                cc.moveBy(0.5, cc.p(0, this.listLayer.getContentSize().height))).repeat(Math.floor((aCellSum - 1) / 10));
            this.listLayer.runAction(cc.sequence(action1, cc.delayTime(5), action1.reverse()).repeatForever());
        }

        this.showLayer();
    },

    /**
     * 删除榜单
     */
    removeResult: function() {
        var callFunc = cc.callFunc(this.deleteLayer, this);
        this.mainNode.getChildByTag(100).runAction(cc.sequence(cc.scaleTo(0.5, 0), callFunc));
    },

    //显示图层
    showLayer: function() {
        for(var i = 0; i < this.mUserInfo.length; i++) {
            if(i >= this.mCellSum) {
                break;
            }
            this.showUserInfo(i);
        }
    },

    //榜单显示玩家信息
    showUserInfo: function(i) {
        var cell = this.listLayer.getChildByTag(i);
        //头像
        var icon = this.mUserInfo[i].userIcon;
        var clipp = new cc.ClippingNode();
        var stencil = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame("fw_finalRank_v1_headMask.png"));
        var content = new cc.Sprite(icon);
        content.setScale(1);
        clipp.setStencil(stencil);
        clipp.setInverted(false);
        clipp.setAlphaThreshold(0);
        clipp.addChild(content);
        cell.addChild(clipp, 1);
        clipp.setPosition(cc.p(cell.getContentSize().width * 0.305, cell.getContentSize().height * 0.52));
        //昵称
        var nickName = this.mUserInfo[i].nickname;
        if(this.getStringLength(nickName) > 10)nickName = nickName.substring(0, this.getStringIndex(nickName)) + "..";
        var label = cell.getChildByTag(2 * i);
        label.setString(nickName);
    },

    //删除榜单层
    deleteLayer: function() {
        this.mainNode.removeFromParent(true);
    },

    //场景中添加精灵方法
    addSprite: function(aName, aScaleX, aScaleY, aPosX, aPosY, aZorder, aTag, aParent) {
        var sprite = new cc.Sprite.createWithSpriteFrame(cc.spriteFrameCache.getSpriteFrame(aName + ".png"));
        sprite.setScale(aScaleX, aScaleY);
        sprite.setPosition(cc.p(aPosX, aPosY));
        aParent.addChild(sprite, aZorder, aTag);
        return sprite;
    },

    //场景中添加文本方法
    addLabel: function(aText, aFont, aSize, aColor, aScaleX, aScaleY, aPosX, aPosY, aZorder, aTag, aParent) {
        var label = cc.LabelTTF.create(aText, aFont, aSize);
        label.setColor(aColor);
        label.setScale(aScaleX, aScaleY);
        label.setPosition(cc.p(aPosX, aPosY));
        aParent.addChild(label, aZorder, aTag);
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
    }
});
