var GK_WebSocket = cc.Class.extend({
    //***********变量*************
    TAG: "GK_WebSocket",

    mWebSocketAddress: "",
    mRoomInfo: null,
    mCbFns: null,

    mSocket: null,
    mConnected: null,
    mGameStarted: false,

    //**************公有函数***********
    /**
     * 构造函数
     * @param aWebSocketHost webSocket地址
     * @param aWebSocketPort webSocket端口
     */
    ctor: function(aWebSocketHost, aWebSocketPort, aRoomGroup) {
        this.mWebSocketAddress = "http://" + aWebSocketHost + ":" + aWebSocketPort;
        this.mRoomInfo = {
            roomGroup: aRoomGroup
        };
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
     * 初始化房间信息
     * @param aRoomGroup 连接码
     * @param aMaxUserCount 最大连接人数
     * @param aExpireTime 游戏过期时间
     */
    configRoomInfo: function(aMaxUserCount, aExpireTime) {
        if(!this.mRoomInfo.roomGroup || aMaxUserCount == undefined || aExpireTime == undefined) {
            throw "configRoomInfo参数错误";
        }

        this.mRoomInfo.maxUserCount = aMaxUserCount;
        this.mRoomInfo.expireTime = aExpireTime;
    },

    /**
     * 初始化回掉函数
     * @param aRoomConnCb webSocket连接成功回调 function()
     * @param aUserJoinCb 用户加入回调 function(uid, userIdx, nickname, userIcon, sex)
     * @param aUserLeftCb 用户离开回调 function(userIdx)
     * @param aUserDataCb 用户数据回调 function(userIdx, data)
     * @param aOnErrCb 错误处理回调 function(forceStop, err)
     */
    configCallbackFunctions: function(aRoomConnCb, aUserJoinCb, aUserLeftCb, aUserDataCb, aOnErrCb) {
        if(!aRoomConnCb || !aUserJoinCb || !aUserLeftCb || !aUserDataCb || !aOnErrCb) {
            throw "configCallbackFunctions参数错误";
        }

        this.mCbFns = {
            roomConnCb: aRoomConnCb,
            userJoinCb: aUserJoinCb,
            userLeftCb: aUserLeftCb,
            userDataCb: aUserDataCb,
            onErrCb: aOnErrCb
        };
    },

    /**
     * 启动webSocket
     * @param aTimeout 超时时间设置
     */
    connect: function(aTimeout) {
        if(!this.mRoomInfo || !this.mCbFns) {
            throw '未配置websocket信息';
        }

        this.mSocket = io(this.mWebSocketAddress, {
            forceNew: true,
            reconnection: false,
            timeout: 5000
        });

        if(aTimeout == undefined) {
            aTimeout = 5000;
        }

        var self = this;

        var timeoutCounter = setTimeout(function() {
            if(!this.connected) {
                self.mCbFns.onErrCb(true, new GK_Error(GK_ResultCode.WEB_SOCKET_ERROR, "websocket连接失败"));
            }
        }, aTimeout);

        this.mSocket.on("connected", function() {
            self.log("on[connected]");

            clearInterval(timeoutCounter);

            self.mSocket.emit("create room", {
                roomGroup: self.mRoomInfo.roomGroup,
                maxUserCount: self.mRoomInfo.maxUserCount,
                codeTime: self.mRoomInfo.expireTime
            });
        });

        this.mSocket.on("created", function() {
            self.log("on[created]");

            self.mConnected = true;
            self.mCbFns.roomConnCb();
        });

        this.mSocket.on("disconnect", function() {
            self.log("on[disconnect]");

            if(!self.mConnected) {
                return;
            }

            //TODO：可以重新连接

            self.mConnected = false;
            self.mCbFns.onErrCb(true, new GK_Error(GK_ResultCode.WEB_SOCKET_ERROR, "websocket断开连接"));
        });

        this.mSocket.on("user join", function(data) {
            var uid = data["uid"];
            var userIdx = data["userIndex"];
            var nickname = decodeURI(new GK_Base64Util().decode(data["nickName"]));
            var userIcon = data["userIcon"];
            var sex = data["sex"];


            self.log("on[user join] uid(" + uid + ") userIdx(" + userIdx + ") nickname(" + nickname + ") userIcon(" +
                userIcon + ") sex(" + sex + ")");

            self.mCbFns.userJoinCb(uid, userIdx, nickname, userIcon, sex);
        });

        this.mSocket.on("user left", function(data) {
            var userIndex = data["userIndex"];

            self.log("on[user left] userIndex(" + userIndex + ")");

            self.mCbFns.userLeftCb(userIndex);
        });

        this.mSocket.on("user data", function(data) {
            var userIdx = data["userIndex"];

            self.log("on[user data] userIdx(" + userIdx + ") data(" + data["data"] + ")");

            if(self.mGameStarted) {
                self.mCbFns.userDataCb(userIdx, data["data"]);
            } else {
                self.mCbFns.onErrCb(false, new GK_Error(GK_ResultCode.WEB_SOCKET_ERROR, "游戏未开始"));
            }
        });

        this.mSocket.on("err", function(data) {
            self.log("on[err] err(" + data["err"] + ")");

            self.mCbFns.onErrCb(true, new GK_Error(GK_ResultCode.WEB_SOCKET_ERROR, "从服务器接收到错误:" + data["err"]));
        });
    },

    /**
     * 开始游戏
     * @param aStartData 开始时的透传字段
     */
    gameStart: function(aStartData) {
        if(!this.mConnected) {
            return self.mCbFns.onErrCb(true, new GK_Error(GK_ResultCode.WEB_SOCKET_ERROR, "webSocket未连接"));
        }

        this.log("emit[game start] startData (" + aStartData + ")");

        this.mSocket.emit("game start", {
            roomGroup: this.mRoomInfo.roomGroup,
            data: aStartData
        });

        this.mGameStarted = true;
    },

    /**
     * 场景是否开始
     * @returns {Boolean}
     */
    isGameStart: function() {
        return this.mGameStarted;
    },

    /**
     * 发送大屏数据给全部手机
     * @param data 数据，JSON格式
     */
    sendGameData: function(data) {
        if(!this.mConnected || !this.mGameStarted) {
            return this.mCbFns.onErrCb(false, new GK_Error(GK_ResultCode.WEB_SOCKET_ERROR, "未连接或游戏未开始"));
        }

        this.log("emit[game data] data(" + data + ")");

        this.mSocket.emit("game data", {
            roomGroup: this.mRoomInfo.roomGroup,
            data: data
        });
    },

    /**
     * 发送游戏结果给全部手机
     * @param data 游戏结果
     */
    sendGameResult: function(data) {
        if(!this.mConnected || !this.mGameStarted) {
            return self.mCbFns.onErrCb(true, new GK_Error(GK_ResultCode.WEB_SOCKET_ERROR, "未连接或游戏未开始"));
        }

        this.log("emit[game result]");

        this.mSocket.emit("game result", {
            roomGroup: this.mRoomInfo.roomGroup,
            data: data
        });
    },

    /**
     * 发送游戏断开命令
     */
    sendGameStop: function() {
        this.log("emit[room leave]");

        if(this.mSocket) {
            this.mSocket.emit("room leave", {
                roomGroup: this.mRoomInfo.roomGroup
            });
        }

        this.mConnected = false;
        this.mGameStarted = false;
    }
});