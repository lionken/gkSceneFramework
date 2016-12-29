var GK_Ranker = cc.Class.extend({
    //***********变量*************
    mRankerName: null,

    //**************公有函数***********
    /**
     * 构造函数
     * @param aRankerName 分组器名称
     */
    ctor: function(aRankerName) {
        this.mRankerName = aRankerName;
    },

    /**
     * 当处于debug模式时，打印log
     * @param aMsg log信息
     * @param force 强制打印log
     */
    log: function(aMsg, force) {
        if(force || GK.debug) {
            console.log(aMsg);
        }
    },

    /**
     * 获取排名器名称名称
     * @return {String}
     */
    getRankerName: function() {
        return this.mRankerName;
    },

    /**
     * 接口，给用户排序，子类需要实现该接口
     * @param aUsers 用户
     * @param aTopK 前几名
     * @return {Array} 返回用户idx的数组
     */
    rankUsers: function(aUsers, aTopK) {
    },

    /**
     * 接口，给组排序，子类需要实现该接口
     * @param aTeams 组
     * @param aTopK 前几名
     * @return {Array} 返回组id的数组
     */
    rankTeams: function(aTeams, aTopK) {
    },

    /**
     * 接口，指定组中排名前K个的用户
     * @param aUsers 用户数组
     * @param aTopK 前几个用户
     * @return {Array} 返回用户idx的数组
     */
    rankUsersInTeam: function(aUsers, aTopK) {
    }
});