var GK_HttpRequestConfig = cc.Class.extend({
    //***********变量*************
    mRoomInfoHost: "",
    mGameInfoHost: "",

    //**************公有函数***********
    /**
     * 构造函数
     */
    ctor: function() {
        if(GK.debug) {
            this.mRoomInfoHost = "http://testr.goooku.com";
            this.mGameInfoHost = "http://actyuser.goooku.com/phone/v1";
        } else {
            this.mRoomInfoHost = "http://101.200.168.68:8080";
            this.mGameInfoHost = "http://actyuser.goooku.com/phone/v1";
        }
    },

    /**
     * 获取连接码的连接信息
     */
    requestRoomCodeInfo: function() {
        return {
            url: this.mRoomInfoHost + "/getRoomCode",
            method: "POST",
            json: true
        };
    },

    /**
     * 获取场景获奖信息
     * @params adPlanId 广告计划id
     */
    requestCouponsInfo: function(aAdPlanId) {
        if(!aAdPlanId) {
            return null;
        }

        return {
            url: this.mGameInfoHost + "/plan/cardList/" + aAdPlanId,
            method: "GET",
            json: false
        };
    },

    /**
     * 获取发送游戏开始的连接信息
     * @returns {Object}
     */
    requestGameStartInfo: function() {
        return {
            url: this.mGameInfoHost + "/box/playList",
            method: "POST",
            json: false
        };
    },

    /**
     * 获取发送活动开始的连接信息
     * @returns {Object}
     */
    requestActivityStartInfo: function() {
      return {
          url: this.mGameInfoHost + "/gameStart",
          method: "GET",
          json: false
      }
    },

    /**
     * 获取发送游戏结果的连接信息
     * @returns {Object}
     */
    requestGameResultInfo: function() {
        return {
            url: this.mGameInfoHost + "/box/coupon/screen",
            method: "POST",
            json: true
        };
    },

    /**
     * 获取发送活动结果的信息
     * @return {Object}
     */
    requestActivityResultInfo: function() {
        return {
            url: this.mGameInfoHost + "/sendGameResult",
            method: "POST",
            json: true
        }
    }
});