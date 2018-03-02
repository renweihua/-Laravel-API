<?php

use Illuminate\Database\Seeder;

class AppTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('apps')->insert([
            'app_id' => 123456,
            'app_secret' => 654321,
            'app_name' => '小丑疯狂吧',
            'request_browser_ip' => Request::getClientIp(),
        ]);
    }
}
