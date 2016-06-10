<?php
/*
Plugin Name: wp-video
Plugin URI:  http://www.idayer.com/my-first-plugin-wp-video.html
Description: 使用 [video] 短代码 在 WordPress 中插入视频,支持优酷,腾迅,PPTV。对于不同平台设备自动识别来加载视频源，PC端识别为flash，iOS平台(包括Mac)播放m3u8或MP4,其他移动终端播放MP4。
Version:1.3.4
Author: Neo
Author URI: http://www.idayer.com/
*/

add_action('wp_enqueue_scripts', 'load_resource');
add_action('admin_menu', 'wp_video');
add_action('media_buttons', 'quick_button', 20);

add_shortcode('video', 'wp_video_shortcode_callback');
/* plugin-update-checker */
require 'plugin-update/plugin-update-checker.php';
$className = PucFactory::getLatestClassVersion('PucGitHubChecker');
$myUpdateChecker = new $className(
    'https://github.com/ineo6/wp-video/',
    __FILE__,
    'master'
);

function wp_video_shortcode_callback($atts, $content)
{

    extract(shortcode_atts(array(
        'width' => '480',
        'height' => '320',
    ), $atts));

    global $wp_video_id;
    if ($wp_video_id) {
        $wp_video_id++;
    } else {
        $wp_video_id = 1;
    }
    if ($content == "") {
        return wp_video_shortcode($atts, $content);
    } else {
        $result = "";

        //youku
        if (preg_match('#http://v.youku.com/v_show/id_(.*?).html#i', $content, $matches)) {
            $result = makeRequest($content);
            $videoId = "";
            if (preg_match("#var videoId = '(\d+)';#i", $result, $matches2)) {
                $videoId = $matches2[1];
            }
            $result = '
		<div class="wp_video" ><div id="wp_video_' . $wp_video_id . '" ><embed src="http://player.youku.com/player.php/sid/' . $matches[1] . '/v.swf" allowFullScreen="true" quality="high" width="' . $width . '" height="' . $height . '" align="middle" allowScriptAccess="always" type="application/x-shockwave-flash"></embed></div></div>
		<script type="text/javascript">
			youku("' . $videoId . '","wp_video_' . $wp_video_id . '",{"height":"' . $height . '","width":"' . $width . '"});
		</script>
	';
        } //56
        else if (preg_match('#http://www.56.com/#i', $content, $matches)) {
            $result = "抱歉,不再支持56视频。";
        } //tudou
        else if (strpos($content, 'www.tudou.com')) {
            $lcode = "";
            if (preg_match('#www.tudou.com/albumplay/(.*?).html#i', $content, $lcodeMatch)) {
                $lcode = $lcodeMatch[1];
            }
            $result = makeRequest($content);

            if (preg_match("#iid: (\d+)\s*,icode: '(.+)'\s*,vcode: [\"']+(.+)[\"']+#i", $result, $matches)) {
                $iid = $matches[1];
                $icode = $matches[2];
                $vcode = $matches[3];
            }
            $result = '
		<div class="wp_video" id="wp_video_' . $wp_video_id . '" ><embed src="http://www.tudou.com/a/' . $lcode . '/&iid=' . $iid . '&resourceId=119586948_05_02_99/v.swf"  width="' . $width . '" height="' . $height . '" type="application/x-shockwave-flash" allowscriptaccess="always"allowfullscreen="true" wmode="opaque" ></embed></div>
		<script type="text/javascript">
			 tudou("' . $vcode . '","' . $iid . '","wp_video_' . $wp_video_id . '",{"height":"' . $height . '","width":"' . $width . '"});
		</script>
	';
        } //sohu
        else if (strpos($content, 'tv.sohu.com')) {
            $sohu = '';
            $result = makeRequest($content);
            if (preg_match('#vid="(\d+)"#i', $result, $matches)) {
                $sohu = $matches[1];
            }
            $result = '
		<div class="wp_video" id="wp_video_' . $wp_video_id . '" ><embed src="http://share.vrs.sohu.com/' . $sohu . '/v.swf&topBar=1&autoplay=false"  width="' . $width . '" height="' . $height . '" type="application/x-shockwave-flash"  allowfullscreen="true"  allowscriptaccess="always"  wmode="Transparent" ></embed></div>
		<script type="text/javascript">
			//sohu("' . $sohu . '","wp_video_' . $wp_video_id . '",{"height":"' . $height . '","width":"' . $width . '"});
		</script>
	';
        } //iqiyi
        else if (strpos($content, '.iqiyi.com/')) {

            $result = makeRequest($content);
            if (preg_match('#data-player-tvid="(\d+)#i', $result, $tvid)) {
                $tvid = $tvid[1];
            }
            if (preg_match('#data-player-videoid="(\w+)"#i', $result, $videoid)) {
                $videoid = $videoid[1];
            }
            $result = '
		<div class="wp_video" id="wp_video_' . $wp_video_id . '" ><embed src="http://player.video.qiyi.com/' . $videoid . '/0/0/v_19rrhv9ifg.swf-tvId=' . $tvid . '-isPurchase=1-cnId=7"  width="' . $width . '" height="' . $height . '" align="middle" allowScriptAccess="always" allowFullscreen="true" type="application/x-shockwave-flash" ></embed></div>
		<script type="text/javascript">window.Q=window.Q||{};window.Q.cssMap={"pad_css/base":"base_f917ab77b2","pad_css/page/pad-long_play":"page/pad-long_play_ef0745df53","pad_css/page/pad-short_play":"page/pad-short_play_c83add8ef6","pad_css/page/pad-live_play":"page/pad-live_play_1316078e4c","pad_css/mod/loginKit":"mod/loginKit_560872a248"};window.Q.cssBase="static.iqiyi.com/css/pad";</script>
		<script type="text/javascript">
			//iqiyi(playPageInfo,"wp_video_' . $wp_video_id . '",{"height":"' . $height . '","width":"' . $width . '"});
		</script>
	';
        } //qq
        else if (strpos($content, 'v.qq.com/')) {
            $qq = '';
            $qJson = '';
            if (preg_match('#vid=(\w+)#i', $content, $matches)) {
                $qq = $matches[1];
            } else {
                //v.qq.com/page or miss vid
                $result = makeRequest($content);
                if (preg_match('#vid:"(\w+)"#i', $result, $matches)) {
                    $qq = $matches[1];
                }
            }

            $qJson = "http://vv.video.qq.com/geturl?otype=json&vid=" . $qq . "&charge=0&callback=qqback";

            $result = '
		<div class="wp_video" id="wp_video_' . $wp_video_id . '" ><embed src="http://static.video.qq.com/TPout.swf?auto=0&vid=' . $qq . '"  width="' . $width . '" height="' . $height . '" align="middle" allowScriptAccess="sameDomain" allowFullscreen="true" type="application/x-shockwave-flash" ></embed></div>
		<script type="text/javascript">
			qq("' . $qq . '","wp_video_' . $wp_video_id . '",{"height":"' . $height . '","width":"' . $width . '"});
		</script>
	';
        } //sina
        else if (strpos($content, 'video.sina.com.cn/')) {
            $result = "抱歉,不再支持新浪视频。";
        } //pptv
        else if (strpos($content, 'v.pptv.com/')) {
            $pptv = '';
            $result = makeRequest($content);
            if (preg_match("#\"id\":(\d+),\"id_encode\":\"(.*?)\",[\s\S]*,\"ctx\":\"(.*?)\"#i", $result, $matches)) {
                //swf
                $pptv = $matches[2];
                $pptv = "http://player.pptv.com/v/" . $pptv . ".swf";
                $kk = pptv_getKK($matches[3]);
                //id
                $vid = $matches[1];
            }
            $result = '
		<div class="wp_video" id="wp_video_' . $wp_video_id . '"><embed src="' . $pptv . '" flashvars="ap=0" width="' . $width . '" height="' . $height . '" align="middle" allowScriptAccess="always" allowFullscreen="true" type="application/x-shockwave-flash" ></embed></div>
		<script type="text/javascript">
			pptv("' . $vid . '","' . $kk . '","wp_video_' . $wp_video_id . '",{"height":"' . $height . '","width":"' . $width . '"});
		</script>
	';
        }

        return $result;
    }
}


