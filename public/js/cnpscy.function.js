/**
 * [myAjax ajax请求函数]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:ajax请求函数
 * @englishAnnotation:Ajax request function
 * @param  {[array]} data [参数]
 * @param  {[string]} HOST [请求地址]
 * @param  {[string]} url [控制器与方法名]
 * @param  {[function]} callback [回调函数]
 * @param  {[string]} dataType [请求数据格式]
 * @param  {[string]} type [请求方式]
 * @return {[array]}      [返回数据]
 */
function myAjax(ajax_data) {
    var callback = ajax_data.callback || [],
        data = ajax_data.data || {},
        HOST = ajax_data.HOST || API_HOST,
        url = ajax_data.url || API_URL,
        dataType = ajax_data.dataType || 'json',
        type = ajax_data.type ? ajax_data.type : (data ? 'GET' : 'POST'),
        async = $.trim(ajax_data.async),
        cache = ajax_data.cache || true,
        suffix = ajax_data.suffix || '';
    if (async == '' || async == undefined || async == "undefined" || isEmpty(async)) async = true;
    /**
     * 针对于API写的
     */
    data.api_token = API_TOKEN;
    if(API_DATA.sign == '' || API_DATA.sign == undefined || API_DATA.sign == "undefined" || isEmpty(API_DATA.sign)){
        API_DATA.url = 'get_api_sign';

        $.ajax({
            url: API_HOST + API_DATA.url,
            data: API_DATA,
            type: 'get',
            dataType: 'json',
            success: function (msg) {
                if(msg.status == 1 && msg.code == 200){
                    data.sign = msg.sign;
                    data.api_token = msg.api_token;
                }
                API_DATA.url = 'api';
                ajax_data.data = API_DATA;

                $.ajax({
                    url: HOST + url + suffix,
                    data: data,
                    type: type,
                    cache: cache,
                    async: async,
                    dataType: dataType,
                    success: function (data) {
                        callback(data);
                        if ($('input[name=layerLoading]').val() == 0) closeLayerLoading();
                    }, error: function (data) {
                        callback(data);
                        if ($('input[name=layerLoading]').val() == 0) closeLayerLoading();
                    }
                });
            }, error: function (data) {
                $.ajax({
                    url: HOST + url + suffix,
                    data: data,
                    type: type,
                    cache: cache,
                    async: async,
                    dataType: dataType,
                    success: function (data) {
                        callback(data);
                        if ($('input[name=layerLoading]').val() == 0) closeLayerLoading();
                    }, error: function (data) {
                        callback(data);
                        if ($('input[name=layerLoading]').val() == 0) closeLayerLoading();
                    }
                });
            }
        });
    }else{
        $.ajax({
            url: HOST + url + suffix,
            data: data,
            type: type,
            cache: cache,
            async: async,
            dataType: dataType,
            success: function (data) {
                callback(data);
                if ($('input[name=layerLoading]').val() == 0) closeLayerLoading();
            }, error: function (data) {
                callback(data);
                if ($('input[name=layerLoading]').val() == 0) closeLayerLoading();
            }
        });
    }
}

/**
 * [checkUrl]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:检测URL是否合法
 * @englishAnnotation:Is it legal to detect URL?
 * @param              {[link]} url [URL地址]
 * @return             {[boolean]} [true/false]
 */
function checkUrl(url) {
    if (url == '' || url == undefined || url == 'undefined' || isEmpty(url)) return false;
    var Expression = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    var objExp = new RegExp(Expression);
    if (objExp.test(url) == true) return true;
    else return false;
}

/**
 * [checkMobile]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:检测手机号码格式是否正确
 * @englishAnnotation:
 * @param              {[tel]} tel [手机号码]
 * @return             {[boolean]}     [true/false]
 */
function checkMobile(tel) {
    if (tel == '' || tel == undefined || tel == 'undefined' || isEmpty(tel)) return false;
    var myreg = /^1(3|4|5|7|8)\d{9}$/;
    if (!myreg.test(tel)) return false;
    else return true;
}

/**
 * [checkIdCard]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:检测是否为身份证号码
 *                     身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
 * @englishAnnotation:
 * @param              {[int]} card [description]
 * @return             {[boolean]}     [true/false]
 */
function checkIdCard(card) {
    if (card == '' || card == undefined || card == 'undefined' || isEmpty(card)) return false;
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(card) === false) return false;
    else return true;
}

/**
 * [getAgeFormIdCard]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:根据身份证号码，获取指定用户的年龄
 * @englishAnnotation:
 * @param              {[int]} identityCard [身份证号码]
 * @return             {[int]} [年龄]
 */
function getAgeFormIdCard(identityCard) {
    if (identityCard == '' || identityCard == undefined || identityCard == 'undefined' || isEmpty(identityCard)) return 0;
    var len = (identityCard + "").length;
    if (len == 0) return 0;
    else if ((len != 15) && (len != 18)) return 0;//身份证号码只能为15位或18位其它不合法
    var strBirthday = "";
    //处理18位的身份证号码从号码中得到生日和性别代码
    if (len == 18) strBirthday = identityCard.substr(6, 4) + "/" + identityCard.substr(10, 2) + "/" + identityCard.substr(12, 2);
    else if (len == 15) strBirthday = "19" + identityCard.substr(6, 2) + "/" + identityCard.substr(8, 2) + "/" + identityCard.substr(10, 2);
    //时间字符串里，必须是“/”
    var birthDate = new Date(strBirthday);
    var nowDateTime = new Date();
    var age = nowDateTime.getFullYear() - birthDate.getFullYear();
    //再考虑月、天的因素;.getMonth()获取的是从0开始的，这里进行比较，不需要加1
    if (nowDateTime.getMonth() < birthDate.getMonth() || (nowDateTime.getMonth() == birthDate.getMonth() && nowDateTime.getDate() < birthDate.getDate())) age--;
    return age;
}

/**
 * [checkRealName]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:检测是否为真实姓名
 * @englishAnnotation:
 * @param              {[string]} name [description]
 * @return             {[boolean]}     [true/false]
 */
function checkRealName(name) {
    if (name == '' || name == undefined || name == 'undefined' || isEmpty(name)) return false;
    var regName = /^[\u4e00-\u9fa5]{2,4}$/;
    if (!regName.test(name)) return false;
    else return true;
}

/**
 * [checkBankCard]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:检测银行卡号格式
 * @englishAnnotation:
 * @param              {[int]} card [description]
 * @return             {[boolean]}     [true/false]
 */
function checkBankCard(card) {
    if (card == '' || card == undefined || card == 'undefined' || isEmpty(card)) return false;
    if (!/^(\d{16}|\d{19})$/.test(card)) return false;
    else return true;
}

/**
 * [hrefUrl 页面跳转]
 * @param  {[link]} url [URL地址]
 */
/**
 * [hrefUrl]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:页面跳转
 * @englishAnnotation:
 * @param              {[link]} url [URL地址]
 * @return             {[boolean]}     [true/false]
 */
function hrefUrl(url) {
    if (url == '' || url == undefined || url == 'undefined' || isEmpty(url)) return false;
    else if (checkUrl(url)) window.location.href = url;
    else if (checkUrl(thisUrl() + url)) window.location.href = url;
    else return false;
}

/**
 * [returnUrl]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:返回上一页，不刷新
 * @englishAnnotation:
 */
function returnUrl() {
    window.location.href = history.go(-1);
    return false;
}

/**
 * [returnUrlRefresh]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:返回上一页并刷新
 * @englishAnnotation:
 */
function returnUrlRefresh(){
    window.location.href = document.referrer;return false;
}

/*
 * 点击进行页面延迟跳转
 * URL 存在，跳转页面。不存在则不进行跳转
 */
function delayHrefPage(url,timeout,type){
    type = (type == '' || type == undefined || type == 'undefined') ? 0 : type; 
    url = $.trim(url);
    timeout = (timeout == '' || timeout == undefined || timeout == 'undefined') ? 3000 : timeout;
    if(url == '' || url == undefined || url == 'undefined'){
        return false;
    }else{
        setTimeout(function () {
            if(url == '' || url == undefined || url == 'undefined'){
                if(type == 0){
                    window.location.reload();
                }else{
                    window.location.href = history.back(-1);
                }
            }else{
                hrefPage(url);
            }
        }, timeout);
    }
}

/**
 * [TimeTransformationDate]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:时间戳转换成日期格式
 * @englishAnnotation:
 * @param              {[int]}  unixTime  [时间戳]
 * @param              {[int]}  year_true [是否展示年]
 * @param              {[int]}  month_true [是否展示月份]
 * @param              {[int]}  day_true [是否展示今天是几号]
 * @param              {[Boolean]} isHour    [小时]
 * @param              {[Boolean]} isMinute  [分钟]
 * @param              {[Boolean]} hasSec    [秒]
 * @param              {[int]}  year      [年 拼接符号]
 * @param              {[int]}  month     [月 拼接符号]
 * @param              {[int]}  day       [日 拼接符号]
 * @param              {[int]}  weekday   [description]
 * @return             {[string]}
 */
