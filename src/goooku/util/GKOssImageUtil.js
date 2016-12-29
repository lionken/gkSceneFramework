var GK_OSSImageUtil = cc.Class.extend({
    //**************公有函数***********
    /**
     * 构造函数
     */
    ctor: function() {
    },

    /**
     * 修改OSS图片大小
     * @param aImageUrl 图片原地址URL
     * @param aWidth 宽
     * @param aHeight 高
     * @param {String} 经修改后的图片地址URL
     */
    resize: function(aImageUrl, aWidth, aHeight) {
        if(!aImageUrl || !aWidth || !aHeight) {
            return null;
        }

        return aImageUrl.replace("oss-", "img-") + '@' + aWidth + "w_" + aHeight + "h" + "_1e"; //短边优先
    }
});

