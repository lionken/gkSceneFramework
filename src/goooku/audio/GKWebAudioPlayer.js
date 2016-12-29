var GK_WebAudioPlayer = GK_AudioPlayer.extend({
    //***********变量*************
    mEffects: {},
    mDefaultVolume: 100,
    mDefaultLoop: true,

    //**************公有函数***********

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
            aVolume = this.mDefaultLoop;
        }

        if(aLoop == undefined) {
            aLoop = this.mDefaultLoop;
        }

        cc.audioEngine.playMusic(aName, aLoop);
        cc.audioEngine.setMusicVolume(aVolume / 100);
    },

    /**
     * 停止播放背景音乐
     */
    stopMusic: function() {
        cc.audioEngine.stopMusic(true); //释放声音数据
    },

    /**
     * 修改当前背景音乐的音量
     * @param aVolume 音量大小（0 - 100）
     */
    changMusicVolume: function(aVolume) {
        if(aVolume == undefined) {
            return;
        }

        cc.audioEngine.setMusicVolume(aVolume / 100);
    },

    /**
     * 初始化全部的音效
     * @param aNames 背景音乐的资源名数组(如: ["res/e1.mp3", "res/e2.mp3", ...]
     */
    initEffect: function(aNames) {
        if(!aNames && !aNames.length || aNames.length <= 0) {
            return;
        }

        for(var i = 0; i < aNames.length; i++) {
            this.mEffects[aNames[i]] = true;
        }
    },

    /**
     * 开始播放音效
     * @param aName 音效资源名
     * @param aVolume 音效音量
     * @param aBgVolume 背景音量大小
     */
    playEffect: function(aName, aVolume, aBgVolume) {
        if(!aName || !this.mEffects[aName]) {
            return;
        }

        if(aVolume == undefined) {
            aVolume = this.mDefaultVolume;
        }

        if(aBgVolume == undefined) {
            aBgVolume = this.mDefaultVolume;
        }


        var audioId = cc.audioEngine.playEffect(aName, false);
        cc.audioEngine.setEffectsVolume(aVolume / 100);
        cc.audioEngine.setMusicVolume(aBgVolume / 100);

        this.mEffects[aName] = audioId;
    },

    /**
     * 停止播放音效
     * @param aName 音效资源名
     */
    stopEffect: function(aName) {
        if(!aName || !this.mEffects[aName] || typeof this.mEffects[aName] != "number" ) {
            return;
        }

        cc.audioEngine.stopEffect(this.mEffects[aName]);
    },

    /**
     * 停止全部音效
     */
    stopAllEffects: function() {
        cc.audioEngine.stopAllEffects();
    }
});