function TimeTransformationDate(unixTime, year_true, month_true, day_true, isHour, isMinute, hasSec, year, month, day, weekday) {
    unixTime = Math.abs(parseInt(unixTime));
    year_true = ((year_true == '' || year_true == undefined || year_true == "undefined" || isEmpty(year_true)) && year_true != false) ? true : year_true;
    month_true = (month_true == '' || month_true == undefined || month_true == "undefined" || isEmpty(month_true)) ? true : month_true;
    day_true = (day_true == '' || day_true == undefined || day_true == "undefined" || isEmpty(day_true)) ? true : day_true;
    isHour = (isHour == '' || isHour == undefined || isHour == "undefined" || isEmpty(isHour)) ? false : isHour;
    isMinute = (isMinute == '' || isMinute == undefined || isMinute == "undefined" || isEmpty(isMinute)) ? false : isMinute;
    hasSec = (hasSec == '' || hasSec == undefined || hasSec == "undefined" || isEmpty(hasSec)) ? false : hasSec;
    weekday = (weekday == '' || weekday == undefined || weekday == "undefined" || isEmpty(weekday)) ? false : weekday;
    year = year ? year : '-';
    month = month ? month : '-';
    day = day ? day : '';
    var time = new Date(unixTime * 1000), date_time = '';
    if (year_true != false) date_time += time.getFullYear() + year;
    if (month_true != false) date_time += Add_0((time.getMonth() + 1)) + month;
    if (day_true != false) date_time += Add_0(time.getDate()) + day;
    if (isHour != false) date_time += ' ' + Add_0(time.getHours());
    if (isMinute != false)  date_time += ':' + Add_0(time.getMinutes());
    if (hasSec != false) date_time += ':' + Add_0(time.getSeconds());
    if (weekday != false) date_time += '&nbsp;&nbsp;星期' + "日一二三四五六".charAt(time.getDay());
    return date_time;
}

/**
 * [dateToUnix]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:日期转化为时间戳
 * @englishAnnotation:
 * @param              {[type]} string [年份-月份-天 小时:分钟:秒]
 * @return             {[type]}        [description]
 */
function dateToUnix(string) {
    var f = string.split(' ', 2);
    var d = (f[0] ? f[0] : '').split('-', 3);
    var t = (f[1] ? f[1] : '').split(':', 3);
    return (new Date(
            parseInt(d[0], 10) || null,
            (parseInt(d[1], 10) || 1) - 1,
            parseInt(d[2], 10) || null,
            parseInt(t[0], 10) || null,
            parseInt(t[1], 10) || null,
            parseInt(t[2], 10) || null
        )).getTime() / 1000;
}

/**
 * [Add_0]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:判断如果参数小于10  ，参数前面 + 0
 * @englishAnnotation:
 * @param              {[type]} data [description]
 * @return             {[string]}
 */
function Add_0(data) {
    if (data < 10) data = '0' + data;
    return data;
}

/**
 * [getQueryString]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:采用正则表达式获取地址栏参数
 * @englishAnnotation:
 * @param {[string]} name [参数名]
 * @return {[string]} [返回的参数]
 */
function getQueryString(name) {
    if (name == '' || name == undefined || name == 'undefined' || isEmpty(name)) return '';
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    else return '';
}

/**
 * [thisUrl]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:获取当前页面的URL地址，不含参数
 * @englishAnnotation:
 * @return {[link]} [URL地址]
 */
function thisUrl() {
    return window.location.origin + window.location.pathname;
}

/**
 * [thisOrigin]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:起源
 * @englishAnnotation:
 * @return {[link]} [域名]
 */
function thisOrigin() {
    return window.location.origin;
}

/**
 * [thisHostName]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:主机
 * @englishAnnotation:
 * @return {[link]} [域名]
 */
function thisHostName() {
    return window.location.hostname;
}

/**
 * [thisPort]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:获取端口
 * @englishAnnotation:
 * @return {[int]} [端口号]
 */
function thisPort() {
    return window.location.port;
}

/**
 * [thisProtocol]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:获取协议 http/https
 * @englishAnnotation:
 * @return {[string]} [协议类型]
 */
function thisProtocol() {
    return window.location.protocol;
}

/**
 * [detectmob]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:设备检测  --- true是移动端，false是PC
 * @englishAnnotation:
 * @return {[Boolean]} [true/false]
 */
function detectmob() {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == 'ipad';
    var bIsIphone = sUserAgent.match(/iphone os/i) == 'iphone os';
    var bIsMidp = sUserAgent.match(/midp/i) == 'midp';
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4';
    var bIsUc = sUserAgent.match(/ucweb/i) == 'web';
    var bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce';
    var bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile';
    var bIsAndroid = sUserAgent.match(/android/i) == 'android';
    if (bIsIpad || bIsIphone || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM || bIsAndroid) return true;
    else return false;
}

/**
 * [ignoreReturnEvent]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:屏蔽页面的回车事件
 * @englishAnnotation:Screen carriage return event
 * @return {[Boolean]} [true/false]
 */
function ignoreReturnEvent() {
    document.onkeydown = function (event) {
        var target, code, tag;
        if (!event) {
            event = window.event; //针对ie浏览器    
            target = event.srcElement;
            code = event.keyCode;
            if (code == 13) {
                tag = target.tagName;
                if (tag == "TEXTAREA") return true;
                else return false;
            }
        } else {
            target = event.target; //针对遵循w3c标准的浏览器，如Firefox    
            code = event.keyCode;
            if (code == 13) {
                tag = target.tagName;
                if (tag == "INPUT") return false;
                else return true;
            }
        }
    };
}

/**
 * [countDown]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:获取验证码效果加载
 * @englishAnnotation:
 * @param              {[string]} unique     [指定的唯一标识]
 * @param              {[int]} timeout    [提示多少秒]
 * @param              {[string]} start_html [默认文字展示]
 * @param              {[string]} down_html  [点击之后文字展示]
 * @return             {[type]}
 */
function countDown(unique, timeout, start_html, down_html) {
    if (unique.attr('disabled') == true || unique.attr('disabled') == 'disabled') return false;
    timeout = (timeout == '' || timeout == undefined || timeout == 'undefined' || isEmpty(timeout)) ? '60' : timeout;
    start_html = (start_html == '' || start_html == undefined || start_html == 'undefined' || isEmpty(start_html)) ? '获取验证码' : start_html;
    down_html = (down_html == '' || down_html == undefined || down_html == 'undefined' || isEmpty(down_html)) ? '重新发送' : down_html;
    _timeout = timeout;
    var timer = '';
    settime(unique);
    function settime(unique) {
        if (_timeout <= 0) {
            unique.removeAttr("disabled");
            unique.html(start_html);
            window.clearInterval(timer);
            return false;
        } else {
            unique.attr("disabled", true);
            unique.html(down_html + "(" + _timeout + ")");
            _timeout--;
        }
        timer = window.setTimeout(function () {
            settime(unique);
        }, 1000);
    }

    return false;
}

/**
 * [isNumber]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:检测是否为数字类型
 * @englishAnnotation:
 * @param              {[int]}  obj [description]
 * @return             {Boolean}     [true/false]
 */
function isNumber(obj) {
    return obj === +obj
}

/**
 * [isString]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:检测是否为字符串
 * @englishAnnotation:
 * @param              {[string]}  obj [description]
 * @return             {Boolean}     [true/false]
 */
function isString(obj) {
    return obj === obj + ''
}

/**
 * [isBoolean]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:检测是否为boolean型
 * @englishAnnotation:
 * @param              {[type]}  obj [description]
 * @return             {Boolean}     [true/false]
 */
function isBoolean(obj) {
    return obj === !!obj
}

/**
 * [hiddenBankCard description]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:银行卡号，隐藏中间12位数
 * @englishAnnotation:
 * @param              {[string]} str [银行卡号]
 * @param              {[int]} space [是否4位空格：1空格；其他不空格]
 * @return             {[string]}
 */
function hiddenBankCard(str, space) {
    if (str == '' || str == undefined || str == 'undefined' || isEmpty(str)) return '';
    space = (space == '' || space == undefined || space == 'undefined' || isEmpty(space)) ? 1 : space;
    var return_str = (space == 1) ? "$1&nbsp;****&nbsp;****&nbsp;****&nbsp;$2" : "$1************$2";
    return str.replace(/^(\d{4})\d+(\d{3})$/, return_str);
}

/**
 * [hiddenIdCard]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:身份证隐藏中间10位数
 * @englishAnnotation:
 * @param              {[string]} str   [description]
 * @param              {[int]} space [description]
 * @return             {[string]}       [description]
 */
function hiddenIdCard(str, space) {
    if (str == '' || str == undefined || str == 'undefined' || isEmpty(str)) return '';
    space = (space == '' || space == undefined || space == 'undefined' || isEmpty(space)) ? 0 : space;
    var return_str = (space != 0) ? "$1&nbsp;***&nbsp;****&nbsp;***&nbsp;$2" : "$1**********$2";
    return str.replace(/^(\d{4})\d+(\d{4})$/, return_str);
}

