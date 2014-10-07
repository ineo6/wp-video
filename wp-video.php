<?php
/*
Plugin Name: wp-video
Plugin URI:  http://www.idayer.com/my-first-plugin-wp-video.html
Description: 使用 [video] 短代码 在 WordPress 中插入视频,支持优酷,56,搜狐,爱奇艺,腾迅,新浪,PPTV。对于不同平台设备自动识别来加载视频源，PC端识别为flash，iOS平台(包括Mac)播放m3u8或MP4,其他移动终端播放MP4。
Version:1.2
Author: Neo
Author URI: http://www.idayer.com/
*/


function wp_video_shortcode_callback( $atts,$content ) {

	extract( shortcode_atts( array(
		'width' => '480',
		'height' => '400',
	), $atts ) );

	global $wp_video_id;
	if($wp_video_id){
		$wp_video_id++;
	}else{
		$wp_video_id = 1;
	}

	$result="";
	


	//youku
	if(preg_match('#http://v.youku.com/v_show/id_(.*?).html#i',$content,$matches)){
		$result=makeRequest($content);
		if (preg_match("#var videoId = '(\d+)';#i", $result,$matches2)) {
			$videoId=$matches2[1];
		}
		$result= '
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="http://player.youku.com/player.php/sid/XNzA2MzgwNzU2/v.swf?VideoIDS='.$matches[1].'&winType=adshow&isAutoPlay=false" allowFullScreen="true" quality="high" width="'.$width.'" height="'.$height.'" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed></p>
		<script type="text/javascript">
			youku("'.$videoId.'","wp_video_'.$wp_video_id.'",{"height":'.$height.',"width":'.$width.'});
		</script>
	';
	}

	//56
	else if(preg_match('#http://www.56.com/(.*?)/v_(.*?).html#i',$content,$matches)){
		$result=makeRequest($content);
		if(preg_match('#"id":(\d+)#i',$result,$matches2))
		{
			$id=$matches2[1];
			$json="http://vxml.56.com/h5json/".$id."/?r=b355902c0d049510670e6c4c&t=1411275951&s=7974222849&src=m&callback=jsonp_dfInfo";
		}
		$result='
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="http://player.56.com/v_'.$matches[2].'.swf"  width="'.$width.'" height="'.$height.'" type="application/x-shockwave-flash" allowFullScreen="true" allowNetworking="all" allowScriptAccess="always" ></embed></p>
		<script type="text/javascript">
			fivesix("'.$id.'","wp_video_'.$wp_video_id.'",{"height":'.$height.',"width":'.$width.'});
		</script>
	';
	}
	//tudou
	else if(strpos($content,'www.tudou.com')){
			$tudou='';
			$result=makeRequest($content);
			 if(preg_match("#iid: (\d+)[.\s\S]*?,vcode: '(\w+)'#i",$result,$matches)){
				$iid=$matches[1];
				$vcode=$matches[2];
			 } 
		$result ='
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="http://www.tudou.com/a/ZJ9MGAsJDjc/&iid='.$iid.'/v.swf"  width="'.$width.'" height="'.$height.'" type="application/x-shockwave-flash" allowscriptaccess="always"allowfullscreen="true" wmode="opaque" ></embed></p>
		<script type="text/javascript">
			 tudou("'.$vcode.'","wp_video_'.$wp_video_id.'",{"height":'.$height.',"width":'.$width.'});
		</script>
	';
	}

//sohu
	else if(strpos($content,'tv.sohu.com')){
			$sohu='';
			$result=makeRequest($content);
			 if(preg_match('#vid="(\d+)"#i',$result,$matches)){
				$sohu=$matches[1];
			 } 
		$result= '
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="http://share.vrs.sohu.com/'.$sohu.'/v.swf&topBar=1&autoplay=false"  width="'.$width.'" height="'.$height.'" type="application/x-shockwave-flash"  allowfullscreen="true"  allowscriptaccess="always"  wmode="Transparent" ></embed></p>
		<script type="text/javascript">
			sohu("'.$sohu.'","wp_video_'.$wp_video_id.'",{"height":'.$height.',"width":'.$width.'});
		</script>
	';
	}
//iqiyi
	else if(strpos($content,'.iqiyi.com/')){

			$result=makeRequest($content);
			 if (preg_match('#<div id="flashbox"([\s\S.]*?)data-player-qiyiProduced#i', $result,$matches)) {
				$videoArea=$matches[1];
				 if(preg_match('#data-player-tvid="(\d+)#i',$videoArea,$tvid)){
					$tvid=$tvid[1];
				 } 

				 if(preg_match('#data-player-videoid="(\w+)"#i',$videoArea,$videoid)){
					$videoid=$videoid[1];
				 } 
				 
			} 
		$result= '
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="http://player.video.qiyi.com/'.$videoid.'/0/0/v_19rrhv9ifg.swf"  width="'.$width.'" height="'.$height.'" align="middle" allowScriptAccess="always" allowFullscreen="true" type="application/x-shockwave-flash" ></embed></p>
		<script type="text/javascript">
			window.videoType="iqiyi";
			var playPageInfo={};
			playPageInfo.tvId='.$tvid.';
			playPageInfo.vid="'.$videoid.'";
			playPageInfo.url="http://m.iqiyi.com/v_19rrnkcdx4.html";

			iqiyi(playPageInfo,"wp_video_'.$wp_video_id.'",{"height":'.$height.',"width":'.$width.'});
		</script>
	';
	}
	//qq
	else if(strpos($content,'v.qq.com/')){
			$qq='';
			$qJson='';
			if(preg_match('#vid=(\w+)#i',$content,$matches)){
				$qq=$matches[1];
			 }
			 else{
				$result=makeRequest($content);
				 if(preg_match('#vid:"(\w+)"#i',$result,$matches)){
					$qq=$matches[1];
				 }
			}
			$qJson="http://vv.video.qq.com/geturl?otype=json&vid=".$qq."&charge=0&callback=qqback";	
				
		$result ='
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="http://static.video.qq.com/TPout.swf?auto=0&vid='.$qq.'"  width="'.$width.'" height="'.$height.'" align="middle" allowScriptAccess="sameDomain" allowFullscreen="true" type="application/x-shockwave-flash" ></embed></p>
		<script type="text/javascript">
			qq("'.$qq.'","wp_video_'.$wp_video_id.'",{"height":'.$height.',"width":'.$width.'});
		</script>
	';
	}
	
	//sina
	else if(strpos($content,'video.sina.com.cn/')){
			$video=explode('#',$content);
			$json="";
			if(count($video)>1){
				if(strpos($video[1],'-')){
					//匹配上#1-1-135738619-1
					$ary = explode('-',$video[1]);
					$vid = $ary[2];

				}else{
					//匹配上#135734426
					$vid=$video[1];
				}
				$order=1;
				$swf="http://p.you.video.sina.com.cn/swf/quotePlayer20140807_V4_4_42_40.swf?autoPlay=0&actlogActive=1&as=1&uid=28&pid=28&vid=".$vid."&tj=1";
			}else
			{
				$result=makeRequest($content);
				 if(preg_match("#swfOutsideUrl:'(.*?)',[\s\S]*ipad_vid:'(\d+)'#i",$result,$matches)){
					//swf swf
					$order=2;
					$swf=$matches[1];
					$vid=$matches[2];
				 } 
			}

		$result= '
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="'.$swf.'"  width="'.$width.'" height="'.$height.'" align="middle" allowScriptAccess="always" allowFullscreen="true" type="application/x-shockwave-flash" ></embed></p>
		<script type="text/javascript">
			sina("'.$vid.'",'.$order.',"wp_video_'.$wp_video_id.'",{"height":'.$height.',"width":'.$width.'});
		</script>
	';
	}
	//pptv
	else if(strpos($content,'v.pptv.com/')){
			$pptv='';
			$result=makeRequest($content);
			 if(preg_match("#\"id\":(\d+),\"id_encode\":\"(.*?)\",[\s\S]*,\"ctx\":\"(.*?)\"#i",$result,$matches)){
				//swf 
				$pptv=$matches[2];
				$pptv="http://player.pptv.com/v/".$pptv.".swf";
				$kk=pptv_getKK($matches[3]);
				//id
				$vid=$matches[1];
			 } 
		$result= '
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="'.$pptv.'" flashvars="ap=0" width="'.$width.'" height="'.$height.'" align="middle" allowScriptAccess="always" allowFullscreen="true" type="application/x-shockwave-flash" ></embed></p>
		<script type="text/javascript">
			pptv("'.$vid.'","'.$kk.'","wp_video_'.$wp_video_id.'",{"height":'.$height.',"width":'.$width.'});
		</script>
	';
	}

	return $result;
}


