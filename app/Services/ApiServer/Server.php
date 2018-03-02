<?php
namespace App\Services\ApiServer;

use Request;
use Validator;
use App\Services\ApiServer\Encryption;

/**
 * API服务端总入口
 * @author cnpscy <[2278757482@qq.com]>
 */
class Server
{
    /**
     * 请求参数
     * @var array
     */
    protected $params = [];

    /**
     * API请求Method名
     * @var string
     */
    protected $method;

    /**
     * app_id
     * @var string
     */
    protected $app_id;

    /**
     * app_secret
     * @var string
     */
    protected $app_secret;

    /**
     * api_token
     * @var string
     */
    protected $api_token = '';

    /**
     * 回调数据格式
     * @var string
     */
    protected $format = 'json';

    /**
     * 签名方法
     * @var string
     */
    protected $sign_method;

    /**
     * Api版本
     * @var string
     */
    public $api_version = 'V1';

    /**
     * 是否输出错误码
     * @var boolean
     */
    protected $error_code_show = false;

    /**
     * API 控制器/类 文件夹目录
     * @var string
     */
    const API_CONTROLLER_LOCATION = '';

    /**
     * 加密类
     * @var [type]
     */
    protected $encryption;

    /**
     * 请求API者的IP地址( ip字符串转换为 整型)
     * @var string
     */
    protected $request_ip;

    /**
     * 请求终端是否为App
     * @var string
     */
    protected $request_app;

    /**
     * 请求的域名
     * @var string
     */
    protected $domain_name;

    /**
     * 初始化
     * @param Error $error Error对象
     */
    public function __construct(Error $error, $API_CONTROLLER_LOCATION = '')
    {
        $this->params = Request::all();
        $this->error = $error;
        $this->API_CONTROLLER_LOCATION = $API_CONTROLLER_LOCATION;
        $this->encryption = new Encryption();
        $_encryption = $this->encryption;
        $this->sign_method = $_encryption->sign_method;
        $this->request_ip = ip2long(Request::getClientIp());//请求API的IP地址
        $this->request_app = is_app();//是否为移动端请求
        $this->domain_name = substr(Request::server('HTTP_REFERER'), 0, -1);//请求的域名
        unset($_encryption, $error, $API_CONTROLLER_LOCATION);
    }

    /**
     * api服务入口执行
     * @param  Request $request 请求参数
     * @return [type]           [description]
     */
    public function run()
    {
        $_encryption = $this->encryption;//加密方式

        /**
         * 参数检测
         */
        $rules = [
            'app_id' => 'required',
            'method' => 'required',
            'format' => 'in:,json',
            'sign_method' => 'in:,' . (string)(implode(',', $_encryption::SIGN_METHOD ?? $this->sign_method)),
            'sign' => 'required',
        ];
        $messages = [
            'app_id.required' => '100101',
            'method.required' => '100103',
            'format.in' => '100105',
            'sign_method.in' => '100106',
            'sign.required' => '100107'
        ];

        $v = Validator::make($this->params, $rules, $messages);
        if ($v->fails()) return $this->response(['status' => 0, 'code' => $v->messages()->first()]);

        /**
         * 赋值对象
         */
        $this->format = !empty($this->params['format']) ? $this->params['format'] : $this->format;
        $this->sign_method = !empty($this->params['sign_method']) ? $this->params['sign_method'] : $this->sign_method;
        $this->params['sign_method'] = !empty($this->params['sign_method']) ? $this->params['sign_method'] : $this->sign_method;//签名类型
        $this->params['api_version'] = !empty($this->params['api_version']) ? $this->params['api_version'] : $this->api_version;//api版本
        $this->api_version = $this->params['api_version'];//两者需要保持一致，其他方法需要使用版本来找控制器的路径
        $this->app_id = $this->params['app_id'] ?? $this->params['data']['app_id'];
        $this->method = $this->params['method'] ?? "";
        $this->api_token = $this->params['api_token'] ?? "";

        /**
         * api_token 与 app_secret 不可同时为空，至少存在一个就OK
         */
        if (empty($this->params['app_secret']) && empty($this->params['api_token'])) {
            if (empty($this->params['app_secret'])) return $this->response(['status' => 0, 'code' => '100109']);
            else if (empty($this->params['api_token'])) return $this->response(['status' => 0, 'code' => '100111']);
            else return $this->response(['status' => 0, 'code' => '100112']);
        }

        /**
         * api_token 与 app_secret 先后顺序为：api_token 先， app_secret 其次。
         */
        if (!empty($this->params['api_token'])) {
            /**
             * 检测 api_token 是否匹配
             * 认证失败之后，进行 app_id 与 app_secret 的验证
             */
            if (!($this->signBeforeCheckApiToken($this->app_id, $this->params['api_token']))) {
                if (!empty($this->params['app_secret']) && !empty($check_return = $this->appidAndAppsecretCheck($this->params))) return $check_return;
                else return $this->response(['status' => 0, 'code' => '100113']);
            }
        } else if (!empty($this->params['app_secret'])) {
            if (!empty($check_return = $this->appidAndAppsecretCheck($this->params))) return $check_return;// app_id 与 app_secret 的验证
        }


        // D. 通过方法名获取类名
        $className = self::getClassName($this->method);

        $classNameList = explode(';', $className);
        if (empty($classNameList)) return $this->response(['status' => 0, 'code' => '100103']);
        $return = [];
        if (count($classNameList) == 1) {
            $method_list = explode('/', $className);
            if (empty($method_list)) return $this->response(['status' => 0, 'code' => '100104']);

            include_once __DIR__ . '/executeClassFunction.php';//控制器函数调用的引入
        } else {
            foreach ($classNameList as $key => $value) {
                $method_list = explode('/', $value);
                if (empty($method_list)) continue;

                include_once __DIR__ . '/executeClassFunction.php';//控制器函数调用的引入
            }
        }
        return ['status' => 1, 'code' => '200', 'return_time' => date('Y-m-d H:i:s'), 'data' => $return];
    }

