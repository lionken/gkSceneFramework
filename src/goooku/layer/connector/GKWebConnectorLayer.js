var GK_WebConnectorLayer = cc.Layer.extend({
    //***********变量*************
    mWidth: null,
    mHeight: null,
    mXOffset: null,
    mYOffset: null,
    //**************公有函数***********
    /**
     * 构造函数
     * @param aWidth 屏幕宽度
     * @param aHeight 屏幕高度
     */
    ctor: function(aWidth, aHeight, aXOffset, aYOffset) {
        this._super();

        this.mWidth = aWidth;
        this.mHeight = aHeight;
        this.mXOffset = aXOffset;
        this.mYOffset = aYOffset;
    },

    /**
     * 创建连接界面
     */
    createLayer: function(aTitle, aWaitDuration, aRoomGroup) {

    },

    /**
     * 显示连接界面
     * @param aCallback 回调函数，标明倒计时结束
     */
    showLayer: function(aCallback) {
    },

    /**
     * 删除连接界面
     */
    deleteLayer: function() {
    },

    /**
     * 用户加入进来
     * @param aUserIdx
     * @param aAvatarUrl
     * @param aSex
     */
    addUser: function(aUserIdx, aAvatarUrl, aSex) {
    },

    removeUser: function(aUserIdx) {
    }
});