var GK_Grouper = cc.Class.extend({
    //***********变量*************
    mUserManager: null,
    mGrouperName: null,

    //**************公有函数***********
    /**
     * 构造函数
     * @param aGrouperName 分组器名称
     */
    ctor: function(aGrouperName) {
        this.mGrouperName = aGrouperName;
    },

    /**
     * 当处于debug模式时，打印log
     * @param aMsg log信息
     * @param aForce 强制打印log
     */
    log: function(aMsg, aForce) {
        if(aForce || GK.debug) {
            console.log(aMsg);
        }
    },

    /**
     * 获取分组器名称
     * @return {String}
     */
    getGroupName: function() {
        return this.mGrouperName;
    },

    /**
     * 接口，给用户分组，子类需要实现该接口
     * @param aTeamCount 组数（0为自动，大于0为指定）
     * @param aUserManager 用户管理
     * @return {Array} 返回TeamId的数组
     */
    groupUser: function(aTeamCount, aUserManager) {
    }
});
