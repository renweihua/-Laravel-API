<!DOCTYPE html>
<html lang="cn">
	<head>
		<meta http-equiv="Content-Type" contect="text/html" charset="utf-8"/>
		<meta http-equiv="Cache-Control" content="max-age=600" />
		<meta http-equiv="Content-Language" contect="zh-CN"><!-- 用以说明主页制作所使用的文字以及语言 -->
		<meta http-equiv="Pragma" contect="no-cache"><!-- 是用于设定禁止浏览器从本地机的缓存中调阅页面内容，设定后一旦离开网页就无法从Cache中再调出 -->
		<meta name="csrf-token" content="{{ csrf_token() }}">
		<title>控制台 - Bootstrap后台管理系统模版Ace下载</title>
		<meta name="keywords" content="Bootstrap模版,Bootstrap模版下载,Bootstrap教程,Bootstrap中文" />
		<meta name="description" content="站长素材提供Bootstrap模版,Bootstrap教程,Bootstrap中文翻译等相关Bootstrap插件下载" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<!-- basic styles -->

		<link href="{{asset('assets/css/bootstrap.min.css')}}" rel="stylesheet" />
		<link rel="stylesheet" href="{{asset('assets/css/font-awesome.min.css')}}" />
	    <link rel="stylesheet" href="{{asset('assets/css/colorbox.css')}}"><!-- 图片预览CSS -->
	    
		<link rel="stylesheet" href="{{asset('assets/css/ace.min.css')}}" />
		<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Open+Sans:400,300" />
		<link rel="stylesheet" href="{{asset('assets/css/ace-rtl.min.css')}}" />
		<link rel="stylesheet" href="{{asset('assets/css/ace-skins.min.css')}}" />
		<link rel="stylesheet" href="{{asset('css/mycss.css')}}" />
	    <link rel="stylesheet" href="{{asset('layer/layer.css')}}"  media="all">
	    <link rel="stylesheet" href="{{asset('layui/css/layui.css')}}"  media="all">



		<!--[if IE 7]>
			<link rel="stylesheet" href="{{asset('assets/css/font-awesome-ie7.min.css')}}" />
		<![endif]-->
		<!-- page specific plugin styles -->
		<!--[if lte IE 8]>
		  <link rel="stylesheet" href="{{asset('assets/css/ace-ie.min.css')}}" />
		<![endif]-->
		<!--[if lt IE 9]>
		<script src="{{asset('assets/js/html5shiv.js')}}"></script>
		<script src="{{asset('assets/js/respond.min.js')}}"></script>
		<![endif]-->

		
		<script src="{{asset('assets/js/ace-extra.min.js')}}"></script>
		<script src="{{asset('js/jquery-2.0.3.min.js')}}"></script>
		<script src="{{asset('js/function.js')}}"></script>
		<script src="{{asset('js/common/common.js')}}"></script>
		<script src="{{asset('js/admin/check_login.js')}}"></script>
		<script type="text/javascript" src="{{asset('layui/layui.js')}}"></script>
	    <script type="text/javascript" src="{{asset('layer/layer.js')}}"></script>
	    <script>
	    	document.addEventListener("onreadystatechange", layerLoading(), false);//页面加载前就执行加载效果
			
	        var webTitle = '小丑直播平台';
	        webTitle = [webTitle, 'text-align:center;'];
	        var ADMINAPIURL = "{{ env('_ADMIN_API_') }}";//后台目录
	        $.ajaxSetup({
			    headers: {
			        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
			    }
			});
	    </script>
	</head>