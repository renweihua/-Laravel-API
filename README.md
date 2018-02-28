# 基于Laravel的API服务端架构代码

借鉴地址：https://github.com/flc1125/ApiServer

[TOC]

## 1. 部署说明

> 现有API基于laravel框架开发，本次介绍也针对laravel。可根据文档自行调整，以适用其他框架下使用

### 1.1. 数据库相关

执行数据库迁移命令 ###迁移文件为：2018_02_27_100134_create_apps_table.php


### 1.2. 目录相关

|标题|路径|
|----|----|
|API核心目录|`app/Services/ApiServer/`|
|API接口目录（默认路径，可自行修改-----env文件中的 API_CONTROLLER_LOCATION 配置）|`app/Http/Controllers/Api/`|
|apps数据库模型|`app/Models/App.php`|
|路由配置|`app/Http/routes.php`|
|API入口控制器|`app/Services/ApiServer/Response/RouterController.php`|

## 2. API文档及开发规范

### 2.1. API调用协议

#### 2.1.1. 请求地址及请求方式

> GET 请求地址：`/api`   API请求地址;

> GET 请求地址：`/get_api_sign`   API的参数加密之后的sign返回;

#### 2.1.2. 公共参数

|参数名|类型|是否必须|描述|
|----|----|----|----|
|app_id|string|是|应用ID|
|app_secret|string|是|密钥|
|method|string|是|接口名称|可进行多个控制多个方法同时请求操作|
|format|string|否|回调格式，默认：json（目前仅支持）|
|sign_method|string|否|签名类型/加密方式，默认：md5（支持md5加密、hash加密、openssl加密、base64、sha1）|
|api_version|string|否|Api版本，默认：V1（可进行传参变更）|
|sign|string|是|签名字符串，参考[签名规则](#签名规则)|

#### 2.1.3. 签名规则

- 对所有API请求参数（包括公共参数和请求参数，但除去`sign`参数），根据参数名称的ASCII码表的顺序排序。如：`foo=1, bar=2, foo_bar=3, foobar=4`排序后的顺序是`bar=2, foo=1, foo_bar=3, foobar=4`。
- 将排序好的参数名和参数值拼装在一起，根据上面的示例得到的结果为：bar2foo1foo_bar3foobar4。
- 把拼装好的字符串采用utf-8编码，使用签名算法对编码后的字节流进行摘要。如果使用`MD5`算法，则：md5(secret+bar2foo1foo_bar3foobar4+secret)
- 将摘要得到的字节结果使用大写表示

#### 2.1.5. 返回结果

```json

例如：http://localhost/get_api_sign?app_id=66231&method=demo/bbb;Test/aaa;Test1/aaa&sign_method=md5&app_secret=0326&sign=C0D19C39E8DFE3FDF78915718C40902E&api_version=v2

#接口验签成功：
{
    "status": true,
    "code": "200",
    "msg": "成功",
    "data": {
        "demo": {
            "status": 1,
            "code": 200,
            "data" : {
                "bbb": {
                    "status": 1,
                    "code": 200,
                    "data": {
                        []
                    }
                }
            }
        },
        "test": {
            "status": 1,
            "code": 200,
            "data" : {
                "abc": {
                    "status": 0,
                    "code": 404,
                    "msg": "方法 {abc} 不存在！"
                }
            }
        },
        "test1": {
            "status": 0,
            "code": 404,
            "msg" : "类 {App\Http\Controllers\Api\V1\Test1} 不存在！"
        }
    }
}

> 错误码配置：`app/Services/ApiServer/Error.php`

现有错误码：

|错误码|错误内容|
|----|----|
|200|成功|
|400|未知错误|
|401|无此权限|
|404|未找到|
|500|服务器异常|
|100101|【app_id】 丢失|
|100102|【app_id】 不存在|
|100103|【app_id】 无权限
|100104|【method】 丢失
|100105|【format】 错误
|100106|【sign_method】 错误
|100107|【sign】 缺失
|100108|【sign】 签名错误
|100109|【method】 方法不存在
|100110|【api_version】 版本丢失！
|100111|【app_secret】 丢失
|100112|【app_secret】 必须为字符串
|100113|【app_secret】 长度必须为1-32位
|100114|【app_id】与【app_secret】 不匹配


#### 2.2.3. API DEMO 示例
文件路径：`app/Http/Controllers/Api/Demo.php`
