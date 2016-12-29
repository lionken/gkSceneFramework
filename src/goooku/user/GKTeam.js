var GK_Team = cc.Class.extend({
    //***********变量*************
    mId: null,
    mName: null,
    mUserIdxArray: null,
    mUserCount: 0,
    mTotalScore: 0,

    //**************公有函数***********
    /**
     * 构造函数
     * @param aId 组id
     * @param aName 组名
     */
    ctor: function(aId, aName) {
        this.mId = aId;
        this.mName = aName;
    },

    /**
     * 获取组id
     * @return {Number}
     */
    getId: function() {
        return this.mId;
    },

    /**
     * 获取组名
     * @return {String}
     */
    getName: function() {
        return this.mName;
    },

    /**
     * 为组添加用户
     * @param aUser 用户对象
     */
    addUser: function(aUser) {
        if(!aUser) {
            return;
        }

        if(!this.mUserIdxArray) {
            this.mUserIdxArray = [];
        }

        if(aUser.setTeam(this)) {
            this.mUserIdxArray[aUser.getIdx()] = aUser;
            this.mUserCount++;
        }
    },

    /**
     * 从组中删除用户
     * @param aUser 用户对象
     */
    removeUser: function(aUser) {
        if(!aUser) {
            return;
        }

        if(this.mUserIdxArray[aUser.getIdx()]) {
            aUser.clearTeam();
            this.mUserIdxArray[aUser.getIdx()] = undefined;
            this.mUserCount--;
        }
    },

    /**
     * 从组中删除用户
     * @param aUserIdx 用户index
     */
    removeUserByIdx: function(aUserIdx) {
        if(aUserIdx == undefined || !this.mUserIdxArray[aUserIdx]) {
            return;
        }

        if(this.mUserIdxArray[aUserIdx]) {
            this.mUserIdxArray[aUserIdx].clearTeam();
            this.mUserIdxArray[aUserIdx] = undefined;
            this.mUserCount--;
        }
    },

    /**
     * 该用户是是否在该组内
     * @param aUser 用户对象
     * @return {Boolean}
     */
    isUserIn: function(aUser) {
        if(this.mUserIdxArray[aUser.getIdx()]) {
            return true;
        }

        return false;
    },

    /**
     * 该用户是是否在该组内
     * @param aIdx 用户index
     * @return {Boolean}
     */
    isUserInByIdx: function(aIdx) {
        if(this.mUserIdxArray[aIdx]) {
            return true;
        }

        return false;
    },

    /**
     * 全组所有用户总分数
     * @return {Number}
     */
    getScore: function() {
        return this.mTotalScore;
    },

    /**
     * 获取组内用户数量
     * @return {Number}
     */
    getUserCount: function() {
        return this.mUserCount;
    },

    /**
     * 添加分数
     * @param aScore 分数
     */
    addScore: function(aScore) {
        this.mTotalScore += aScore;
    },

    /**
     * 减少分数
     * @param aScore 分数
     */
    reduceScore: function(aScore) {
        this.mTotalScore -= aScore;
    },

    /**
     * 解散组
     */
    separateTeam: function() {
        for(var idx in this.mUserIdxArray) {
            this.mUserIdxArray[idx].clearTeam();
        }
        this.mUserCount = 0;
        this.mUserIdxArray = null;
        this.mTotalScore = 0;
    },

    /**
     * 组胜利
     * @param aWin 赢(1) 输(0)
     */
    setTeamResult: function(aWin) {
        for(var idx in this.mUserIdxArray) {
            this.mUserIdxArray[idx].setWin(aWin);
        }
    },

    /**
     * 组中用户排名
     * @param aRanker
     * @param aTopK 前几名
     * @return {Array} 返回用户idx的数组
     */
    rank: function(aRanker, aTopK) {
        if(!aRanker || this.mUserCount == 0) {
            return null;
        }

        return aRanker.rankUsersInTeam(this.mUserIdxArray, aTopK);
    }
});