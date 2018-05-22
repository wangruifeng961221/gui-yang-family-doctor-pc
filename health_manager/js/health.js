/**
 * @author beytagh
 * @date 20180309
 * 格式化字符串
 * @param args
 * @see '{0}-{1}.format(id,user);'
 * @returns {String}
 */
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({)" + i + "(})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    };

    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

/**
 * Jquery 插件扩展
 * @author beytagh
 * @date 20180309
 * @see 用户扩展Jquery方法
 */
jQuery.extend({
    /**
     * 去除收尾特定字符
     * @param text 需要去除的字符的字符串
     * @param char 去除的特定字符
     * @returns {string|XML|void}
     */
    "trimChar": function (text, char) {
        return text.replace(new RegExp('^\\' + char + '+|\\' + char + '+$', 'g'), '');
    },
    /**
     * 获取token
     */
    'getToken': function () {
        var token = $.cookie(health.cookie_key);
        if (token == undefined || token == false) {
            let referrer = document.URL;
            location.href = '/health/login.html?referrer=' + encodeURI(referrer);
        }
        return token;
    },
    /**
     * 获取当前系统时间戳
     * @returns {*|Array|boolean|Number|string|XMLList}
     */
    'time': function () {
        return (new Date()).valueOf();
    },
    // 获取当前日期
    'getNowFormatDate': function () {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },

    /**
     * 生成API链接
     * @param url
     * @param cache
     * @returns {String|*}
     */
    'formateUrl': function (url, cache) {
        var returnUrl;
        if (url.indexOf('?') > 0) {
            returnUrl = health.apiUrl + '{0}' + "&token={1}";
        } else {
            returnUrl = health.apiUrl + '{0}' + "?token={1}";
        }

        cache = cache ? true : false;
        if (!cache) {
            returnUrl += "&_r={2}";
        }
        return returnUrl.format(url, $.getToken(), health.timestamp);
    },
    /**
     * 获取get参数
     * @param key key值
     * @returns {null}
     */
    'getQueryString': function (key) {
        var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    },
    //  获取
    'getOrgId': function () {
        let orgid = $.cookie(health.cookie_orgid_key);
        if (!orgid) {
            let _url = $.formateUrl('backend/user/info');
            $.ajax({
                url: _url,
                async: false,
                success: function (res) {
                    if (res.code == 0) {
                        let currentInfo = [];
                        currentInfo.push({
                            avatar: res.content.user.avatar,
                            name: res.content.user.name,
                        });

                        $.cookie(health.cookie_orgid_key, res.content.user.orgid, {path: '/'});
                        $.cookie(health.cookie_user_key, JSON.stringify(currentInfo), {path: '/'});
                    } else {
                        $.destroy();
                        location.href = '/health/login.html';
                    }

                }
            });
        }
        return $.cookie(health.cookie_orgid_key);
    },
//    获取 个人信息 头像 名字
    'getInfo': function () {
        let user = $.cookie(health.cookie_orgid_key);
        if (!user) {
            let _url = $.formateUrl('backend/user/info');
            $.ajax({
                url: _url,
                async: false,
                success: function (res) {
                    if (res.code == 0) {
                        let currentInfo = [];
                        currentInfo.push({
                            avatar: res.content.user.avatar,
                            name: res.content.user.name,
                        });

                        $.cookie(health.cookie_orgid_key, res.content.user.orgid, {path: '/'});
                        $.cookie(health.cookie_user_key, JSON.stringify(currentInfo), {path: '/'});
                    } else {
                        $.destroy();
                        location.href = '/health/login.html';
                    }
                }
            });
        }
        return JSON.parse($.cookie(health.cookie_user_key));

    },
//    根据身份证获取年龄
    'GetAge': function (identityCard) {
        var len = (identityCard + "").length;
        if (len == 0) {
            return 0;
        } else {
            if ((len != 15) && (len != 18))//身份证号码只能为15位或18位其它不合法
            {
                return 0;
            }
        }
        var strBirthday = "";
        if (len == 18)//处理18位的身份证号码从号码中得到生日和性别代码
        {
            strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
        }
        if (len == 15) {
            strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
        }
        //时间字符串里，必须是“/”
        var birthDate = new Date(strBirthday);
        var nowDateTime = new Date();
        var age = nowDateTime.getFullYear() - birthDate.getFullYear();
        //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
        if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    },
//    根据身份证获取出生日期
    'trim': function (s) {
        return s.replace(/^\s+|\s+$/g, "");   //为下一个函数提供
    },
    'getBirthdatByIdNo': function (iIdNo) {
        var tmpStr = "";
        var idDate = "";
        var tmpInt = 0;
        var strReturn = "";
        iIdNo = $.trim(iIdNo);
        if ((iIdNo.length != 15) && (iIdNo.length != 18)) {
            strReturn = "输入的身份证号位数错误";
            return strReturn;
        }
        if (iIdNo.length == 15) {
            tmpStr = iIdNo.substring(6, 12);
            tmpStr = "19" + tmpStr;
            tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6)
            return tmpStr;
        }
        else {
            tmpStr = iIdNo.substring(6, 14);
            tmpStr = tmpStr.substring(0, 4) + "-" + tmpStr.substring(4, 6) + "-" + tmpStr.substring(6)
            return tmpStr;
        }
    },
//    根据身份证获取性别
    'getSex': function (idCard) {
        var sexMap = {0: "女", 1: "男"};
        if (idCard.length == 15) {
            return sexMap[idCard.substring(14, 15) % 2];
        } else if (idCard.length == 18) {
            return sexMap[idCard.substring(14, 17) % 2];
        } else {
            //不是15或者18,null
            return null;
        }
    },
//    根据生日计算
    'calcAge': function (strBirthday) {
        var r = strBirthday.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if (r == null) return false;
        var d = new Date(r[1], r[3] - 1, r[4]);
        if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
            var Y = new Date().getFullYear();
            return (Y - r[1]);
        }
        return 0;
    },
    //判断值是否在数组中
    'isInArray': function (arr, val) {
        var index = this.inArray(val, arr);
        if (index >= 0) {
            return true;
        }
        return false;

    },
