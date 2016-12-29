//圣诞版MVP界面
var GK_MvpLayerV3 = GK_MvpLayer.extend({
    //***********变量*************
    mOssImgUtil: null,

    //**************公有函数***********
    /**
     * 构造函数
     * @returns {Boolean}
     */
    ctor: function() {
        this._super();
        //cc.spriteFrameCache.addSpriteFrames("res/mvp_V3.plist");

        this.mainNode = new cc.LayerColor(cc.color(255, 255, 255, 0), 1280, 720);
        this.mainNode.setPosition(cc.p(0, 0));
        this.addChild(this.mainNode, 0, 1);
        this.mainNode.setAnchorPoint(cc.p(0, 0));
        //this.mainNode.setScale(GK.screen_width / 1280);

        this.mainLayer = this.loadStudioJsonFile(res.mvp_json);
        this.mainNode.addChild(this.mainLayer, 1);
        var mvpNode = this.getStudioWidgetByName(this.mainLayer,"MVP");
        mvpNode.setScale(0);
        var light = this.getStudioWidgetByName(this.mainLayer,"light");
        light.setScale(0);
        var rankList = this.getStudioWidgetByName(this.mainLayer,"rankList");
        rankList.setScale(0);
        return true;
    },

    /**
     * 显示MVP界面
     * @param aMVPs MVP用户信息数组，MVP用户信息为userIcon(头像), sex(性别), nickname(昵称)
     * @param aLogoUrl 商家logo
     * @param aPostUrls 商家海报URL数组
     */
    showMVP: function(aMVPs) {
        var mvpNode = this.getStudioWidgetByName(this.mainLayer,"MVP");
        var icon = this.getStudioWidgetByName(mvpNode,"icon");
        icon.setOpacity(0);
        mvpNode.runAction(cc.sequence(cc.scaleTo(0.2,1.2),cc.scaleTo(0.1,1)));
        var light = this.getStudioWidgetByName(this.mainLayer,"light");
        light.runAction(cc.sequence(cc.scaleTo(0.2,1.5),cc.scaleTo(0.1,1.3)));
        light.runAction(cc.rotateBy(5,360).repeatForever());
        var rankList = this.getStudioWidgetByName(this.mainLayer,"rankList");
        rankList.runAction(cc.sequence(cc.scaleTo(0.2,1.2),cc.scaleTo(0.1,1)));

        //mvp信息
        if(aMVPs && aMVPs.length == 1) {
            if(aMVPs[0].userIcon) {
                this.addUrlSprite(aMVPs[0].userIcon,2.5,2.5,icon.x,icon.y,1,1,mvpNode);
            }
            if(aMVPs[0].sex) {
                var sex = this.getStudioWidgetByName(mvpNode,"sex");
                if(aMVPs[0].sex == 1) {
                    sex.loadTexture("shengdancai (32).png",ccui.Widget.PLIST_TEXTURE);
                } else if(aMVPs[0].sex == 2) {
                    sex.loadTexture("shengdancai (31).png",ccui.Widget.PLIST_TEXTURE);
                } else {
                    sex.loadTexture("shengdancai (32).png",ccui.Widget.PLIST_TEXTURE);
                }
            }

            if(aMVPs[0].nickname) {
                var nickName = aMVPs[0].nickname;
                var name = this.getStudioWidgetByName(mvpNode,"nickname");
                if(this.getStringLength(nickName) > 10) {
                    nickName = nickName.substring(0, this.getStringIndex(nickName)) + "..";
                }
                name.setString(nickName);
            } else {
                var name = this.getStudioWidgetByName(mvpNode,"nickname");
                name.setString("感快互动");
            }
        } else {
            var name = this.getStudioWidgetByName(this.mainLayer,"nickname");
            name.setString("感快互动");
        }
        //排行榜信息
        var panel = this.getStudioWidgetByName(this.mainLayer,"Panel_2");
        var layer = new cc.LayerColor(cc.p(0,0,0,0),panel.width,panel.height);
        panel.addChild(layer);
        var num = userArray.length > 10 ? 10 : userArray.length;
        for(var i = 0;i<10;i++){
            var cell = this.loadStudioJsonFile(res.cell_json);
            layer.addChild(cell,1,i);
            cell.setPosition(panel.width/2,panel.height*(0.9 - i*0.2));
            var numb = this.getStudioWidgetByName(cell,"num");
            numb.setString((i+1)+"");
        }
        for(var i = 0;i<num;i++){
            var cell = layer.getChildByTag(i);
            var nickname = this.getStudioWidgetByName(cell,"nickname");
            var nickName = userArray[i].mNickname;
            if(this.getStringLength(nickName) > 10) {
                nickName = nickName.substring(0, this.getStringIndex(nickName)) + "..";
            }
            nickname.setString(nickName);
            var sex = this.getStudioWidgetByName(cell,"sex");
            sex.setLocalZOrder(2);
            if(userArray[i].mSex == 1){
                sex.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("baiweinian_paihang (2).png"));
            }else{
                sex.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("baiweinian_paihang (1).png"));
            }
            var icon = this.getStudioWidgetByName(cell,"icon");
            this.addUrlSprite(userArray[i].mAvatarUrl,0.9,0.9,icon.x,icon.y,1,-1,cell);

        }
        layer.runAction(cc.sequence(cc.delayTime(3),cc.moveBy(10, 0, panel.height*1), cc.delayTime(5),
            cc.moveBy(1, 0, panel.height*-1)).repeatForever());
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
    loadStudioJsonFile: function(jsonFile) {
        var json = ccs.load(jsonFile);
        return json.node;
    },
    getStudioWidgetByName: function(root, widgetName) {
        if(!root) {
            cc.log("getStudioWidgetByName error root null");
            return null;
        }
        var widget = ccui.helper.seekWidgetByName(root, widgetName);
        if(!widget) {
            cc.log("getStudioWidgetByName error widgetName " + widgetName + " rootName " + root.getName());
            return null;
        }
        return widget;
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
    addUrlSprite: function(name, scaleX, scaleY, posX, posY, Zorder, tag, parent) {
        var sprite = new cc.Sprite(name);
        sprite.setScale(scaleX, scaleY);
        sprite.setPosition(cc.p(posX, posY));
        parent.addChild(sprite, Zorder, tag);
        return sprite;
    },
});
