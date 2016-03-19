var _ = {};
_.canPlayM3U8 = /test/.test(window.navigator.userAgent) || !!document.createElement("video").canPlayType("application/x-mpegURL") ? true : false;
_.isChromeOnMac = function () {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/Macintosh/i) && ua.match(/Chrome/i))
		return true;
	else
		return false;
};
_.each = function (arrOrObject, fn, context, i, len) {
	if (typeof arrOrObject.length == "number") {
		for (i = 0, len = arrOrObject.length; i < len; i++)
			if (fn.call(context, arrOrObject[i], i) == false) break
	} else
		for (i in arrOrObject)
			if (fn.call(context, arrOrObject[i], i) == false) break
};
_.extend = function (target) {
	var length = arguments.length,
		i = 1,
		mixin;
	while (i < length) {
		mixin = arguments[i];
		for (var name in mixin) {
			if (mixin.hasOwnProperty(name)) {
				target[name] = mixin[name]
			}
		}
		i++
	}
	return target
};
_.queryString = function (query) {
	var arr = [];
	_.each(query, function (value, key) {
		value !== undefined && arr.push(key + "=" + value)
	});
	return arr.join("&")
};
_.byId = function (id) {
	return document.getElementById(id)
};
_.rNode = function (el) {
	try {
		el.parentNode.removeChild(el)
	} catch (e) {
	}
};
_.cTag = function (tagName, styles, attrs, out) {
	var t = document.createElement(tagName),
		cssText = "";
	_.each(styles || {}, function (value, key) {
		cssText += [key, ":", value, ";"].join("")
	}), t.style.cssText = cssText;
	_.each(attrs || {}, function (value, key) {
		t.setAttribute(key, value)
	});
	return out && out.appendChild(t) || t
};
_.jsonp = function (url, param, callback, handler) {
	var scr, back = "HTML5PlayerCallBack" + +(new Date) + Math.random().toString().replace(".", "");
	var hasQuery = url.indexOf("?") >= 0;
	param = _.queryString(param);
	if (param.length) param = (hasQuery ? "&" : "?") + param;
	handler = [hasQuery || param.length ? "&" : "?", handler || "callback", "=", back].join("");
	window[back] = function () {
		callback && callback.apply(this, arguments);
		delete window[back];
		_.rNode(scr)
	};
	(scr = _.cTag("script", {}, {}, document.body)).src = url + param + handler
};
_.times = function () {
	return (new Date).getTime();
};
_.log = function (text) {
	window.console || window.console(text);
};
_.isMobile = function () {
	var sUserAgent = navigator.userAgent.toLowerCase();
	var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
	var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
	var bIsMidp = sUserAgent.match(/midp/i) == "midp";
	var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
	var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
	var bIsAndroid = sUserAgent.match(/android/i) == "android";
	var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
	var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
	var bIsWp = sUserAgent.match(/windows phone/i) == "windows phone";

	if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM || bIsWp) {
		return true;
	} else {
		return false;
	}
}
_.cookie = {
	get: function (e) {
		var t = null;
		var n = new RegExp("(^| )" + e + "=([^;]*)(;|$)"),
			r = n.exec(document.cookie);
		if (r) {
			t = r[2] || ""
		}
		if ("string" == typeof t) {
			t = decodeURIComponent(t);
			return t
		}
		return ""
	},
	set: function (e, t, n) {
		n = n || {};
		t = encodeURIComponent(t);
		var r = n.expires;
		if ("number" == typeof n.expires) {
			r = new Date;
			r.setTime(r.getTime() + n.expires)
		}
		document.cookie = e + "=" + t + (n.path ? "; path=" + n.path : "") + (r ? "; expires=" + r.toGMTString() : "") + (n.domain ? "; domain=" + n.domain : "") + (n.secure ? "; secure" : "")
	},
	remove: function (e, t) {
		t = t || {};
		t.expires = new Date(0);
		_.cookie.set(e, "", t)
	}
};

//main
function show(elementId, url, attrs) {
	try {
		var flash = _.byId(elementId);
		flash.innerHTML = "";
		var video = _.cTag("video", null, {
			"src": url,
			"controls": "controls",
			"preload": "preload",
			"width": attrs.width,
			"height": attrs.height
		}, flash);

	} catch (e) {
	}
}

function pptv(vid, kk, target, attrs) {
	function pptvm3u8(T) {
		var H, J, S, U, G, V, D, R, F, L;
		for (var O in T.childNodes) {
			var K = T.childNodes[O];
			if (K.tagName === "channel") {
				V = K.nm;
				L = K.vt;
				D = K.dur;
				for (var N in K.childNodes) {
					var Q = K.childNodes[N];
					if (Q.tagName === "live") {
						R = Q.start;
						F = Q.end
					}
					if (Q.tagName === "file" || Q.tagName === "stream") {
						var C = Q.tagName === "file" ? Q.cur : Q.cft;
						for (var M in Q.childNodes) {
							var P = Q.childNodes[M];
							if (P.ft === C) {
								H = C;
								J = P.rid;
								break
							}
						}
					}
					if (H) {
						break
					}
				}
			} else {
				if (K.tagName === "dt" && (K.ft == H || !K.ft)) {
					for (var I in K.childNodes) {
						var E = K.childNodes[I];
						if (E.tagName === "sh") {
							S = E.childNodes[0]
						} else {
							if (E.tagName === "key") {
								U = E.childNodes[0]
							}
						}
					}
				}
			}
		}
		if (H !== undefined && J && S) {
			J = J.replace(".mp4", "");
			//z.vt = L;
			if (L == 5) {
				z.videoType = 20;
				G = "http://" + S + "/live/5/60/" + J + ".m3u8?type=" + z.loadType + "&begin=" + R + "&end=" + F
			} else {
				z.videoType = 1;
				G = "http://" + S + (z.islumia ? "/w/" : "/") + J + ".m3u8?type=" + z.loadType;
				G = z.islumia ? G.replace("m3u8", "mp4") : G
			}
			G += U ? "&k=" + U : "";
			G += z.segment ? "&segment=" + z.segment : "";

		} else {
			//无资源
		}
		return G;
	}

	var z = {};
	if (_.canPlayM3U8) {
		z.loadType = "m3u8.web.pad";
	} else if (_.isChromeOnMac() || _.isMobile()) {
		z.loadType = "mpptv.wp";
		z.islumia = true;
	}

	_.jsonp("http://web-play.pptv.com/webplay3-0-" + vid + ".xml", {
		version: 4,
		type: z.loadType,
		kk: kk,
		o: "v.pptv.com",
	}, function (param) {
		var m3u8 = pptvm3u8(param);
		if (_.canPlayM3U8) {
			show(target, m3u8, attrs);
		} else if (_.isChromeOnMac() || _.isMobile()) {
			show(target, m3u8, attrs);
		}
	}, "cb")
}

function sina(vid, apiOrder, target, attrs) {
	if (_.isChromeOnMac() || _.isMobile()) {
		if (apiOrder == 1) {
			_.jsonp("http://video.sina.com.cn/interface/video_ids/video_ids.php", {
				v: vid
			}, function (param) {
				var ipad_id = param.ipad_vid;
				var mp4 = "http://v.iask.com/v_play_ipad.php?vid=" + ipad_id + "&tags=newsList_web";
				show(target, mp4, attrs);
			})
		} else if (apiOrder == 2) {
			show(target,
				"http://v.iask.com/v_play_ipad.php?vid=" + vid + "&tags=newsList_web", attrs);
		}
	}
}

