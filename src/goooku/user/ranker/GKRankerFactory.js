var GK_RANKER_TYPE = {
    GK_RANKER_FINAL: 1,
    GK_RANKER_TOP_K: 2
    /***在此处扩展***/
};

var GK_RankerFactory = cc.Class.extend({
    //**************公有函数***********
    /**
     * 构造函数
     */
    ctor: function() {
    },

    /**
     * 创建分组器
     * @param aType 分组器类型
     * @returns {GK_RANKER}
     */
    create: function(aType) {
        var ranker = null;

        switch(aType) {
            case GK_RANKER_TYPE.GK_RANKER_FINAL:
                ranker = new GK_RankerFinal("FinalRanker");
                break;
            case GK_RANKER_TYPE.GK_RANKER_TOP_K:
                ranker = new GK_RankerTopK("TopKRanker");
                break;
            default:
                ranker = null;
        }

        return ranker;
    }
});
