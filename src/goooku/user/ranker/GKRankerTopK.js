var GK_RankerTopK = GK_Ranker.extend({
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

        this.selectK(users, 0, users.length - 1, aTopK, "mScore");
        this.qSort(users, 0, aTopK - 1, "mScore");

        var userIdxArr = [];
        for(var j = 0; j < aTopK; j++) {
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

        this.selectK(teams, 0, teams.length - 1, aTopK, "mTotalScore");
        this.qSort(teams, 0, aTopK - 1, "mTotalScore");

        var teamIdxArr = [];
        for(var j = 0; j < aTopK; j++) {
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

    partition: function(a, l, r, key) {
        var t = a[l];
        var pivokey = a[l];
        while(l < r) {
            while(l < r && a[r][key] < pivokey[key]) {
                --r;
            }
            a[l] = a[r];
            while(l < r && a[l][key] >= pivokey[key]) {
                ++l;
            }
            a[r] = a[l];
        }
        a[l] = t;
        return l;
    },

    selectK: function(a, start, end, k, key) {
        var index = 0;
        if(start < end) {
            index = this.partition(a, start, end, key);
            if(index == k) {  //第K大的数
                index = k;
            } else if(index < k) { //还要从index的右边找k-index个数
                index = this.selectK(a, index + 1, end, k - index, key);
            } else if(index > k) {  //k个数都在Index的左边
                index = this.selectK(a, start, index - 1, k, key);
            }
        }
        return index;
    },

    //快速排序
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