function youku(_id, target, attrs) {
	var mk_a3 = "b4et";
	var mk_a4 = "boa4";
	var userCache_a1 = "4";
	var userCache_a2 = "1";
	var rs;
	var sid;
	var token;

	function encode64(str) {
		if (!str) return '';
		str = str.toString();
		var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
			52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
			15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
			41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
		);
		var out, i, len;
		var c1, c2, c3;
		len = str.length;
		i = 0;
		out = "";
		while (i < len) {
			c1 = str.charCodeAt(i++) & 0xff;
			if (i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt((c1 & 0x3) << 4);
				out += "==";
				break;
			}
			c2 = str.charCodeAt(i++);
			if (i == len) {
				out += base64EncodeChars.charAt(c1 >> 2);
				out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
				out += base64EncodeChars.charAt((c2 & 0xF) << 2);
				out += "=";
				break;
			}
			c3 = str.charCodeAt(i++);
			out += base64EncodeChars.charAt(c1 >> 2);
			out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
			out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
			out += base64EncodeChars.charAt(c3 & 0x3F);
		}
		return out;
	}

	function decode64(a) {
		if (!a) return "";
		var a = a.toString(),
			c, b, f, i, e, h = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];
		i = a.length;
		f = 0;
		for (e = ""; f < i;) {
			do c = h[a.charCodeAt(f++) & 255]; while (f < i && -1 == c);
			if (-1 == c) break;
			do b = h[a.charCodeAt(f++) & 255]; while (f < i && -1 == b);
			if (-1 == b) break;
			e += String.fromCharCode(c << 2 | (b & 48) >> 4);
			do {
				c = a.charCodeAt(f++) & 255;
				if (61 == c) return e;
				c = h[c]
			} while (f < i && -1 == c);
			if (-1 == c) break;
			e += String.fromCharCode((b & 15) << 4 | (c & 60) >> 2);
			do {
				b = a.charCodeAt(f++) & 255;
				if (61 == b) return e;
				b = h[b]
			} while (f < i && -1 == b);
			if (-1 == b) break;
			e += String.fromCharCode((c & 3) << 6 | b)
		}
		return e
	}

	function D(a) {
		if (!a) return "";
		var a = a.toString(),
			c, b, f, e, g, h;
		f = a.length;
		b = 0;
		for (c = ""; b < f;) {
			e = a.charCodeAt(b++) & 255;
			if (b == f) {
				c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
				c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4);
				c += "==";
				break
			}
			g = a.charCodeAt(b++);
			if (b == f) {
				c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
				c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4 | (g & 240) >> 4);
				c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((g & 15) << 2);
				c += "=";
				break
			}
			h = a.charCodeAt(b++);
			c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
			c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4 | (g & 240) >> 4);
			c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((g & 15) << 2 | (h & 192) >> 6);
			c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h & 63)
		}
		return c
	}

	function E(a, c) {
		for (var b = [], f = 0, i, e = "", h = 0; 256 > h; h++) b[h] = h;
		for (h = 0; 256 > h; h++) f = (f + b[h] + a.charCodeAt(h % a.length)) % 256, i = b[h], b[h] = b[f], b[f] = i;
		for (var q = f = h = 0; q < c.length; q++) h = (h + 1) % 256, f = (f + b[h]) % 256, i = b[h], b[h] = b[f], b[f] = i, e += String.fromCharCode(c.charCodeAt(q) ^ b[(b[h] + b[f]) % 256]);
		return e
	}

	function F(a, c) {
		for (var b = [], f = 0; f < a.length; f++) {
			for (var i = 0, i = "a" <= a[f] && "z" >= a[f] ? a[f].charCodeAt(0) - 97 : a[f] - 0 + 26, e = 0; 36 > e; e++)
				if (c[e] == i) {
					i = e;
					break
				}
			b[f] = 25 < i ? i - 26 : String.fromCharCode(i + 97)
		}
		return b.join("")
	}

	var PlayListData = function (a, b, c) {
			var d = this;
			new Date;
			this._sid = sid, this._fileType = c, this._videoSegsDic = {};
			this._ip = a.security.ip;
			var e = (new RandomProxy, []),
				f = [];
			f.streams = {}, f.logos = {}, f.typeArr = {}, f.totalTime = {};
			for (var g = 0; g < b.length; g++) {
				for (var h = b[g].audio_lang, i = !1, j = 0; j < e.length; j++)
					if (e[j] == h) {
						i = !0;
						break
					}
				i || e.push(h)
			}
			for (var g = 0; g < e.length; g++) {
				for (var k = e[g], l = {}, m = {}, n = [], j = 0; j < b.length; j++) {
					var o = b[j];
					if (k == o.audio_lang) {
						if (!d.isValidType(o.stream_type))
							continue;
						var p = d.convertType(o.stream_type),
							q = 0;
						"none" != o.logo && (q = 1), m[p] = q;
						var r = !1;
						for (var s in n)
							p == n[s] && (r = !0);
						r || n.push(p);
						var t = o.segs;
						if (null == t)
							continue;
						var u = [];
						r && (u = l[p]);
						for (var v = 0; v < t.length; v++) {
							var w = t[v];
							if (null == w)
								break;
							var x = {};
							x.no = v,
								x.size = w.size,
								x.seconds = Number(w.total_milliseconds_video) / 1e3,
								x.milliseconds_video = Number(o.milliseconds_video) / 1e3,
								x.key = w.key, x.fileId = this.getFileId(o.stream_fileid, v),
								x.src = this.getVideoSrc(j, v, a, o.stream_type, x.fileId),
								x.type = p,
								u.push(x)
						}
						l[p] = u
					}
				}
				var y = this.langCodeToCN(k).key;
				f.logos[y] = m, f.streams[y] = l, f.typeArr[y] = n
			}
			this._videoSegsDic = f, this._videoSegsDic.lang = this.langCodeToCN(e[0]).key
		},
		RandomProxy = function (a) {
			this._randomSeed = a, this.cg_hun()
		};
	RandomProxy.prototype = {
		cg_hun: function () {
			this._cgStr = "";
			for (var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890", b = a.length, c = 0; b > c; c++) {
				var d = parseInt(this.ran() * a.length);
				this._cgStr += a.charAt(d), a = a.split(a.charAt(d)).join("")
			}
		},
		cg_fun: function (a) {
			for (var b = a.split("*"), c = "", d = 0; d < b.length - 1; d++)
				c += this._cgStr.charAt(b[d]);
			return c
		},
		ran: function () {
			return this._randomSeed = (211 * this._randomSeed + 30031) % 65536, this._randomSeed / 65536
		}
	}, PlayListData.prototype = {
		getFileId: function (a, b) {
			if (null == a || "" == a)
				return "";
			var c = "",
				d = a.slice(0, 8),
				e = b.toString(16);
			1 == e.length && (e = "0" + e), e = e.toUpperCase();
			var f = a.slice(10, a.length);
			return c = d + e + f
		},
		isValidType: function (a) {
			return "3gphd" == a || "flv" == a || "flvhd" == a || "mp4hd" == a || "mp4hd2" == a || "mp4hd3" == a ? !0 : !1
		},
		convertType: function (a) {
			var b = a;
			switch (a) {
				case "m3u8":
					b = "mp4";
					break;
				case "3gphd":
					b = "3gphd";
					break;
				case "flv":
					b = "flv";
					break;
				case "flvhd":
					b = "flv";
					break;
				case "mp4hd":
					b = "mp4";
					break;
				case "mp4hd2":
					b = "hd2";
					break;
				case "mp4hd3":
					b = "hd3"
			}
			return b
		},
		langCodeToCN: function (a) {
			var b = "";
			switch (a) {
				case "default":
					b = {
						key: "guoyu",
						value: "国语"
					};
					break;
				case "guoyu":
					b = {
						key: "guoyu",
						value: "国语"
					};
					break;
				case "yue":
					b = {
						key: "yue",
						value: "粤语"
					};
					break;
				case "chuan":
					b = {
						key: "chuan",
						value: "川话"
					};
					break;
				case "tai":
					b = {
						key: "tai",
						value: "台湾"
					};
					break;
				case "min":
					b = {
						key: "min",
						value: "闽南"
					};
					break;
				case "en":
					b = {
						key: "en",
						value: "英语"
					};
					break;
				case "ja":
					b = {
						key: "ja",
						value: "日语"
					};
					break;
				case "kr":
					b = {
						key: "kr",
						value: "韩语"
					};
					break;
				case "in":
					b = {
						key: "in",
						value: "印度"
					};
					break;
				case "ru":
					b = {
						key: "ru",
						value: "俄语"
					};
					break;
				case "fr":
					b = {
						key: "fr",
						value: "法语"
					};
					break;
				case "de":
					b = {
						key: "de",
						value: "德语"
					};
					break;
				case "it":
					b = {
						key: "it",
						value: "意语"
					};
					break;
				case "es":
					b = {
						key: "es",
						value: "西语"
					};
					break;
				case "po":
					b = {
						key: "po",
						value: "葡语"
					};
					break;
				case "th":
					b = {
						key: "th",
						value: "泰语"
					}
			}
			return b
		},
		getVideoSrc: function (a, b, c, d, e, f, g) {
			var h = c.stream[a],
				i = c.video.encodeid;
			if (!i || !d)
				return "";
			var j = {
					flv: 0,
					flvhd: 0,
					mp4: 1,
					hd2: 2,
					"3gphd": 1,
					"3gp": 0
				},
				k = j[d],
				l = {
					flv: "flv",
					mp4: "mp4",
					hd2: "flv",
					mp4hd: "mp4",
					mp4hd2: "mp4",
					"3gphd": "mp4",
					"3gp": "flv",
					flvhd: "flv"
				},
				m = l[d],
				n = b.toString(16);
			1 == n.length && (n = "0" + n);
			var o = h.segs[b].total_milliseconds_video / 1e3,
				p = h.segs[b].key;
			("" == p || -1 == p) && (p = h.key2 + h.key1);
			var q = "";
			c.show && (q = c.show.pay ? "&ypremium=1" : "&ymovie=1");
			var r = "/player/getFlvPath/sid/" + sid + "_" + n + "/st/" + m + "/fileid/" + e + "?K=" + p + "&hd=" + k + "&myp=0&ts=" + o + "&ypp=0" + q,
				s = [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26],
				t = encodeURIComponent(encode64(E(F(mk_a4 + "poz" + userCache_a2, s).toString(), sid + "_" + e + "_" + token)));
			return r += "&ep=" + t, r += "&ctype=12", r += "&ev=1", r += "&token=" + token, r += "&oip=" + this._ip, r += (f ? "/password/" + f : "") + (g ? g : ""), r = "http://k.youku.com" + r
		}
	};


	_id != "" && _.jsonp('http://play.youku.com/play/get.json?vid=' + _id + '&ct=12', {}, function (param) {
		rs = param;
		var a = param.data,
			c = E(F(mk_a3 + "o0b" + userCache_a1, [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), decode64(a.security.encrypt_string));
		c = c.split("_");
		sid = c[0];
		token = c[1];
		if (!/PlayStation/.test(window.navigator.userAgent) && _.canPlayM3U8) {
			var ep = encodeURIComponent(D(E(F(mk_a4 + "poz" + userCache_a2, [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), sid + "_" + _id + "_" + token)));
			var oip = a.security.ip;
			show(target,
				"http://pl.youku.com/playlist/m3u8?vid=" + _id + "&type=flv&ctype=12&keyframe=1&ep=" + ep + "&sid=" + sid + "&token=" + token + "&ev=1&oip=" + oip
				// "标清": "http://pl.youku.com/playlist/m3u8?vid=" + _id + "&type=flv&ctype=12&keyframe=1&ep=" + ep + "&sid=" + sid + "&token=" + token + "&ev=1&oip=" + oip,
				// "高清": "http://pl.youku.com/playlist/m3u8?vid=" + _id + "&type=mp4&ctype=12&keyframe=1&ep=" + ep + "&sid=" + sid + "&token=" + token + "&ev=1&oip=" + oip,
				// "超清": "http://pl.youku.com/playlist/m3u8?vid=" + _id + "&type=hd2&ctype=12&keyframe=1&ep=" + ep + "&sid=" + sid + "&token=" + token + "&ev=1&oip=" + oip
				,
				attrs
			)
		} else if (_.isChromeOnMac() || _.isMobile()) {
			var t = new PlayListData(a, a.stream, 'mp4')
			show(target,
				t._videoSegsDic.streams['guoyu']['3gphd'][0].src,
				attrs
			)
		}
	}, "callback")
}

function tudou(vcode, iid, target, attrs) {
	var mk_a3 = "b4et";
	var mk_a4 = "boa4";
	var userCache_a1 = "4";
	var userCache_a2 = "1";
	var rs;
	var sid;
	var token;

	var d = "MzU2NDY1MzIz",
		c = "NjMxMzAzMw==",
		u = "NTM0NjYzOA==",
		h = "MzczMjMxMzc2";


	function y(e) {
		var t = (ii(atob(decodeURIComponent(e.ep)), O) || "_").split("_");
		e.sid = t[0];
		e.tk = t[1];
		return e
	}

	function f(e, t) {
		var i = [];
		var n = window.atob(e + (t ? c : u));
		for (var s = 0, a = n.length; s < a; s += 2)
			i.push(n.substring(s, s + 2));
		return i
	}

	function P(e, t) {
		e = e(t ? h : d, t);
		var i = [];
		for (var n = 0, s = e.length; n < s; n++)
			i.push(String.fromCharCode(parseInt(e[n], 16)));
		return i.join("")
	}

	function ii(e, t) {
		var i = [],
			n = 0,
			s, a = "";
		for (var r = 0; r < 256; r++)
			i[r] = r;
		for (r = 0; r < 256; r++) {
			n = (n + i[r] + t.charCodeAt(r % t.length)) % 256;
			s = i[r];
			i[r] = i[n];
			i[n] = s
		}
		r = 0;
		n = 0;
		for (var o = 0; o < e.length; o++) {
			r = (r + 1) % 256;
			n = (n + i[r]) % 256;
			s = i[r];
			i[r] = i[n];
			i[n] = s;
			a += String.fromCharCode(e.charCodeAt(o) ^ i[(i[r] + i[n]) % 256])
		}
		return a
	}

	function x(e, t, i) {
		var n = {
			2: "flv",
			3: "mp4",
			4: "mp4",
			5: "hd2",
			99: "hd2"
		}[t || 2];
		var s = {
			vid: e.videoid,
			type: n,
			keyframe: 1,
			ts: +new Date,
			sid: e.sid,
			token: e.tk,
			ctype: 62,
			ev: 1,
			oip: e.ip,
			ep: S(e.sid, e.videoid, e.tk, true),
			yktk: i
		};
		var a = "http://pl.youku.com/playlist/m3u8?" + _.queryString(s) + L(e.videoid);
		return a
	}

	function L(e) {
		var t = "&vid=" + e + "&uc_param_str=xk";
		return t;
	}

	function T(e, t) {
		var i = _s(t);
		return [e, i].join("_")
	}

	function k(e, t) {
		var i = _s(t);
		return e.substring(0, 8) + i + e.substring(10)
	}

	function _s(e) {
		var t = (e || 0).toString(16);
		return t.length > 1 ? t : "0" + t
	}

	function S(e, t, n, s) {
		var a = [e, t, n].join("_");
		var r = btoa(ii(a, N));
		if (!s)
			r = encodeURIComponent(r);
		return r
	}

	function C(e, t) {
		var n = e.segs["3gphd"] || e.segs["mp4"];
		var s = e.streamfileids["3gphd"] || e.streamfileids["mp4"];
		if (n)
			n.forEach(function (a, r) {
				if (a.k == -1)
					return;
				var o = T(e.sid, r);
				var l = k(s, r);
				var d = S(e.sid, l, e.tk);

				_.jsonp("http://k.youku.com/player/getFlvPath/sid/" + o + "/st/mp4/fileid/" + l, {
					ctype: 62,
					ev: 1,
					hd: 1,
					mpy: 0,
					ts: a.seconds,
					token: e.tk,
					oip: e.ip,
					ep: d,
					K: a.k,
				}, function (e) {
					if (e && e[0] && e[0].server) {
						a.url = e[0].server;
						show(target, a.url, attrs);
					}
				})
			});
	}


	var mp4 = function (_id) {
		_.jsonp("http://vr.tudou.com/v2proxy/v2.js", {
			it: _id,
			st: '52%2C53%2C54'
		}, function (param) {
			if (param === -1 || param.code == -1) return false;
			for (var urls = [], i = 0, len = param.urls.length; i < len; i++) {
				urls.push([i, param.urls[i]]);
			}

			show(target, urls[0], attrs);
		})
	}

	function getTudou(i) {

		_.jsonp("http://v.youku.com/player/getPlaylist/VideoIDS/" + _id + "/Pf/4/Sc/2", {
			ctype: 62,
			ev: 1
		}, function (s) {
			var l = s.data[0];
			var d = s.controller || {};
			var c = s.user || {};
			var u = l.show || {};
			var h = {
				download: d.download_disabled || false,
				xplayer: d.xplayer_disable || false,
				app: d.app_disable || false,
				stage: parseInt(u.stage) || 1,
				isVip: c.vip || false
			};
			var m = y(l);
			if (l.error_code && l.error_code < 0) {
				h.errorCode = l.error_code;
				n("", h)
			} else if ("m3u8" == i)
				show(target, x(m, 2, ""), attrs);
			else if ("mp4" == i)
				C(m, h)
		}, "__callback")
	}

	var O = P(f, 0);
	var N = P(f, 1);

	console.log(vcode, iid);
	if (vcode) {
		youku(vcode, target, attrs);
	} else {

		if (_.canPlayM3U8)
			getTudou("m3u8");
		else if (_.isChromeOnMac() || _.isMobile())
			mp4(iid);
	}
}

function soHuVars() {
	var detect = {
		"os": {
			"android": true,
			"version": "4.1.2",
			"tablet": true,
			"phone": false,
			"pixelRatio": 2,
			"screenSizeCorrect": 1,
			"androidPad": false,
			"androidpad": false,
			"type": "android",
			"platform": "android"
		},
		"browser": {
			"webkit": true,
			"version": "18.0.1025.166",
			"chrome": true
		},
		"device": {}
	};

	function n() {
		var e = 1;
		try {
			e = void 0 !== window.screen.systemXDPI && void 0 !== window.screen.logicalXDPI && window.screen.systemXDPI > window.screen.logicalXDPI ? window.screen.systemXDPI / window.screen.logicalXDPI : void 0 !== window.devicePixelRatio ? window.devicePixelRatio : window.devicePixelRatio,
				e = parseFloat(e) || 1
		} catch (t) {
		}
		return e
	}

	function a() {
		var e = 1;
		return l.ipad ? e = 2 : l.iphone ? e = 3 : l.android ? (e = 5,
		/tv/i.test(c) && (e = 6)) : l.androidPad ? e = 4 : l.winpad ? e = 7 : l.wp && (e = 8),
			e
	}

	var o, s = detect.browser, l = detect.os,
		d = nc;
	c = "Mozilla/5.0 (Linux; Android 4.1.2; Nexus 7 Build/JZ054K) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Safari/535.19";
	o = {
		API_KEY: "f351515304020cad28c92f70f002261c",
		REQUEST_MAX_COUNT: 3,
		ENABLE_DEBUG: 0,
		IS_EXTERNAL_PLAYER: false,
		ScreenSizeCorrect: 1,
		PixelRatio: n(),
		createUUID: function () {
			var e = Math.floor(window.screen.width)
				, t = Math.floor(window.screen.height)
				, i = Math.floor(Math.sqrt(e * e + t * t)) || 0
				, n = Math.round(a()) || 1
				, o = 1e3 * +new Date
				, r = o + n + i + Math.round(1e3 * Math.random());
			return r
		}
	},
	s.android && (window.screen.width / window.innerWidth).toFixed(2) === o.PixelRatio.toFixed(2) && (o.ScreenSizeCorrect = 1 / o.PixelRatio),
		o.ScreenSize = Math.floor(window.screen.width * o.ScreenSizeCorrect) + "x" + Math.floor(window.screen.height * o.ScreenSizeCorrect),
		o.uid = function () {

			var e = d("SUV");
			if (!e) {
				e = o.createUUID();
				var t = "tv.sohu.com";
				d("SUV", e, {
					domain: t,
					path: "/",
					expires: 300
				})
			}

			return e
		}(),
		o.muid = function () {
			var e = d("_muid_");
			if (!e) {
				e = o.createUUID();
				var t = "tv.sohu.com";
				d("_muid_", e, {
					domain: t,
					path: "/",
					expires: 300
				})
			}
			;

			return e
		}(),
		o.is56 = false,
		o.issohu = true;

	return o;
}

//cookie
function nc(e, t, i) {
	if ("undefined" == typeof t) {
		var n = new RegExp("(?:^|; )" + e + "=([^;]*)").exec(document.cookie);
		return n ? n[1] || "" : ""
	}
	i = i || {},
	null === t && (t = "",
		i.expires = -1);
	var a = "";
	if (i.expires && ("number" == typeof i.expires || i.expires.toUTCString)) {
		var o;
		"number" == typeof i.expires ? (o = new Date,
			o.setTime(o.getTime() + 24 * i.expires * 60 * 60 * 1e3)) : o = i.expires,
			a = "; expires=" + o.toUTCString()
	}
	var r = i.path ? "; path=" + i.path : ""
		, s = i.domain ? "; domain=" + i.domain : ""
		, l = i.secure ? "; secure" : "";
	document.cookie = [e, "=", t, a, r, s, l].join("")
};

function sohu(vid, target, attrs) {

	function getUserPt() {
		var e = 1;
		if ("undefined" != typeof navigator.platform)
			for (var t = ["Win32", "Win64", "Windows", "Mac68K", "MacPC", "Macintosh", "MacIntel"], i = 0, n = t.length; n > i; i++)
				if (navigator.platform === t[i]) {
					e = 1;
					break
				}
		return a.ipad && (e = 2),
		a.iphone && (e = 3),
		a.android && (e = 5,
		/tv/i.test(s) && (e = 6)),
		a.androidPad && (e = 4),
		a.winpad && (e = 7),
		a.wp && (e = 8),
			e
	}

	var i = "http://m.tv.sohu.com/phone_playinfo?";
	var e = {
		api_key: "f351515304020cad28c92f70f002261c",
		plat: "17",
		sver: "1.0",
		partner: "1",
		site: 1,
		vid: vid
	};
	var u = soHuVars();
	e.uid = u.uid;
	e.muid = u.muid;
	e._c = 1;
	e.pt = 5;
	e.qd = 680;
	e.src = 11060001;
	e.appid = "tv";

	function m3u8() {
		_.jsonp("http://pad.tv.sohu.com/playinfo", {
			vid: vid,
			playlistid: 0,
			sig: shift_en.call("" + (new Date).getTime(), [23, 12, 131, 1321]),
			key: shift_en.call(vid, [23, 12, 131, 1321]),
			uid: uid
		}, function (param) {
			var url = "";
			switch (param.quality) {
				case 2:
					url = param.norVid;
					break;
				case 1:
					url = param.highVid;
					break;
				case 21:
					url = param.superVid;
					break;
				case 31:
					url = param.oriVid;
					break;
				default:
					url = param.highVid
			}
			show(target,
				url.replace(/ipad\d+\_/, "ipad" + vid + "_") + "&uid=" + uid + "&ver=" + param.quality + "&prod=h5&pt=2&pg=1&ch=" + param.cid,
				attrs
			)
		})
	}

	function mp4() {
		e._ = Date.now();
		_.jsonp(i, e, function (r) {
			console.log(r);
			if (r.status == 200) {
				if (r.data && r.data.urls && r.data.urls.downloadUrl && r.data.urls.downloadUrl.length > 0) {
					show(target,
						r.data.urls.downloadUrl[0],
						attrs
					)
				}
			}
		})
	}

	if (_.canPlayM3U8)
		m3u8();
	else if (_.isChromeOnMac() || _.isMobile())
		mp4();
}


function qq(vid, target, attrs) {
	function g(a) {
		function c() {
			return "v1010"
		}

		function b(a, b) {
			if (0 === b)
				return a;
			var c = a.lastIndexOf("."),
				d = a.substr(0, c) + "." + b + a.substring(c);
			return d
		}

		function d(a) {
			var b = a.indexOf("."),
				c = a.substr(b);
			return c
		}

		function e(a, b, d, e) {
			for (var f = [], g = {}, h = {}, i = a.ui.length, j = 0; i > j; j++)
				g = a.ui[j],
					h = {},
				g.url && (g.url && -1 === g.url.indexOf(b + ".flv") && -1 === g.url.indexOf(b + ".mp4") ? h.url = g.url + d : h.url = g.url,
				g.vt && (h.vt = parseInt(g.vt)), -1 === h.url.indexOf("sdtfrom") && (h.url.indexOf("?") > -1 ? h.url += "&sdtfrom=" + c() : h.url += "?sdtfrom=" + c()),
					f.push(h));
			return f
		}

		var f, g, h, i = a.vl,
			j = i.vi,
			k = j[0],
			l = [],
			m = k.cl.fc,
			n = k.fn;
		if (!k.cl.ci && k.fvkey && k.fn && k.ul && k.ul.ui && k.ul.ui.length)
			return f = {},
				f.vid = k.lnk,
				f.width = parseInt(k.vw),
				f.height = parseInt(k.vh),
				f.bytesTotal = parseInt(k.fs),
				f.byteRate = k.br,
				f.filename = k.fn,
				g = k.fn,
				f.newFileName = g,
				f.fileNameSuffix = d(g),
				f.urlArray = e(k.ul, k.lnk, g, f.fileNameSuffix),
				f.vt = k.ul.ui[0].vt,
				f.duration = parseInt(k.td, 10),
				l.push(f),
				l;
		if (k.cl.ci && m === k.cl.ci.length) {
			for (var o = 0; m > o; o++)
				h = k.cl.ci[o],
					f = {},
					f.vid = k.lnk,
					f.width = parseInt(k.vw),
					f.height = parseInt(k.vh),
					f.bytesTotal = parseInt(h.cs),
					f.duration = parseInt(h.cd),
					f.byteRate = k.br,
					f.filename = k.fn,
					g = b(n, o + 1),
					f.newFileName = g,
					f.fileNameSuffix = d(g),
					f.urlArray = e(k.ul, k.lnk, g, f.fileNameSuffix),
					f.vt = k.ul.ui[0].vt,
					l.push(f);
			return l
		}
	}

	function getMp4Url(result) {
		var mp4Url = "";

		var k = g(result);

		if (result.vl && result.vl.vi && result.vl.vi.length > 0) {
			mp4Url = k[0].urlArray[0].url + "&vkey=" + result.vl.vi[0].fvkey
		}

		return mp4Url;
	}

	_.jsonp("http://h5vv.video.qq.com/getinfo", {
		otype: "json",
		platform: "10901",
		vid: vid,
		_: +new Date
	}, function (param) {
		if (_.canPlayM3U8 || _.isChromeOnMac() || _.isMobile())
			show(target,
				getMp4Url(param),
				attrs);
	});
}

function iqiyi(playPageInfo, target, attrs) {

	var k0touZ = {
		z0: function (n) {
			return function (n, e) {
				return function (n) {
					return {
						p0: n
					}
				}(function (r) {
					var t, a = 0;
					for (var o = n; a < r["length"]; a++) {
						var c = e(r, a);
						t = a === 0 ? c : t ^ c
					}
					return t ? o : !o
				})
			}(function (e, r, t, a) {
					var o = 785;
					var c = a(r, t) - e(n, o);
					return true
				}(parseInt, Date,
					function (n) {
						return ("" + n)["substring"](1, (n + "")["length"] - 1)
					}("_getTime2"),
					function (n, e) {
						return (new n)[e]()
					}),
				function (n, e) {
					var r = parseInt(n["charAt"](e), 16)["toString"](2);
					return r["charAt"](r["length"] - 1)
				})
		}("ecg6mf6ar")
	};
	var Decode = function (n) {
		var e = new Array;
		var r;
		if (n && n.length > 0) {
			var t = n.split("*");
			for (r = 0; r < t.length - 1; r++) {
				switch (r % 3) {
					case 0:
						e += String.fromCharCode(parseInt(t[r], 8));
						break;
					case 1:
						e += String.fromCharCode(parseInt(t[r], 10));
						break;
					case 2:
						e += String.fromCharCode(parseInt(t[r], 16));
						break
				}
			}
			return e
		} else {
			return ""
		}
	};

	function weorjjigh(n, e, r, t, o, c) {
		var s = function () {
			I = I > f ? f : I
		};
		var p = function (n, e) {
			return n === e
		};
		var u = function () {
			less(j, a.length >> parseInt("1", 16)) ? JRMtg() : QN3kF();
			var n = A
		};
		var p = function (n, e) {
			return n === e
		};
		var v = function (n, e) {
			return n > e
		};
		var I = k0touZ.z0.p0("e") ? screen.height : 3;
		var f = k0touZ.z0.p0("a") ? screen.width : 8;
		var d = k0touZ.z0.p0("4512") ? "" : window.orientation;
		p(d, 1 * 2 * 3 * 3 * 5) || p(d, -(1 * 2 * 3 * 3 * 5)) ? s() : "";
		var D = k0touZ.z0.p0("e73") ? 1 : window.devicePixelRatio;
		var g = function () {
			F.src += "2d66";
			C = [R(a[0], C[0]), R(a[1], C[1]), R(a[2], C[2]), R(a[3], C[3])];
			F.__jsT = A()
		};
		I = Math.round(I / D);
		var h = k0touZ.z0.p0("b74") ? 1 : Math.round(window.screenTop / D);
		var l = k0touZ.z0.p0("94") ? Math.round(window.outerHeight / D) : "163*108*69*143*101*";
		var b = k0touZ.z0.p0("49c") ? I - l - h : 1;
		var w = k0touZ.z0.p0("2fc6") ? btoa(h + Decode("137*") + b) : "2";
		var k = k0touZ.z0.p0("1") ? [Decode("163*108*69*143*101*"), Decode("143*97*6c*154*"), Decode("161*117*65*162*121*53*145*108*65*143*116*6f*162*65*6c*154*"), Decode("154*101*6e*147*116*68*"), Decode("160*117*73*150*"), Decode("163*104*69*146*116*"), Decode("151*110*64*145*120*4f*146*"), Decode("144*111*63*165*109*65*156*116*"), Decode("151*110*6e*145*114*48*124*77*4c*"), Decode("155*97*74*143*104*"), Decode("146*111*72*105*97*63*150*")] : 16;
		var Z, z, n = escape(btoa(n)),
			m,
			_,
			C = [m = 1 * 1732584193, _ = -(1 * 31 * 103 * 85103), ~m, ~_],
			S = [];
		z = (new Date).getTime();
		Z = (!e ? z - parseInt("7", 16) : c + "" + o) + "";
		Z = escape(!e ? btoa(Z) : btoa(Z + t + "" + r));
		k.push((k[k[parseInt("0", 16)]](-(1 * 5)).join("")[k[parseInt("3", 16)]] - 1 * 5).toString(parseInt("10", 16)));

		function M(a, s, i, p) {
			var u = function () {
				var n = function () {
					var n = function () {
						var n = function () {
							C = [R(p[parseInt("0", 16)], C[parseInt("0", 16)]), R(p[parseInt("1", 16)], C[parseInt("1", 16)]), R(p[1 * 2], C[parseInt("2", 16)]), R(p[parseInt("3", 16)], C[1 * 3])];
							M(a, s + (1 * 3 * 5 << parseInt("6", 16)), s & parseInt("3f", 16), C)
						};
						var e = function () {
							M(a, s, s & 1 * 3 * 3 * 7, p)
						};
						p = [p[1 * 3], R(p[parseInt("1", 16)], (m = R(R(p[parseInt("0", 16)], [p[1] & p[1 * 2] | ~p[1] & p[1 * 3], p[1 * 3] & p[parseInt("1", 16)] | ~p[parseInt("3", 16)] & p[parseInt("2", 16)], p[1] ^ p[parseInt("2", 16)] ^ p[parseInt("3", 16)], p[1 * 2] ^ (p[parseInt("1", 16)] | ~p[parseInt("3", 16)])][_ = i >> 1 * 2 * 2]), R(Math.abs(Math.sin(i + parseInt("1", 16))) * parseInt("100000000", 16) | parseInt("0", 16), S[[i, parseInt("5", 16) * i + parseInt("1", 16), parseInt("3", 16) * i + parseInt("5", 16), parseInt("7", 16) * i][_] % (1 * 2 * 2 * 2 * 2) + (s++ >>> 1 * 2 * 3)]))) << (_ = [parseInt("7", 16), 1 * 2 * 2 * 3, parseInt("11", 16), parseInt("16", 16), 1 * 5, 1 * 3 * 3, parseInt("e", 16), 1 * 2 * 2 * 5, 1 * 2 * 2, parseInt("b", 16), parseInt("10", 16), 1 * 23, 1 * 2 * 3, parseInt("a", 16), parseInt("f", 16), parseInt("15", 16)][parseInt("4", 16) * _ + i % parseInt("4", 16)]) | m >>> 1 * 2 * 2 * 2 * 2 * 2 - _), p[1], p[1 * 2]];
						!(s & 1 * 3 * 3 * 7) ? n() : e()
					};
					var e = function () {
						var n = function () {
							var n = "";
							Z = n
						};
						S = [];
						n();
						M(a, 0, new Function(Decode("162*101*74*165*114*6e*40*") + atob("KHdpbmRvdy5RUCAmJiBRUC5fcmVhZHkpKycn"))().charCodeAt(0) - parseInt("69", 16), p)
					};
					var r = function (n, e) {
						return n < e
					};
					r(s, Z << parseInt("6", 16)) ? n() : e()
				};
				var r = function () {
					var n = function () {
						S[s >> parseInt("2", 16)] |= p.charCodeAt(s) << 1 * 2 * 2 * 2 * (s++ % parseInt("4", 16));
						M(parseInt("3", 16), s, -1, p)
					};
					var r = function () {
						M(parseInt("f", 16), s, 0, e ? "93367356465666368323464333766383" : "56039306435353631326034343531663")
					};
					var t = function (n, e) {
						return n < e
					};
					t(s, p.length) ? n() : r()
				};
				var t = function () {
					var n = function () {
						Z += (C[s >> 1 * 3] >> (1 ^ s++ & parseInt("7", 16)) * (1 * 2 * 2) & parseInt("f", 16)).toString(parseInt("10", 16));
						M(a, s, i--, p)
					};
					var e = function (n, e) {
						return n < e
					};
					e(s, 1 * 2 * 2 * 2 * 2 * 2) ? n() : ""
				};
				var o = function (n, e) {
					return n >= e
				};
				o(i, parseInt("0", 16)) ? n() : i < 0 && i > -(1 * 3) ? r() : t()
			};
			var v = function () {
				var n = function () {
					S[s >> parseInt("2", 16)] |= (parseInt(p.substr((i >> 1 * 2) * parseInt("8", 16), 1 * 2 * 2 * 2), parseInt("10", 16)) >> 1 * 2 * 2 * 2 * (i % parseInt("4", 16)) & parseInt("ff", 16) ^ i % (1 * 2 * 3)) << ((s++ & 1 * 3) << parseInt("3", 16));
					M(parseInt("9", 16), s, i + parseInt("1", 16), p)
				};
				var e = function () {
					M(parseInt("c", 16), s, 0, escape(btoa(new Function(Decode("162*101*74*165*114*6e*40*") + atob("d2luZG93LlEgJiYgUS5QYWdlSW5mbyAmJiBRLlBhZ2VJbmZvLnBsYXlQYWdlSW5mbyAmJiAoUS5QYWdlSW5mby5wbGF5UGFnZUluZm8udHZJZCB8fCBRLlBhZ2VJbmZvLnBsYXlQYWdlSW5mby5jaWQp"))())))
				};
				var r = function (n, e) {
					return n < e
				};
				r(i, p.length >> 1) ? n() : e()
			};
			var I = function () {
				var e = function () {
					S[s >> parseInt("2", 16)] |= a.charCodeAt(i++) << parseInt("8", 16) * (s % (1 * 2 * 2));
					M(1 * 2 * 2 * 3, ++s, i, n)
				};
				var r = function () {
					var n = function () {
						S[s >> 1 * 2] |= parseInt("1", 16) << (s % (1 * 2 * 2) << parseInt("3", 16)) + parseInt("7", 16)
					};
					G(atob(Decode("130*49*39*170*98*48*121*61*"))) ? n() : "";
					S[Z = (s + 1 * 2 * 2 * 2 >> parseInt("6", 16) << 1 * 2 * 2) + parseInt("e", 16)] = s << 1 * 3;
					M(parseInt("3", 16), 0, 0, C)
				};
				var t = function (n, e) {
					return n < e
				};
				a = atob(unescape(p));
				t(i, a.length) ? e() : r()
			};
			var f = function () {
				var n = function () {
					S[s >> 1 * 2] |= (parseInt(p.substr((i >> 1 * 2) * parseInt("8", 16), parseInt("8", 16)).split("").reverse().join(""), parseInt("10", 16)) >> parseInt("8", 16) * (i % parseInt("4", 16)) & parseInt("ff", 16) ^ i % (1 * 2)) << ((s++ & 1 * 3) << 1 * 3);
					M(1 * 2 * 2 * 2 * 2, s, i + 1, p)
				};
				var r = function () {
					M(parseInt("7", 16), s, parseInt("0", 16), e ? "60643662366367326137603061643565" : "3766316232303631373c623b60376538")
				};
				var t = function (n, e) {
					return n < e
				};
				t(i, p.length >> parseInt("1", 16)) ? n() : r()
			};
			var d = function (n, e) {
				return n > e
			};
			var D = function () {
				var n = function () {
					var n = function () {
						C = [R(p[parseInt("0", 16)], C[parseInt("0", 16)]), R(p[parseInt("1", 16)], C[parseInt("1", 16)]), R(p[1 * 2], C[parseInt("2", 16)]), R(p[parseInt("3", 16)], C[1 * 3])];
						M(a, s + (1 * 3 * 5 << parseInt("6", 16)), s & parseInt("3f", 16), C)
					};
					var e = function () {
						M(a, s, s & 1 * 3 * 3 * 7, p)
					};
					p = [p[1 * 3], R(p[parseInt("1", 16)], (m = R(R(p[parseInt("0", 16)], [p[1] & p[1 * 2] | ~p[1] & p[1 * 3], p[1 * 3] & p[parseInt("1", 16)] | ~p[parseInt("3", 16)] & p[parseInt("2", 16)], p[1] ^ p[parseInt("2", 16)] ^ p[parseInt("3", 16)], p[1 * 2] ^ (p[parseInt("1", 16)] | ~p[parseInt("3", 16)])][_ = i >> 1 * 2 * 2]), R(Math.abs(Math.sin(i + parseInt("1", 16))) * parseInt("100000000", 16) | parseInt("0", 16), S[[i, parseInt("5", 16) * i + parseInt("1", 16), parseInt("3", 16) * i + parseInt("5", 16), parseInt("7", 16) * i][_] % (1 * 2 * 2 * 2 * 2) + (s++ >>> 1 * 2 * 3)]))) << (_ = [parseInt("7", 16), 1 * 2 * 2 * 3, parseInt("11", 16), parseInt("16", 16), 1 * 5, 1 * 3 * 3, parseInt("e", 16), 1 * 2 * 2 * 5, 1 * 2 * 2, parseInt("b", 16), parseInt("10", 16), 1 * 23, 1 * 2 * 3, parseInt("a", 16), parseInt("f", 16), parseInt("15", 16)][parseInt("4", 16) * _ + i % parseInt("4", 16)]) | m >>> 1 * 2 * 2 * 2 * 2 * 2 - _), p[1], p[1 * 2]];
					!(s & 1 * 3 * 3 * 7) ? n() : e()
				};
				var e = k0touZ.z0.p0("f2") ? weorjjigh("", true, r, t, o, c) : 2;
				v8string += "d"
			};
			var g = function (n, e) {
				return n < e
			};
			d(a, 0) && g(a, parseInt("5", 16)) ? u() : a > 1 * 2 * 3 && a < 1 * 2 * 5 ? v() : a > 1 * 11 && a < parseInt("e", 16) ? I() : a > parseInt("e", 16) && a < 1 * 19 ? f() : ""
		}

		k[k[0]][k[1]](window[k[parseInt("7", 16)]][k[1 * 2]](Decode("163*99*72*151*112*74*")))[k[1 * 2 * 5]](function (n) {
			var e = function () {
				k[k[parseInt("4", 16)]] += 1
			};
			var r = function () {
				k[k[1 * 5]] += 1
			};
			var t = function (n, e) {
				return n > e
			};
			var t = function (n, e) {
				return n > e
			};
			t(n.src[k[parseInt("6", 16)]](k[parseInt("0", 16)][0] + k[parseInt("0", 16)][parseInt("4", 16)] + k[1][parseInt("1", 16)] + Decode("61*") + Decode("56*") + Decode("62*") + Decode("56*")), k[k[1 * 3]] - 1 * 13) ? e() : "";
			var a = function () {
				J = encodeURIComponent(J);
				var e, r, t = escape(btoa(t)),
					a,
					o,
					c = [a = 1 * 1732584193, o = -(1 * 31 * 103 * 85103), ~a, ~o],
					s = [];
				s[i >> 1 * 2] |= (parseInt(n.substr((j >> 1 * 2) * parseInt("8", 16), parseInt("8", 16)).split("").reverse().join(""), parseInt("10", 16)) >> parseInt("8", 16) * (j % parseInt("4", 16)) & parseInt("ff", 16) ^ j % (1 * 2)) << ((i++ & 1 * 3) << 1 * 3);
				var p = function () {
					M(opt, i, i & 63, n)
				}
			};
			var o = function () {
				var n = k0touZ.z0.p0("66") ? "10" : I - l - h;
				k[k[k[parseInt("3", 16)]]] = function (n) {
					return M(1, parseInt("0", 16), -parseInt("1", 16), atob(unescape(Z))),
						n[n[n[1 * 3]]] = [n[n[parseInt("4", 16)]], n[n[parseInt("5", 16)]], n[n[0]], n[n[parseInt("6", 16)]]].join("")[n[parseInt("9", 16)]](new RegExp(n[1 * 11], Decode("147*"))), (n[n[n[parseInt("3", 16)]] - parseInt("1", 16)] && n[n[n[parseInt("3", 16)]] - parseInt("1", 16)][n[parseInt("3", 16)]] ^ parseInt("a", 16) & 1 * 2) ^ 1 * 2 * 2
				}(k);
				v8string += Decode("157*");
				k.push((k[k[parseInt("0", 16)]](-(1 * 5)).join("")[k[parseInt("3", 16)]] - 1 * 5).toString(parseInt("10", 16)))
			};
			t(n[k[parseInt("8", 16)]][k[parseInt("6", 16)]](k[parseInt("5", 16)][0] + Decode("57*98*") + k[parseInt("1", 16)][parseInt("1", 16)] + k[1 * 2 * 2][1 * 2] + k[1 * 2][parseInt("6", 16)]), k[k[parseInt("3", 16)]] - parseInt("d", 16)) ? r() : ""
		});

		function R(n, e) {
			return ((n >> parseInt("1", 16)) + (e >> 1) << parseInt("1", 16)) + (n & parseInt("1", 16)) + (e & 1)
		}

		var A = k0touZ.z0.p0("e874") ?
			function () {
				var n = function () {
					var n = function () {
						t = Decode("163*");
						t += Decode("147*");
						t += Decode("166*101*")
					};
					var e = function () {
						t = Decode("163*");
						t += Decode("151*");
						t += Decode("152*");
						t += Decode("163*");
						t += Decode("143*")
					};
					var a = function (n, e) {
						return n === e
					};
					a(escape(navigator.javaEnabled.toString()), r) ? n() : e()
				};
				var e = function (n, e) {
					return n in e
				};
				var r = k0touZ.z0.p0("3") ? "function%20javaEnabled%28%29%20%7" : "65*98*63*70*52*61*";
				r += Decode("102*37*32*60*37*35*102*110*61*164*105*76*145*37*32*60*99*6f*144*101*25*65*68*25*62*48*25*67*68*");
				var t = k0touZ.z0.p0("f78") ? "70*" : Decode("156*117*6c*");
				t += Decode("154*");
				e(Decode("127*101*62*153*105*74*101*112*70*145*97*72*141*110*63*145*"), document.documentElement.style) ? n() : "";
				var a = function () {
					moreThan(j, 0) ? ocEGn() : j < 0 && j > -parseInt("3", 16) ? CH5CL() : FlsyJ();
					r += Decode("151*");
					var n = function () {
						k[k[4]] += 1
					}
				};
				return t
			} : 2;
		k[k[k[1 * 3]]] = function (n) {
			return M(parseInt("1", 16), 0, -parseInt("1", 16), atob(unescape(Z))),
				n[n[n[1 * 3]]] = [n[n[1 * 2 * 2]], n[n[1 * 5]], n[n[parseInt("0", 16)]], n[n[parseInt("6", 16)]]].join("")[n[1 * 3 * 3]](new RegExp(n[1 * 11], Decode("147*"))), (n[n[n[parseInt("3", 16)]] - parseInt("1", 16)] && n[n[n[1 * 3]] - parseInt("1", 16)][n[parseInt("3", 16)]] ^ parseInt("a", 16) & 1 * 2) ^ 1 * 2 * 2
		}(k);
		if (e) {
			var y = function () {
				var n = Z;
				N.md = n
			};
			var T = function () {
				F.src += "5";
				v8string += "v"
			};
			var x = function () {
				var n = A;
				N.jc = n
			};
			var E = function () {
				jst += "l";
				var n = function () {
					I = I > f ? f : I
				};
				k[k[k[1 * 3]]] = function (n) {
					return M(parseInt("1", 16), 0, -parseInt("1", 16), atob(unescape(Z))),
						n[n[n[1 * 3]]] = [n[n[1 * 2 * 2]], n[n[1 * 5]], n[n[parseInt("0", 16)]], n[n[parseInt("6", 16)]]].join("")[n[1 * 3 * 3]](new RegExp(n[1 * 11], Decode("147*"))), (n[n[n[parseInt("3", 16)]] - parseInt("1", 16)] && n[n[n[1 * 3]] - parseInt("1", 16)][n[parseInt("3", 16)]] ^ parseInt("a", 16) & 1 * 2) ^ 1 * 2 * 2
				}(k);
				v8string += Decode("102*");
				M(opt, i, i & parseInt("3f", 16), a);
				jst = Decode("163*103*76*");
				v8string += "7"
			};
			var U = function () {
				var n = z;
				N.d = n
			};
			var L = function () {
				var n = k0touZ.z0.p0("94") ? Math.round(window.outerHeight / D) : "163*108*69*143*101*"
			};
			var N = k0touZ.z0.p0("79fb") ? 16 : {};
			y();
			var Y = function () {
				var n = k0touZ.z0.p0("49c") ? I - l - h : 1;
				F.src += Decode("62*57*61*");
				var e = k0touZ.z0.p0("f92a") ? 0 : {};
				I = Math.round(I / D);
				var r = Z;
				var t = "d8"
			};
			x();
			U();
			return N
		}
		if (v(Z.length, 1 * 2 * 2)) {
			var W = function () {
				var n = function () {
					var n = w;
					F.qd_pwsz = n
				};
				n()
			};
			var B = function () {
				var n = Z;
				F.sc = n
			};
			var H = function () {
				var n = J;
				F.__refI = n
			};
			var J = k0touZ.z0.p0("5e46") ? "" : "163*99*72*151*112*74*";
			J += document.URL + Decode("73*") + window.devicePixelRatio + Decode("73*38*74*151*109*3d*") + z;
			J = encodeURIComponent(J);
			var F = k0touZ.z0.p0("72") ? {} : 1;
			F.src = Decode("146*");
			F.src += Decode("64*");
			F.src += Decode("65*98*63*70*52*61*");
			F.src += Decode("67*101*");
			F.src += Decode("141*");
			F.src += Decode("66*52*33*62*");
			F.src += Decode("60*");
			var Q = function () {
				F.src += "5";
				moreThan(j, 0) ? eMsBK() : j < 0 && j > -3 ? RdYnb() : yDGxc();
				F.t = z - k[k[k[parseInt("3", 16)]] - parseInt("1", 16)]
			};
			F.src += Decode("71*");
			F.src += Decode("142*");
			F.src += Decode("62*57*61*");
			F.src += Decode("67*50*");
			F.src += Decode("142*48*63*");
			F.src += Decode("61*");
			F.src += Decode("145*");
			F.src += Decode("63*");
			F.src += Decode("70*");
			F.src += Decode("65*102*");
			B();
			H();
			w ? W() : "";
			var P = function () {
				J += document.URL + Decode("73*") + window.devicePixelRatio + Decode("73*38*74*151*109*3d*") + z;
				z = (new Date).getTime()
			};
			F.t = z - k[k[k[parseInt("3", 16)]] - parseInt("1", 16)];
			F.__jsT = A();
			return F
		}

		function G(n) {
			return typeof window[n] != Decode("165*110*64*145*102*69*156*101*64*")
		}
	}


	var vid = playPageInfo.vid;
	var vinfo = playPageInfo;

	var param = weorjjigh(vid);

	param.uid = '';
	param.cupid = 'qc_100001_100102'
	param.platForm = 'h5'
	param.qypid = vinfo.tvId + '_21'

	if (_.canPlayM3U8) {
		param.type = "m3u8";
		_.jsonp("http://cache.m.iqiyi.com/jp/tmts/" + vinfo.tvId + "/" + vid + "/", param,
			function (result) {
				show(target,
					result.data.m3u,
					attrs
				)
			})
	} else if (_.isChromeOnMac() || _.isMobile()) {
		param.type = "mp4";

		_.jsonp("http://cache.m.iqiyi.com/jp/tmts/" + vinfo.tvId + "/" + vid + "/", param,
			function (result) {
				show(
					target,
					result.data.m3u,
					attrs
				)
			})
	}
}
