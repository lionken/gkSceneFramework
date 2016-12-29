var GK_AudioPlayer = cc.Class.extend({
    /**
     * 开始播放背景音乐
     * @param aName 背景音乐的资源名(如："res/audio.mp3")
     * @param aVolume 音量大小
     * @param aLoop 是否循环播放
     */
    playMusic: function(aName, aVolume, aLoop) {
    },

    /**
     * 停止播放背景音乐
     */
    stopMusic: function() {
    },

    /**
     * 修改当前背景音乐的音量
     * @param aVolume 音量大小（0 - 100）
     */
    changMusicVolume: function(aVolume) {
    },

    /**
     * 初始化全部的音效
     * @param aNames 背景音乐的资源名数组(如: ["res/e1.mp3", "res/e2.mp3", ...]
     */
    initEffect: function(aNames) {
    },

    /**
     * 开始播放音效
     * @param aName 音效资源名
     * @param aVolume 音效音量
     * @param aBgVolume 背景音音量
     */
    playEffect: function(aName, aVolume, aBgVolume) {
    },

    /**
     * 停止播放音效
     * @param aName
     */
    stopEffect: function(aName) {
    },

    /**
     * 停止全部音效
     */
    stopAllEffects: function() {
    }

});