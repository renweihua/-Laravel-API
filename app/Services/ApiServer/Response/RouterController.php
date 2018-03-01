<?php
namespace App\Services\ApiServer\Response;

use App\Http\Controllers\Controller;
use App\Services\ApiServer\Server;
use App\Services\ApiServer\Error;
use App\Services\ApiServer\Encryption;

/**
 * Api入口控制器
 * @author cnpscy <[2278757482@qq.com]>
 */
class RouterController extends Controller
{
    /**
     * API总入口
     * @return [type] [description]
     */
    public static function index()
    {
        $server = new Server(new Error);
        return $server->run();
    }

    /**
     * [generateSign]
     * @author:cnpscy <[2278757482@qq.com]>
     * @chineseAnnotation:生成sign验签
     * @englishAnnotation:
     * @version:1.0
     * @return             [type] [description]
     */
    public static function getGenerateSign()
    {
        $encryption = new Encryption();
        $server = new Server(new Error);
        $params = \Request::all();
        $params['sign_method'] = empty($params['sign_method']) ? $encryption->sign_method : $params['sign_method'];

        $data_get['app_id'] = $params['app_id'] ?? '';
        $data_get['app_secret'] = $params['app_secret'] ?? '';
        $data_get['method'] = $params['method'] ?? '';
        $data_get['sign_method'] = $params['sign_method'] ?? $encryption->sign_method;
        $data_get['api_version'] = $params['api_version'] ?? $server->api_version;
        $data_get['sign'] = $params['sign'] ?? '';

        unset($params);

        if(!in_array(strtolower($data_get['sign_method']), $encryption::SIGN_METHOD)) return ['status' => 0, 'code' => 404, 'data' => '加密方式 {'.strtolower($data_get['sign_method']).'} 未找到！'];

        unset($data_get['sign']);
        $params_str = strtoupper(array_ksort_to_string($data_get));

        if(empty($data_get['sign_method']) || strtolower($data_get['sign_method']) == 'md5') return ['status' => 1, 'code' => 200, 'data' => $encryption->generateMd5Sign($params_str), 'str' => $params_str];
        else if(strtolower($data_get['sign_method']) == 'hash') return ['status' => 1, 'code' => 200, 'data' => $encryption->hashEncryption($params_str), 'str' => $params_str];
        else if(strtolower($data_get['sign_method']) == 'openssl') return ['status' => 1, 'code' => 200, 'data' => $encryption->opensslEncrypt($params_str), 'str' => $params_str];
        else if(strtolower($data_get['sign_method']) == 'base64') return ['status' => 1, 'code' => 200, 'data' => base64_encode($params_str), 'str' => $params_str];
        else if(strtolower($data_get['sign_method']) == 'sha1') return ['status' => 1, 'code' => 200, 'data' => sha1($params_str), 'str' => $params_str];
    }
}
