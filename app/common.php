<?php
/**
 *
 *
 * 针对于laravel的方法函数
 *
 *
 */

/***************    缓存函数    开始    ***************/

/**
 * [set_cache]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:设置缓存
 * @englishAnnotation:
 * @param              [type] $key     [description]
 * @param              [type] $data    [description]
 * @param              [type] $minutes [description]$minutes = 7*24*60*60
 */
function set_cache($key, $data, $minutes = 5 * 60)
{
    return \Cache::put($key, $data, $minutes);
}

/**
 * [get_cache]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:获取缓存的数据
 * @englishAnnotation:
 * @param              [type] $key [description]
 * @return             [type]      [description]
 */
function get_cache($key)
{
    return \Cache::get($key) ?? '';
}

/**
 * [has_cache]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:是否存在该key的缓存
 * @englishAnnotation:
 * @param              [type]  $key [description]
 * @return             boolean      [description]
 */
function has_cache($key)
{
    return \Cache::has($key) ? true : false;
}

/**
 * [del_cache]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:删除缓存
 * @englishAnnotation:
 * @param              [type] $key [description]
 * @return             [type]      [description]
 */
function del_cache($key)
{
    return \Cache::forget($key) ?? false;
}

/***************    缓存函数    结束    ***************/

/**
 * [array_ksort_to_string]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:数组升序转成字符串
 * @englishAnnotation:
 * @version:1.0
 * @param              [type] $data [description]
 * @return             [type]       [description]
 */
function array_ksort_to_string($data){
	if(is_string($data)) return $data;
    ksort($data);
    $tmps = array();
    foreach ($data as $k => $v) $tmps[] = $k . $v;
    return implode('', $tmps);
}

/**
 * [is_mobile]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:是否为手机端访问
 * @englishAnnotation:
 * @version:1.0
 * @return             boolean [description]
 */
function is_mobile(){
    $useragent=isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : ''; 
    $useragent_commentsblock=preg_match('|\(.*?\)|',$useragent,$matches)>0?$matches[0]:'';    
    
    $mobile_os_list=array('Google Wireless Transcoder','Windows CE','WindowsCE','Symbian','Android','armv6l','armv5','Mobile','CentOS','mowser','AvantGo','Opera Mobi','J2ME/MIDP','Smartphone','Go.Web','Palm','iPAQ');
    $mobile_token_list=array('Profile/MIDP','Configuration/CLDC-','160×160','176×220','240×240','240×320','320×240','UP.Browser','UP.Link','SymbianOS','PalmOS','PocketPC','SonyEricsson','Nokia','BlackBerry','Vodafone','BenQ','Novarra-Vision','Iris','NetFront','HTC_','Xda_','SAMSUNG-SGH','Wapaka','DoCoMo','iPhone','iPod'); 

    $found_mobile=CheckSubstrs($mobile_os_list,$useragent_commentsblock) || 
    CheckSubstrs($mobile_token_list,$useragent); 

    if ($found_mobile) return true; 
    else return false;
}

function CheckSubstrs($substrs,$text){ 
    foreach($substrs as $substr){
    	if(false!==strpos($text,$substr)) return true;
    }
    return false; 
}

/**
 * [is_app]
 * @author:cnpscy <[2278757482@qq.com]>
 * @chineseAnnotation:检测是否为App
 * @englishAnnotation:
 * @version:1.0
 * @return             boolean [description]
 */
function is_app(){
    if (isset ($_SERVER['HTTP_X_WAP_PROFILE'])) return true;// 如果有HTTP_X_WAP_PROFILE则一定是移动设备
    // 如果via信息含有wap则一定是移动设备,部分服务商会屏蔽该信息
    if (isset ($_SERVER['HTTP_VIA'])) return stristr($_SERVER['HTTP_VIA'], "wap") ? true : false;// 找不到为flase,否则为true
    // 脑残法，判断手机发送的客户端标志,兼容性有待提高
    if (isset ($_SERVER['HTTP_USER_AGENT']))
    {
        $clientkeywords = ['nokia', 'sony', 'ericsson', 'mot', 'samsung', 'htc', 'sgh', 'lg', 'sharp', 'sie-', 'philips', 'panasonic', 'alcatel', 'lenovo', 'iphone', 'ipod', 'blackberry', 'meizu', 'android', 'netfront', 'symbian', 'ucweb', 'windowsce', 'palm', 'operamini', 'operamobi', 'openwave', 'nexusone', 'cldc', 'midp', 'wap', 'mobile' ];
        // 从HTTP_USER_AGENT中查找手机浏览器的关键字
        if (preg_match("/(" . implode('|', $clientkeywords) . ")/i", strtolower($_SERVER['HTTP_USER_AGENT']))) return true;
    }
    // 协议法，因为有可能不准确，放到最后判断
    if (isset ($_SERVER['HTTP_ACCEPT']))
    {
        // 如果只支持wml并且不支持html那一定是移动设备
        // 如果支持wml和html但是wml在html之前则是移动设备
        if ((strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') !== false) && (strpos($_SERVER['HTTP_ACCEPT'], 'text/html') === false || (strpos($_SERVER['HTTP_ACCEPT'], 'vnd.wap.wml') < strpos($_SERVER['HTTP_ACCEPT'], 'text/html')))) return true;
    }
    return false;
}