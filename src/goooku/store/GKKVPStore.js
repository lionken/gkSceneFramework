var GK_KVPStore =  cc.Class.extend({
    //***********变量*************
    mStore: null,
    mWatchers: null,

    //**************公有函数***********
    /**
     * 构造函数
     */
    ctor: function() {
        this.mStore = {};
        this.mWatchers = {};
    },

    /**
     * 将KVP放入存储中
     * @params aKey 键
     * @params aValue 值
     */
    put: function(aKey, aValue) {
        this.mStore[aKey] = aValue;

        if(this.mWatchers[aKey] && this.mWatchers[aKey].length > 0) {
            for(var i = 0; i < this.mWatchers[aKey].length; i++) {
                var cbFun =  this.mWatchers[aKey][i].onData;
                if(cbFun && typeof cbFun == "function") {
                    cbFun.call(this.mWatchers[aKey][i], aKey, aValue);
                }
            }
        }
    },

    /**
     * 获取键值
     * @param aKey 键
     * @return {Object} 值
     */
    get: function(aKey) {
        if(this.mStore[aKey] != undefined) {
            return this.mStore[aKey];
        }

        return null;
    },

    /**
     * 删除指定Key的数据
     * @param aKey 键
     */
    del: function(aKey) {
        if(this.mStore[aKey] != undefined) {
            delete this.mStore[aKey];
        }

        if(this.mWatchers[aKey] && this.mWatchers[aKey].length > 0) {
            for(var i = 0; i < this.mWatchers[aKey].length; i++) {
                var cbFun =  this.mWatchers[aKey][i].delData;
                if(cbFun && typeof cbFun == "function") {
                    cbFun.call(this.mWatchers[aKey][i], aKey);
                }
            }
        }
    },

    /**
     * 观察该键值的变化情况
     * @param aKey 键
     * @param aView 层
     */
    setWatcher: function(aKey, aView) {
        if(this.mWatchers[aKey] == undefined) {
            this.mWatchers[aKey] = [];
        }

        this.mWatchers[aKey].push(aView);
    },

    /**
     * 销毁存储
     */
    destroy: function() {
        this.mStore = null;
    }
});