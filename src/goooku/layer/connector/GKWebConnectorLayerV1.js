var GKWebConnectorLayerV1 = GK_WebConnectorLayer.extend({
    //***********变量*************
    mWidth: null,
    mHeight: null,
    mXOffset: null,
    mYOffset: null,

    mTitle: null,
    mRoomGroup: null,
    mWaitDuration: null,

    mGameStarted: false,

    //**************公有函数***********
    /**
     * 创建连接界面
     */
    createLayer: function(aTitle, aWaitDuration, aRoomGroup) {
        if(!aTitle || !aWaitDuration || !aRoomGroup) {
            throw "参数错误，无法创建连接页面"
        }

        this.mTitle = aTitle;
        this.mWaitDuration = aWaitDuration;

        if(GK.debug) { //用来为压力测试显示code
            this.mTitle += '(' + aRoomGroup + ')';
        }

        var binaryCodeStr = parseInt(aRoomGroup, 16).toString(2);

        var len = 16 - binaryCodeStr.length;
        for(var cnt = 0; cnt < len; cnt++) {
            binaryCodeStr = '0' + binaryCodeStr;
        }

        this.mRoomGroup = binaryCodeStr;

        //游戏主场景隐藏
        _.el('#gameCanvas')[0].style.display = "none";

        //添加screen.css
        var nodeLink = document.createElement('link');
        nodeLink.href = "http://game.goooku.com/common/css/screen.css";
        nodeLink.rel = "stylesheet";
        _.el('head')[0].appendChild(nodeLink);

        //添加动效所需容器
        var nodeStyle = document.createElement('style');
        nodeStyle.id = "dynamic";
        _.el('head')[0].appendChild(nodeStyle);
    },

    /**
     * 显示连接界面
     * @param aCallback 回调函数，标明倒计时结束
     */
    showLayer: function(aCallback) {
        //十六宫格区域放置在场景区域表面
        var nodeli = document.createElement('div');
        nodeli.className = 'scene-container';
        nodeli.style.cssText =
            'width:' + this.mWidth + 'px;' +
            'height:' + this.mHeight + 'px;' +
            'top:' + this.mXOffset + 'px;' +
            'left:' + this.mYOffset + 'px;' +
            'background:url("http://game.goooku.com/led-web/img/background.jpg");';

        var body = document.getElementsByTagName('body')[0];
        var canvas = document.getElementById('Cocos2dGameContainer');
        body.insertBefore(nodeli, canvas);

        //绘制顶部嘿咻logo和游戏名称区域
        _.el('.scene-container').html(
            '<div class="header">' +
            '<div class="little-man">' +
            '<img src="http://game.goooku.com/led-web/img/logo.png" class="logo">' +
            '</div>' +
            '<div class="title">' + this.mTitle + '</div>' +
            '</div>' +
            '<div class="content">' +
            '<div class="connect">' +
            '<ul id="list">');

        var audioli = document.createElement('audio');
        audioli.id = 'bgAudio';
        audioli.src = 'http://game.goooku.com/led-web/sound/connect_bg.mp3';
        body.insertBefore(audioli, canvas);
        var audio = document.getElementById('bgAudio');
        audio.loop = 'loop';
        audio.play();

        //绘制十六宫格区域
        var fragment = document.createDocumentFragment();
        var nodes = null;
        for(var i = 0; i < 16; i += 1) {
            var divTemp = document.createElement("div");
            divTemp.innerHTML =
                '<li><div class="img-container">' +
                '<img id="' + i + '" src="http://game.goooku.com/led-web/img/button-default.png"/>' +
                '</div>' +
                '</li>';
            nodes = divTemp.childNodes[0];
            fragment.appendChild(nodes);
        }

        _.el('#list')[0].appendChild(fragment);


        //替换四个选中位图片
        for(var j = 15; j >= 0; j--) {
            if(this.mRoomGroup.charAt(j) == 1) {
                _.el('#' + j).attr('src', 'http://game.goooku.com/led-web/img/button-press.png');
            }
        }

        //添加头像显示区域
        var activityDiv = document.createElement("div");
        activityDiv.className = 'activity';
        activityDiv.innerHTML = '<ul id="avatar"></ul></div>';
        _.el('.content')[0].appendChild(activityDiv);

        //添加进度条
        var progressDiv = document.createElement("div");
        progressDiv.className = 'progress';
        progressDiv.innerHTML =
            '<div class="inner-progress">' +
            '<div class="num">' +
            '</div>' +
            '<div class="bar">' +
            '<progress class="bar-progress">' +
            '</progress>' +
            '</div>' +
            '</div>';
        _.el('.scene-container')[0].appendChild(progressDiv);

        //因方法体内为根据生成的html页面元素来适应大小，所以需延迟加载
        var self = this;
        requestAnimationFrame(function(){
            _.el('.num')[0].style.lineHeight = window.getComputedStyle(_.el('.inner-progress')[0], null).height;
            _.el('.num')[0].style.fontSize =
                parseInt(window.getComputedStyle(_.el('.inner-progress')[0], null).height.replace('px', '')) / 1.5 +
                'px';

            _.el('.title')[0].style.lineHeight = window.getComputedStyle(_.el('.header')[0], null).height;
            _.el('.title')[0].style.fontSize =
                parseInt(window.getComputedStyle(_.el('.header')[0], null).height.replace('px', '')) / 1.3 + 'px';

            //changeStart添加超过边界人数后的上滚动效
            var activityHeight = Math.floor((_.el('.activity')[0].clientHeight) / 4);
            var style = _.el("#dynamic");
            style.html(
                '@-webkit-keyframes moveOut {' +
                'from {-webkit-transform:translateY(0)}' +
                'to {-webkit-transform:translateY(-' + activityHeight + 'px)}}' +
                '@keyframes moveOut {' +
                'from {transform:translateY(0)}' +
                'to {transform:translateY(-' + activityHeight + 'px)}}'
            );

            var progressVal = self.mWaitDuration;
            var progressMax = self.mWaitDuration;
            _.el('.num').text(progressVal);
            _.el('.bar-progress').attr('max', progressMax);
            _.el('.bar-progress').attr('value', progressVal);

            //开始运行进度条和倒计时
            var interval = window.setInterval(function() {
                progressVal = progressVal - 0.1;
                var rel = Math.floor(progressVal * 10) / 10;
                _.el('.num').text(Math.round(progressVal));
                _.el('.bar-progress').attr('value', rel);
                if(rel === 0) {
                    audio.pause();
                    clearInterval(interval);
                    aCallback();
                }
            }, 100);
        });


        //进行数量检查
        this.avatarRefreshInterval = window.setInterval(function() {
            if(_.el('#avatar')[0].childNodes.length > 20) {
                _.el('#avatar li').addClass('avatar-remove');
                var timeout = setTimeout(function() {
                    _.el('#avatar li').each(function(idx, item) {
                        if(idx < 5) {
                            _.el('#avatar')[0].removeChild(item);
                        }
                    });
                    _.el('#avatar li').removeClass('avatar-remove');
                    clearTimeout(timeout);
                }, 1500);
            }
        }, 2000);
    },

    /**
     * 删除连接界面
     */
    deleteLayer: function() {
        _.el('#gameCanvas')[0].style.display = "block";
        _.el('.scene-container')[0].style.background = '';
        _.el('.scene-container').empty();
        _.el('.scene-container')[0].appendChild(_.el("#Cocos2dGameContainer")[0]);

        window.clearInterval(this.avatarRefreshInterval);
        this.mGameStarted = true;

        //TODO: 重写GKWebConnectorLayerV1.js，使用cocosjs API，可以不再该位置调用cc.game.run而在WebPageProcess.js中
        cc.game.run();

        _.el("#Cocos2dGameContainer")[0].style.width = this.mWidth + 'px';
        _.el("#Cocos2dGameContainer")[0].style.height = this.mHeight + 'px';
        _.el("#Cocos2dGameContainer")[0].style.margin = '0 0';

        _.el("#gameCanvas")[0].style.width = this.mWidth + 'px';
        _.el("#gameCanvas")[0].style.height = this.mHeight + 'px';
    },

    /**
     * 用户加入进来
     * @param aUserIdx
     * @param aAvatarUrl
     * @param aSex
     */
    addUser: function(aUserIdx, aAvatarUrl, aSex) {
        var activityWidth = Math.floor((_.el('.activity')[0].clientWidth) / 8.2);
        var sexIcon = '';
        if(aSex == '1') {
            sexIcon = 'http://game.goooku.com/led-web/img/male.png';
        } else if(aSex == '2') {
            sexIcon = 'http://game.goooku.com/led-web/img/female.png';
        } else {
            sexIcon = 'http://game.goooku.com/led-web/img/ladyman.png';
        }

        var avatarImg = new Image();
        avatarImg.src = aAvatarUrl;
        var self = this;

        avatarImg.onload = function() {
            var avatarHtml =
                '<li id="' + aUserIdx + '">' +
                '<div class="avatar-container">' +
                '<img class="userIcon" style="border-radius: 50%;width:' + activityWidth + 'px;height:' +
                activityWidth + 'px" src="' + aAvatarUrl + '" />' +
                '</div>' +
                '<div class="sex-container">' +
                '<img class="sexIcon" src="' + sexIcon + '" />' +
                '</div>' +
                '</li>';
            self.AppendHTML(_.el('#avatar')[0], avatarHtml);
        };
    },

    /**
     * 添加用户头像节点到页面中
     * @param aNode 节点
     * @param aHtml html脚本
     * @constructor
     */
    AppendHTML: function(aNode, aHtml) {
        var divTemp = document.createElement("div");
        var fragment = document.createDocumentFragment();
        divTemp.innerHTML = aHtml;
        var nodes = divTemp.childNodes;
        for(var i = 0, length = nodes.length; i < length; i += 1) {
            fragment.appendChild(nodes[i].cloneNode(true));
        }
        aNode.appendChild(fragment);
    },


    removeUser: function(aUserIdx) {
        if(aUserIdx) {
            if(!this.mGameStarted) {
                _.el('#avatar')[0].removeChild(_.el('#avatar #' + aUserIdx)[0]);
            }
        }
    }
});