    /**
     * [executeClassFunction]
     * @author:cnpscy <[2278757482@qq.com]>
     * @chineseAnnotation:执行类中方法操作
     * @englishAnnotation:
     * @version:1.0
     * @param              array $method_list [description]
     * @return             [type]              [description]
     */
    public function executeClassFunction(array $method_list)
    {
        $className = $method_list[0];
        $this->params['function_name'] = (count($method_list) > 1) ? $method_list[1] : '';//执行类中的某个方法

        //判断类名是否存在---配置API控制器文件夹路径
        $api_controller_location = empty(self::API_CONTROLLER_LOCATION) ? config('app.API_CONTROLLER_LOCATION') : self::API_CONTROLLER_LOCATION;
        $classPath = (empty($api_controller_location) ? __NAMESPACE__ . '\\Response\\' : $api_controller_location . '\\') . (empty($this->api_version) ? '' : $this->api_version . '\\') . $className;

        if (!$className || !class_exists($classPath)) return ['status' => 0, 'code' => 404, 'data_name' => strtolower($className), 'data' => '类 {' . $classPath . '} 不存在！'];

        $class = new $classPath;//api接口分发

        return ['status' => 1, 'code' => 200, 'data' => (array)$class::apiReturn($class, $this->params, $className), 'data_name' => strtolower($className)];
    }

    /**
     * [checkSign]
     * @author:cnpscy <[2278757482@qq.com]>
     * @chineseAnnotation:校验签名
     * @englishAnnotation:
     * @version:1.0
     * @return             [type] [description]
     */
    protected function checkSign($params_ary)
    {
        $data['app_id'] = $params_ary['app_id'] ?? $this->app_id;
        $data['app_secret'] = $params_ary['app_secret'] ?? '';
        $data['method'] = $params_ary['method'] ?? '';
        $data['sign_method'] = $params_ary['sign_method'] ?? $this->encryption->sign_method;
        $data['api_version'] = $params_ary['api_version'] ?? $this->api_version;
        $data['sign'] = $params_ary['sign'] ?? '';
        $data['api_token'] = $params_ary['api_token'] ?? '';
        $sign = strtoupper(array_key_exists('sign', $data) ? $data['sign'] : '');

        if (empty($sign)) return array('status' => 0, 'code' => '100107');

        $sign_oupper = array_key_exists('sign', $data) ? $data['sign'] : '';

        unset($data['sign']);

        $params_str = strtoupper(array_ksort_to_string($data));

        if (
            (strtoupper($sign) == strtoupper($this->encryption->generateMd5Sign($params_str)) && strtolower($this->sign_method) == 'md5')
            ||
            ($this->encryption->hashVerify($params_str, $sign_oupper) && strtolower($this->sign_method) == 'hash')
            ||
            (strtolower($this->sign_method) == 'openssl' && strtoupper($sign) == strtoupper($this->encryption->opensslEncrypt($params_str)))
            ||
            (strtolower($this->sign_method) == 'base64' && strtoupper($sign) == strtoupper(base64_encode($params_str)))
            ||
            (strtolower($this->sign_method) == 'sha1' && strtoupper($sign) == strtoupper(sha1($params_str)))
        ) {
            return $this->signSuccessStorageCache($data['app_id']) ? ['status' => 1, 'code' => '200'] : ['status' => 0, 'code' => '100108'];
        } else return array('status' => 0, 'code' => '100108');
    }

    /**
     * [appidAndAppsecretCheck]
     * @author:cnpscy <[2278757482@qq.com]>
     * @chineseAnnotation:app_id 与 app_secret 的验证
     * @englishAnnotation:
     * @version:1.0
     * @return             [type] [description]
     */
    protected function appidAndAppsecretCheck(array $params = [])
    {
        $app = App::getInstance($this->app_id)->info($params);
        if (empty($app)) return $this->response(['status' => 0, 'code' => '100101']);
        else if (empty($app->{'status'})) return $this->response(['status' => 0, 'code' => '100102']);
        else if ($app->{'app_secret'} != $this->params['app_secret']) return $this->response(['status' => 0, 'code' => '100110']);
        else if(!$this->request_app){
            if(substr_count($app->{'domain_name'}, '/') == 3) $app->{'domain_name'} = substr($app->{'domain_name'}, 0, -1);
            if (ip2long($app->{'request_browser_ip'}) != $this->request_ip && $app->{'domain_name'} != $this->domain_name) return $this->response(['status' => 0, 'code' => '100114']);
        }

        // C. 校验签名
        $signRes = $this->checkSign($this->params);
        if (!$signRes || !$signRes['status']) return $this->response(['status' => 0, 'code' => $signRes['code']]);
    }

