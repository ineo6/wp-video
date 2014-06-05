<?php
/*
Plugin Name: wp-video
Plugin URI:  http://www.idayer.com/my-first-plugin-wp-video.html
Description: 使用 [video] 短代码 在 WordPress 中插入视频,支持优酷,56,搜狐,爱奇艺,腾迅,新浪,PPTV。该插件支持视频PC和iOS播放播放。同时,现在支持部分网站无广告，感谢<a href="http://userscripts.org/scripts/show/119622">YoukuAntiADs</a>的修改swf播放器。
Version:1.1
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

	$ipad_height = $height * 0.9;
	
	//youku
	if(preg_match('#http://v.youku.com/v_show/id_(.*?).html#i',$content,$matches)){
		return '
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="http://player.youku.com/player.php/sid/XNzA2MzgwNzU2/v.swf?VideoIDS='.$matches[1].'&winType=adshow&isAutoPlay=false" allowFullScreen="true" quality="high" width="'.$width.'" height="'.$height.'" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed></p>
		<script type="text/javascript">
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/ipad/i)||ua.match(/Macintosh/i)){
				document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="'.$width.'" height="'.$ipad_height.'" controls="controls" autoplay="" preload="" src="http://v.youku.com/player/getRealM3U8/vid/'.$matches[1].'/type/mp4/v.m3u8"></video>\';
			}else if(ua.match(/iphone/i)){
				document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="240" height="180" controls="controls" autoplay="" preload="" src="http://v.youku.com/player/getRealM3U8/vid/'.$matches[1].'/type/mp4/v.m3u8"></video>\';
			}
		</script>
	';
	}

	//56
	else if(preg_match('#http://www.56.com/(.*?)/v_(.*?).html#i',$content,$matches)){
		$result=makeRequest($content);
		if(preg_match('#"id":(\d+)#i',$result,$matches2))
		{
			$id=$matches2[1];
		}
		return '
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="http://player.56.com/v_'.$matches[2].'.swf"  width="'.$width.'" height="'.$height.'" type="application/x-shockwave-flash" allowFullScreen="true" allowNetworking="all" allowScriptAccess="always" ></embed></p>
		<script type="text/javascript">
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/ipad/i)||ua.match(/Macintosh/i)){
				document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="'.$width.'" height="'.$ipad_height.'" controls="controls" autoplay="" preload="" src="http://vxml.56.com/html5/'.$id.'/?src=3g&res=qqvga"></video>\';
			}else if(ua.match(/iphone/i)){
				document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="240" height="180" controls="controls" autoplay="" preload="" src="http://vxml.56.com/html5/'.$id.'/?src=3g&res=qqvga"></video>\';
			}
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
		return '
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="http://share.vrs.sohu.com/'.$sohu.'/v.swf&topBar=1&autoplay=false"  width="'.$width.'" height="'.$height.'" type="application/x-shockwave-flash"  allowfullscreen="true"  allowscriptaccess="always"  wmode="Transparent" ></embed></p>
		<script type="text/javascript">
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/ipad/i)||ua.match(/Macintosh/i)){
				document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="'.$width.'" height="'.$ipad_height.'" controls="controls" autoplay="" preload="" src="http://hot.vrs.sohu.com/ipad'.$sohu.'.m3u8"></video>\';
			}else if(ua.match(/iphone/i)){
				document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="240" height="180" controls="controls" autoplay="" preload="" src="http://hot.vrs.sohu.com/ipad'.$sohu.'.m3u8"></video>\';
			}
		</script>
	';
	}
//iqiyi
	else if(strpos($content,'.iqiyi.com/')){
			$iqiyi='';
			$im3u8='';

			$result=makeRequest($content);
			 if(preg_match('#data-player-tvid="(\d+)"\s+data-player-videoid="(\w+)"#i',$result,$matches)){
				$tvid=$matches[1];
				$iqiyi=$matches[2];
				$api="http://cache.m.iqiyi.com/jp/tmts/".$tvid."/".$iqiyi."/?uid=2007179977&cupid=qc_100001_100102&platForm=h5&type=m3u8&rate=1&callback=QV.http.__callbacks__.cbgfwrvo";
				$result=makeRequest($api);
				if(preg_match('#"m3u":"([\w:./]+)"#i',$result,$matches))
					$im3u8=$matches[1];
			 } 
		return '
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="http://player.video.qiyi.com/'.$iqiyi.'/0/0/v_19rrhv9ifg.swf"  width="'.$width.'" height="'.$height.'" align="middle" allowScriptAccess="always" allowFullscreen="true" type="application/x-shockwave-flash" ></embed></p>
		<script type="text/javascript">
				var ua = navigator.userAgent.toLowerCase();
				if(ua.match(/ipad/i)||ua.match(/Macintosh/i)){
					document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="'.$width.'" height="'.$ipad_height.'" controls="controls" autoplay="" preload="" src="'.$im3u8.'" ></video>\';
				}else if(ua.match(/iphone/i)){
					document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="240" height="180" controls="controls" autoplay="" preload="" src="'.$im3u8.'" ></video>\';
				}

				
		</script>
	';
	}
	//qq
	else if(strpos($content,'v.qq.com/')){
			$qq='';
			$qJson='';
			$result=makeRequest($content);
			 if(preg_match('#vid:"(\w+)"#i',$result,$matches)){
				$qq=$matches[1];
				$qJson="http://vv.video.qq.com/geturl?otype=json&vid=".$qq."&charge=0&callback=qqback";
			 } 
		return '
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="http://static.video.qq.com/TPout.swf?auto=0&vid='.$qq.'"  width="'.$width.'" height="'.$height.'" align="middle" allowScriptAccess="sameDomain" allowFullscreen="true" type="application/x-shockwave-flash" ></embed></p>
		<script type="text/javascript">
			var scr = document.createElement("script");
			scr.src = "'.$qJson.'";
			
			window["qqback"]=function(result){
				var mp4=result.vd.vi[0].url;
				var ua = navigator.userAgent.toLowerCase();
				if(ua.match(/ipad/i)||ua.match(/Macintosh/i)){
					document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="'.$width.'" height="'.$ipad_height.'" controls="controls" autoplay="" preload="" src="\'+mp4+\'" ></video>\';
				}else if(ua.match(/iphone/i)){
					document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="240" height="180" controls="controls" autoplay="" preload="" src="\'+mp4+\'" ></video>\';
				}
				delete window["qqback"];
			}
			document.body.appendChild(scr);
		</script>
	';
	}
	
	//sina
	else if(strpos($content,'video.sina.com.cn/')){
			$sina='';
			$smp4='';
			$result=makeRequest($content);
			 if(preg_match("#vid:'(.*?)',\s* ipad_vid:'(\d+)'#i",$result,$matches)){
				//swf swf

				$sina=explode('|',$matches[1]);
				$sina=$sina[0];
				$sina="http://p.you.video.sina.com.cn/swf/quotePlayer20140424_V4_4_42_26.swf?autoPlay=0&actlogActive=1&as=1&vid=".$sina;
				//mp4 vid
				$smp4="http://edge.v.iask.com.sinastorage.com/".$matches[2].".mp4";
			 } 
		return '
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="'.$sina.'"  width="'.$width.'" height="'.$height.'" align="middle" allowScriptAccess="always" allowFullscreen="true" type="application/x-shockwave-flash" ></embed></p>
		<script type="text/javascript">
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/ipad/i)||ua.match(/Macintosh/i)){
				document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="'.$width.'" height="'.$ipad_height.'" controls="controls" autoplay="" preload="" src="'.$smp4.'"></video>\';
			}else if(ua.match(/iphone/i)){
				document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="240" height="180" controls="controls" autoplay="" preload="" src="'.$smp4.'"></video>\';
			}
		</script>
	';
	}
	//pptv
	else if(strpos($content,'v.pptv.com/')){
			$pptv='';
			$pJson='';
			$result=makeRequest($content);
			 if(preg_match("#\"id\":(\d+),\"id_encode\":\"(.*?)\"#i",$result,$matches)){
				//swf 
				$pptv=$matches[2];
				$pptv="http://player.pptv.com/v/".$pptv.".swf";
				//id
				$pJson="http://web-play.pptv.com/webplay3-0-".$matches[1].".xml?version=4&type=m3u8.web.pad&cb=pptvback";
			 } 
		return '
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="'.$pptv.'" flashvars="ap=0" width="'.$width.'" height="'.$height.'" align="middle" allowScriptAccess="always" allowFullscreen="true" type="application/x-shockwave-flash" ></embed></p>
		<script type="text/javascript">
			//pptv回调中处理m3u8函数
			pptvm3u8=function(Z){
					var ab,ae,ac,ad;
					for(var aa in Z.childNodes){
						var W=Z.childNodes[aa];
						if(W.tagName==="channel"){
							for(var Y in W.childNodes){
							var V=W.childNodes[Y];
							if(V.tagName==="file"||V.tagName==="stream"){
							var ag=V.tagName==="file"?V.cur:V.cft;
							for(var X in V.childNodes)
							{var af=V.childNodes[X];if(af.ft===ag){ab=ag;ae=af.rid;break}}}
							if(ab){break}}}
						else{if(W.tagName==="dt"&&W.ft==ab){
							for(var Y in W.childNodes){
							var l=W.childNodes[Y];
								if(l.tagName==="sh"){
									ac=l.childNodes[0]}else{
									if(l.tagName==="key"){
									ad=l.childNodes[0]}}}}}}
						if(ab!=undefined&&ae&&ac){
							var m3u8=[];
							ae=ae.replace(".mp4","");
							if(ad){
								m3u8[0]="http://"+ac+"/"+ae+".m3u8?type=m3u8.web.pad&k="+ad;
								m3u8[1]="http://"+ac+"/0/"+ae+".mp4?k="+ad+"&key=dc1ebe73b407f8f5653ddea3405407c9";
								return m3u8;}
							else{
								m3u8[0]="http://"+ac+"/"+ae+".m3u8?type=m3u8.web.pad";
								return m3u8;}}
						else{}}
			
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/ipad/i)||ua.match(/Macintosh/i)||ua.match(/iphone/i)){
			var scr = document.createElement("script");
			scr.src = "'.$pJson.'";
			window["pptvback"]=function(result){
				var m3u8=pptvm3u8(result);
				document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="'.$width.'" height="'.$ipad_height.'" controls="controls"  preload="" src="\'+m3u8[1]+\'" ></video>\';
				
				if(ua.match(/ipad/i)||ua.match(/Macintosh/i)){
					document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="'.$width.'" height="'.$ipad_height.'" controls="controls" autoplay="" preload="" src="\'+m3u8[0]+\'" ></video>\';
				}else if(ua.match(/iphone/i)){
					document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="240" height="180" controls="controls" autoplay="" preload="" src="\'+m3u8[0]+\'" ></video>\';
				}
				delete window["pptvback"];
			}
			document.body.appendChild(scr);
			}			
			
			
		</script>
	';
	}
}


//各种方法

//土豆-填充序列到9位 
function fillZero($num,$n){
	$tempArray=Array();
	if($n >strlen(''+$num)){
		$index=$n - strlen($num);
		for($i=0;$i<$index;$i++)
			$tempArray[$i]="0";	
		return join("",$tempArray).$num;
	}else
		return $num;
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

add_action('admin_menu','wp_video');
add_action('media_buttons','quick_button',20);
add_shortcode( 'video', 'wp_video_shortcode_callback' );

?>