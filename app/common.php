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

function array_ksort_to_string($data){
	if(is_string($data)) return $data;
    ksort($data);
    $tmps = array();
    foreach ($data as $k => $v) $tmps[] = $k . $v;
    return implode('', $tmps);
}