//各种方法

//pptv
function pptv_getKK($D)
{
    $D = urldecode($D);
    $C = array();
    $B = explode("&", $D);
    $z = 0;

    while ($B[$z]) {
        $A = explode("=", $B[$z]);
        $C[$A[0]] = $A[1];
        $z++;
    }
    return $C["kk"];
}

//请求数据方法
function makeRequest($url, $refer = "")
{
    //初始化cUrl对象
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_REFERER, $url);
    curl_setopt($curl, CURLOPT_HEADER, 0);
     curl_setopt($curl, CURLOPT_HTTPHEADER,array('Accept-Encoding: gzip, deflate'));
    curl_setopt($curl, CURLOPT_ENCODING, 'gzip,deflate');
    curl_setopt($curl, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.73 Safari/537.36");
    // 设置cURL 参数，要求结果保存到字符串中还是输出到屏幕上。
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    $data = curl_exec($curl);

    curl_close($curl);
    return $data;
}

function wp_video()
{
    if (function_exists('add_menu_page')) {
        add_menu_page('wp-video', 'wp-video', 'manage_options', 'wp_video/option.php');
    }
}

function quick_button()
{
    $url = WP_PLUGIN_URL . "/" . dirname(plugin_basename(__FILE__)) . '/background.php?width=640&height=250';
    echo '<a href="' . $url . '"  class="button thickbox" data-editor="content" title="插入视频">插入视频</a>';
}

function load_resource()
{
    wp_enqueue_script('wp-video-js', plugins_url('video-min.js', __FILE__));
    wp_enqueue_style('wp-video-css', plugins_url('wp-video.css', __FILE__));
}


?>