/**
 * [hiddenMobile]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:对于手机号隐藏中间四位，使用*号代替
 * @englishAnnotation:
 * @param              {[string]} str   [description]
 * @param              {[int]} space [description]
 * @return             {[string]}       [description]
 */
function hiddenMobile(str, space) {
    if (str == '' || str == undefined || str == 'undefined' || isEmpty(str)) return '';
    space = (space == '' || space == undefined || space == 'undefined' || isEmpty(space)) ? 0 : space;
    var return_str = (space != 0) ? "$1&nbsp;****&nbsp;$2" : "$1****$2";
    return str.replace(/^(\d{3})\d+(\d{4})$/, return_str);
}

/**
 * [nowToTheSpecifiedTimestampDifferDays]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:现在到指定时间戳，相差多少天
 * @englishAnnotation:
 * @param              {[int]} timestamp [指定时间戳, 为空，默认为此刻时间戳]
 * @param              {[type]} start_timestamp [开始时间戳，为空，默认从此刻开始]
 * @return             {[int]}                 [天数]
 */
function nowToTheSpecifiedTimestampDifferDays(timestamp, start_timestamp) {
    (timestamp == '' || timestamp == undefined || timestamp == 'undefined' || isEmpty(timestamp)) ? $.now() : timestamp;
    var start_timestamp = (start_timestamp == '' || start_timestamp == undefined || start_timestamp == 'undefined' || isEmpty(start_timestamp)) ? $.now() : start_timestamp,
        end_timestamp = Date.parse(new Date(TimeTransformationDate(timestamp, true, true, true)));
    return Math.floor(Math.abs((end_timestamp - start_timestamp)) / (1000 * 60 * 60 * 24));
}

/**
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:图片上传转码base64
 * @englishAnnotation:
 * @param              {[type]}   url          [description]
 * @param              {Function} callback     [description]
 * @param              {[type]}   outputFormat [description]
 * @return             {[type]}                [description]
 */
function convertImgToBase64(url, callback, outputFormat) {
    var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d'),
        img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL(outputFormat || 'image/png');
        callback.call(this, dataURL);
        canvas = null;
    };
    img.src = url;
}

/**
 * [getObjectURL]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:本地图片预览
 * @englishAnnotation:
 * @param              {[type]} file [description]
 * @return             {[type]}      [description]
 */
function getObjectURL(file) {
    var url = null;
    if (window.webkitURL != undefined) url = window.webkitURL.createObjectURL(file);
    else if (window.createObjectURL != undefined) url = window.createObjectURL(file);
    else if (window.URL != undefined) url = window.URL.createObjectURL(file);
    return url;
}

/**
 * [previewUploadImg]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:本地图片预览
 * @englishAnnotation:
 * @param              {[type]} file [上传图片的标识]
 * @param              {[type]} fill [base64img]
 * @return             {[type]}      [description]
 */
function previewUploadImg(file, fill, inputfill) {
    $(file).trigger('click');
    $(file).on("change", function () {
        convertImgToBase64(getObjectURL(this.files[0]), function (base64img) {
            if ($(fill)) $(fill).attr('src', base64img);
            $(fill).css('display', 'block');
            uploadImgBase64img(base64img, inputfill);
        });
    })
}

/**
 * [updateHtmlTitle]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:修改当前页面的title标题
 * @englishAnnotation:
 * @param              {[string]} str [description]
 */
function updateHtmlTitle(str) {
    if (str == '' || str == undefined || str == 'undefined' || isEmpty(str)) return false;
    document.title = str;
}

/**
 * [isWeixin]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:检测是否为微信浏览器
 * @englishAnnotation:
 */
function isWeixin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') $("#rs").text("微信浏览器");
    else $("#rs").text("不是微信浏览器");
}

/**
 * [isEmpty]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:检测数据是否为空/是否存在
 * @englishAnnotation:
 * @param              {[string|array|object]}  data [需要检测的数据，可以为字符串、数组、对象]
 * @return             {Boolean}      [true/false]
 */
function isEmpty(data) {
    var type, data = $.trim(data);
    if (typeof data == undefined || typeof data == null || typeof data == '') return true;
    // else if (!data && data !== 0 && data !== '') return false;
    type = Object.prototype.toString.call(data).slice(8, -1);
    if (type.toLowerCase() == 'object') {
        if (Object.prototype.isPrototypeOf(data) && Object.keys(data).length === 0) return true;
        else return false;
    } else if (type.toLowerCase() == 'array') {
        if (Array.prototype.isPrototypeOf(data) && data.length === 0) return true;
        else return false;
    } else if (type.toLowerCase() == 'string') {
        if ($.trim(data).length === 0) return true;
        else return false;
    } else if (typeof type == 'boolean') return data;
    return false;
};

/**
 * [objectToArray]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:对象转成数组格式
 * @englishAnnotation:
 * @param              {[Object]} obj [description]
 */
function objectToArray(obj) {
    if (obj == '' || obj == undefined || obj == 'undefined' || isEmpty(obj)) return [];
    type = Object.prototype.toString.call(obj).slice(8, -1),
    arr = [];
    if (type.toLowerCase() == 'object') {
        if(!isEmpty(obj)){
            for (var key in obj) {
                if (!obj.hasOwnProperty(key)) continue;
                var item = {};
                item[key] = obj[key];
                arr.push(item);
            }
        }
    }
    return arr;
}

/*
 * 点击进行页面延迟跳转
 * URL 存在，跳转页面。不存在则不进行跳转
 */
/**
 * [delayHrefPage]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:点击进行页面延迟跳转
 *                     URL 存在，跳转页面。不存在则不进行跳转
 * @englishAnnotation:
 * @param              {[string]} url     [跳转的页面]
 * @param              {[int]} timeout [几秒后执行]
 * @param              {[int]} type    [类型]
 *                                     url为空时：1：刷新页面；2：返回上一页；其他：不做任何操作
 * @return             {[type]}         [description]
 */
function delayHrefPage(url, timeout, type) {
    type = (type == '' || type == undefined || type == 'undefined' || isEmpty(type)) ? 0 : Math.abs(parseInt(type));
    timeout = (timeout == '' || timeout == undefined || timeout == 'undefined' || isEmpty(timeout)) ? 3000 : timeout;
    setTimeout(function () {
        if (url == '' || url == undefined || url == 'undefined' || isEmpty(url)) {
            if (type == 1) window.location.reload();
            else if (type == 2) returnUrl();
            else return false;
        } else hrefUrl(url);
    }, timeout);
}


/*********************  layer组件 开始  ********************/

/**
 * [layerLoading]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:layer加载层
 * @englishAnnotation:
 * @param              {[string]} title   [标题]
 * @param              {[int]} icon    [图标]
 * @param              {[int]} timeout [加载时长]
 * @return             {[html]}         [description]
 */
function layerLoading(title, icon, timeout) {
    $('input[name=layerLoading]').val(0);
    layer.closeAll();
    title = (title == '' || title == undefined || title == 'undefined' || isEmpty(title)) ? '拼命加载中...' : title;
    icon = (icon == '' || icon == undefined || icon == 'undefined' || isEmpty(icon)) ? 16 : icon;
    timeout = (timeout == '' || timeout == undefined || timeout == 'undefined' || isEmpty(timeout)) ? 300000 : timeout;
    return layer.msg(title, {icon: icon, shade: [0.5, '#f5f5f5'], scrollbar: false, offset: '50%', time: timeout});
}

/**
 * [closeLayerLoading]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:关闭layer加载层
 * @englishAnnotation:
 * @return             {[type]} [description]
 */
function closeLayerLoading() {
    layer.closeAll();
    $('input[name=layerLoading]').val(1);
}

/**
 * [selectorLayerPageList]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:页面点击跳转
 * @englishAnnotation:
 * @param  {[int]} page [页码]
 */
function selectorLayerPageList(page) {
    var limit = $('div.layui-laypage span.layui-laypage-limits select option:selected').val();
    page = (page == '' || page == 'undefined' || page == undefined || isEmpty(page)) ? 1 : page;
    hrefUrl(thisUrl() + '?page=' + page + '&limit=' + Math.abs(limit));
}

/**
 * [layerMsg]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:layerMsg 提示框
 * @englishAnnotation:layer prompt box
 * @param              {[string]} title   [弹出框信息]
 * @param              {[int]} icon    [对应的表情：0:感叹号；1：笑脸；2：叉号（X）；3：问号；4：锁；5：哭脸；6：笑脸；]
 * @param              {[int]} timeout [时间，几秒之后消失]
 * @param              {[string]} url     [跳转URL地址]
 * @param              {[int]} type    [类型-决定返回/刷新]
 *                                     0：不进行其他任何操作；1：返回上一页；2：刷新当前页面；3：页面跳转；4：跳转到列表页面（针对于iframe/内容区域ajax请求）；5：执行函数操作
 * @param              {[function]} callback     [函数名]
 */