//各种方法

//pptv
function pptv_getKK($D) {
	$D=urldecode($D);
	$C = array();
	$B = explode("&",$D);
	$z = 0;
	
	while ($B[$z]) {
		$A =explode("=",$B[$z]);
		$C[$A[0]] = $A[1];
		$z++;
	}
	return $C["kk"];
}

//请求数据方法
function makeRequest($url,$refer="")
{
        //初始化cUrl对象
		$curl=curl_init();
		curl_setopt($curl,CURLOPT_URL,$url);
		curl_setopt($curl, CURLOPT_REFERER, $url );
		curl_setopt($curl,CURLOPT_HEADER,0);
		curl_setopt($curl, CURLOPT_USERAGENT,"Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.31 (KHTML, like Gecko) Chrome/26.0.1410.64 Safari/537.31");
		// 设置cURL 参数，要求结果保存到字符串中还是输出到屏幕上。    
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);  
		$data=curl_exec($curl);
		curl_close($curl);
		return $data;
}

function wp_video(){
	if(function_exists('add_menu_page')) {
		add_menu_page('wp-video','wp-video','manage_options', 'wp_video/option.php') ;
	}
}

function quick_button(){
	$url=WP_PLUGIN_URL.'/wp_video/background.php?width=640&height=250';
	echo '<a href="'.$url.'"  class="button thickbox" data-editor="content" title="插入视频">插入视频</a>';
}

function plugin_js() {
	
	wp_enqueue_script( 'wp-video-js', plugins_url('video-min.js',__FILE__));
}

add_action( 'wp_enqueue_scripts', 'plugin_js' );

add_action('admin_menu','wp_video');
add_action('media_buttons','quick_button',20);
add_shortcode( 'video', 'wp_video_shortcode_callback' );

?>