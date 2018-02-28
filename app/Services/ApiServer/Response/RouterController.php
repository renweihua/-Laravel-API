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
        $params = \Request::all();
        $params['sign_method'] = empty($params['sign_method']) ? $encryption->sign_method : $params['sign_method'];
        if(!in_array(strtolower($params['sign_method']), $encryption::SIGN_METHOD)) return ['status' => 0, 'code' => 404, 'data' => '加密方式 {'.strtolower($params['sign_method']).'} 未找到！'];

        unset($params['sign']);
        $params_str = array_ksort_to_string($params);

        if(empty($params['sign_method']) || strtolower($params['sign_method']) == 'md5') return ['status' => 1, 'code' => 200, 'data' => $encryption->generateMd5Sign($params_str)];
        else if(strtolower($params['sign_method']) == 'hash') return ['status' => 1, 'code' => 200, 'data' => $encryption->hashEncryption($params_str)];
        else if(strtolower($params['sign_method']) == 'openssl') return ['status' => 1, 'code' => 200, 'data' => $encryption->opensslEncrypt($params_str)];
        else if(strtolower($params['sign_method']) == 'base64') return ['status' => 1, 'code' => 200, 'data' => strtoupper(base64_encode($params_str))];
        else if(strtolower($params['sign_method']) == 'sha1') return ['status' => 1, 'code' => 200, 'data' => strtoupper(sha1($params_str))];
    }
}
