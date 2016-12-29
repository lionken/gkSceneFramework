var GK_ActivityProcess = GK_Process.extend({
  //***********变量*************
  TAG: "GK_ActivityProcess",

  mWebConnector: null,
  mInterface: null,

  mCallFunctions: null,

  mRoomGroup: null,
  mWebSocketAddress: null,
  mWebSocketPort: null,

  /**************公有函数***********
   /**
   * 构造函数
   */
  ctor: function() {
    this.mInterface = new GK_ActivityInterface();
    this.mWebConnector = new GK_WebConnector();
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
   * 配置socket回调
   * @param aGameSocketCallback socket回调接口
   */
  configGameSocketCallback: function(aGameSocketCallback) {
    this.mGameSocketCallback = aGameSocketCallback;
  },

  /**
   * 获取场景信息
   */
  getGameInfo: function() {
    if(!GK.scene_title) {
      throw "未配置场景标题";
    }

    this.mInterface.setGameInfo(GK.scene_title);
  },

  /**
   * 初始化场景
   */
  initGameConfig: function() {
    var roomGroup = this.mInterface.getVerificationCode();
    var webSocketAddress = this.mInterface.getSocketAddress();
    var webSocketPort = this.mInterface.getSocketPort();

    if(roomGroup && webSocketAddress && webSocketPort) {
      //TODO: 需要将token的设置也加入进来
      this.mSocketManager =
        new GK_SocketManager(null, roomGroup, webSocketAddress, webSocketPort,
          this.mGameSocketCallback, this.mInterface);

      GK.GameDataSender = new GK_GameDataSender(this.mSocketManager);
    } else {
      this.mInterface.onError(GK_ResultCode.WRONG_PARAMETER, "未初始化连接码或连接地址");
    }
  },

  /**
   * 开始连接场景到后端
   */
  gameConnect: function() {
    if(this.mSocketManager) {
      this.mSocketManager.connect(GK.scene_max_connection, GK.scene_duration);
    } else {
      this.mInterface.onError(GK_ResultCode.WRONG_PARAMETER, "gameConnect未生成mSocketManager");
    }
  },

  /**
   * 场景开始
   */
  gameStart: function() {
    if(this.mSocketManager) {
      //开始连接
      this.mSocketManager.activityStart();

      //初始化cocos场景
      //WORKAROUND: cocos framework会重设canvas的div，所以在GKWebConnectorLayerV1中调用run
      //cc.game.run();
    } else {
      this.mInterface.onError(GK_ResultCode.WRONG_PARAMETER, "gameStart 未生成mSocketManager");
    }
  },

  /**
   * 开始运行
   */
  run: function() {
    this.mInterface.run();
  }
});