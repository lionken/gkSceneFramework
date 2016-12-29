GK_UserManager = cc.Class.extend({
    //***********变量*************
    TAG: "GK_UserManager",

    mUsers: null,
    mUserCount: 0,

    mTeamId: 0,
    mTeams: null,
    mTeamCount: 0,

    mGrouperFactory: null,
    mFinalGrouped: false,

    mRankerFactory: null,
    mRtRanker: null,
    mFnRanker: null,
    mFinalRanked: false,


    //**************公有函数***********
    /**
     * 构造函数
     */
    ctor: function() {
    },

    /**
     * 当处于debug模式时，打印log
     * @param aMsg log信息
     * @param force 强制打印log
     */
    log: function(aMsg, force) {
        if(force || GK.debug) {
            console.log("[" + this.TAG + "] " + aMsg);
        }
    },


    //**********************用户相关**********************
    /**
     * 创建用户
     * @return {GK_User}
     */
    createUser: function(aIdx, aUid, aNickname, aSex) {
        if(!aIdx || !aUid || !aNickname || !aSex) {
            this.log("createUser User(" + aIdx + ", " + aUid + ", " + aNickname + ", " + aSex + ") wrong params");
            return null;
        }

        var user = new GK_User(aIdx, aNickname, aUid, aSex);

        if(!this.mUsers) {
            this.mUsers = new Array();
        }

        this.mUsers[aIdx] = user;

        this.mUserCount++;

        this.log("createUser User(" + aIdx + ", " + aNickname + ", " + aUid + ", " + aSex + ")");

        return user;
    },

    /**
     * 删除用户
     * @param aUser 用户对象
     */
    removeUser: function(aUser) {
        if(!aUser || !this.mUsers[aUser.getIdx()]) {
            this.log("removeUser can not find user");
            return;
        }

        aUser.removeFromTeam();
        this.mUsers[aUser.getIdx()] = undefined;

        this.mUserCount--;

        this.log("removeUser User(" + aUser.getIdx() + ")");
    },

    /**
     * 删除用户通过用户的Index
     * @param aUserIdx 用户的Index
     */
    removeUserByIdx: function(aUserIdx) {
        if(aUserIdx == undefined || !this.mUsers[aUserIdx]) {
            this.log("removeUserByIdx can not find user by aUserIdx(" + aUserIdx + ")");
            return;
        }

        this.mUsers[aUserIdx].removeFromTeam();
        this.mUsers[aUserIdx] = undefined;

        this.mUserCount--;

        this.log("removeUser User(" + aUserIdx + ")");
    },

    /**
     * 通过用户idx获取用户
     * @param aUserIdx 用户的Index
     * @return {GK_User}
     */
    getUserByIdx: function(aUserIdx) {
        if(aUserIdx == undefined || !this.mUsers[aUserIdx]) {
            this.log("getUserByIdx can not find user by aUserIdx(" + aUserIdx + ")");
            return null;
        }

        this.log("getUserByIdx aUserIdx(" + aUserIdx + ")");

        return this.mUsers[aUserIdx];
    },

    /**
     * 通过用户uid获取用户
     * @param aUid
     * @return {GK_User}
     */
    getUserByUid: function(aUid) {
        if(aUid == undefined) {
            this.log("getUserByUid no aUid");
            return null;
        }

        var user = null;
        for(var idx in this.mUsers) {
            if(this.mUsers[idx] && this.mUsers[idx].getUid() == aUid) {
                user = this.mUsers[idx];
            }
        }

        this.log("getUserByUid user(" + user + ")");

        return user;
    },

    /**
     * 为某用户添加分数
     * @param aUserIdx 用户的Index
     * @param aScore 用户的分数
     */
    addScore: function(aUserIdx, aScore) {
        if(aUserIdx == undefined || !this.mUsers[aUserIdx]) {
            this.log("addScore can not find user by aUserIdx(" + aUserIdx + ")");
            return;
        }

        this.mUsers[aUserIdx].addScore(aScore);

        this.log("addScore (" + aUserIdx + ", " + aScore + ")");
    },

    /**
     * 为某用户减少分数
     * @param aUserIdx 用户的Index
     * @param aScore 用户的分数
     */
    reduceScore: function(aUserIdx, aScore) {
        if(aUserIdx == undefined || !this.mUsers[aUserIdx]) {
            this.log("reduceScore can not find user by aUserIdx(" + aUserIdx + ")");
            return;
        }

        this.mUsers[aUserIdx].reduceScore(aScore);

        this.log("reduceScore (" + aUserIdx + ", " + aScore + ")");
    },

    /**
     * 获取用户数量
     * @return {Number}
     */
    getUserCount: function() {
        this.log("getUserCount count(" + this.mUserCount + ")");

        return this.mUserCount;
    },

    /**
     * 获取全部用户
     * @return {Array}
     */
    getUsers: function() {
        this.log("getUsers");

        return this.mUsers;
    },


    //**********************组相关**********************
    /**
     * 创建组
     * @param aName 组名
     * @return {GK_Team}
     */
    createTeam: function(aName) {
        if(!aName) {
            aName = this.mTeamId.toString();
        }

        var team = new GK_Team(this.mTeamId, aName);

        if(!this.mTeams) {
            this.mTeams = new Array();
        }

        this.mTeams[this.mTeamId] = team;

        this.log("createTeam team(" + this.mTeamId + ", " + aName + ")");

        this.mTeamId++;
        this.mTeamCount++;

        return team;
    },

    /**
     * 移除组
     * @param aTeam 组对象
     */
    removeTeam: function(aTeam) {
        if(!aTeam || !this.mTeams[aTeam.getId()]) {
            this.log("removeTeam aTeam(" + aTeam + ") can not find team");
            return;
        }

        aTeam.separateTeam();
        this.mTeams[aTeam.getId()] = undefined;

        this.mTeamCount--;

        this.log("removeTeam team(" + aTeam.getId() + ")");
    },

    /**
     * 移除组
     * @param aTeamId 组id
     */
    removeTeamById: function(aTeamId) {
        if(aTeamId == undefined || !this.mTeams[aTeamId]) {
            this.log("removeTeamById aTeamId(" + aTeamId + ") can not find team");
            return;
        }

        this.mTeams[aTeamId].separateTeam();
        this.mTeams[aTeamId] = undefined;

        this.mTeamCount--;

        this.log("removeTeam team(" + aTeamId + ")");
    },

    /**
     * 获取组通过组Id
     * @param aTeamId 组id
     */
    getTeamById: function(aTeamId) {
        if(aTeamId == undefined || !this.mTeams[aTeamId]) {
            this.log("getTeamById aTeamId(" + aTeamId + ") can not find team");
            return null;
        }

        return this.mTeams[aTeamId];
    },

    /**
     * 获取组数量
     * @return {Number}
     */
    getTeamCount: function() {
        this.log("getTeamCount count(" + this.mTeamCount + ")");

        return this.mTeamCount;
    },

    /**
     * 获取全部组
     * @returns {Array}
     */
    getTeams: function() {
        this.log("getTeams");

        return this.mTeams;
    },


    //**********************分组相关**********************
    /**
     * 给用户分组
     * @param aType 分组器类型，在GK_GroupFactory中定义
     * @param aTeamCount 租的数量，可以为空
     * @return {Array} 返回TeamId的数组
     */
    groupUser: function(aType, aTeamCount) {
        if(!this.mGrouperFactory) {
            this.mGrouperFactory = new GK_GrouperFactory();
        }

        var grouper = this.mGrouperFactory.createGrouper(aType);

        if(grouper) {
            this.log("groupUser Group user by " + grouper.getGroupName() + " aTeamCount(" + aTeamCount + ")");

            if(aTeamCount == undefined || aTeamCount < 0) {
                aTeamCount = 0;
            }

            return grouper.groupUser(aTeamCount, this);
        }

        this.log("can not find Grouper by Type(" + aType + ")");
        return null;
    },

    /**
     * 利用自定义分组器给用户分组
     * @param aGrouper
     */
    groupUserByCustomGrouper: function(aGrouper) {
        if(!aGrouper) {
            this.log("groupUserByCustomGrouper can not find Grouper");
            return;
        }

        this.log("groupUserByCustomGrouper groupUser");

        return aGrouper.groupUser(this);
    },

    /**
     * 获取用户分组情况
     * @return {Object} {uid: teamId, uid: teamId, ...}
     */
    getUserGroupInfo: function() {
        var groupInfo = null;
        if(this.getTeams() && this.getTeamCount() > 0 && this.getUsers() && this.getUserCount() > 0) {
            for(var uIdx in this.getUsers()) {
                if(!uIdx){
                    continue;
                }
                if(!groupInfo) {
                    groupInfo = {};
                }

                groupInfo[uIdx] = this.getUserByIdx(uIdx).getTeam().getId();
            }
        }

        return groupInfo;
    },

    //**********************排行相关**********************
    /**
     * 获取实时排名器
     * @returns {GK_Ranker}
     */
    getRealTimeRanker: function() {
        if(!this.mRankerFactory) {
            this.mRankerFactory = new GK_RankerFactory();
        }

        //使用TOP_K排序器做实时排名
        if(!this.mRtRanker) {
            this.mRtRanker = this.mRankerFactory.create(GK_RANKER_TYPE.GK_RANKER_TOP_K);
        }

        return this.mRtRanker;
    },

    /**
     * 获取最终排名器
     * @returns {GK_Ranker}
     */
    getFinalRanker: function() {
        if(!this.mRankerFactory) {
            this.mRankerFactory = new GK_RankerFactory();
        }

        //使用Final排序器做实时排名
        if(!this.mFnRanker) {
            this.mFnRanker = this.mRankerFactory.create(GK_RANKER_TYPE.GK_RANKER_FINAL);
        }

        return this.mFnRanker;
    },

    /**
     * 开始实时排名，显示组
     * @param aTopK 前几名
     * @return {Array} 返回组id的数组
     */
    rankTeamRealTime: function(aTopK) {
        if(!this.getTeams() || this.getTeamCount() <= 0 || aTopK <= 0) {
            this.log("rankTeamRealTime no team or aTopK(" + aTopK + ") wrong");
            return null;
        }

        var ranker = this.getRealTimeRanker();

        this.log("rankTeamRealTime rankTeams aTopK(" + aTopK + ")");

        return ranker.rankTeams(this.getTeams(), aTopK);
    },

    /**
     * 开始实时排名，显示用户
     * @param aTopK 前几名
     * @return {Array} 返回用户idx的数组
     */
    rankUserRealTime: function(aTopK) {
        if(!this.getUsers() || this.getUserCount() <= 0 || aTopK <= 0) {
            this.log("rankUserRealTime no user or aTopK(" + aTopK + ") wrong");
            return [];
        }

        var ranker = this.getRealTimeRanker();

        this.log("rankUserRealTime rankUsers aTopK(" + aTopK + ")");

        var topK = this.getUserCount() <= aTopK ? this.getUserCount() : aTopK;

        return ranker.rankUsers(this.getUsers(), topK);
    },

    /**
     * 用户在组中的排名
     * @param aTeamId 组id
     * @param aTopK 前几名
     * @return {Array} 返回用户idx的数组
     */
    rankUserInTeam: function(aTeamId, aTopK) {
        var team = this.getTeamById(aTeamId);

        if(!team || team.getUserCount() <= 0 || aTopK <= 0) {
            this.log("rankUserInTeam no team/user or aTopK(" + aTopK + ") wrong");
            return null;
        }

        var ranker = this.getRealTimeRanker();

        this.log("rankUserInTeam team rank aTopK(" + aTopK + ")");

        return team.rank(ranker, aTopK);
    },

    /**
     * 最终排名确认，确认后用户输入将不再接收
     */
    finalRanked: function() {
        if(this.mFinalRanked) {
            this.log("finalRanked has already final ranked");
            return;
        }

        this.log("finalRanked make user score fix");
        for(var idx in this.mUsers) {
            if(this.mUsers[idx]) {
                this.mUsers[idx].finalRanked();
            }
        }
    },

    /**
     * 组最终排名
     * @return {Array} 返回组id的数组
     */
    rankTeamFinal: function() {
        if(!this.getTeams() || this.getTeamCount() <= 0) {
            this.log("rankTeamFinal no team");
            return null;
        }

        var ranker = this.getFinalRanker();

        this.finalRanked();

        this.log("rankTeamFinal");

        return ranker.rankTeams(this.getTeams(), 0); //第二个参数无用
    },

    /**
     * 用户最终排名
     * @return {Array} 返回用户idx的数组
     */
    rankUserFinal: function() {
        if(!this.getUsers() || this.getUserCount() <= 0) {
            this.log("rankUserFinal no user");
            return null;
        }

        var ranker = this.getFinalRanker();

        this.finalRanked();

        this.log("rankUserFinal");

        return ranker.rankUsers(this.getUsers(), 0); //第二个参数无用
    },

    /**
     * 根据用户组的排名结果，给用户排名
     * @param aTeamIds 组id的数组，必须已经排好序，可以不存在
     * @return {Array} 返回用户idx的数组
     */
    rankUserByTeamFinal: function(aTeamIds) {
        if(!aTeamIds) {
            aTeamIds = this.rankTeamFinal();
        }

        var ranker = this.getFinalRanker();

        this.finalRanked();

        if(aTeamIds && aTeamIds.length > 0) { //有组

            var idxArray = [];
            for(var i = 0; i < aTeamIds.length; i++) {
                var rankResult = this.getTeamById(aTeamIds[i]).rank(ranker, 0); //第二个参数无用

                if(rankResult && rankResult.length > 0) {
                    idxArray = idxArray.concat(rankResult);
                }
            }

            this.log("rankUserByTeamFinal has team idxArray.length(" + idxArray.length + ")");

            if(idxArray.length <= 0) {
                idxArray = null;
            } else {  //TODO: 该部分应该与ranker合并，临时解决方案，正式时应该删除
                for(var i = 0; i < idxArray.length; i++) {
                    var user = this.getUserByIdx(idxArray[i]);
                    user.setRank(i+1);
                }
            }

            return idxArray;
        } else { //无组，直接对用户排序
            this.log("rankUserByTeamFinal no team");

            return ranker.rankUsers(this.getUsers(), 0); //第二个参数无用
        }
    },

    //**********************设置互动结果**********************
    /**
     * 设置组的输赢
     * @param aTeamIds 组id的数组
     * @param aWin 赢(1) 输(0)
     */
    setTeamResult: function(aTeamIds, aWin) {
        if(!aTeamIds || aTeamIds.length <= 0) {
            this.log("setTeamResult no team ids", true);
            return;
        }

        this.log("setTeamResult aWin(" + aWin + ")");

        for(var i = 0; i < aTeamIds.length; i++) {
            this.getTeamById(aTeamIds[i]).setTeamResult(aWin);
        }
    },
    /**
     * 设置全部玩家的输赢
     * @param aWin 赢(1) 输(0)
     */
    setAllUsersWin: function(aWin) {
        for(var idx in this.mUsers) {
            if(!this.mUsers[idx]){
                continue;
            }
            var user = this.mUsers[idx];
            user.setWin(1);
        }
    },
    /**
     * 生成最终的结果
     * @param aUserIdxArray 已排好序的用户idx数组
     * @return {Object} 用户结果
     */
    generateGameResult: function(aUserIdxArray) {
        if(!aUserIdxArray || aUserIdxArray.length <= 0) {
            this.log("generateGameResult no aUserIdxArray", true);
            return null;
        }

        var result = [];
        for(var i = 0; i < aUserIdxArray.length; i++) {
            var user = this.getUserByIdx(aUserIdxArray[i]);

            if(user.getRank() != i + 1) {
                this.log("generateGameResult aUserIdxArray is not ordered", true);
                result = [];
                break;
            }

            if(user && user.getResult()) {
                result.push(user.getResult())
            }
        }

        if(result.length <= 0) {
            return null;
        }

        return result;
    }
});