<?php
namespace App\Services\ApiServer\Response;

use App\Http\Controllers\Controller;
use App\Services\ApiServer\Server;
use App\Services\ApiServer\Error;

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
    public static function generateSign()
    {
        $server = new Server(new Error);
        $params = \Request::all();
        unset($params['sign']);
        return $server->generateMd5Sign($params);
    }
}
