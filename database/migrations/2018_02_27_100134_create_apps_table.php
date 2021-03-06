<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAppsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        /**
         * 如果是app请求，那么 domain_name 与 request_browser_ip 字段可为空；
         * 如果不是, 那么 domain_name 与 request_browser_ip 字段至少存在其一
         */
        Schema::create('apps', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->increments('id')->unsigned()->comment('API表');
            $table->string('app_id', 60)->default('')->comment('App_Id')->unique();
            $table->string('app_secret', 255)->default('')->comment('密钥');
            $table->string('app_name', 255)->default('')->comment('app名称')->unique();
            $table->string('app_desc', 255)->default('')->comment('描述');
            $table->boolean('status')->unsigned()->default(1)->comment('状态：0：禁用；1：可用');
            $table->string('domain_name', 255)->default('')->comment('网址');
            $table->string('request_browser_ip', 255)->default('')->comment('网址IP');
            $table->integer('ip')->default(0)->unsigned()->comment('创建时的IP');
            $table->text('browser_type')->nullable()->comment('创建时浏览器类型');
            $table->integer('add_time')->default(0)->unsigned()->comment('创建时的时间');
            $table->index(['ip', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('apps');
    }
}
