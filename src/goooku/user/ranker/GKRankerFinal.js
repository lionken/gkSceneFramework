var GK_RankerFinal = GK_Ranker.extend({
    //**************公有函数***********
    ctor: function() {
    },

    /**
     * 实现，给用户排序
     * @param aUsers 用户
     * @param aTopK 前几名
     * @return {Array} 返回用户idx的数组
     */
    rankUsers: function(aUsers, aTopK) {
        var users = [];
        var k = 0;

        for(var i in aUsers) {
            if(aUsers[i]) {
                users[k++] = aUsers[i];
            }
        }

        this.qSort(users, 0, users.length - 1, "mScore");
        var userIdxArr = [];
        for(var j = 0; j < users.length; j++) {
            users[j].setRank(j + 1);
            userIdxArr.push(users[j].getIdx());
        }
        return userIdxArr;
    },

    /**
     * 实现，给组排序
     * @param aTeams 组
     * @param aTopK 前几名
     * @return {Array} 返回组id的数组
     */
    rankTeams: function(aTeams, aTopK) {
        var teams = [];
        var k = 0;

        for(var i in aTeams) {
            if(aTeams[i]) {
                teams[k++] = aTeams[i];
            }
        }

        this.qSort(teams, 0, teams.length - 1, "mTotalScore");
        var teamIdxArr = [];

        for(var j = 0; j < teams.length; j++) {
            this.rankUsers(teams[j].mUserIdxArray, 0);
            teamIdxArr.push(teams[j].getId());
        }

        return teamIdxArr;
    },

    /**
     * 实现，指定组中排名前K个的用户
     * @param aUsers 用户数组
     * @param aTopK 前几个用户
     * @return {Array} 返回用户idx的数组
     */
    rankUsersInTeam: function(aUsers, aTopK) {
        return this.rankUsers(aUsers, aTopK);
    },

    qSort: function(arr, l, r, key) {
        if(l < r) {
            var i = l;
            var j = r;
            var x = arr[l];
            while(i < j) {
                while(i < j && arr[j][key] < x[key]) {
                    j--;
                }
                if(i < j) {
                    arr[i++] = arr[j];
                }
                while(i < j && arr[i][key] >= x[key]) {
                    i++;
                }
                if(i < j) {
                    arr[j--] = arr[i];
                }
            }
            arr[i] = x;
            this.qSort(arr, l, i - 1,key);
            this.qSort(arr, i + 1, r,key);
        }
    }
});