function layerMsg(title, icon, timeout, type, url, callback) {
    layer.closeAll();
    if (title == '' || title == undefined || title == 'undefined' || isEmpty(title)) return false;
    timeout = timeout == 0 ? 100 : timeout;
    timeout = (timeout == '' || timeout == undefined || timeout == 'undefined' || isEmpty(timeout)) ? 3000 : timeout;
    icon = (icon == '' || icon == 'undefined' || icon == undefined || isEmpty(icon)) ? 0 : icon;
    url = (url == '' || url == 'undefined' || url == undefined || isEmpty(url)) ? '' : url;
    type = (type == '' || type == undefined || type == 'undefined' || isEmpty(type)) ? 0 : type;
    callback = (callback == '' || callback == 'undefined' || callback == undefined || isEmpty(callback)) ? '' : callback;
    layer.msg(title, {icon: icon, time: timeout});//, title: webTitle
    switch (parseInt(type)) {
        case 0:
            break;
        case 1:
            setTimeout(function () {
                returnUrl();
            }, timeout);//检测上一页是否存在，是：返回；否：跳转首页
            break;
        case 2:
            setTimeout(function () {
                window.location.reload();
            }, timeout);//刷新当前页面
            break;
        case 3:
            if(!isEmpty(url)){
                setTimeout(function () {
                    hrefUrl(url);
                }, timeout);//页面跳转    
            }
            break;
        case 4:
            setTimeout(function () {
                loadingContentList();
            }, timeout); //跳转到当前栏目的列表页
            break;
        case 5:
            setTimeout(function () {
                callback();
            }, timeout); //执行函数操作
            break;
    }
    return false;
}

/**
 * [layerAlert]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:layerAlert layer 弹出提示，页面跳转
 * @englishAnnotation:
 * @param              {[string]} title   [弹出框信息]
 * @param              {[int]} icon    [对应的表情：0:感叹号；1：笑脸；2：叉号（X）；3：问号；4：锁；5：哭脸；6：笑脸；]
 * @param              {[int]} timeout [时间，几秒之后消失]
 * @param              {[string]} url     [跳转URL地址]
 * @param              {[int]} type    [类型-决定返回/刷新]
 *                                      0：不进行其他任何操作；1：返回上一页；2：刷新当前页面；3：页面跳转；4：跳转到列表页面；5：执行函数操作
 * @param              {[function]} callback     [函数名]
 */
function layerAlert(title, icon, timeout, url, type, callback) {
    // layer.closeAll();
    if (title == '' || title == undefined || title == 'undefined' || isEmpty(title)) return false;
    type = (type == '' || type == undefined || type == 'undefined' || isEmpty(type)) ? 0 : type;
    timeout = timeout == 0 ? 100 : timeout;
    timeout = (timeout == '' || timeout == undefined || timeout == 'undefined' || isEmpty(timeout)) ? 3000 : timeout;
    icon = (icon == '' || icon == 'undefined' || icon == undefined || isEmpty(icon)) ? 0 : icon;
    callback = (callback == '' || callback == 'undefined' || callback == undefined || isEmpty(callback)) ? '' : callback;
    webTitle = (webTitle == '' || webTitle == undefined || webTitle == 'undefined' || isEmpty(webTitle)) ? document.title : webTitle;
    switch (parseInt(type)) {
        case 0:
            layer.alert(title, {icon: icon, title: webTitle});
            break;
        case 1://检测上一页是否存在，是：返回；否：跳转首页
            layer.alert(title, {icon: icon, title: webTitle}, function (index) {
                setTimeout(function () {
                    returnUrl();
                }, timeout);
            });
            break;
        case 2://刷新当前页面
            layer.alert(title, {icon: icon, title: webTitle}, function (index) {
                setTimeout(function () {
                    location.reload();
                }, timeout);
            });
            break;
        case 3://页面跳转
            layer.alert(title, {icon: icon, title: webTitle}, function (index) {
                setTimeout(function () {
                    hrefUrl(url);
                }, timeout);
            });
            break;
        case 4://跳转到当前栏目的列表页
            layer.alert(title, {icon: icon, title: webTitle}, function (index) {
                layer.close(index);
                setTimeout(function () {
                    loadingContentList();
                }, timeout);
            });
            break;
        case 5://执行函数操作
            layer.alert(title, {icon: icon, title: webTitle}, function (index) {
                layer.close(index);
                setTimeout(function () {
                    callback();
                }, timeout);
            });
            break;
    }
    return false;
}

/**
 * [loadingContentList]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:重载列表页面---相当于刷新/跳转页面
 * @englishAnnotation:Overloaded list page -- equivalent to refresh / jump pages
 * @return             {[type]} [description]
 */
function loadingContentList() {
    var page_title = $.trim($('div.main div.pageTitle span').html()),
        main_title = $.trim($('div.main-title h2').html());
    $('div.sidebar ul.sidenav li.open ul li').each(function () {
        var title = $.trim($(this).find('a').html()),
            title_ = $.trim($(this).find('a').attr('data-title'));
        if (title == page_title || title_ == page_title || title == main_title || title_ == main_title) {
            $(this).find('a').trigger('click');
            return false;
        }
    });
}

/**
 * [laytpl laytpl的模板引擎 + laypage分页 + layer弹出框]
 * @param  {[array]} data     [数据]
 * @param  {[string]} tpl [模板引擎的html]
 * @param  {[string]} selector [选择器]
 * @param  {[string]} position [添加到的位置]
 * @param  {[string]} pageSelector [分页的选择器]
 * @param  {[int]} limit [每页展示的数量]--------去除
 * @param  {[int]} is_open_page [是否需要调用分页插件：1、调用；0、不调用]
 * @param  {[array]} form_data [表单的字段   form form的唯一标识]
 * @param  {[Function]} callback [刷新数据的函数名]
 * @param  {[int]} show_page [分页连续出现的页码个数]
 * @return {[html]}          [插入到指定位置]
 */
function laytpl(data, tpl, selector, position, pageSelector, is_open_page, form_data, callback, show_page) {
    data = (data == '' || data == 'undefined' || data == undefined || isEmpty(data)) ? [] : data;
    selector = (selector == '' || selector == 'undefined' || selector == undefined || isEmpty(selector)) ? 'contentList' : selector;
    position = (position == '' || position == 'undefined' || position == undefined || isEmpty(position)) ? 'after' : position;
    pageSelector = (pageSelector == '' || pageSelector == 'undefined' || pageSelector == undefined || isEmpty(pageSelector)) ? 'pageList' : pageSelector;
    tpl = (tpl == '' || tpl == 'undefined' || tpl == undefined || isEmpty(tpl)) ? demo.innerHTML : tpl;
    is_open_page = (is_open_page == '' || is_open_page == 'undefined' || is_open_page == undefined || isEmpty(is_open_page)) ? 0 : is_open_page;
    form_data = (form_data == '' || form_data == 'undefined' || form_data == undefined || isEmpty(form_data)) ? {'form': 'form.first_form'} : form_data;
    show_page = (show_page == '' || show_page == 'undefined' || show_page == undefined || isEmpty(show_page)) ? 5 : Math.abs(parseInt(show_page));
    callback = (callback == '' || callback == 'undefined' || callback == undefined || isEmpty(callback)) ? '' : callback;
    if (isEmpty(data)) return false;
    if (isEmpty($('form.first_form'))) return false;
    layui.use(['laytpl', 'laypage', 'layer'], function (index) {
        /**
         * [laytpl 模板引擎处理]
         */
        var laytpl = layui.laytpl,
            laypage = layui.laypage,
            pageAry = data.data;
        /**
         * [open 左右界定符]
         */
        laytpl.config({
            open: '<<{',
            close: '}>>'
        });
        var getTpl = tpl
            , view = document.getElementById('view');
        laytpl(getTpl).render(data, function (html) {
            if (data.curr == 1) $(selector).html(html);
            else {
                if (position == 'before') $(selector).before(html);
                else if (position == 'after') $(selector).after(html);
                else if (position == 'append') $(selector).append(html);
                else if (position == 'prepend') $(selector).prepend(html);
                else if (position == 'html') $(selector).html(html);
            }
        });
        /**
         * [该接口调取是否需要调用分页插件]
         */
        if (is_open_page == 0 || pageAry.total == 0) return false;
        /**
         * [laypage 分页数据处理]
         */
        laypage.render({
            elem: pageSelector,//选择器---只能是容器ID、DOM对象
            count: Math.abs(pageAry.total),//数量
            curr: Math.abs(pageAry.current_page),//当前页面/起始页码
            groups: show_page,//连续出现的页码个数
            limit: Math.abs(pageAry.per_page),//每页展示的数量
            layout: ['count', 'prev', 'page', 'next', 'limit', 'skip'],//自定义排版 , 'limit', 'skip'
            prev: '<em>←</em>',
            next: '<em>→</em>',
            theme: '#1E9FFF',//背景色
            jump: function (obj) {
                $(form_data['form'] + ' input[name=page]').val(Math.abs(pageAry.current_page));
                $(form_data['form'] + ' input[name=limit]').val(Math.abs(pageAry.per_page));
                var formPage = $(form_data['form'] + ' input[name=page]').val();
                var formLimit = $(form_data['form'] + ' input[name=limit]').val();
                //点击的页码
                $('#' + pageSelector + ' a').bind('click', function () {
                    if (!$(this).hasClass('layui-disabled') && $(this).attr('data-page') != 0) {
                        $(form_data['form'] + ' input[name=start_function]').val(1);
                        $(form_data['form'] + ' input[name=page]').val($(this).attr('data-page'));
                        callback();
                        return false;
                    }
                });
                //上一页
                $('#' + pageSelector + ' a.layui-laypage-prev').bind('click', function () {
                    if (!$(this).hasClass('layui-disabled') && $(this).attr('data-page') != 0) {
                        $(form_data['form'] + ' input[name=start_function]').val(1);
                        $(form_data['form'] + ' input[name=page]').val($(this).attr('data-page'));
                        callback();
                        return false;
                    }
                });
                //下一页
                $('#' + pageSelector + ' a.layui-laypage-next').bind('click', function () {
                    if (!$(this).hasClass('layui-disabled') && $(this).attr('data-page') != 0) {
                        $(form_data['form'] + ' input[name=start_function]').val(1);
                        $(form_data['form'] + ' input[name=page]').val($(this).attr('data-page'));
                        callback();
                        return false;
                    }
                });
                //填写页码，点击跳转
                $('#' + pageSelector + ' span.layui-laypage-skip button.layui-laypage-btn').bind('click', function () {
                    var page = $(this).parent().children('input.layui-input').val();
                    var limit = $('div.layui-laypage span.layui-laypage-limits select option:selected').val();
                    if (formPage != page || formLimit != limit) {
                        $(form_data['form'] + ' input[name=start_function]').val(1);
                        $(form_data['form'] + ' input[name=page]').val(Math.abs(page));
                        $(form_data['form'] + ' input[name=limit]').val(Math.abs(limit));
                        callback();
                        return false;
                    }
                });
                //每页数量改变的时候
                $('#' + pageSelector + ' div.layui-laypage span.layui-laypage-limits select').bind('change', function () {
                    var limit = $('div.layui-laypage span.layui-laypage-limits select option:selected').val();
                    if (formLimit != limit) {
                        $(form_data['form'] + ' input[name=start_function]').val(1);
                        $(form_data['form'] + ' input[name=limit]').val(Math.abs(limit));
                        $(form_data['form'] + ' input[name=page]').val(1);
                        callback();
                        return false;
                    }
                });
                //输入框的回车按钮
                $('#' + pageSelector + ' div.layui-laypage span.layui-laypage-skip input.layui-input').keydown(function (event) {
                    var page = $(this).parent().children('input.layui-input').val();
                    var limit = $('div.layui-laypage span.layui-laypage-limits select option:selected').val();
                    if (formPage != page || formLimit != limit) {
                        $(form_data['form'] + ' input[name=start_function]').val(1);
                        $(form_data['form'] + ' input[name=page]').val(Math.abs(page));
                        $(form_data['form'] + ' input[name=limit]').val(Math.abs(limit));
                        callback();
                        return false;
                    }
                });
            }
        });
    });
}

