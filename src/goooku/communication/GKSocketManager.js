var GK_SocketManager = cc.Class.extend({
    //***********变量*************
    TAG: "GK_SocketManager",

    mWebSocket: null,
    mHttpRequest: null,
    mGameSocketCallback: null,
    mInterface: null,

    mNeedRequestGameStart: 0,
    mGameResultData: null,

    mStop: false,

    //**************公有函数***********
    /**
     * 构造函数
     * @param aToken 向后台申请code的access_token
     * @param aRoomGroup 连接code
     * @param aWebSocketHost webSocket地址
     * @param aWebSocketPort webSocket端口
     */
    ctor: function(aToken, aRoomGroup, aWebSocketHost, aWebSocketPort, aGameSocketCallback, aInterface) {
        this.mHttpRequest = new GK_HttpRequest(aToken, aRoomGroup);
        this.mWebSocket = new GK_WebSocket(aWebSocketHost, aWebSocketPort, aRoomGroup);
        this.mGameSocketCallback = aGameSocketCallback;
        this.mInterface = aInterface;
    },

    /**
     * 当处于debug模式时，打印log
     * @param aMsg log信息
     * @param aForce 强制打印log
     */
    log: function(aMsg, aForce) {
        if(aForce || GK.debug) {
            console.log("[" + this.TAG + "] " + aMsg);
        }
    },

    /**
     * 连接到服务器
     * @param aRoomGroup 连接码
     * @param aMaxUserCount 最大连接人数
     * @param aExpireTime 游戏过期时间
     */
    connect: function(aMaxUserCount, aExpireTime) {
        this.log('connect maxUserCount(' + aMaxUserCount + ') expireTime(' + aExpireTime + ')');

        if(this.mStop) {
            return;
        }

        //配置WebSocket
        this.mWebSocket.configRoomInfo(aMaxUserCount, aExpireTime);
        this.mWebSocket.configCallbackFunctions(this.onConnect.bind(this), this.onUserJoin.bind(this),
            this.onUserLeft.bind(this), this.onUserData.bind(this), this.onError.bind(this));

        this.mWebSocket.connect(5000); //5s未连接成功则连接失败
    },

    /**
     * 开始游戏
     * @param aStartData 开始时的透传字段
     */
    gameStart: function(aStartData) {
        this.log('gameStart');

        if(this.mStop) {
            return;
        }

        if(this.mWebSocket.isGameStart()) {
            return;
        }

        if(!aStartData) {
            aStartData = {};
        }

        //title可能是中文，使用encodeURI + base64编码
        aStartData["sceneName"] = new GK_Base64Util().encode(GK.scene_title);
        aStartData["userCount"] = GK.UserManager.getUserCount();

        this.mWebSocket.gameStart(aStartData);

        if(this.mGameSocketCallback.onGameStart && typeof this.mGameSocketCallback.onGameStart == 'function') {
            this.mGameSocketCallback.onGameStart();
        } else {
            this.log('onGameStart', true);
        }

        var self = this;
        if(this.mNeedRequestGameStart > 0) {
            setTimeout(function() {
                self.mHttpRequest.sendGameStart(function(aErr) {
                    if(aErr) {
                        self.onError(true, aErr);
                    }
                });
            }, 10000); //10s延时，供后端将缓存数据迁移到数据库
        }
    },

    /**
     * 开始活动
     * @param aStartData 开始时的透传字段
     */
    activityStart: function(aStartData) {
        this.log('activityStart');

        if(this.mStop) {
            return;
        }

        if(this.mWebSocket.isGameStart()) {
            return;
        }

        if(!aStartData) {
            aStartData = {};
        }

        //title可能是中文，使用encodeURI + base64编码
        aStartData["sceneName"] = new GK_Base64Util().encode(GK.scene_title);
        aStartData["userCount"] = GK.UserManager.getUserCount();

        this.mWebSocket.gameStart(aStartData);

        if(this.mGameSocketCallback.onGameStart && typeof this.mGameSocketCallback.onGameStart == 'function') {
            this.mGameSocketCallback.onGameStart();
        } else {
            this.log('activityStart', true);
        }
    },

    /**
     * 大屏发送数据给全部手机
     * @param aData 数据，JSON格式
     */
    sendGameData: function(aData) {
        this.log('sendGameData');

        if(this.mStop) {
            return;
        }

        this.mWebSocket.sendGameData(aData);
    },

    /**
     * 发送游戏结果
     * @param aResultData 游戏结果数据
     */
    sendGameResult: function(aResultData) {
        this.log('sendGameResult');

        if(this.mStop || !aResultData) {
            return;
        }

        this.mGameResultData = {};
        for(var i = 0; i < aResultData.length; i++) {
            if(aResultData[i] && aResultData[i].uIdx && aResultData[i].win != undefined &&
                aResultData[i].score != undefined && aResultData[i].rank != undefined) {
                this.mGameResultData[aResultData[i].uIdx] = {
                    w: aResultData[i].win,
                    r: aResultData[i].rank,
                    s: aResultData[i].score,
                    t: aResultData[i].rank //TODO: 暂时赋值为当前游戏排名
                };
            }
        }

        this.mHttpRequest.sendGameResult(aResultData, (this.onMVP).bind(this), (this.onGameResult).bind(this));
    },

    /**
     * 发送活动结果
     * @param aResultData 游戏结果数据
     */
    sendActivityResult: function(aResultData) {
        this.log('sendActivityResult');

        if(this.mStop || !aResultData) {
            return;
        }

        var resultArray = [];
        for(var i = 0; i < aResultData.length; i++) {
            resultArray.push({
                uid: aResultData[i].uid,
                rank: aResultData[i].rank
            });
        }

        var self = this;
        this.mHttpRequest.sendActivityResult(resultArray, function(err) {
            self.log('sendActivityResult err=' + err);
        });
    },

    stop: function() {
        this.log('stop');

        if(this.mStop) {
            return;
        }

        this.mWebSocket.sendGameStop();

        delete this.mWebSocket;
        delete this.mHttpRequest;

        this.mStop = true;
    },

    /**
     * 回调函数，标明已连接成功
     */
    onConnect: function() {
        if(this.mStop) {
            return;
        }

        GK.UserManager = new GK_UserManager();
        GK.KVPStore = new GK_KVPStore();

        if(this.mInterface) {
            this.mInterface.onCreated();
        }
    },

    /**
     * 回调函数，标明用户已经连接
     * @param aUid 用户id
     * @param aUserIdx 用户在该场景下的index
     * @param aNickname 用户昵称
     * @param aUserIcon 用户昵称
     * @param aSex 用户性别
     */
    onUserJoin: function(aUid, aUserIdx, aNickname, aUserIcon, aSex) {
        if(this.mStop) {
            return;
        }

        this.mNeedRequestGameStart++;

        if(this.mGameSocketCallback.onUserJoin && typeof this.mGameSocketCallback.onUserJoin == 'function') {
            //TODO：昵称的解析
            this.mGameSocketCallback.onUserJoin(aUid, aUserIdx, aNickname, aUserIcon, aSex);

            if(this.mInterface) {
                this.mInterface.onUserJoin(aUid, aUserIdx, aNickname, aUserIcon, aSex);
            }
        } else {
            this.log('onUserJoin', true);
        }
    },

    /**
     * 回调函数，标明用户已经退出
     * @param aUserIdx 用户在该场景下的index
     */
    onUserLeft: function(aUserIdx) {
        if(this.mStop) {
            return;
        }

        this.mNeedRequestGameStart--;

        if(this.mGameSocketCallback.onUserLeft && typeof this.mGameSocketCallback.onUserLeft == 'function') {
            this.mGameSocketCallback.onUserLeft(aUserIdx);

            if(this.mInterface) {
                this.mInterface.onUserLeft(aUserIdx);
            }
        } else {
            this.log('onUserLeft', true);
        }
    },

    /**
     * 回调函数，标明某用户传给大屏的数据
     * @param aUserIdx 用户在该场景下的index
     * @param aData 用户传递的JSON数据
     */
    onUserData: function(aUserIdx, aData) {
        if(this.mStop) {
            return;
        }

        if(this.mGameSocketCallback.onUserData && typeof this.mGameSocketCallback.onUserData == 'function') {
            this.mGameSocketCallback.onUserData(aUserIdx, aData);
        } else {
            this.log('onUserData', true);
        }
    },

    /**
     * 回到函数，返回MVP信息
     * @param aMVPInfo MVP信息，格式如下：
     * {
     *   brandLogoUrl: String,
     *   posterUrls: Array,
     *   uid: String
     * }
     */
    onMVP: function(aMvpInfo) {
        if(this.mStop) {
            return;
        }

        if(this.mGameSocketCallback.onMVP && typeof this.mGameSocketCallback.onMVP == 'function') {
            this.mGameSocketCallback.onMVP(aMvpInfo);
        } else {
            this.log('onMVP', true);
        }
    },

    /**
     * 回掉函数，标明游戏结果发送完毕
     * @param aError 游戏结果发送过程中出错
     */
    onGameResult: function(aError) {
        if(this.mStop) {
            return;
        }

        if(this.mGameResultData) {
            this.mWebSocket.sendGameResult(this.mGameResultData);
            delete this.mGameResultData;//清除gameResult的引用
        }

        if(aError) {
            this.onError(true, aError);
            return;
        }

        if(this.mInterface) {
            var mvpShowDuration = GK.scene_mvp_show_duration * 1000;
            var self = this;
            setTimeout(function() {
                self.stop();
                self.mInterface.endOfAdvertisement();
            }, mvpShowDuration);
        }
    },

    /**
     * 回调函数，标明socket出错
     * @param aForceStop 是否强制退出
     * @param aError 错误信息
     */
    onError: function(aForceStop, aError) {
        if(aForceStop) {
            this.stop();
        }

        if(this.mGameSocketCallback.onError && typeof this.mGameSocketCallback.onError == 'function') {
            this.mGameSocketCallback.onError(aForceStop, aError);

            if(this.mInterface && aForceStop) {
                this.mInterface.onError(aError.getCode(), aError.getMsg());
            }
        } else {
            this.log('onError', true);
        }
    }
});