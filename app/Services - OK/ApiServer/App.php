<?php
namespace App\Services\ApiServer;

use App\Http\Models\App as AppModel;
use Carbon\Carbon;

/**
 * API服务端 - App应用相关
 *
 * @author cnpscy <[2278757482@qq.com]>
 */
class App
{
    /**
     * appid
     * @var [type]
     */
    protected $app_id;
    protected $app_secret;

    /**
     * 缓存key前缀
     * @var string
     */
    protected $cache_key_prefix = 'api:app:info:';

    /**
     * 初始化
     * @param [type] $app_id [description]
     */
    public function __construct(string $app_id)
    {
        $this->app_id = $app_id;
    }

    /**
     * 获取当前对象
     * @param  string $app_id appid
     * @return object
     */
    public static function getInstance(string $app_id)
    {
        static $_instances = [];
        if (array_key_exists($app_id, $_instances)) return $_instances[$app_id];
        return $_instances[$app_id] = new self($app_id);
    }

    /**
     * 获取app信息
     * @return AppModel
     */
    public function info()
    {
        $cache_key = $this->cache_key_prefix . $this->app_id;

        if (has_cache($cache_key)) return get_cache($cache_key);

        $app = AppModel::where(['app_id' => $this->app_id])->first();

        if ($app) set_cache($cache_key, $app, Carbon::now()->addMinutes(60)); // 写入缓存

        return $app;
    }
}
