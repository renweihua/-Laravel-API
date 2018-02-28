<?php
namespace App\Http\Controllers\Api\V1;

use App\Services\ApiServer\Response\BaseResponse;
use App\Services\ApiServer\Response\InterfaceResponse;

/**
 * 公共控制器
 */
class Common extends BaseResponse implements InterfaceResponse
{
    /**
     * 接口名称
     * @var string
     */
    protected $method = 'common';

    /**
     * [apiReturn]
     * @author:cnpscy <[2278757482@qq.com]>
     * @chineseAnnotation:默认返回格式
     * @englishAnnotation:
     * @version:1.0
     * @param              [type] &$_this  [description]
     * @param              [type] &$params [description]
     * @return             [type]          [description]
     */
    public static function apiReturn(&$_this, array &$params = [])
    {
        if(empty($params)) return ['status' => 0, 'code' => '404'];
        else if (empty($params['function_name'])) return ['status' => 1, 'code' => '200', 'data' => []];
        else {
            $params['function_list'] = explode('-', $params['function_name']);
            if (is_array($params['function_list'])) {
                $_func_list = get_class_methods($_this);//当前类所拥有的方法列表
                foreach ($params['function_list'] as $key => $value) {
                    if(empty($value)) continue;
                    if (!in_array($value, $_func_list)) $return_list[$value] = ['status' => 0, 'code' => '404', 'msg' => '方法 {' . $value . '} 不存在！'];
                    else $return_list[$value] = $_this->$value();
                }
                unset($params);
                return $return_list;
            } else return $_this->$params['function_name'];
        }
    }
}