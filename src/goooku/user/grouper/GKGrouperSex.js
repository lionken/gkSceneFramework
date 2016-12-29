var GK_GrouperSex = GK_Grouper.extend({
    //**************公有函数***********
    /**
     * 将按性别分配到不同组中去
     * @param aTeamCount 组数（0为自动，大于0为指定）
     * @param aUserManager 用户管理
     * @return {Array} 返回TeamId的数组
     */
    groupUser: function(aTeamCount, aUserManager) {
        if(!aUserManager || !aUserManager.getUsers() || aUserManager.getUserCount() <= 0) {
            this.log("can not group users", true);
            return null;
        }

        var teamIdArray = [];

        var manTeam = aUserManager.createTeam("man");
        teamIdArray.push(manTeam.getId());

        var womanTeam = aUserManager.createTeam("womanTeam");
        teamIdArray.push(womanTeam.getId());

        for(var idx in aUserManager.getUsers()) {
            var user = (aUserManager.getUsers())[idx];

            if(user.getSex() == "2") {
                womanTeam.addUser(user);
            } else { //性别未设置也填如男组
                manTeam.addUser(user);
            }
        }

        return teamIdArray;
    }
});