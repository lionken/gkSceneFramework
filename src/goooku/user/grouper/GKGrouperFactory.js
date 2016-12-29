var GK_GROUPER_TYPE = {
    GK_GROUPER_TEAM_AVERAGE: 1,
    GK_GROUPER_TEAM_SEX: 2,
    GK_GROUPER_COUPLE: 3
    /***在此处扩展***/
};

var GK_GrouperFactory = cc.Class.extend({
    //**************公有函数***********
    /**
     * 构造函数
     */
    ctor: function() {
    },

    /**
     * 创建分组器
     * @param aType 分组器类型
     * @returns {GK_GROUPER}
     */
    createGrouper: function(aType) {
        var grouper = null;

        switch(aType) {
            case GK_GROUPER_TYPE.GK_GROUPER_TEAM_AVERAGE:
                grouper = new GK_GrouperTeamAverage("GroupByTeamAverage");
                break;
            case GK_GROUPER_TYPE.GK_GROUPER_TEAM_SEX:
                grouper = new GK_GrouperSex("GroupBySex");
                break;
            default:
                grouper = null;
        }

        return grouper;
    }
});
