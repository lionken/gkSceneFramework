var GK_HttpRequest = cc.Class.extend({
    //***********变量*************
    TAG: "GK_HttpRequest",

    mHttpRequest: null,
    mHttpRequestConfig: null,
    mToken: null,
    mRoomGroup: null,


    //**************公有函数***********
    /**
     * 构造函数
     * @param aToken 向后台申请code的access_token
     * @param aRoomGroup 连接code
     */
    ctor: function(aToken, aRoomGroup) {
        this.mHttpRequest = new GK_Ajax();
        this.mHttpRequestConfig = new GK_HttpRequestConfig();

        this.mToken = aToken;
        this.mRoomGroup = aRoomGroup;
    },

    /**
     * 当处于debug模式时，打印log
     * @param aMsg log信息
     * @param aForce 强制打印log
     */
    log: function(aMsg, aForce) {
        if(aForce || GK.debug) {
            console.log("[" + this.TAG + "] " + aMsg);
        }
    },

    /**
     * 获取手机端连接码
     * @param aSceneInfo 场景信息，格式如下：
     * {
     *   type: 'url', 手机端场景类型，目前都是url
     *   url: xxx, 手机端场景网址
     *   screenId: xxx, 屏幕id
     *   advertisementPlanId: xxx, 计划id
     *   sceneId: xxx, 场景id
     *   ttl: xxx, 过期时间
     * }
     * @param aCallback 回调函数，function（err, connInfo)
     */
    getRoomCode: function(aSceneInfo, aCallback) {
        this.log("getRoomCode In");

        //TODO: 加入token获得的检查

        var requestInfo = this.mHttpRequestConfig.requestRoomCodeInfo();

        if(!requestInfo) {
            return aCallback(new GK_Error(GK_ResultCode.WRONG_PARAMETER, "未找到requestInfo"));
        }

        this.mHttpRequest.request({
            url: requestInfo.url,
            method: requestInfo.method,
            json: requestInfo.json,
            data: aSceneInfo
        }).done(function(res) {
            if(res.roomCode && res.ip && res.port) {
                aCallback(null, {
                    roomGroup: res.roomCode,
                    ip: res.ip,
                    port: res.port
                });
            } else {
                aCallback(new GK_Error(GK_ResultCode.HTTP_REQUEST_ERROR, "获取连接码返回"));
            }
        }).fail(function() {
            aCallback(new GK_Error(GK_ResultCode.HTTP_REQUEST_ERROR, "获取连接码失败"));
        });
    },

    /**
     * 获取该广告计划关联的全部卡券信息
     * @param aAdPlanId 广告计划id
     * @param aCallback function(cardList), 不存在cardList，直接开始主场景，其中cardList的定义为：
     *  card_list: [
     *    {
     *      win: xxx,
     *      rank: xxx,
     *      name: xxx,
     *      backgroundUrl: xxx
     *    },
     *    ...
     *  ]
     *
     */
    requestCouponsInfo: function(aAdPlanId, aCallback) {
        this.log("getRoomCode In aAdPlanId = " + aAdPlanId);

        if(!this.mToken) {
            //不存在token，直接开始场景
            aCallback(null);
            return;
        }

        var requestInfo = this.mHttpRequestConfig.requestCouponsInfo(aAdPlanId);

        if(!requestInfo) {
            return aCallback(new GK_Error(GK_ResultCode.WRONG_PARAMETER, "未找到requestInfo"));
        }

        this.mHttpRequest.request({
            url: requestInfo.url,
            method: requestInfo.method,
            json: requestInfo.json,
            data: {
                accessToken: this.mToken
            }
        }).done(function(res) {
            var dataJson = JSON.parse(res);

            if(dataJson && dataJson["status"] && dataJson["status"]["status_code"] == 0 && dataJson["result"] &&
                dataJson["result"]["card_list"]) {

                var cardList = dataJson["result"]["card_list"];

                if(cardList.length <= 0) {
                    aCallback(null);
                } else {
                    cardList.sort(function(c1, c2) {
                        if(c1.win > c2.win) {
                            return true;
                        } else {
                            return c1.rank > c2.rank;
                        }
                    });

                    aCallback(cardList);
                }
            } else {
                aCallback(null);
            }
        }).fail(function() {
            aCallback(null);
        });
    },

    /**
     * 发送游戏开始通知
     * @param aCallback 回掉函数function(err)
     */
    sendGameStart: function(aCallback) {
        this.log("sendGameStart In");

        //检查参数
        //TODO: 加入token检查 if(!this.mToken || !this.mRoomGroup) {
        if(!this.mRoomGroup) {
            return aCallback(new GK_Error(GK_ResultCode.WRONG_PARAMETER, "未初始化token或roomGroup"));
        }

        var requestInfo = this.mHttpRequestConfig.requestGameStartInfo();

        if(!requestInfo) {
            return aCallback(new GK_Error(GK_ResultCode.WRONG_PARAMETER, "未找到requestInfo"));
        }

        this.mHttpRequest.request({
            url: requestInfo.url,
            method: requestInfo.method,
            json: requestInfo.json,
            data: {
                //TODO：加入token检查 accessToken: this.mToken,
                roomGroup: this.mRoomGroup
            }
        }).done(function(res) {
            aCallback(null);
        }).fail(function() {
            aCallback(new GK_Error(GK_ResultCode.HTTP_REQUEST_ERROR, "发送游戏开始失败"));
        });
    },

    /**
     * 发送活动开始通知
     * @param aCallback 回掉函数function(err)
     */
    sendActivityStart: function(aCallback) {
        this.log("sendActivityStart In");

        //检查参数
        //TODO: 加入token检查 if(!this.mToken || !this.mRoomGroup) {
        if(!this.mRoomGroup) {
            return aCallback(new GK_Error(GK_ResultCode.WRONG_PARAMETER, "未初始化token或roomGroup"));
        }

        var requestInfo = this.mHttpRequestConfig.requestActivityStartInfo();

        if(!requestInfo) {
            return aCallback(new GK_Error(GK_ResultCode.WRONG_PARAMETER, "未找到requestInfo"));
        }

        this.mHttpRequest.request({
            url: requestInfo.url,
            method: requestInfo.method,
            json: requestInfo.json,
            data: {
                //TODO：加入token检查 accessToken: this.mToken,
                auid: GK.activity_id
            }
        }).done(function(res) {
            aCallback(null);
        }).fail(function() {
            aCallback(new GK_Error(GK_ResultCode.HTTP_REQUEST_ERROR, "发送活动开始失败"));
        });
    },

    /**
     * 发送游戏结果
     * @param aResults 游戏结果数组
     * @param aMVPCallback 回调函数，原型为 function(mpvInfo)
     * @param aResultCallback 回掉函数，原型为 function(err)
     */
    sendGameResult: function(aResults, aMVPCallback, aResultCallback) {
        this.log("sendGameResult In");

        //检查参数
        //TODO： 加入token检查 if(!this.mToken || !this.mRoomGroup) {
        if(!this.mRoomGroup) {
            return aResultCallback(new GK_Error(GK_ResultCode.WRONG_PARAMETER, "未初始化token或roomGroup"));
        }

        if(!aResults || aResults.length <= 0) {
            aMVPCallback(null); //显示默认MVP
            return aResultCallback(null);
        }

        if(!aResults[0].uid || aResults[0].rank != 1 || aResults[0].win != 1) {
            aMVPCallback(null); //显示默认MVP
            return aResultCallback(null);
        }

        var requestInfo = this.mHttpRequestConfig.requestGameResultInfo();

        if(!requestInfo) {
            return aResultCallback(new GK_Error(GK_ResultCode.WRONG_PARAMETER, "未找到requestInfo"));
        }

        var self = this;
        this.mHttpRequest.request({
            url: requestInfo.url,
            method: requestInfo.method,
            json: requestInfo.json,
            data: {
                roomGroup: this.mRoomGroup,
                data: JSON.stringify({"resultArr": aResults.slice(0, 1)}),
                noTicket: 0
            }
        }).done(function(res) {
            var mvpInfo = null;

            var dataJson = res;

            if(dataJson && dataJson["status"] && dataJson["status"]["status_code"] == 0 && dataJson["result"] &&
                dataJson["result"]["mvp_brandLogoUrl"] && dataJson["result"]["mvp_posterUrls"] &&
                dataJson["result"]["mvp_uid"]) {

                mvpInfo = {
                    brandLogoUrl: dataJson["result"]["mvp_brandLogoUrl"],
                    posterUrls: dataJson["result"]["mvp_posterUrls"],
                    uid: dataJson["result"]["mvp_uid"]
                };

                aMVPCallback(mvpInfo);

                //发送剩余数据给后台
                self.sendRestGameResult(aResults, aResultCallback);
            } else {
                self.log("获取MVP信息时返回结果错误");
                aMVPCallback(null); //显示默认MVP
                aResultCallback(null);
            }
        }).fail(function() {
            self.log("获取MVP信息时HTTP请求错误");
            aMVPCallback(null); //显示默认MVP
            aResultCallback(null);
        });
    },

    /**
     * 发送剩余结果给后台
     * @param aResults 结果数组
     * @param aResultCallback 结果反馈回调 function(err)
     */
    sendRestGameResult: function(aResults, aResultCallback) {
        this.log("sendRestGameResult In");

        var totalCount = aResults.length - 1;
        var sendCount = 0;
        var oncePreCount = 1000; //每次发送1000个参与者的数据
        var receiveCount = 0;

        if(totalCount <= 0) {
            aResultCallback(null);
            return;
        }

        var httpRequestCallback = function() {
            receiveCount += oncePreCount;

            if(receiveCount >= totalCount) {
                aResultCallback(null);
            }
        };

        var noTicket = 0;
        while(true) {
            if(totalCount - sendCount <= 0) {
                break;
            }

            var start = sendCount + 1;

            var requestInfo = this.mHttpRequestConfig.requestGameResultInfo();

            this.mHttpRequest.request({
                url: requestInfo.url,
                method: requestInfo.method,
                data: {
                    roomGroup: this.mRoomGroup,
                    data: JSON.stringify({"resultArr": aResults.slice(start, oncePreCount)}),
                    noTicket: noTicket
                }
            }).done(httpRequestCallback).fail(httpRequestCallback);
            
            noTicket = 1;

            sendCount += oncePreCount;
        }
    },

    //TODO: 重写该部分代码！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
    /**
     * 发送活动结果
     * @param aResults
     *   [
     *     {
     *       uid: xxx,
     *       rank: xxx
     *     }
     *   ]
     * @param aResultCallback
     */
    sendActivityResult: function(aResults, aResultCallback) {
        this.log("sendActivityResult In");

        console.dir(aResults);

        if(!this.mRoomGroup || !GK.activity_id || !GK.scene_oid) {
            return aResultCallback(new GK_Error(GK_ResultCode.WRONG_PARAMETER, "未初始化token或roomGroup"));
        }

        if(!aResults || aResults.length <= 0) {
            return aResultCallback(null);
        }

        var activityResult = [];
        for(var i = 0; i < aResults.length; i++) {
            if(!aResults[i].uid || aResults[i].rank == undefined) {
                continue;
            }
            activityResult.push({
                u: aResults[i].uid,
                r: aResults[i].rank
            });
        }

        var requestInfo = this.mHttpRequestConfig.requestActivityResultInfo();

        if(!requestInfo) {
            return aResultCallback(new GK_Error(GK_ResultCode.WRONG_PARAMETER, "未找到requestInfo"));
        }

        var self = this;
        this.mHttpRequest.request({
            url: requestInfo.url,
            method: requestInfo.method,
            json: requestInfo.json,
            data: {
                auid: GK.activity_id,
                oid: GK.scene_oid,
                gameData: JSON.stringify(activityResult)
            }
        }).done(function(res) {
            aResultCallback(null);
        }).fail(function() {
            self.log("发送活动结果出错");
            aResultCallback(null);
        });
    }
});