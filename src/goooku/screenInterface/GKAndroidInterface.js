var GK_AndroidInterface = GK_ScreenInterface.extend({
    /**************公有函数***********
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
        AndroidInterface.setGameInfo(aTitle);
    },

    /**
     * 获取连接码
     * @return {String}
     */
    getVerificationCode: function() {
        return AndroidInterface.getVerificationCode();
    },

    /**
     * 获取长连接服务器的ip地址
     */
    getSocketAddress: function() {
        return AndroidInterface.getSocketAddress();
    },

    /**
     * 获取长连接服务器的端口
     */
    getSocketPort: function() {
        return AndroidInterface.getSocketPort();
    },

    /**
     * 连接后台是否成功
     */
    onCreated: function() {
        AndroidInterface.onCreated();
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
        AndroidInterface.onUserJoin(aUid, aUserIdx, aNickname, aUserAvatar, aSex);
    },

    /**
     * 用户离开
     * @param aUserIdx 用户在该场景下的index
     */
    onUserLeft: function(aUserIdx) {
        AndroidInterface.onUserLeft(aUserIdx);
    },

    /**
     * 发生错误
     * @param aErrCode 错误码
     * @param aErrMsg 错误信息
     */
    onError: function(aErrCode, aErrMsg) {
        AndroidInterface.onError(aErrCode, aErrMsg);
    },

    /**
     * 播放结束
     */
    endOfAdvertisement: function() {
        AndroidInterface.endOfAdvertisement();
    },

    /**
     * 开始运行
     */
    run: function() {
        AndroidInterface.finishLoading();
    }
});