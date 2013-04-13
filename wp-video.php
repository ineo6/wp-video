<?php
/*
Plugin Name: wp-video
Plugin URI:  http://www.idayer.com/
Description: 使用 [video] 短代码 在 WordPress 中插入视频,支持优酷,土豆,56,搜狐,爱奇异,腾迅,新浪。该插件支持视频PC和iOS播放播放，在电脑上通过flash播放,ios平台则自动识别并通过html5的方式播放。用法：<a href="http://www.idayer.com/my-first-plugin-wp-video.html">http://www.idayer.com/my-first-plugin-wp-video.html</a>
Version:1.0
Author: neo
Author URI: http://www.idayer.com/
*/

add_shortcode( 'video', 'wp_video_shortcode_callback' );
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
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="http://static.youku.com/v1.0.0149/v/swf/qplayer_rtmp.swf?VideoIDS='.$matches[1].'&winType=adshow&isAutoPlay=false" allowFullScreen="true" quality="high" width="'.$width.'" height="'.$height.'" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed></p>
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
		return '
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="http://player.56.com/v_'.$matches[2].'.swf"  width="'.$width.'" height="'.$height.'" type="application/x-shockwave-flash" allowFullScreen="true" allowNetworking="all" allowScriptAccess="always" ></embed></p>
		<script type="text/javascript">
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/ipad/i)||ua.match(/Macintosh/i)){
				document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="'.$width.'" height="'.$ipad_height.'" controls="controls" autoplay="" preload="" src="http://vxml.56.com/m3u8/'.$matches[2].'/"></video>\';
			}else if(ua.match(/iphone/i)){
				document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="240" height="180" controls="controls" autoplay="" preload="" src="http://vxml.56.com/m3u8/'.$matches[2].'/"></video>\';
			}
		</script>
	';
	}
	
	
	//tudou
	else if(strpos($content,'www.tudou.com')){
			echo 'what';
			$tudou='';
			$result=makeRequest($content);
			 if(preg_match('#iid:\s?(\d+)#i',$result,$matches)){
				$iid=$matches[1];
				$padiid=fillZero($iid,9);
				if(preg_match_all('#(\d{3})#i',$padiid,$m_iid)){
					$idEncodeed = $m_iid[0][0].'/'.$m_iid[0][1].'/'.$m_iid[0][2];
					$tudou="http://m3u8.tdimg.com/".$idEncodeed."2.m3u8";
				}
			 } 
		return '
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="http://www.tudou.com/a/ZJ9MGAsJDjc/&iid='.$iid.'/v.swf"  width="'.$width.'" height="'.$height.'" type="application/x-shockwave-flash" allowscriptaccess="always"allowfullscreen="true" wmode="opaque" ></embed></p>
		<script type="text/javascript">
			var ua = navigator.userAgent.toLowerCase();
			if(ua.match(/ipad/i)||ua.match(/Macintosh/i)){
				document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="'.$width.'" height="'.$ipad_height.'" controls="controls" autoplay="" preload="" src="'.$tudou.'"></video>\';
			}else if(ua.match(/iphone/i)){
				document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="240" height="180" controls="controls" autoplay="" preload="" src="'.$tudou.'"></video>\';
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
			 if(preg_match('#"videoId":"(\w+)"#i',$result,$matches)){
				$iqiyi=$matches[1];
				$im3u8="http://cache.video.qiyi.com/m/201971/".$iqiyi."/";
			 } 
		return '
		<p id="wp_video_'.$wp_video_id.'" style="text-align: center;"><embed src="http://www.iqiyi.com/player/20130407135726/Player.swf?vid='.$iqiyi.'.swf"  width="'.$width.'" height="'.$height.'" align="middle" allowScriptAccess="always" allowFullscreen="true" type="application/x-shockwave-flash" ></embed></p>
		<script type="text/javascript">
			var scr = document.createElement("script");
			scr.src = "'.$im3u8.'";
			document.body.appendChild(scr);
			
			var timer;
			timer = setInterval(function(){
				if(window.ipadUrl){
					clearInterval(timer);
						var ua = navigator.userAgent.toLowerCase();
				if(ua.match(/ipad/i)||ua.match(/Macintosh/i)){
					document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="'.$width.'" height="'.$ipad_height.'" controls="controls" autoplay="" preload="" src="\'+ipadUrl.data.url+\'" ></video>\';
				}else if(ua.match(/iphone/i)){
					document.getElementById(\'wp_video_'.$wp_video_id.'\').innerHTML=\'<video class="html5-player" width="240" height="180" controls="controls" autoplay="" preload="" src="\'+ipadUrl.data.url+\'" ></video>\';
				}

				}
			},100)
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
			 if(preg_match("#swfOutsideUrl:'(.*?)',\s* videoData:{\s* ipad_vid:'(\d+)'#i",$result,$matches)){
				//swf swf
				$sina=$matches[1];
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
}


//各种方法
//土豆

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
		curl_setopt($curl,CURLOPT_HEADER,0);
		// 设置cURL 参数，要求结果保存到字符串中还是输出到屏幕上。    
		curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);  
		$data=curl_exec($curl);
		curl_close($curl);
		return $data;
}