/**
 * [laypage]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:layui的分页组件
 * @englishAnnotation:
 * @param              {[array]} data         [数据]
 * @param              {[string]} pageSelector [分页的标识]
 * @param              {[array]} form_data    [form表单的标识]
 * @param              {[Function]} callback [刷新数据的函数名]
 * @param              {[int]} show_page    [分页连续出现的页码个数]
 * @return             {[html]}
 */
function laypage(data, pageSelector, form_data, callback, show_page) {
    pageSelector = (pageSelector == '' || pageSelector == 'undefined' || pageSelector == undefined || isEmpty(pageSelector)) ? 'pageList' : pageSelector;
    data = (data == '' || data == 'undefined' || data == undefined || isEmpty(data)) ? [] : data;
    form_data = (form_data == '' || form_data == 'undefined' || form_data == undefined || isEmpty(form_data)) ? {'form': 'form.first_form'} : form_data;
    show_page = (show_page == '' || show_page == 'undefined' || show_page == undefined || isEmpty(show_page)) ? 5 : show_page;
    callback = (callback == '' || callback == 'undefined' || callback == undefined || isEmpty(callback)) ? '' : callback;
    if (isEmpty(data)) return false;
    if (isEmpty($('form.first_form'))) return false;
    layui.use(['laypage'], function (index) {
        /**
         * [laytpl 模板引擎处理]
         */
        var laypage = layui.laypage,
            pageAry = data.data;
        /**
         * [laypage 分页数据处理]
         */
        laypage.render({
            elem: pageSelector,//选择器---只能是容器ID、DOM对象
            count: Math.abs(pageAry.total),//数量
            curr: Math.abs(pageAry.current_page),//当前页面/起始页码
            groups: show_page,//连续出现的页码个数
            limit: Math.abs(pageAry.per_page),//每页展示的数量
            layout: ['count', 'prev', 'page', 'next'],//自定义排版 , 'limit', 'skip'
            prev: '<em>←</em>',
            next: '<em>→</em>',
            theme: '#1E9FFF',//背景色
            jump: function (obj) {
                $(form_data['form'] + ' input[name=page]').val(Math.abs(pageAry.current_page));
                $(form_data['form'] + ' input[name=limit]').val(Math.abs(pageAry.per_page));
		var formPage = Math.abs(pageAry.current_page),
		    formLimit = Math.abs(pageAry.per_page),
		    limit = $('div.layui-laypage span.layui-laypage-limits select option:selected').val(),
                    page = $(this).parent().children('input.layui-input').val();
                //点击的页码
                $('#' + pageSelector + ' a').bind('click', function () {
                    if (!$(this).hasClass('layui-disabled') && $(this).attr('data-page') != 0) {
                        $(form_data['form'] + ' input[name=start_function]').val(1);
                        $(form_data['form'] + ' input[name=page]').val($(this).attr('data-page'));
                        callback();
                        return false;
                    }
                });
                //上一页
                $('#' + pageSelector + ' a.layui-laypage-prev').bind('click', function () {
                    if (!$(this).hasClass('layui-disabled') && $(this).attr('data-page') != 0) {
                        $(form_data['form'] + ' input[name=start_function]').val(1);
                        $(form_data['form'] + ' input[name=page]').val($(this).attr('data-page'));
                        callback();
                        return false;
                    }
                });
                //下一页
                $('#' + pageSelector + ' a.layui-laypage-next').bind('click', function () {
                    if (!$(this).hasClass('layui-disabled') && $(this).attr('data-page') != 0) {
                        $(form_data['form'] + ' input[name=start_function]').val(1);
                        $(form_data['form'] + ' input[name=page]').val($(this).attr('data-page'));
                        callback();
                        return false;
                    }
                });
                //填写页码，点击跳转
                $('#' + pageSelector + ' span.layui-laypage-skip button.layui-laypage-btn').bind('click', function () {
                    if (formPage != page || formLimit != limit) {
                        $(form_data['form'] + ' input[name=start_function]').val(1);
                        $(form_data['form'] + ' input[name=page]').val(Math.abs(page));
                        $(form_data['form'] + ' input[name=limit]').val(Math.abs(limit));
                        callback();
                        return false;
                    }
                });
                //每页数量改变的时候
                $('#' + pageSelector + ' div.layui-laypage span.layui-laypage-limits select').bind('change', function () {
                    if (formLimit != limit) {
                        $(form_data['form'] + ' input[name=start_function]').val(1);
                        $(form_data['form'] + ' input[name=limit]').val(Math.abs(limit));
                        $(form_data['form'] + ' input[name=page]').val(1);
                        callback();
                        return false;
                    }
                });
                //输入框的回车按钮
                $('#' + pageSelector + ' div.layui-laypage span.layui-laypage-skip input.layui-input').on('keyup', function (event) {
                    var max_value = $(this).parent().siblings('a.layui-laypage-last').attr('data-page'),
                        this_value = $(this).val(),
                        this_value = !isNaN(this_value) ? ( this_value <= 0 ? 1 : this_value) : 1,
			this_value = ( parseInt(this_value) > parseInt(max_value) ) ? max_value : this_value;
		    $(this).val(this_value);
                    $(this).bind('keypress',function(event){
                        if(event.keyCode == "13"){
                            $(form_data['form'] + ' input[name=start_function]').val(1);
                            $(form_data['form'] + ' input[name=limit]').val(Math.abs(limit));
                            $(form_data['form'] + ' input[name=page]').val(this_value);
                            callback();
                            return false;
                        }
                    });
                });
            }
        });
    });
}

/*********************  layer组件 结束  ********************/



/*********************  mui组件   开始  ********************/

/**
 * [muiMsg]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:MUI的消息提示框组件
 * @englishAnnotation:
 * @param              {[string]} title    [提示标题]
 * @param              {[string]} duration [持续显示时间,默认值 short(2000ms)]
 *                                         支持 整数值 和 String ,String可选: long(3500ms),short(2000ms)
 * @param              {[int]} timeout [时间，几秒之后消失]
 * @param              {[string]} url     [跳转URL地址]
 * @param              {[int]} type    [类型-决定返回/刷新]
 *                                      0：不进行其他任何操作；1：返回上一页；2：刷新当前页面；3：页面跳转；4：跳转到列表页面
 */
