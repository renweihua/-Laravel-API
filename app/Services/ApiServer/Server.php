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
    protected $api_version = 'V1';
    
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
        // A.1 初步校验
        $rules = [
            'app_id' => 'required',
            'method' => 'required',
            'format' => 'in:,json',
            'sign_method' => 'in:,' . (string)(implode(',', $_encryption::SIGN_METHOD ?? $this->sign_method)),
            'app_secret' => 'required|string|min:1|max:32|',
            'sign' => 'required',
        ];
        $messages = [
            'app_id.required' => '100101',
            'method.required' => '100104',
            'format.in' => '100105',
            'sign_method.in' => '100106',
            'app_secret.required' => '100111',
            'app_secret.string' => '100112',
            'app_secret.min' => '100113',
            'app_secret.max' => '100113',
            'sign.required' => '100107'
        ];

        $v = Validator::make($this->params, $rules, $messages);

        if ($v->fails()) return $this->response(['status' => 0, 'code' => $v->messages()->first()]);

        // A.2 赋值对象
        $this->format = !empty($this->params['format']) ? $this->params['format'] : $this->format;
        $this->sign_method = !empty($this->params['sign_method']) ? $this->params['sign_method'] : $this->sign_method;
        $this->params['sign_method'] = !empty($this->params['sign_method']) ? $this->params['sign_method'] : $this->sign_method;//签名类型
        $this->params['api_version'] = !empty($this->params['api_version']) ? $this->params['api_version'] : $this->api_version;//api版本
        $this->api_version = $this->params['api_version'];//两者需要保持一致，其他方法需要使用版本来找控制器的路径
        $this->app_id = $this->params['app_id'];
        $this->method = $this->params['method'];


        // B. appid校验
        $app = App::getInstance($this->app_id)->info();
        if (empty($app)) return $this->response(['status' => 0, 'code' => '100102']);
        if (empty($app->{'status'})) return $this->response(['status' => 0, 'code' => '100103']);
        if ($app->{'app_secret'} != $this->params['app_secret']) return $this->response(['status' => 0, 'code' => '100114']);

        // C. 校验签名
        $signRes = $this->checkSign($this->params);
        if (!$signRes || !$signRes['status']) return $this->response(['status' => 0, 'code' => $signRes['code']]);

        // D. 通过方法名获取类名
        $className = self::getClassName($this->method);

        $classNameList = explode(';', $className);
        if (empty($classNameList)) return $this->response(['status' => 0, 'code' => '100109']);
        $return = [];
        if (count($classNameList) == 1) {
            $method_list = explode('/', $className);
            if (empty($method_list)) return $this->response(['status' => 0, 'code' => '100104']);

            include_once __DIR__ .'/executeClassFunction.php';//控制器函数调用的引入
        } else {
            foreach ($classNameList as $key => $value) {
                $method_list = explode('/', $value);
                if (empty($method_list)) continue;

                include_once __DIR__ .'/executeClassFunction.php';//控制器函数调用的引入
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
        $classPath = (empty($api_controller_location) ? __NAMESPACE__ . '\\Response\\' : $api_controller_location . '\\') . ( empty($this->api_version) ? '' : $this->api_version.'\\') . $className;
        
        if (!$className || !class_exists($classPath)) return ['status' => 0, 'code' => 404, 'data_name' => strtolower($className), 'data' => '类 {' . $classPath . '} 不存在！'];
        //api接口分发
        $class = new $classPath;

        return ['status' => 1, 'code' => 200, 'data' => (array)$class::apiReturn($class, $this->params, $className), 'data_name' => strtolower($className)];
    }

    /**
     * 校验签名
     * @param  [type] $params [description]
     * @return [type]         [description]
     */
    protected function checkSign($params_ary)
    {
        $sign = array_key_exists('sign', $params_ary) ? $params_ary['sign'] : '';

        if (empty($sign)) return array('status' => 0, 'code' => '100107');

        unset($params_ary['sign']);

        $params_str = array_ksort_to_string($params_ary);

        if (strtoupper($sign) == $this->generateSign($params_ary) && strtolower($this->sign_method) == 'md5') return array('status' => 1, 'code' => '200');
        else if ($this->encryption->hashVerify($params_str, $sign) && strtolower($this->sign_method) == 'hash') return array('status' => 1, 'code' => '200');
        else if (strtolower($this->sign_method) == 'openssl' && strtoupper($sign) == $this->encryption->opensslEncrypt($params_str)) return array('status' => 1, 'code' => '200');
        else if (strtolower($this->sign_method) == 'base64' && strtoupper($sign) == strtoupper(base64_encode($params_str))) return array('status' => 1, 'code' => '200');
        else if (strtolower($this->sign_method) == 'sha1' && strtoupper($sign) == strtoupper(sha1($params_str))) return array('status' => 1, 'code' => '200');
        return array('status' => 0, 'code' => '100108');
    }

    /**
     * 生成签名
     * @param  array $params 待校验签名参数
     * @return string|false
     */
    protected function generateSign($params)
    {
        if (strtolower($this->sign_method) == 'md5') return $this->encryption->generateMd5Sign($params);
        return false;
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