    /**
     * [signSuccessStorageCache]
     * @author:cnpscy <[2278757482@qq.com]>
     * @chineseAnnotation:sign 认证之前，参数存在 api_token，先验证 api_token
     * @englishAnnotation:
     * @version:1.0
     * @param              string $app_id [description]
     * @return             [type]         [description]
     */
    public function signBeforeCheckApiToken(string $app_id, string $api_token)
    {
        if (has_cache($app_id . '_' . $this->request_ip)) {
            $sign_cache = get_cache($app_id . '_' . $this->request_ip);
            if (empty($sign_cache)) return false;
            else if ($sign_cache['expire_time'] >= time() && $api_token == $sign_cache['api_token']) return true;
        }
        return false;
    }

    /**
     * [cacheData]
     * @author:cnpscy <[2278757482@qq.com]>
     * @chineseAnnotation:设置缓存的数据
     * @englishAnnotation:
     * @version:1.0
     * @param              string $app_id [description]
     * @return             [type]         [description]
     */
    protected function cacheData(string $app_id){
        $api_cache['request_ip'] = $this->request_ip;
        $api_cache['app_id'] = $app_id;
        $api_cache['api_token'] = md5(uniqid(md5(microtime(true)),true));//生成一个不会重复的字符串
        $api_cache['expire_time'] = time() + 10 * 60;
        return $api_cache;
    }

    /**
     * [signSuccessStorageCache]
     * @author:cnpscy <[2278757482@qq.com]>
     * @chineseAnnotation:sign 认证成功之后，进行数据缓存
     * @englishAnnotation:
     * @version:1.0
     * @param              string $app_id [description]
     * @return             [type]         [description]
     */
    protected function signSuccessStorageCache(string $app_id)
    {
        $api_cache = $this->cacheData($app_id);

        if (has_cache($api_cache['app_id'] . '_' . $api_cache['request_ip'])) {
            $sign_cache = get_cache($api_cache['app_id'] . '_' . $api_cache['request_ip']);
            if (empty($sign_cache)) set_cache($api_cache['app_id'] . '_' . $api_cache['request_ip'], $api_cache, 10 * 60);
            else if ($sign_cache['expire_time'] < time()) set_cache($api_cache['app_id'] . '_' . $api_cache['request_ip'], $api_cache, 10 * 60);
        } else set_cache($api_cache['app_id'] . '_' . $api_cache['request_ip'], $api_cache, 10 * 60);
        return true;
    }

    /**
     * [getSignSuccessSetCache]
     * @author:cnpscy <[2278757482@qq.com]>
     * @chineseAnnotation:Api获取sign成功之后，返回的 api_token 
     * @englishAnnotation:
     * @version:1.0
     * @return             [type] [description]
     */
    public function getSignSuccessSetCache(string $app_id){
        $api_cache = $this->cacheData($app_id);

        if (has_cache($api_cache['app_id'] . '_' . $api_cache['request_ip'])) {
            $sign_cache = get_cache($api_cache['app_id'] . '_' . $api_cache['request_ip']);
            if(!empty($sign_cache) && trim($sign_cache['app_id']) == trim($api_cache['app_id']) && $sign_cache['expire_time'] >= time()) $api_cache['api_token'] = $sign_cache['api_token'];
            else set_cache($api_cache['app_id'] . '_' . $api_cache['request_ip'], $api_cache, 10 * 60);
        } else set_cache($api_cache['app_id'] . '_' . $api_cache['request_ip'], $api_cache, 10 * 60);

        return $api_cache['api_token'];
    }

    /**
     * 通过方法名转换为对应的类名
     * @param  string $method 方法名
     * @return string|false
     */
    protected function getClassName($method)
    {
        $methods = explode('.', $method);

        if (!is_array($methods)) return false;

        $tmp = array();
        foreach ($methods as $value) $tmp[] = ucwords($value);

        $className = implode('', $tmp);
        return $className;
    }

    /**
     * 输出结果
     * @param  array $result 结果
     * @return response
     */
    protected function response(array $result)
    {
        if (!array_key_exists('msg', $result) && array_key_exists('code', $result)) $result['msg'] = $this->getError($result['code']);

        if ($this->format == 'json') return response()->json($result);

        return false;
    }

    /**
     * 返回错误内容
     * @param  string $code 错误码
     * @return string
     */
    protected function getError($code)
    {
        return $this->error->getError($code, $this->error_code_show);
    }
}
