var TestLayer = cc.Layer.extend({
    testCases: [],
    mainNode: null,

    //TODO：在此处拓展
    ctor: function() {
        this._super();

        this.mainNode = new cc.LayerColor(cc.color(192, 192, 192, 255), GK.screen_width, GK.screen_height);
        this.mainNode.setPosition(cc.p(0, 0));
        this.addChild(this.mainNode, 0);


        this.testCases.push(this.createTestCase(this.testCounterDownLayer.bind(this)));
        this.testCases.push(this.createTestCase(this.testHelpV1.bind(this)));
        this.testCases.push(this.createTestCase(this.testMvpV1.bind(this)));
        this.testCases.push(this.createTestCase(this.testMvpV2.bind(this)));
        this.testCases.push(this.createTestCase(this.testProgressV1.bind(this)));
        this.testCases.push(this.createTestCase(this.testDynamicRankV1.bind(this)));
        this.testCases.push(this.createTestCase(this.testFinalRankV1.bind(this)));

        this.startTest();

        return true;
    },

    /**
     * 创建测试用例
     * @param fn
     * @returns {Function}
     */
    createTestCase: function(fn) {
        return function(cb) {
            fn(function() {
                cb(null);
            });
        }
    },

    /**
     * 测试开始
     */
    startTest: function() {
        cc.async.waterfall(
            this.testCases,
            function(err) {
            });
    },

    /**
     * 测试倒计时是否正确
     * @param cb 测试完成回调函数
     */
    testCounterDownLayer: function(cb) {
        var countDownLayer = new GK_CountDownLayerV1();

        this.mainNode.addChild(countDownLayer, 5);

        countDownLayer.startCountDown(function() {
            cb();
        });
    },

    /**
     * 测试操作提示
     * @param cb 测试完成回调函数
     */
    testHelpV1: function(cb) {
        var helperLayer = null;

        var self = this;

        var testProcess = function(callback) {
            self.mainNode.addChild(helperLayer, 5);

            helperLayer.showLayer();

            setTimeout(function() {
                helperLayer.removeLayer();
                callback(null);
            }, 5000);
        };


        cc.async.waterfall([
            function(callback) {
                helperLayer = new GK_HelpTouchLayerV1();
                testProcess(callback);
            },
            function(callback) {
                helperLayer = new GK_HelpShakeLayerV1();
                testProcess(callback);
            },
            function(callback) {
                helperLayer = new GK_HelpMoveLayerV1();
                testProcess(callback);
            }
        ], function(err) {
            cb(null);
        });
    },

    /**
     * MVP测试
     * @param cb 测试完成回调函数
     */
    testMvpV1: function(cb) {
        var mvpLayer = new GK_MvpLayerV1();
        this.mainNode.addChild(mvpLayer, 5);

        var testUser = {
            userIcon: "http://o8una80lq.bkt.clouddn.com/45708906f885a60ea69382d20",
            nickname: "测试用户",
            sex: 1
        };

        var testShop = {
            logo: "http://goooku-manage.oss-cn-beijing.aliyuncs.com/goooku-shop/df16e842-63b5-4d36-9221-c26c85f8ef5f",
            postUrls: [
                "http://goooku-manage.oss-cn-beijing.aliyuncs.com/goooku-shop/f97754a5-bb16-4751-a8cc-25e3dd0ea70f",
                "http://goooku-manage.oss-cn-beijing.aliyuncs.com/goooku-shop/8257a89d-340c-43ae-9ce1-8fa80fabf5bf"
            ]
        };

        var mvps = [];
        mvps.push(testUser);
        mvpLayer.showMVP(mvps, testShop.logo, testShop.postUrls);

        setTimeout(function() {
            mvpLayer.removeFromParent(true);
            cb();
        }, 5000);
    },

    /**
     * MVP测试
     * @param cb 测试完成回调函数
     */
    testMvpV2: function(cb) {
        var mvpLayer = new GK_MvpLayerV2();
        this.mainNode.addChild(mvpLayer, 6);

        var testUser = {
            userIcon: "http://o8una80lq.bkt.clouddn.com/45708906f885a60ea69382d20",
            nickname: "测试用户",
            sex: 1
        };

        var testShop = {
            logo: "http://goooku-manage.oss-cn-beijing.aliyuncs.com/goooku-shop/df16e842-63b5-4d36-9221-c26c85f8ef5f",
            postUrls: [
                "http://goooku-manage.oss-cn-beijing.aliyuncs.com/goooku-shop/f97754a5-bb16-4751-a8cc-25e3dd0ea70f",
                "http://goooku-manage.oss-cn-beijing.aliyuncs.com/goooku-shop/8257a89d-340c-43ae-9ce1-8fa80fabf5bf"
            ]
        };

        var mvps = [];
        mvps.push(testUser);
        mvpLayer.showMVP(mvps, testShop.logo, testShop.postUrls);

        setTimeout(function() {
            mvpLayer.removeFromParent(true);
            cb();
        }, 5000);
    },

    /**
     * 进度条测试
     * @param cb 测试完成回调函数
     */
    testProgressV1: function(cb) {
        var progressLayer = new GK_ProgressLayerV1();
        this.mainNode.addChild(progressLayer, 5, 1000);
        progressLayer = this.mainNode.getChildByTag(1000);
        progressLayer.setPosition(cc.p(0, 0));
        progressLayer.runAction(cc.sequence(cc.moveTo(1, cc.p(0, 0))));
        var layerParams = {
            time: 10,
            scale: 0.6
        };
        var tick = 0;
        progressLayer.startProgress(layerParams,
            function() {
                tick++;
                console.log('tick: ' + tick);
            },
            function() {
                console.log('进度条走完');
                cb();
            },
            false
        );
    },

    /**
     * 动态排行榜测试
     * @param cb 测试完成回调函数
     */
    testDynamicRankV1: function(cb) {
        var dynamicRankLayer = new GK_DynamicRankLayerV1();
        this.mainNode.addChild(dynamicRankLayer, 6, 8);

        dynamicRankLayer.setPosition(cc.p(0, 0));

        var userInfoArr = [];
        for(var i = 0; i < 8; i++) {
            var testUser = {
                userIcon: "http://o8una80lq.bkt.clouddn.com/45708906f885a60ea69382d20",
                nickname: "测试用户" + i,
                sex: 1
            };
            userInfoArr.push(testUser);
        }

        var layerParams = {
            scale: 0.8
        };
        dynamicRankLayer.createRank(layerParams, userInfoArr);

        function randomUsers(users) {
            for(var i = 0; i < users.length; i++) {
                var m = Math.floor(Math.random() * users.length);
                var n = Math.floor(Math.random() * users.length);
                var temp = users[m];
                users[m] = users[n];
                users[n] = temp;
            }
        }

        var count = 0;
        var timer = setInterval(function() {
            if(count < 16) {
                randomUsers(userInfoArr);
                dynamicRankLayer.showResult(userInfoArr);
            } else {
                clearInterval(timer);
                dynamicRankLayer.removeRank(userInfoArr);
                cb();
            }
            count++;
        }, 1000);
    },

    /**
     * 最终排行榜测试
     * @param cb 测试完成回调函数
     */
    testFinalRankV1: function(cb) {
        var finalRankLayer = new GK_FinalRankLayerV1();
        this.mainNode.addChild(finalRankLayer, 0);

        var testUser = {
            userIcon: "http://o8una80lq.bkt.clouddn.com/45708906f885a60ea69382d20",
            nickname: "测试用户",
            sex: 1
        };

        var userInfoArr = [];
        for(var i = 0; i < 12; i++) {
            userInfoArr.push(testUser);
        }

        finalRankLayer.showResult(userInfoArr, 20);

        setTimeout(function() {
            finalRankLayer.removeResult();
            cb();
        }, 10000);
    }
});