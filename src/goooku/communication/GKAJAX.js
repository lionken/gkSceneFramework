var GK_Ajax = cc.Class.extend({
    //**************公有函数***********
    /**
     * 网络请求
     * @param aOps {url:xxx, method: xxx, data: xxx}
     */
    request: function(aOps) {
        if(typeof aOps == "string") {
            aOps = {url: aOps};
        }

        aOps.url = aOps.url || "";
        aOps.method = aOps.method || "get";
        aOps.data = aOps.data || {};

        var getParams = function(aData, aUrl) {
            var arr = [], str;
            for(var name in aData) {
                arr.push(name + "=" + encodeURIComponent(aData[name]));
            }
            str = arr.join("&");
            if(str != "") {
                return aUrl ? (aUrl.indexOf("?") < 0 ? "?" + str : "&" + str) : str;
            }
            return "";
        };

        var api = {
            host: {},
            process: function(aOps) {
                var self = this;

                this.xhr = new XMLHttpRequest();

                this.xhr.onreadystatechange = function() {
                    if(self.xhr.readyState == 4 && self.xhr.status == 200) {
                        var result = self.xhr.responseText;
                        if(aOps.json === true) {
                            result = JSON.parse(result);
                        }
                        self.doneCallback && self.doneCallback.apply(self.host, [result, self.xhr]);
                    } else if(self.xhr.readyState == 4) {
                        self.failCallback && self.failCallback.apply(self.host, [self.xhr]);
                    }
                    self.alwaysCallback && self.alwaysCallback.apply(self.host, [self.xhr]);
                };

                this.xhr.timeout = 10000;
                this.xhr.ontimeout = function(e) {
                    self.failCallback && self.failCallback.apply(self.host, [self.xhr]);
                };

                this.xhr.onerror = function(e) {
                    self.failCallback && self.failCallback.apply(self.host, [self.xhr]);
                };

                if(aOps.method == "get" || aOps.method == "GET") {
                    this.xhr.open("GET", aOps.url + getParams(aOps.data, aOps.url), true);
                } else {
                    this.xhr.open(aOps.method, aOps.url, true);
                    this.setHeaders({
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-type": "application/x-www-form-urlencoded"
                    });
                }
                if(aOps.headers && typeof aOps.headers == "object") {
                    this.setHeaders(aOps.headers);
                }

                setTimeout(function() {
                    aOps.method === "get" || aOps.method === "" ? self.xhr.send() : self.xhr.send(getParams(aOps.data));
                }, 20);
                return this;
            },

            done: function(callback) {
                this.doneCallback = callback;
                return this;
            },

            fail: function(callback) {
                this.failCallback = callback;
                return this;
            },

            always: function(callback) {
                this.alwaysCallback = callback;
                return this;
            },

            setHeaders: function(headers) {
                for(var name in headers) {
                    this.xhr.setRequestHeader(name, headers[name]);
                }
            }
        };
        return api.process(aOps);
    }
});
