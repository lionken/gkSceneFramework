var GK_RedirectUtil = cc.Class.extend({
    //**************公有函数***********
    /**
     * 构造函数
     */
    ctor: function() {
    },

    /**
     * 重定向网页到指定位置
     * @param aUrl 重定向地址
     */
    redirect: function(aUrl) {
        if(aUrl) {
            window.location.href = aUrl;
        }
    }
});