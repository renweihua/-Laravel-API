var webTitle = '小丑疯狂吧',
	API_HOST = thisOrigin() + '/',
    API_URL = 'api',
    APP_ID = '123456',
    APP_SECRET = '654321',
    API_TOKEN = '',
    API_DATA = {
        'method' : 'demo/aaa-bbb-ccc',
        /**
         * sign_method：
         * md5---base64---sha1      通过js加密获取 sign
         * openssl 与 hash          则是通过Ajax请求之后获取sign
         */
        'sign_method' : 'base64',
        'api_version' : 'V1',
        'app_id' : APP_ID,
        'app_secret' : APP_SECRET,
        'api_token' : API_TOKEN,
        'url' : 'api',
        'sign' : '',
    };

    delete API_DATA.sign;
    delete API_DATA.url;
    api_data_ary = objectToArrayKV(API_DATA),
    api_data_string = (arraySortToString(api_data_ary)).toUpperCase();

    if($.trim(API_DATA.sign_method).toLowerCase() == 'md5') API_DATA.sign = $.md5(api_data_string).toUpperCase();
    else if($.trim(API_DATA.sign_method).toLowerCase() == 'base64') API_DATA.sign = base64encode(api_data_string).toUpperCase();
    else if($.trim(API_DATA.sign_method).toLowerCase() == 'sha1') API_DATA.sign = hex_sha1(api_data_string).toUpperCase();

    

/**
 * [objectToArrayKV]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:对象转换成数组，键值与键名保留
 * @englishAnnotation:
 * @version:1.0
 * @param              {[type]} obj [description]
 * @return             {[type]}     [description]
 */
function objectToArrayKV(obj) {
    if (obj == '' || obj == undefined || obj == 'undefined' || isEmpty(obj)) return [];
    type = Object.prototype.toString.call(obj).slice(8, -1),
    arr = [];
    if (type.toLowerCase() == 'object') {
        if(!isEmpty(obj)){
            for (var key in obj) {
                if (!obj.hasOwnProperty(key)) continue;
                arr[key] = obj[key];
            }
        }
    }
    return arr;
}

/**
 * [arraySortToString]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:数组升序排列，并且转换成字符串
 * @englishAnnotation:
 * @version:1.0
 * @param              {[type]} array [description]
 * @return             {[type]}       [description]
 */
function arraySortToString(array){
    type = Object.prototype.toString.call(array).slice(8, -1),
    arr = [],
    str = '',
    i = 0;
    if (type.toLowerCase() == 'array') {
        for (var key in array) {
        	arr[i] = key;
        	i++;
        }
        arr.sort();
        for (var k in arr) str += arr[k] + array[arr[k]];
    }
    return str;
}