function muiMsg(title, duration, timeout, type, url, callback) {
    if (title == '' || title == undefined || title == 'undefined' || isEmpty(title)) return false;
    duration = (duration == '' || duration == undefined || duration == 'undefined' || isEmpty(duration)) ? 'short' : duration;
    type = (type == '' || type == undefined || type == 'undefined' || isEmpty(type)) ? 0 : type;
    timeout = timeout == 0 ? 100 : timeout;
    timeout = (timeout == '' || timeout == undefined || timeout == 'undefined' || isEmpty(timeout)) ? 3000 : timeout;
    url = (url == '' || url == 'undefined' || url == undefined || isEmpty(url)) ? '' : url;
    callback = (callback == '' || callback == 'undefined' || callback == undefined || isEmpty(callback)) ? '' : callback;//回调函数
    mui.toast(title, {duration: duration, type: 'div'});
    switch (parseInt(type)) {
        case 0:
            break;
        case 1:
            setTimeout(function () {
                returnUrl();
            }, timeout);//检测上一页是否存在，是：返回；否：跳转首页
            break;
        case 2:
            setTimeout(function () {
                window.location.reload();
            }, timeout);//刷新当前页面
            break;
        case 3:
            if(!isEmpty(url)){
                setTimeout(function () {
                    hrefUrl(url);
                }, timeout);//页面跳转    
            }
            break;
        case 4:
            setTimeout(function () {
                loadingContentList();
            }, timeout); //跳转到当前栏目的列表页
            break;
        case 5:
            setTimeout(function () {
                callback();
            }, timeout); //执行函数操作
            break;
    }
    return false;
}

/**
 * [muiAlert]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:MUI的 警告框/弹出框 组件
 * @englishAnnotation:
 * @param              {[string]}   message  [提示对话框上显示的内容]
 * @param              {[string]}   title    [提示对话框上显示的标题]
 * @param              {[string]}   btnValue [提示对话框上按钮显示的内容]
 * @param              {[function]} callback [提示对话框上关闭后的回调函数]
 * @param              {[string]}   type     [是否使用h5绘制的对话框]
 */
function muiAlert(message, title, btnValue, type, url, callback) {
    message = (message == '' || message == undefined || message == 'undefined' || isEmpty(message)) ? '提示' : message;
    if (isEmpty(message)) return false;
    title = (title == '' || title == undefined || title == 'undefined' || isEmpty(title)) ? '' : title;
    btnValue = (btnValue == '' || btnValue == undefined || btnValue == 'undefined' || isEmpty(btnValue)) ? '' : btnValue;
    url = (url == '' || url == 'undefined' || url == undefined || isEmpty(url)) ? '' : url;
    callback = (callback == '' || callback == 'undefined' || callback == undefined || isEmpty(callback)) ? '' : callback;//回调函数
    type = (type == '' || type == undefined || type == 'undefined' || isEmpty(type)) ? '' : type;
    mui.alert(message, title, btnValue, callback, type);
    switch (parseInt(type)) {
        case 0:
            break;
        case 1:
            setTimeout(function () {
                returnUrl();
            }, timeout);//检测上一页是否存在，是：返回；否：跳转首页
            break;
        case 2:
            setTimeout(function () {
                window.location.reload();
            }, timeout);//刷新当前页面
            break;
        case 3:
            if(!isEmpty(url)){
                setTimeout(function () {
                    hrefUrl(url);
                }, timeout);//页面跳转    
            }
            break;
        case 4:
            setTimeout(function () {
                loadingContentList();
            }, timeout); //跳转到当前栏目的列表页
            break;
        case 5:
            setTimeout(function () {
                callback();
            }, timeout); //执行函数操作
            break;
    }
    return false;
}

/**
 * [muiVerifyRemind]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:mui提示跳转到指定的焦点
 * @englishAnnotation:
 * @param              {[type]} title  [description]
 * @param              {[type]} unique [description]
 */
function muiVerifyRemind(title,unique){
    muiMsg(title);
    unique = (unique == '' || unique == undefined || unique == 'undefined') ? '' : unique;
    if(unique != '') $(unique).focus();
    return false;
}

/*********************  mui组件   结束  ********************/

/*************** 任意组件的焦点提示   开始  ****************/

/**
 * [verifyRemind]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:验证输入信息有误之后，提示并且焦点回转
 * @englishAnnotation:After verifying that the input information is incorrect, prompt and focus rotation is made
 * @param              {[string]} title    [提示语]
 * @param              {[string]} unique   [唯一标识]
 * @param              {[int]} assembly [提示类型/指定组件提示]
 */
function verifyRemind(title, unique, assembly, timeout) {
    if (title == '' || title == undefined || title == 'undefined' || isEmpty(title)) return false;
    assembly = (assembly == '' || assembly == undefined || assembly == 'undefined' || isEmpty(assembly)) ? 0 : assembly;
    unique = (unique == '' || unique == undefined || unique == 'undefined' || isEmpty(unique)) ? '' : unique;
    timeout = (timeout == '' || timeout == undefined || timeout == 'undefined' || isEmpty(timeout)) ? '3000' : timeout;
    if (isEmpty($(unique).val())) {
        switch (parseInt(assembly)) {
            case 1:
                layerMsg(title, 0, timeout);
                break;
            case 2:
                layerAlert(title);
                break;
            case 3:
                muiMsg(title);
                break;
            case 4:
                muiAlert(title);
                break;
            default:
                alert(title);
        }
        $(unique).focus();
        return false;
    } else return true;
}

/*************** 任意组件的焦点提示   结束  ****************/


/**
 * [ceil_num]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:向上取整
 * @englishAnnotation:
 * @param              {[type]} _this [description]
 * @return             {[type]}       [description]
 */
function ceil_num(_this) {
    $(_this).val(Math.ceil($(_this).val()));
}

/**
 * [two_decimal]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:只保留两位小数
 * @englishAnnotation:
 * @param              {[type]} obj [description]
 * @return             {[type]}     [description]
 */
function two_decimal(obj) {
    obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
}

/**
 * [isReturnNum]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:是否返回数字
 * @englishAnnotation:
 * @param              {[type]}  string         [description]
 * @param              {[type]}  default_string [description]
 * @return             {Boolean}                [description]
 */
function isReturnNum(string, default_string) {
    default_string = (default_string == '' || default_string == undefined || default_string == 'undefined' || isEmpty(default_string)) ? 0 : default_string;
    if (string == null || string == 0) return (default_string ? default_string : 0);
    else return string;
}

/**
 * [divideByThousand]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:除以千
 * @englishAnnotation:
 * @param              {[type]} num [description]
 * @return             {[type]}     [description]
 */
function divideByThousand(num) {
    num = (num == '' || num == undefined || num == 'undefined' || isEmpty(num)) ? 0 : num;
    return parseFloat(num) / parseFloat(1000);
}

/**
 * [isHasImg]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:检测图片是否存在
 * @englishAnnotation:
 * @param              {[type]}  pathImg [description]
 * @return             {Boolean}         [description]
 */
function isHasImg(pathImg) {
    var ImgObj = new Image();
    ImgObj.src = pathImg;
    if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) return true;
    else return false;
}


/*************** web uploader 组件   开始  ****************/

/**
 * [webUploaderImgs]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:web uploader + layer 图片上传操作
 * @englishAnnotation:
 * @version:1.2
 * @param              {[type]} unique                [上传按钮标识]
 * @param              {[type]} server                [上传地址]
 * @param              {[type]} picture_show_position [图片展示的位置标识]
 * @param              {[type]} input_unique          [上传图片之后返回的图片路径赋予给指定的input标识]
 * @param              {[type]} img_limit             [上传图片数量的限制：]
 *                                                    0：不限制
 *                                                    大于等于1 就为可上传的图片数量
 * @param              {[type]} swf_static            [swf文件路径]
 * @param              {[type]} show_static           [图片展示不同位置：]
 *                                                    1：before 标识之前
 *                                                    2: prepend 标识内部之前
 *                                                    3: html 标识内容
 *                                                    4: append 标识内部之后
 *                                                    5: after 标识之后
 *                                                    其他：append
 * @param              {Boolean} is_auto            [是否自动上传：false：关闭自动上传；true：自动上传]
 * @param              {[type]} upload_unique                [手动上传的标识]
 * @return             {[type]}                       [description]
 *
 *
 * 不建议使用手动上传：
 *     除非你是原生代码。
 *     使用框架的话，多图每次只会请求一次API，并且只会有一张图片传递。（具体原因：目测应该是框架做了屏蔽吗？（这个解释，我要笑死了，哈哈哈哈^_^）问题未解决！）
 *
 *     正常逻辑应该是：多图，有几张图就会请求几次API！
 */
