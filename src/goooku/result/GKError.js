var GK_Error = cc.Class.extend({
    //***********变量*************
    mCode: null,
    mMsg: "",

    //**************公有函数***********
    /**
     * 构造函数
     */
    ctor: function(aCode, aMsg) {
        if(aCode && typeof aCode == "number") {
            this.mCode = aCode;
        }

        if(aMsg && typeof aMsg == "string") {
            this.mMsg = aMsg;
        }
    },

    /**
     * 获取错误码
     * @return {Number}
     */
    getCode: function() {
        return this.mCode;
    },

    /**
     * 获取错误信息
     * @return {String}
     */
    getMsg: function() {
        return this.mMsg;
    },

    /**
     * 错误信息格式化输出
     * @return {String}
     */
    toString: function() {
        var msg = "";

        msg += this.mCode ? "[Error " + this.mCode + "]" : "[Error UNKNOWN]";
        msg += this.mMsg != "" ? this.mMsg : "Unknown error message";

        return msg;
    }
});