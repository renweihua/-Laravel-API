<?php
namespace App\Services\ApiServer;

/**
 * API服务端 - 错误码
 * @author cnpscy <[2278757482@qq.com]>
 */
class Error
{
    /**
     * 错误码
     * @var [type]
     */
    public static $errCodes = [
        // 系统码
        '200' => '成功！',
        '400' => '未知错误！',
        '401' => '无此权限！',
        '404' => '未找到！',
        '500' => '服务器异常！',

        // 公共错误码
        '100101' => '【app_id】 不可为空！',
        '100102' => '【app_id】 无权限！',
        '100103' => '【method】 不可为空！',
        '100104' => '【method】 方法不存在！',
        '100105' => '【format】 错误！',
        '100106' => '【sign_method】 错误！',
        '100107' => '【sign】 缺失！',
        '100108' => '【sign】 签名错误！',
        '100109' => '【app_secret】 不可为空！',
        '100110' => '【app_id】与【app_secret】 不匹配！',
        '100111' => '【api_token】 不可为空！',
        '100112' => '【app_secret】与【api_token】 不可同时为空！',
        '100113' => '【api_token】 已失效！',
        '100114' => ' 你是PC端，未授予权限请求接口！',
    ];

    /**
     * 返回错误码
     * @var string
     */
    public static function getError($code = '400', $_ = false)
    {
        if (!isset(self::$errCodes[$code])) $code = '400';

        return ($_ ? "[{$code}]" : '') . self::$errCodes[$code];
    }
}
