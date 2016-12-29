var GK_MainLayer = cc.Layer.extend({
    /**
     * 构造函数
     */
    ctor: function() {
        this._super();
    },

    /**
     * 获取MainNode
     * @return  {cc.Layer}
     */
    getMainNode: function() {
        throw "未找到MainNode";
    },

    /**
     * 观察该键值的变化
     * @params aKey 键
     */
    watch: function(aKey) {
        if(aKey && GK.KVPStore) {
            GK.KVPStore.setWatcher(aKey, this);
        }
    },

    /**
     * 观察的键值发生变化
     * @params aKey 键
     * @params aValue 值
     */
    onData: function(aKey, aValue) {
    },

    /**
     * 观察的键值被清除
     * @params aKey 键
     */
    delData: function(aKey) {
    }
});