function webUploaderImgs(unique, server, picture_show_position, input_unique, img_limit, swf_static, show_static, is_auto, upload_unique) {
    img_limit = (img_limit == '' || img_limit == undefined || img_limit == "undefined" || isEmpty(img_limit)) ? 0 : img_limit;
    input_unique = (input_unique == '' || input_unique == undefined || input_unique == "undefined" || isEmpty(input_unique)) ? '' : input_unique;
    swf_static = (swf_static == '' || swf_static == undefined || swf_static == "undefined" || isEmpty(swf_static)) ? '/webuploader-0.1.5/Uploader.swf' : swf_static;
    show_static = (show_static == '' || show_static == undefined || show_static == "undefined" || isEmpty(show_static)) ? 4 : show_static;
    server = (server == '' || server == undefined || server == "undefined" || isEmpty(server)) ? '/uploads/imgs' : server;
    is_auto = (is_auto == undefined || is_auto == "undefined" || isEmpty(is_auto) || Boolean(is_auto) != false || is_auto != false) ? true : is_auto;
    img_class = 'webuploader_img_limit_' + img_limit + '_unique_' + unique.replace('#', '');

    $(unique).attr('span-class', img_class);
    $(unique).attr('input_unique', input_unique);
    $(unique).attr('max', img_limit);
    // 初始化Web Uploader
    var uploader = WebUploader.create({
        auto: is_auto,// 选完文件后，是否自动上传。
        swf: swf_static,// swf文件路径
        server: server,// 文件接收服务端。 
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        // pick: unique,
        pick: {
            id: unique,
            multiple: false
        },
        formData: {},//data参数
        // 只允许选择图片文件。
        accept: {
            title: 'Images',
            extensions: 'gif,jpg,jpeg,bmp,png',
            mimeTypes: 'image/*'
        },
        fileNumLimit: img_limit,
        // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
        resize: false
    });

    count = 0,
        max = img_limit,
        flag = true;

    if (max > 0) {
        uploader.on('beforeFileQueued', function (file, res) {
            uploader.reset();
            count = $('.' + $(uploader['options']['pick']['id']).attr('span-class')).length;
            max = parseInt($(uploader['options']['pick']['id']).attr('max'));
            console.log(count, max, flag);
            if (count >= max && flag) {
                flag = false;
                this.trigger('error', 'Q_EXCEED_NUM_LIMIT', max, file);
                setTimeout(function () {
                    flag = true;
                    uploader.reset();//重置上传队列
                }, 1);
            }

            return count >= max ? false : true;
        });

        uploader.on('fileQueued', function () {
            count++;
            console.log('fileQueued------' + count);
        });

        uploader.on('fileDequeued', function () {
            count--;
            console.log('fileDequeued------' + count);
        });

        uploader.on('delWebUploaderImgs', {'count': count}, function () {
            count--;
            console.log('delWebUploaderImgs------' + count);
        });

        uploader.on('error', function (handler) {
            console.log(handler);
            if(handler=="Q_EXCEED_NUM_LIMIT") detectionPlugins('上传图片超出上限！');
            
        });
    }

    // 当有文件添加进来的时候
    uploader.on('fileQueued', function (file) {
        img_class = $(uploader['options']['pick']['id']).attr('span-class'),
            input_unique_val = $(uploader['options']['pick']['id']).attr('input_unique');
        //webUploaderImgHtml('', input_unique_val, img_class, file.id, file.name);
        var $li = $(webUploaderImgHtml('', input_unique_val, img_class, file.id, file.name)),
            $img = $li.find('img');

        // $list为容器jQuery实例
        switch (parseInt(show_static)) {
            case 1:
                $(picture_show_position).before($li);
                break;
            case 2:
                $(picture_show_position).prepend($li);
                break;
            case 3:
                $(picture_show_position).html($li);
                break;
            case 4:
                $(picture_show_position).append($li);
                break;
            case 5:
                $(picture_show_position).after($li);
                break;
            default :
                $(picture_show_position).append($li);
                break;
        }

        // 创建缩略图
        // 如果为非图片文件，可以不用调用此方法。
        // thumbnailWidth x thumbnailHeight 为 100 x 100
        thumbnailWidth = thumbnailHeight = '150';
        uploader.makeThumb( file, function( error, src ) {
            if ( error ) {
                $img.replaceWith('<span>不能预览</span>');
                return;
            }
            $img.attr( 'src', src );
        }, thumbnailWidth, thumbnailHeight );
    });

    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
    uploader.on( 'uploadSuccess', function( file , res) {
        if(!isEmpty($(input_unique)) && res.status == 1){
            (img_limit == 0 || isEmpty($(input_unique).val())) ? $(input_unique).val(res.data) : $(input_unique).val($(input_unique).val() + ',' + res.data);
            $( '#'+file.id ).attr('base-src', res.data);
        }else $( '#'+file.id ).remove();
        layerMsg(res.msg, res.status == 1 ? 1 : 5);
    });

    // 文件上传失败，显示上传出错。---我根本没碰到它
    uploader.on( 'uploadError', function( file ) {
        var $li = $( '#'+file.id ),
            $error = $li.find('div.error');

        // 避免重复创建
        if ( !$error.length ) $error = $('<div class="error"></div>').appendTo( $li );

        layerMsg('图片上传失败！', 5);
    });

    // 完成上传完了，成功或者失败，先删除进度条。---我根本没碰到它
    uploader.on( 'uploadComplete', function( file ) {
        $( '#'+file.id ).find('.progress').remove();
    });

    /**
     * 手动上传
     */
    if(is_auto == false && !isEmpty(upload_unique)){
        $(upload_unique).bind('click', function(){
            layerMsg('上传中……', 0);
            uploader.upload();
            layerMsg('上传成功！', 1);
        });
    }
}

/**
 * [webUploaderImgHtml]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:详情页面/修改页面的图片HTML返回，做预览
 * @englishAnnotation:
 * @version:1.2
 * @param              {[type]} img_src   [description]
 * @param              {[type]} file_id   [description]
 * @param              {[type]} img_class [description]
 * @param              {[type]} file_name [description]
 * @return             {[type]}           [description]
 */
function webUploaderImgHtml(img_src, input_unique, img_class, file_id, file_name) {
    img_src = (img_src == '' || img_src == undefined || img_src == "undefined" || isEmpty(img_src)) ? '' : img_src;
    file_id = (file_id == '' || file_id == undefined || file_id == "undefined" || isEmpty(file_id)) ? '' : file_id;
    img_class = (img_class == '' || img_class == undefined || img_class == "undefined" || isEmpty(img_class)) ? '' : img_class;
    file_name = img_src == '' ? file_name : img_src;
    return '<span id="' + file_id + '" class="profile-picture margin-right-2-rem position-relative ' + img_class + ' width-height-6_6-rem" base-src="' + img_src.replace('/goods_img/', '') + '">' +
        '   <img id="avatar" class="editable img-responsive editable-click editable-empty" alt="图片上传" src="' + file_name + '" style="width:100px;height:100px;">' +
        '   <button type="button" id="cboxClose" class="line-inherit color-white background-color-red" onclick="delWebUploaderImgs( this, \'' + input_unique + '\')">×</button>' +
        '</span>';
}

/**
 * [delWebUploaderImgs]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:删除已上传的图片
 * @englishAnnotation:
 * @version:1.2
 * @param              {[type]} _this [description]
 * @return             {[type]}       [description]
 */
function delWebUploaderImgs(_this, input_unique) {
    layer.confirm('确定要删除该图片吗？\b\n\r 删除之后将无法恢复！', {title: webTitle}, function (index) {
        $(input_unique).val(moreimgDeleteSpecifyImg($(input_unique).val(), $(_this).parent().attr('base-src')));//移除当前删除图片的img路径

        $(_this).parent().remove();
        layer.close(index);
        flag = true;
        count--;
    }, function () {
        layerMsg('取消删除图片操作！', 3, 1500);
    });
    count = count;
}

/**
 * [moreimgDeleteSpecifyImg]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:多图中，删除指定的图片img
 * @englishAnnotation:
 * @version:1.2
 * @param              {[type]} more_img [description]
 * @param              {[type]} del_img  [description]
 * @return             {[type]}          [description]
 */
function moreimgDeleteSpecifyImg(more_img, del_img) {
    if (more_img.indexOf(',' + del_img) >= 0) return more_img.replace(',' + del_img, '');
    else if (more_img.indexOf(del_img + ',') >= 0) return more_img.replace(del_img + ',', '');
    return more_img.replace(del_img, '');
}

/*************** web uploader 组件   结束  ****************/

/**
 * [getBrowserInfo]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:获取当前用户的浏览器类型
 * @englishAnnotation:
 * @version:1.0
 * @return             {[string]} [浏览器类型]
 */
