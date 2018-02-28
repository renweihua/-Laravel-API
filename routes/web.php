<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// API 相关
Route::get('api', '\App\Services\ApiServer\Response\RouterController@index');  // API 入口
Route::get('get_api_sign', '\App\Services\ApiServer\Response\RouterController@getGenerateSign');  //生成sign验签
