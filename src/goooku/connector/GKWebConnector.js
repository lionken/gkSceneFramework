var GK_WebConnector = cc.Class.extend({
    //***********变量*************
    TAG: "GK_WebConnector",

    mConnectorLayer: null,

    //**************公有函数***********
    /**
     * 构造函数
     * @param aXOffset 左上角x坐标
     * @param aYOffset 左上角y坐标
     * @param aScreenWidth 屏幕宽度
     * @param aScreenHeight 屏幕高度
     */
    ctor: function(aXOffset, aYOffset, aScreenWidth, aScreenHeight) {
        this.mConnectorLayer = new GKWebConnectorLayerV8(aScreenWidth, aScreenHeight, aXOffset, aYOffset);
    },

    /**
     * 创建连接器
     * @param aTitle 场景名
     * @param aWaitDuration 连接等待时间
     * @param aRoomGroup 连接码
     */
    createWebConnector: function(aTitle, aWaitDuration, aRoomGroup) {
        if(this.mConnectorLayer) {
            this.mConnectorLayer.createLayer(aTitle, aWaitDuration, aRoomGroup);
        }
    },

    /**
     * 开始运行构造器
     * @param aCallback 回调函数，标明倒计时结束
     */
    startConnector: function(aCallback) {
        if(this.mConnectorLayer) {
            this.mConnectorLayer.showLayer(aCallback);
        }
    },

    /**
     * 添加用户
     * @param aUserIdx 用户在该场景下的index
     * @param aUserAvatar 用户头像
     * @param aUserSex 用户性别
     */
    addUser: function(aUserIdx, aUserAvatar, aUserSex) {
        if(aUserIdx && aUserAvatar && aUserSex && this.mConnectorLayer) {
            this.mConnectorLayer.addUser(aUserIdx, aUserAvatar, aUserSex);
        }
    },

    /**
     * 删除用户
     * @param aUserIdx 用户在该场景内的唯一标识
     */
    removeUser: function(aUserIdx) {
        if(aUserIdx && this.mConnectorLayer) {
            this.mConnectorLayer.removeUser(aUserIdx);
        }
    },

    /**
     * 停止连接器
     */
    stopConnector: function() {
        this.mConnectorLayer.deleteLayer();
        delete this.mConnectorLayer;
    }
});