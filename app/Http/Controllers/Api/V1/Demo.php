<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Api\V1\Common;

/**
 * demo 
 */
class Demo extends Common
{
    /**
     * 接口名称
     * @var string
     */
    protected $method = 'demo';

    public static function aaa()
    {
        return [ 'status' => 1, 'function' => 'Demo类中的aaa方法', 'code' => '200', 'data' => [] ];
    }

    public function bbb()
    {
        return [ 'status' => 1, 'function' => 'Demo类中的bbb方法', 'code' => '200', 'data' => [] ];
    }

    public function ccc()
    {
        return [ 'status' => 1, 'function' => 'Demo类中的ccc方法', 'code' => '200', 'data' => [] ];
    }
}