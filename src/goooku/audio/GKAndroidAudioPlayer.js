var GK_AndroidAudioPlayer = GK_AudioPlayer.extend({
    mDefaultVolume: 100,
    mDefaultLoop: true,

    /**
     * 开始播放背景音乐
     * @param aName 背景音乐的资源名(如："res/audio.mp3")
     * @param aVolume 音量大小
     * @param aLoop 是否循环播放
     */
    playMusic: function(aName, aVolume, aLoop) {
        if(!aName) {
            return;
        }

        if(aVolume == undefined) {
            aVolume = this.mDefaultVolume;
        }

        if(aLoop == undefined) {
            aLoop = this.mDefaultLoop;
        }

        AndroidInterface.playBackgroundMusic(aName, aVolume, aLoop);
    },

    /**
     * 停止播放背景音乐
     */
    stopMusic: function() {
        AndroidInterface.stopBackgroundMusic();
    },

    /**
     * 修改当前背景音乐的音量
     * @param aVolume 音量大小（0 - 100）
     */
    changMusicVolume: function(aVolume) {
        if(aVolume == undefined) {
            return;
        }

        AndroidInterface.changeBackgroundMusicVolume(aVolume);
    },

    /**
     * 初始化全部的音效
     * @param aNames 背景音乐的资源名数组(如: ["res/e1.mp3", "res/e2.mp3", ...]
     */
    initEffect: function(aNames) {
        if(!aNames && !aNames.length || aNames.length <= 0) {
            return;
        }

        var namesString = "";
        for(var i = 0; i < aNames.length; i++) {
            if(namesString == "") {
                namesString += aNames[i];
            } else {
                namesString += "|" + aNames[i];
            }
        }

        AndroidInterface.initEffect(namesString);
    },

    /**
     * 开始播放音效
     * @param aName 音效资源名
     * @param aVolume 音效音量
     * @param aBgVolume 背景音量大小
     */
    playEffect: function(aName, aVolume, aBgVolume) {
        if(!aName) {
            return;
        }

        if(aVolume == undefined) {
            aVolume = this.mDefaultVolume;
        }

        if(aBgVolume == undefined) {
            aBgVolume = this.mDefaultVolume;
        }

        AndroidInterface.playEffect(aName, aVolume, aBgVolume);
    },

    /**
     * 停止播放音效
     * @param aName 音效资源名
     */
    stopEffect: function(aName) {
        if(!aName) {
            return;
        }

        AndroidInterface.stopEffect(aName);
    },

    /**
     * 停止全部音效
     */
    stopAllEffects: function() {
        AndroidInterface.stopAllEffects();
    }
});