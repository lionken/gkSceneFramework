var GK_GameDataSender = cc.Class.extend({
    //***********变量*************
    mSocketManager: null,

    //**************公有函数***********
    /**
     * 构造函数
     * @param aSocketManager socket管理器
     */
    ctor: function(aSocketManager) {
        if(!aSocketManager) {
            throw "GK_GameSender构造函数参数不正确";
        }

        this.mSocketManager = aSocketManager;
    },

    /**
     * 大屏发送数据给全部手机
     * @param aData 数据，JSON格式
     */
    sendGameData: function(aData) {
        this.mSocketManager.sendGameData(aData);
    },

    /**
     * 发送游戏结果
     * @param aResultData 游戏结果数据
     */
    sendGameResult: function(aResultData) {
        this.mSocketManager.sendGameResult(aResultData);
    },

    /**
     * 发送活动结果
     */
    sendActivityResult: function(aResultData) {
        this.mSocketManager.sendActivityResult(aResultData);
    }});