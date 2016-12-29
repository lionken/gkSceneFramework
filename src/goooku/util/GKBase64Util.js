var GK_Base64Util = cc.Class.extend({
    //***********变量*************
    mKeyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    //**************公有函数***********
    /**
     * 构造函数
     */
    ctor: function() {
    },

    /**
     * base64编码
     * @param aInput 输入字符串
     * @returns {String}
     */
    encode: function(aInput) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        aInput = this.utf8Encode(aInput);

        while(i < aInput.length) {
            chr1 = aInput.charCodeAt(i++);
            chr2 = aInput.charCodeAt(i++);
            chr3 = aInput.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if(isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if(isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this.mKeyStr.charAt(enc1) + this.mKeyStr.charAt(enc2) +
                this.mKeyStr.charAt(enc3) + this.mKeyStr.charAt(enc4);
        }

        return output;
    },


    /**
     * base64解码
     * @param aInput 输入字符串
     * @returns {String}
     */
    decode: function(aInput) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        aInput = aInput.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while(i < aInput.length) {
            enc1 = this.mKeyStr.indexOf(aInput.charAt(i++));
            enc2 = this.mKeyStr.indexOf(aInput.charAt(i++));
            enc3 = this.mKeyStr.indexOf(aInput.charAt(i++));
            enc4 = this.mKeyStr.indexOf(aInput.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if(enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if(enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }

        output = this.utf8Decode(output);

        return output;

    },

    /**
     * base64的utf8编码
     * @param aString 输入字符串
     * @returns {String}
     */
    utf8Encode: function(aString) {
        aString = aString.replace(/\r\n/g, "\n");
        var utftext = "";

        for(var n = 0; n < aString.length; n++) {

            var c = aString.charCodeAt(n);

            if(c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }

        return utftext;
    },

    /**
     * base64的utf8解码
     * @param aUtftext 输入字符串
     * @returns {String}
     */
    utf8Decode: function(aUtftext) {
        var string = "";
        var i = 0;
        var c = 0;
        var c2 = 0;
        var c3 = 0;

        while(i < aUtftext.length) {
            c = aUtftext.charCodeAt(i);

            if(c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = aUtftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = aUtftext.charCodeAt(i + 1);
                c3 = aUtftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }

        return string;
    }

});

