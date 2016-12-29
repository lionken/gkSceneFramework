var GK_User = cc.Class.extend({
    //***********变量*************
    mIdx: null,
    mNickname: null,
    mUid: null,
    mSex: null,
    mAvatarUrl: null,
    mScore: 0,
    mRank: 0,
    mWin: 0, //默认为0
    mTeam: null,
    mRanked: false,

    //**************公有函数***********
    /**
     * 构造函数
     * @param aIdx 用户在该场景下的index
     * @param aNickname 用户的昵称
     * @param aUid 用户id
     * @param aSex 用户性别
     */
    ctor: function(aIdx, aNickname, aUid, aSex) {
        this.mIdx = aIdx;
        this.mNickname = aNickname;
        this.mUid = aUid;
        this.mSex = aSex;


        this.mAvatarUrl = "http://testqiniu.goooku.com/5" + aUid;
    },

    /**
     * 获取用户在该场景下的index
     * @return {Number}
     */
    getIdx: function() {
        return this.mIdx;
    },

    /**
     * 获取用户昵称
     * @return {String}
     */
    getNickname: function() {
        return this.mNickname;
    },

    /**
     * 获取用户唯一id
     * @return {String}
     */
    getUid: function() {
        return this.mUid;
    },

    /**
     * 获取用户的用户的头像URL
     * @return {String}
     */
    getAvatarUrl: function() {
        return this.mAvatarUrl;
    },

    /**
     * 获取用户性别
     * @return {Number}
     */
    getSex: function() {
        return this.mSex;
    },

    /**
     * 该用户得分
     * @param aScore 所得分数
     */
    addScore: function(aScore) {
        if(this.mRanked) { //已最终排名，无法在加入分数
            return;
        }

        this.mScore += aScore;

        if(this.mTeam) {
            this.mTeam.addScore(aScore);
        }
    },

    /**
     * 该用户减分
     * @param aScore 所减分数
     */
    reduceScore: function(aScore) {
        if(this.mRanked) { //已最终排名，无法在加入分数
            return;
        }

        //确保没有负分的存在
        var teamReduceScore = 0;
        if(this.mScore >= aScore) {
            this.mScore -= aScore;
            teamReduceScore = aScore;
        } else {
            this.mScore = 0;
            teamReduceScore = this.mScore;
        }

        if(this.mTeam) {
            this.mTeam.reduceScore(teamReduceScore);
        }
    },

    /**
     * 获取用户当前所得分数
     * @returns {Number}
     */
    getScore: function() {
        return this.mScore;
    },

    /**
     * 获取用户组
     * @returns {Number}
     */
    getTeam: function() {
        return this.mTeam;
    },

    /**
     * 设置用户组id
     * @param aTeam 组id
     * @returns {Boolean}
     */
    setTeam: function(aTeam) {
        if(!this.mTeam && aTeam) {
            this.mTeam = aTeam;
            return true;
        }

        return false;
    },

    /**
     * 将用户的组清空
     */
    clearTeam: function() {
        this.mTeam = null;
    },

    /**
     * 将用户从组中删除
     */
    removeFromTeam: function() {
        if(this.mTeam) {
            this.mTeam.removeUser(this);
        }
    },

    /**
     * 已进行最终排名
     */
    finalRanked: function() {
        this.mRanked = true;
    },

    /**
     * 设置用户排名
     * @param aRank 用户排名
     */
    setRank: function(aRank) {
        this.mRank = aRank;
    },

    /**
     * 获取用户排名信息
     * @returns {umber}
     */
    getRank: function() {
        return this.mRank;
    },

    /**
     * 设置用户输赢
     * @param aWin
     */
    setWin: function(aWin) {
        this.mWin = aWin;
    },

    /**
     * 获取用户输赢信息
     * @returns {Number}
     */
    getWin: function() {
        return this.mWin;
    },

    /**
     * 获取用户互动结果
     * @return {Object}
     */
    getResult: function() {
        if(this.getIdx() != null && !this.getUid() ||
            this.getWin() == undefined && this.getRank() <= 0 && this.getScore() == undefined) {
            return null;
        }

        return {
            uIdx: this.getIdx(),
            uid: this.getUid(),
            win: this.getWin(),
            rank: this.getRank(),
            score: this.getScore()
        }
    }
});