//    删除cookie 和 sessionStorage
    'destroy': function () {
        window.sessionStorage.clear();
        $.removeCookie(health.cookie_key, {path: '/'});
        $.removeCookie(health.cookie_orgid_key, {path: '/'});
        $.removeCookie(health.cookie_user_key, {path: '/'});
    },

//    退出
    'SignOut': function () {
        let url = $.formateUrl('/backend/site/login-out');
        $.get(url, res => {
            $.destroy();
            window.location.href = health.homeUrl;
        })
    },
});


//health
var health = {};
health.cookie_key = '_auth-health-manager-token';
health.cookie_orgid_key = '__js_orgid';
health.cookie_user_key = '__js_myInfo';
health.identity_key = '__js_identity';
health.timestamp = $.time();
health.apiUrl = 'http://health.api.vipicare.com/';
health.homeUrl = 'http://admin.health.com/';    // 开发地址
//health.homeUrl = 'http://health.m.vipicare.com/';   //线上地址
health.title = '家庭医生服务管理平台';
health.BigPageSize = 15;    //大分页默认显示10条
health.SmallPageSize = 8;   //弹框小分页默认显示8条
health.indexPageSize = 5;   //首页默认显示5条
health.otherTagId = 0;    //标签0 默认隐藏

/**
 * 获取左侧菜单
 */
health.getMenus = function () {
    var menus = window.sessionStorage.getItem('menus');
    if (menus != 'undefined') {
        return JSON.parse(menus);
    }
    return null;
};

/**
 * 获取routs路由
 */
health.getRouts = function () {
    var routs = window.sessionStorage.getItem('menus');
    if (routs != 'undefined') {
        return JSON.parse(routs);
    }
    return null;
};


/**
 * 设置页面TITLE
 * @author beytagh
 * @date 20180309
 */
$(document).ready(function () {
    document.title = '{0}-{1}'.format(document.title, health.title);
});


