var GameSocketCallback = cc.Class.extend({
    //***********变量*****************
    //TODO：添加变量

    //**************公有函数***********
    /**
     * 构造函数
     */
    ctor: function() {
        //TODO：添加成员变量的初始化

    },

    /**
     * 用户连接成功回调
     * @param aUid 用户id
     * @param aUserIdx 用户index
     * @param aNickname 昵称
     * @param aUserIcon 用户
     * @param aSex 用户性别（1男2女）
     */
    onUserJoin: function(aUid, aUserIdx, aNickname, aUserIcon, aSex) {
        //TODO：处理用户连接逻辑
        GK.UserManager.createUser(aUserIdx, aUid, aNickname, aSex);

    },

    /**
     * 用户离开
     * @param aUserIdx 用户index
     */
    onUserLeft: function(aUserIdx) {
        //TODO：处理用户离开逻辑
        GK.UserManager.removeUserByIdx(aUserIdx);
    },

    /**
     * 游戏开始
     */
    onGameStart: function() {
        //TODO: 游戏开始

    },

    /**
     * 用户传递来的数据
     * @param aUserIdx 用户index
     * @param aData 用户处理
     */
    onUserData: function(aUserIdx, aData) {
        //TODO：处理用户数据
        switch(aData.id) {
            case GK.const.SOCKET_ID.COUNT_PLUS:
                if (GK.MainLayer.step > 0) {
                    GK.UserManager.addScore(aUserIdx, 1);
                    GK.MainLayer.showDlg(aUserIdx,aData.targetIndex)
                }
                break;
            default:
                console.log("wrong data.id = " + aData.id);
        }
    },

    /**
     * 返回MVP信息
     * @param aMVPInfo MVP信息，格式如下：
     * {
     *   brandLogoUrl: String,
     *   posterUrls: Array,
     *   uid: String
     * }
     */
    onMVP: function(aMVPInfo) {
        //TODO: 处理MVP显示信息
        if(!aMVPInfo) {
            aMVPInfo = {};
        }

        var mainNode = GK.MainLayer.getMainNode();

        var mvpLayer = new GK_MvpLayerV3();
        mainNode.addChild(mvpLayer, 100);

        var mvps = [];
        var user = GK.UserManager.getUserByUid(aMVPInfo.uid);
        if(user) {
            mvps.push({
                userIcon: user.getAvatarUrl(),
                sex: user.getSex(),
                nickname: user.getNickname()
            });
        }

        mvpLayer.showMVP(mvps, aMVPInfo.brandLogoUrl, aMVPInfo.posterUrls);
    },

    /**
     * 游戏socket出错
     * @param aForceStop 是否需要强制停止
     * @param aError 用户错误信息
     */
    onError: function(aForceStop, aError) {
        //TODO：处理错误信息
        //TODO：需要一个出错页面
    }
});