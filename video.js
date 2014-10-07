	var _ = {};
	_.canPlayM3U8 = !!document.createElement("video").canPlayType("application/x-mpegURL") ? true : false;
	_.isChromeOnMac = function() {
		var ua = navigator.userAgent.toLowerCase();
		if (ua.match(/Macintosh/i) && ua.match(/Chrome/i))
			return true;
		else
			return false;
	};
	_.each = function(arrOrObject, fn, context, i, len) {
		if (typeof arrOrObject.length == "number") {
			for (i = 0, len = arrOrObject.length; i < len; i++)
				if (fn.call(context, arrOrObject[i], i) == false) break
		} else
			for (i in arrOrObject)
				if (fn.call(context, arrOrObject[i], i) == false) break
	};
	_.extend = function(target) {
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
	_.queryString = function(query) {
		var arr = [];
		_.each(query, function(value, key) {
			value !== undefined && arr.push(key + "=" + value)
		});
		return arr.join("&")
	};
	_.byId = function(id) {
		return document.getElementById(id)
	};
	_.rNode = function(el) {
		try {
			el.parentNode.removeChild(el)
		} catch (e) {}
	};
	_.cTag = function(tagName, styles, attrs, out) {
		var t = document.createElement(tagName),
			cssText = "";
		_.each(styles || {}, function(value, key) {
			cssText += [key, ":", value, ";"].join("")
		}), t.style.cssText = cssText;
		_.each(attrs || {}, function(value, key) {
			t.setAttribute(key, value)
		});
		return out && out.appendChild(t) || t
	};
	_.jsonp = function(url, param, callback, handler) {
		var scr, back = "HTML5PlayerBookMarkCodeByZythum" + +(new Date) + Math.random().toString().replace(".", "");
		var hasQuery = url.indexOf("?") >= 0;
		param = _.queryString(param);
		if (param.length) param = (hasQuery ? "&" : "?") + param;
		handler = [hasQuery || param.length ? "&" : "?", handler || "callback", "=", back].join("");
		window[back] = function() {
			callback && callback.apply(this, arguments);
			delete window[back];
			_.rNode(scr)
		};
		(scr = _.cTag("script", {}, {}, document.body)).src = url + param + handler
	};
	_.times = function() {
		return (new Date).getTime();
	};
	_.log = function(text) {
		window.console || window.console(text);
	};
	_.isMobile = function() {
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

	//main
	function show(elementId, url,attrs) {
		try {
			var flash = _.byId(elementId);
			flash.innerHTML = "";
			var video = _.cTag("video", null, {
				"src": url,
				"controls": "controls",
				"preload": "preload",
				"width":attrs.width,
				"height":attrs.height
			}, flash);
		} catch (e) {}
	}

	function pptv(vid, kk, target,attrs) {
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
		}, function(param) {
			var m3u8 = pptvm3u8(param);
			if (_.canPlayM3U8) {
				show(target, m3u8,attrs);
			} else if (_.isChromeOnMac() || _.isMobile()) {
				show(target, m3u8,attrs);
			}
		}, "cb")
	}

	function sina(vid, apiOrder, target,attrs) {
		if (apiOrder == 1) {
			_.jsonp("http://video.sina.com.cn/interface/video_ids/video_ids.php", {
				v: vid
			}, function(param) {
				var ipad_id = param.ipad_vid;
				var mp4 = "http://v.iask.com/v_play_ipad.php?vid=" + ipad_id + "&tags=newsList_web";
				show(target, mp4,attrs);
			})
		} else if (apiOrder == 2) {
			show(target,
				"http://v.iask.com/v_play_ipad.php?vid=" + vid + "&tags=newsList_web",attrs);
		}
	}

	function youku(_id, target,attrs) {
		var mk_a3 = "b4et";
		var mk_a4 = "boa4";
		var userCache_a1 = "4";
		var userCache_a2 = "1";
		var rs;
		var sid;
		var token;

		function na(a) {
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

		function T(a, c) {
			this._sid = sid;
			this._seed = a.seed;
			this._fileType = c;
			var b = new U(this._seed);
			this._streamFileIds = a.streamfileids;
			this._videoSegsDic = {};
			for (c in a.segs) {
				for (var f = [], i = 0, g = 0; g < a.segs[c].length; g++) {
					var h = a.segs[c][g],
						q = {};
					q.no = h.no;
					q.size = h.size;
					q.seconds = h.seconds;
					h.k && (q.key = h.k);
					q.fileId = this.getFileId(a.streamfileids, c, parseInt(g), b);
					q.type = c;
					q.src = this.getVideoSrc(h.no, a, c, q.fileId);
					f[i++] = q
				}
				this._videoSegsDic[c] = f
			}
		}

		function U(a) {
			this._randomSeed = a;
			this.cg_hun()
		}
		U.prototype = {
			cg_hun: function() {
				this._cgStr = "";
				for (var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890", c = a.length, b = 0; b < c; b++) {
					var f = parseInt(this.ran() * a.length);
					this._cgStr += a.charAt(f);
					a = a.split(a.charAt(f)).join("")
				}
			},
			cg_fun: function(a) {
				for (var a = a.split("*"), c = "", b = 0; b < a.length - 1; b++) c += this._cgStr.charAt(a[b]);
				return c
			},
			ran: function() {
				this._randomSeed = (211 * this._randomSeed + 30031) % 65536;
				return this._randomSeed / 65536
			}
		};
		T.prototype = {
			getFileId: function(a, c, b, f) {
				for (var i in a)
					if (i == c) {
						streamFid = a[i];
						break
					}
				if ("" == streamFid) return "";
				c = f.cg_fun(streamFid);
				a = c.slice(0, 8);
				b = b.toString(16);
				1 == b.length && (b = "0" + b);
				b = b.toUpperCase();
				c = c.slice(10, c.length);
				return a + b + c
			},
			getVideoSrc: function(a, c, d, f, i, g) {
				if (!c.videoid || !d) return "";
				var h = {
						flv: 0,
						flvhd: 0,
						mp4: 1,
						hd2: 2,
						"3gphd": 1,
						"3gp": 0
					}[d],
					q = {
						flv: "flv",
						mp4: "mp4",
						hd2: "flv",
						"3gphd": "mp4",
						"3gp": "flv"
					}[d],
					k = a.toString(16);
				1 == k.length && (k = "0" + k);
				var l = c.segs[d][a].seconds,
					a = c.segs[d][a].k;
				if ("" == a || -1 == a) a = c.key2 + c.key1;
				d = "";
				c.show && (d = c.show.show_paid ? "&ypremium=1" : "&ymovie=1");
				c = "/player/getFlvPath/sid/" + sid + "_" + k + "/st/" + q + "/fileid/" + f + "?K=" + a + "&hd=" + h + "&myp=0&ts=" + l + "&ypp=0" + d;
				f = encodeURIComponent(D(E(F(mk_a4 + "poz" + userCache_a2, [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), sid + "_" + f + "_" + token)));
				c = c + ("&ep=" + f) + "&ctype=12&ev=1" + ("&token=" + token);
				c += "&oip=" + rs.data[0].ip;
				return "http://k.youku.com" + (c + ((i ? "/password/" + i : "") + (g ? g : "")))
			}
		};
		_.jsonp("http://v.youku.com/player/getPlaylist/VideoIDS/" + _id + "/Pf/4/ctype/12/ev/1", {}, function(param) {
			rs = param;
			var a = param.data[0],
				c = E(F(mk_a3 + "o0b" + userCache_a1, [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), na(a.ep));
			c = c.split("_");
			sid = c[0];
			token = c[1];
			if (!/PlayStation/.test(window.navigator.userAgent) && _.canPlayM3U8) {
				var ep = encodeURIComponent(D(E(F(mk_a4 + "poz" + userCache_a2, [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), sid + "_" + _id + "_" + token)));
				var oip = a.ip;
				show(target,
					"http://pl.youku.com/playlist/m3u8?vid=" + _id + "&type=flv&ctype=12&keyframe=1&ep=" + ep + "&sid=" + sid + "&token=" + token + "&ev=1&oip=" + oip
					// "标清": "http://pl.youku.com/playlist/m3u8?vid=" + _id + "&type=flv&ctype=12&keyframe=1&ep=" + ep + "&sid=" + sid + "&token=" + token + "&ev=1&oip=" + oip,
					// "高清": "http://pl.youku.com/playlist/m3u8?vid=" + _id + "&type=mp4&ctype=12&keyframe=1&ep=" + ep + "&sid=" + sid + "&token=" + token + "&ev=1&oip=" + oip,
					// "超清": "http://pl.youku.com/playlist/m3u8?vid=" + _id + "&type=hd2&ctype=12&keyframe=1&ep=" + ep + "&sid=" + sid + "&token=" + token + "&ev=1&oip=" + oip
					,
					attrs
				)
			} else if (_.isChromeOnMac() || _.isMobile()) {
				var t = new T(a);
				show(target,
					t._videoSegsDic["3gphd"][0].src,
					attrs
				)
			}
		}, "__callback")
	}

	function tudou(vid, target,attrs) {
		var _id = vid;
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
				n.forEach(function(a, r) {
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
					}, function(e) {
						if (e && e[0] && e[0].server) {
							a.url = e[0].server;
							show(target, a.url,attrs);
						}
					})
				});
		}

		var O = P(f, 0);
		var N = P(f, 1);
		var i = !_.canPlayM3U8 ? "m3u8" : "mp4";
		_.jsonp("http://v.youku.com/player/getPlaylist/VideoIDS/" + _id + "/Pf/4/Sc/2", {
			ctype: 62,
			ev: 1
		}, function(s) {
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
				show(target,x(m, 2, ""),attrs);
			else if ("mp4" == i)
				C(m, h)
		}, "__callback")
	}