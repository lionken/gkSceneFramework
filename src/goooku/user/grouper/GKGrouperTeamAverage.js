var GK_GrouperTeamAverage = GK_Grouper.extend({
    //***********变量*************
    mAutoTeamCount: 2,

    //**************公有函数***********
    /**
     * 将用户平均分配到各个组中
     * @param aTeamCount 组数（0为自动，大于0为指定）
     * @param aUserManager 用户管理
     * @return {Array} 返回TeamId的数组
     */
    groupUser: function(aTeamCount, aUserManager) {
        if(!aUserManager || !aUserManager.getUsers() || aUserManager.getUserCount() <= 0) {
            this.log("can not group users", true);
            return null;
        }

        //是否为自动分组
        aTeamCount = aTeamCount == 0 ? this.mAutoTeamCount : aTeamCount;

        var teamIdArray = [];
        for(var i = 0; i < aTeamCount; i++) {
            var team = aUserManager.createTeam();
            teamIdArray.push(team.getId());
        }

        var j = 0;
        for(var idx in aUserManager.getUsers()) {
            var user = (aUserManager.getUsers())[idx];
            aUserManager.getTeamById(teamIdArray[j]).addUser(user);

            j++;
            j = j % teamIdArray.length;
        }

        return teamIdArray;
    }
});