function getBrowserInfo() {
    var agent = navigator.userAgent.toLowerCase(),
        arr = [],
        system = agent.split(' ')[1].split(' ')[0].split('(')[1],
        regStr_edge = /edge\/[\d.]+/gi,
        regStr_ie = /trident\/[\d.]+/gi,
        regStr_ff = /firefox\/[\d.]+/gi,
        regStr_chrome = /chrome\/[\d.]+/gi,
        regStr_saf = /safari\/[\d.]+/gi,
        regStr_opera = /opr\/[\d.]+/gi;
    return agent;
    /**
     * 下面获取的IP并不是真实的IP
     */
    arr.push(agent);
    //IE
    if (agent.indexOf("trident") > 0) {
        arr.push(agent.match(regStr_ie)[0].split('/')[1]);
        return arr;
    }
    //Edge
    if (agent.indexOf('edge') > 0) {
        arr.push(agent.match(regStr_edge)[0].split('/')[1]);
        return arr;
    }
    //firefox
    if (agent.indexOf("firefox") > 0) {
        arr.push(agent.match(regStr_ff)[0].split('/')[1]);
        return arr;
    }
    //Opera
    if (agent.indexOf("opr") > 0) {
        arr.push(agent.match(regStr_opera)[0].split('/')[1]);
        return arr;
    }
    //Safari
    if (agent.indexOf("safari") > 0 && agent.indexOf("chrome") < 0) {
        arr.push(agent.match(regStr_saf)[0].split('/')[1]);
        return arr;
    }
    //Chrome
    if (agent.indexOf("chrome") > 0) {
        arr.push(agent.match(regStr_chrome)[0].split('/')[1]);
        return arr;
    } else {
        arr.push('未获取到！')
        return arr;
    }
}

/**
 * [getIPs]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:获取用户的真实IP
 * @englishAnnotation:
 * @version:1.0
 * @param              {Function} callback [description]
 * @return             {[type]}            [description]
 *
 * demo:
 *     getIPs(function(ip){ console.log(ip) })
 */
function getIp(callback)
{
    var ip_dups = {};

    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection
    || window.mozRTCPeerConnection    || window.webkitRTCPeerConnection;
    var mediaConstraints = {
        optional: [{RtpDataChannels: true}]
    };
    //firefox already has a default stun server in about:config
    //  media.peerconnection.default_iceservers =
    //  [{"url": "stun:stun.services.mozilla.com"}]
    var servers = undefined;
    //add same stun server for chrome
    if(window.webkitRTCPeerConnection)
    servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};

    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);

    //listen for candidate events
    pc.onicecandidate = function(ice){
        //skip non-candidate events
        if(ice.candidate){
            //match just the IP address
            var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/,
            ip_info = ip_regex.exec(ice.candidate.candidate),
            ip_addr = ip_info[1] ? ip_info[1] : '';
            //remove duplicates
            if(ip_dups[ip_addr] === undefined) callback(ip_addr);
            ip_dups[ip_addr] = true;
        }
    };

    //create a bogus data channel
    pc.createDataChannel("");

    //create an offer sdp
    pc.createOffer(function(result){
        //trigger the stun server request
        pc.setLocalDescription(result, function(){});
    }, function(){});
}


function windowAlert(title, timeout, type, url, callback) {
    if (title == '' || title == undefined || title == 'undefined' || isEmpty(title)) return false;
    type = (type == '' || type == undefined || type == 'undefined' || isEmpty(type)) ? 0 : type;
    timeout = (timeout == '' || timeout == undefined || timeout == 'undefined' || isEmpty(timeout)) ? 3000 : timeout;
    callback = (callback == '' || callback == 'undefined' || callback == undefined || isEmpty(callback)) ? '' : callback;
    if (type == 0) alert(title);
    else {
        if (type == 1) {//检测上一页是否存在，是：返回；否：跳转首页
            alert(title);
            setTimeout(function () {
                returnUrl();
            }, timeout);
        } else if (type == 2) {//
            alert(title);
            setTimeout(function () {
                location.reload();
            }, timeout);
        } else if (type == 3) {//页面跳转
            alert(title);
            setTimeout(function () {
                hrefUrl(url);
            }, timeout);
        } else if (type == 4) { //跳转到当前栏目的列表页
            alert(title);
            setTimeout(function () {
                loadingContentList();
            }, timeout);
        } else if (type == 5) { //执行函数操作
            alert(title);
            setTimeout(function () {
                callback();
            }, timeout);
        }
    }
    return false;
}

/**
 * [rollingLoading]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:下拉加载
 * @englishAnnotation:
 * @version:1.0
 * @param              {[type]} functionName [函数名]
 * @param              {[type]} timeout      [时间间隔]
 * @return             {[type]}              [description]
 */
function rollingLoading(functionName, timeout){
    var timeoutInt,// 要保证最后要运行一次
        timeout = (timeout == '' || timeout == undefined || timeout == 'undefined') ? 1000 : timeout;
    window.onscroll = function () {
        setTimeout(function () {
            if (timeoutInt != undefined) window.clearTimeout(timeoutInt);
            timeoutInt = window.setTimeout(function () {
                //监听事件内容---当滚动条到底时,这里是触发内容---异步请求数据,局部刷新dom
                if($(document).height() == $(window).height() + $(window).scrollTop()) functionName;
            }, timeout);
        }, timeout);
    }
}











/*****************************************  此方法参数过多，不适合使用！！！    *******************************/


/**
 * [detectionPlugins]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:
 * @englishAnnotation:
 * @version:1.0
 * @param              {[type]}   title        [提示标题]
 *                                             muiAlert：弹出框的标题
 *                                             Other：内容信息
 * @param              {[type]}   assembly     [提示类型/指定组件提示]
 *                                             0：自动检测
 *                                                 先后顺序：
 *                                                     1：layerMsg
 *                                                     2：layerAlert
 *                                                     3：muiMsg
 *                                                     4：muiAlert
 *                                                     5：windowAlert
 *                                                     6：alert
 *                                             1：layerMsg
 *                                             2：layerAlert
 *                                             3：muiMsg
 *                                             4：muiAlert
 *                                             5：windowAlert
 *                                             6：alert
 * @param              {[type]}   icon         [description]
 *                                             layer：图标
 *                                             muiMsg：持续显示时间,默认值 short(2000ms)
 *                                             muiAlert：内容信息
 * @param              {[type]}   timeout      [description]
 *                                             layerMsg：时间，几秒之后消失，并且执行回调函数
 *                                             Other：几秒之后执行回调函数
 * @param              {[type]}   type         [类型-决定返回/刷新]
 *                                             0：不进行其他任何操作；
 *                                             1：返回上一页；
 *                                             2：刷新当前页面；
 *                                             3：页面跳转；
 *                                             4：跳转到列表页面（针对于iframe/内容区域ajax请求）；
 *                                             5：执行函数操作
 * @param              {[type]}   url          [跳转URL地址]
 * @param              {Function} callback     [回调函数]
 * @param              {[type]}   display_type [提示类型：0：提示层；1：弹出框]
 * @param              {[type]}   btnValue     [muiAlert：提示对话框上按钮显示的内容]
 * @return             {[type]}                [description]
 */
function detectionPlugins(title, assembly, icon, timeout, type, url, callback, display_type, btnValue) {
    if (title == '' || title == undefined || title == 'undefined' || isEmpty(title)) return false;
    assembly = (assembly == '' || assembly == undefined || assembly == 'undefined' || isEmpty(assembly)) ? 0 : assembly;//提示类型/指定组件提示
    type = (type == '' || type == undefined || type == 'undefined' || isEmpty(type)) ? 0 : type;
    timeout = timeout == 0 ? 100 : timeout;
    timeout = (timeout == '' || timeout == undefined || timeout == 'undefined' || isEmpty(timeout)) ? 3000 : timeout;
    duration = (icon == '' || icon == undefined || icon == 'undefined' || isEmpty(icon)) ? 'short' : icon;//muiMsg 持续显示时间,默认值 short(2000ms)
    _message = (icon == '' || icon == undefined || icon == 'undefined' || isEmpty(icon)) ? document.title : icon;//只针对于muiAlert
    callback = (callback == '' || callback == 'undefined' || callback == undefined || isEmpty(callback)) ? '' : callback;//回调函数
    display_type = (display_type == '' || display_type == undefined || display_type == 'undefined' || isEmpty(display_type)) ? 0 : display_type;//提示类型：0：提示层；1：弹出框
    btnValue = (btnValue == '' || btnValue == undefined || btnValue == 'undefined' || isEmpty(btnValue)) ? '' : btnValue;//muiAlert：提示对话框上按钮显示的内容
    switch (parseInt(assembly)) {
        case 0:
            try{
                timeout = (timeout == '' || timeout == undefined || timeout == 'undefined' || isEmpty(timeout)) ? 3000 : timeout;
                display_type == 0 ? layerMsg(title, icon, timeout, type, url, callback) : layerAlert(title, icon, timeout, type, url, callback);
            }catch(e){
                console.log(e.message+'， 检测MUI插件');
                try{
                    if(display_type == 0) muiMsg(title, duration, timeout, type, url, callback);
                    else muiAlert(title, _message, btnValue, type, url, callback);
                }catch(e){
                    console.log(e.message+'， 使用JQ弹出层');
                    try{
                        windowAlert(title, timeout, type, url, callback);
                    }catch(e){
                        console.log(e.message);
                        alert(title);
                    }
                }
            } 
            break;
        case 1:
            layerMsg(title, icon, timeout, type, url, callback);
            break;
        case 2:
            layerAlert(title, icon, timeout, type, url, callback);
            break;
        case 3:
            muiMsg(title, duration, timeout, type, url, callback);
            break;
        case 4:
            muiAlert(message, title, btnValue, type, url, callback);
            break;
        case 5:
            windowAlert(title, timeout, type, url, callback);
            break;
        case 6:
            alert(title);
            break;
    }
}