# 基于Laravel的API服务端架构代码

借鉴地址：https://github.com/flc1125/ApiServer

[TOC]

## 1. 部署说明

> 现有API基于laravel框架开发，本次介绍也针对laravel。可根据文档自行调整，以适用其他框架下使用

### 1.1. 数据库相关

> 执行数据库迁移命令 ###迁移文件为：2018_02_27_100134_create_apps_table.php

> 运行数据库迁移 php artisan db:seed --class=AppTableSeeder


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

> GET 请求地址：`/get_api_sign`   API的参数加密之后的 sign 和 api_token 返回。（前端加密的函数正在写，到时候也会发布出来）
    除了 hash 加密，其余 加密返回的 sign 全部大写。

#### 2.1.2. 公共参数
##### app_secret 与 api_token 至少存在一个参数
|参数名|类型|是否必须|描述|
|----|----|----|----|
|app_id|string|是|应用ID|
|app_secret|string|否|密钥|
|api_token|string|否|Api接口请求的token验证（默认存储时间为 10分钟）|
|method|string|是|接口名称---可进行多个控制多个方法同时请求操作。例如：method=demo/bbb-ccc;Test/aaa;Test1/aaa（请求了 Demo控制器的bbb 和 ccc方法 、Test控制器的aaa方法、Test1控制器的aaa方法）|
|format|string|否|回调格式，默认：json（目前仅支持）|
|sign_method|string|否|签名类型/加密方式，默认：md5（支持md5加密、hash加密、openssl加密、base64、sha1）|
|api_version|string|否|Api版本，默认：V1（可进行传参变更）|
|sign|string|是|签名字符串，参考[签名规则](#签名规则)|

#### 2.1.3. api_token 与 app_secret

> 如果接口中存在 api_token，默认会先进行 app_id 与 api_token 进行检测，<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;检测成功：调取接口数据<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;检测失败：进行 app_id 与 app_secret 进行认证：<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果成功，调取接口数据；<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;否则，返回提示信息
 
> 如果不存在 api_token， 那么直接进行 app_id 与 app_secret 进行认证：<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;如果成功，调取接口数据；<br>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;否则，返回提示信息

#### 2.1.4. 返回结果

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
```


### 2.2 错误码配置：`app/Services/ApiServer/Error.php`

现有错误码：

|错误码|错误内容|
|----|----|
|200|成功|
|400|未知错误|
|401|无此权限|
|404|未找到|
|500|服务器异常|
|100101|【app_id】 不可为空！
|100102|【app_id】 无权限！
|100103|【method】 不可为空！
|100104|【method】 方法不存在！
|100105|【format】 错误！
|100106|【sign_method】 错误！
|100107|【sign】 缺失！
|100108|【sign】 签名错误！
|100109|【app_secret】 不可为空！
|100110|【app_id】与【app_secret】 不匹配！
|100111|【api_token】 不可为空！
|100112|【app_secret】与【api_token】 不可同时为空！
|100113|【api_token】 已失效！
|100114|你是PC端，未授予权限请求接口！


### 2.3. API DEMO 示例
> 文件路径：`app/Http/Controllers/Api/Demo.php`
> 打开首页，会默认请求，打开控制器查看便好。
> 如果你是通过手机端，那么进入数据库，更改：
&nbsp;&nbsp;&nbsp;&nbsp; domain_name 为 你的域名
&nbsp;&nbsp;&nbsp;&nbsp; 或者
&nbsp;&nbsp;&nbsp;&nbsp; request_browser_ip 你访问的IP