/**
 * 设置版权信息
 * @author beytagh
 * @date 20180309
 $(document).ready(function () {
    var template = '<span style="display: block;">版本信息&nbsp;&nbsp;3.0VER</span> <span>{0}</span>';
    var host = document.domain;
    var version = template.format(host);
    $('.menu_info>div.info').html(version);
});*/


/**
 * 设置ico
 * @author beytagh
 * @date 20180309
 */
$(document).ready(function () {
    $('head').append('<link>');
    var favicon = $('head').children(':last');
    favicon.attr({
        rel: 'shortcut icon',
        href: '/favicon.ico'
    });
});

$(document).ready(function () {
    NProgress.start();
});

$(window).load(function () {
    NProgress.done();
});


/**
 * 全局拦截ajax
 * @author beytagh
 * @date 20180416
 *
 */
$(document).ajaxSend(function (ev, xhr, settings) {
    var method = settings.type;
    if (method == 'POST') {
        NProgress.start();
        $('body').append('<div class="page-cover">' +
            '<div class="spinner">\n' +
            '  <div class="bounce1"></div>\n' +
            '  <div class="bounce2"></div>\n' +
            '  <div class="bounce3"></div>\n' +
            '</div>' +
            '</div>');
    }

});

/**
 * 全局拦截ajax
 * @author beytagh
 * @date 20180326
 *
 */
$(document).ajaxComplete(function (ev, xhr, settings) {

    try {
        var res = xhr.responseText;
        var method = settings.type;

        //移除遮罩层
        if (method == 'POST') {
            $('.page-cover').remove();
            NProgress.done();
        }

        //判断登录状态
        var jsonData = JSON.parse(res);
        if (jsonData.code == 10000) {
            $.destroy();
            location.href = '/health/login.html';
        }

    } catch (e) {
    }
});

/**
 * 清除验证信息
 * @author beytagh
 * @date 20180416
 */
$(document).ready(function () {
    $('.modal').on('hidden.bs.modal', function (e) {
        let error = $('.errorText');
        if (error) {
            error.empty();
        }
    });

});


/**
 * 截断字符串
 * @author beytagh
 * @date 20180309
 * @param str 需要截断的字符串
 * @param len 截取长度
 * @param hasDot 是否添加 '...'
 * @returns {string}
 */
health.subString = function (str, len, hasDot) {
    var newLength = 0;
    var newStr = "";
    var chineseRegex = /[^\x00-\xff]/g;
    var singleChar = "";
    var strLength = str.replace(chineseRegex, "**").length;
    for (var i = 0; i < strLength; i++) {
        singleChar = str.charAt(i).toString();
        if (singleChar.match(chineseRegex) != null) {
            newLength += 2;
        }
        else {
            newLength++;
        }
        if (newLength > len) {
            break;
        }
        newStr += singleChar;
    }

    if (hasDot && strLength > len) {
        newStr += "...";
    }
    return newStr;
};

health.hashCode = function (str) {
    str = str + "";
    var h = 0, off = 0;
    var len = str.length;

    for (var i = 0; i < len; i++) {
        h = 31 * h + str.charCodeAt(off++);
        if (h > 0x7fffffff || h < 0x80000000) {
            h = h & 0xffffffff;
        }
    }
    return h;
};

/**
 * 浏览器唯一标识
 * @author beytagh
 * @date 20180328
 * @returns {*}
 */
health.jsIdentity = function () {
    var n = navigator;
    var s = window.screen;
    var fp = new Fingerprint({canvas: true, ie_activex: true, screen_resolution: true});
    var strIdentity = n.appCodeName + n.appMinorVersion + n.appName + n.appVersion
        + n.cookieEnabled + n.cpuClass + n.onLine + n.platform + n.userAgent
        + n.browserLanguage + n.systemLanguage + n.userLanguage
        + s.availHeight + s.availWidth + s.colorDepth + s.height + s.width + s.pixelDepth + s.fontSmoothingEnabled
        + fp;

    return hex_md5(strIdentity);
};



