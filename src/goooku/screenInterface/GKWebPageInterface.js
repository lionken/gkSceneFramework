var GK_WebPageInterface = GK_ScreenInterface.extend({
    //***********变量*************
    mRoomGroup: null,
    mWebSocketAddress: null,
    mWebSocketPort: null,

    mWebConnector: null,

    //**************公有函数***********
     /**
     * 构造函数
     */
    ctor: function() {
    },

    /**
     * 设置显示的标题
     * @param aTitle 场景的标题
     */
    setGameInfo: function(aTitle) {
        this.mWebConnector =
            new GK_WebConnector(GK.screen_offset_x, GK.screen_offset_y, GK.screen_width, GK.screen_height);
        this.mWebConnector.createWebConnector(aTitle, GK.waitTime, this.mRoomGroup);
    },

    /**
     * 获取连接码
     * @return {String}
     */
    getVerificationCode: function() {
        return this.mRoomGroup;
    },

    /**
     * 获取长连接服务器的ip地址
     */
    getSocketAddress: function() {
        return this.mWebSocketAddress;
    },

    /**
     * 获取长连接服务器的端口
     */
    getSocketPort: function() {
        return this.mWebSocketPort;
    },

    /**
     * 连接后台是否成功
     */
    onCreated: function() {
        if(this.mWebConnector) {
            var self = this;
            this.mWebConnector.startConnector(function() {
                self.mWebConnector.stopConnector();

                gameStart();
            });
        }
    },

    /**
     * 用户加入
     * @param aUid 用户id
     * @param aUserIdx 用户在该场景下的index
     * @param aNickname 用户的昵称
     * @param aUserAvatar 用户头像URL
     * @param aSex 用户性别（1男2女）
     */
    onUserJoin: function(aUid, aUserIdx, aNickname, aUserAvatar, aSex) {
        if(this.mWebConnector) {
            this.mWebConnector.addUser(aUserIdx, aUserAvatar, aSex);
        }
    },

    /**
     * 用户离开
     * @param aUserIdx 用户在该场景下的index
     */
    onUserLeft: function(aUserIdx) {
        if(this.mWebConnector) {
            this.mWebConnector.removeUser(aUserIdx);
        }
    },

    /**
     * 发生错误
     * @param aErrCode 错误码
     * @param aErrMsg 错误信息
     */
    onError: function(aErrCode, aErrMsg) {
        //TODO: 换一个产品式的报错方式
        alert('错误(' + aErrCode + ') ' + aErrMsg);
    },

    /**
     * 播放结束
     */
    endOfAdvertisement: function() {
        if(GK.debug) {
            alert("场景播放结束！");
        }
    },

    /**
     * 开始运行
     */
    run: function() {
        var self = this;

        this.requestVerificationCode(function(err) {
            if(err) {
                self.onError(GK_ResultCode.HTTP_REQUEST_ERROR, "获取连接码错误！");
            } else {
                //配置场景信息
                getGameInfo();

                //初始化连接
                initGameConfig();

                //开始连接
                gameConnect();
            }
        });
    },

    /**
     * 获取连接码
     * @param aCallback 回调函数 function(aErr)
     */
    requestVerificationCode: function(aCallback) {
        if(!GK.screen_id || !GK.scene_wechat_url || !GK.scene_id || !GK.scene_plan_id) {
            throw "未配置sceneInfo";
        }

        var sceneInfo = {
            type: "url",
            url: GK.scene_wechat_url,
            screenId: GK.screen_id,
            advertisementPlanId: GK.scene_plan_id,
            sceneId: GK.scene_id,
            ttl: GK.scene_duration
        };

        var self = this;
        var httpRequest = new GK_HttpRequest();
        httpRequest.getRoomCode(sceneInfo, function(err, connInfo) {
            if(!err) {
                self.mRoomGroup = connInfo.roomGroup;
                self.mWebSocketAddress = connInfo.ip;
                self.mWebSocketPort = connInfo.port;
            }
            aCallback(err);
        });
    }
});



