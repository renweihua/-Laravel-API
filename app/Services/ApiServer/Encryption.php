<?php
namespace App\Services\ApiServer;

/**
 * 加密类
 * @author cnpscy <[2278757482@qq.com]>
 */
class Encryption
{
    /**
     * 加密类型
     * @var array
     * 支持md5加密、hash加密、openssl加密、base64、sha1
     */
    const SIGN_METHOD = ['md5', 'hash', 'openssl', 'base64', 'sha1'];

    /**
     * openssl加密的向量
     * @var string
     */
    const OPENSSL_IV = "q]#ed'vfgh;lksj2";//必须16位
    /**
     * openssl加密的默认秘钥
     * @var string
     */
    const OPENSSL_KEY = '/*41-+[";./,aj&*';//必须16位

    /**
     * openssl加密的加密方法
     * @var string
     */
    const OPENSSL_METHOD = 'AES-256-CBC';

    /**
     * 默认签名方法
     * @var string
     */
    public $sign_method = 'md5';

    /**
     * [opensslDecrypt]
     * @author:cnpscy <[2278757482@qq.com]>
     * @chineseAnnotation:openssl 加密
     * @englishAnnotation:
     * @version:1.0
     * @param              string $string [加密字符串]
     * @param              string $key [self::OPENSSL_KEY]
     * @param              string $iv [self::OPENSSL_IV]
     * @return             [type]          [description]
     */
    public function opensslEncrypt(string $string, string $key = self::OPENSSL_KEY, string $iv = self::OPENSSL_IV)
    {
        return strtoupper(base64_encode(openssl_encrypt($string, self::OPENSSL_METHOD, $key, 0, $iv)));
    }

    /**
     * [opensslDecrypt]
     * @author:cnpscy <[2278757482@qq.com]>
     * @chineseAnnotation:openssl 解密
     * @englishAnnotation:
     * @version:1.0
     * @param              string $encrypt [需要解密的字符串]
     * @param              string $key [self::OPENSSL_KEY]
     * @param              string $iv [self::OPENSSL_IV]
     * @return             [type]          [description]
     */
    public function opensslDecrypt(string $encrypt, string $key = self::OPENSSL_KEY, string $iv = self::OPENSSL_IV)
    {
        $encrypt = base64_decode($encrypt);
        return openssl_decrypt($encrypt, self::OPENSSL_METHOD, $key, 0, $iv);
    }

    /**
     * md5方式签名
     * @param  array $params 待签名参数
     * @return string
     */
    public function generateMd5Sign($params)
    {
        return strtoupper(md5(array_ksort_to_string($params)));
    }

    /**
     * [hashEncryption]
     * @author:cnpscy <[2278757482@qq.com]>
     * @chineseAnnotation:hash进行加密操作
     * @englishAnnotation:
     * @param              string $string [description]
     * @return             [type]        [description]
     */
    public function hashEncryption(string $string)
    {
        return password_hash($string, PASSWORD_DEFAULT);
    }

    /**
     * [hashVerify]
     * @author:cnpscy <[2278757482@qq.com]>
     * @chineseAnnotation:检测密码和哈希值是否匹配
     * @englishAnnotation:
     * @param              [type] $pass      [明文密码]
     * @param              [type] $hash_pass [hash加密之后的密码]
     * @return             [boolean]          [description]
     */
    public function hashVerify(string $string, string $hash_pass)
    {
        return password_verify($string, $hash_pass);
    }
}
