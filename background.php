<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<title>insert-video-button-background</title>
</head>
<body id="wp-video-input">
<form id="wp-link" tabindex="-1" class="ui-dialog-content ui-widget-content" style="width: auto; min-height: 125px; max-height: none; height: auto;">
	<input type="hidden" id="_ajax_linking_nonce" name="_ajax_linking_nonce" value="785ec4ef1f">	
	<div id="link-selector">
		<div id="link-options">
			<p class="howto">嵌入的视频地址</p>
			<div>
				<label><span>URL</span><input id="emvideo-url" type="text" name="href"></label>
			</div>
			<div>
				<label><span>宽度</span><input id="emvideo-width" type="text" name="width"></label>
			</div>
			<div>
				<label><span>高度</span><input id="emvideo-height" type="text" name="height"></label>
			</div>
		</div>
	</div>
	<div class="submitbox">
		<input type="button" value="插入文章" class="button-primary insertEmbedVideo" style="float:right;">
		<script type="text/javascript">
			/* <![CDATA[ */
			jQuery('.insertEmbedVideo').click(function(){
				var win = window.dialogArguments || opener || parent || top;
				var vurl = jQuery("#emvideo-url").val();
				var vwidth = jQuery("#emvideo-width").val();
				var vheight = jQuery("#emvideo-height").val();
				if (vurl!="")
				{	
					if(vheight!="" || vwidth!="")
					win.send_to_editor('[video width="'+vwidth+'" height="'+vheight+'"]'+ vurl+ '[/video]');
				else 
					win.send_to_editor('[video]'+ vurl+ '[/video]');
				}
			});
			/* ]]> */
		</script>
	</div>
	</form>
</body>
</html>