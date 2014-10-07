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
		} catch (e) {}
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
		}, function(param) {
			var m3u8 = pptvm3u8(param);
			if (_.canPlayM3U8) {
				show(target, m3u8, attrs);
			} else if (_.isChromeOnMac() || _.isMobile()) {
				show(target, m3u8, attrs);
			}
		}, "cb")
	}

	function sina(vid, apiOrder, target, attrs) {
		if (apiOrder == 1) {
			_.jsonp("http://video.sina.com.cn/interface/video_ids/video_ids.php", {
				v: vid
			}, function(param) {
				var ipad_id = param.ipad_vid;
				var mp4 = "http://v.iask.com/v_play_ipad.php?vid=" + ipad_id + "&tags=newsList_web";
				show(target, mp4, attrs);
			})
		} else if (apiOrder == 2) {
			show(target,
				"http://v.iask.com/v_play_ipad.php?vid=" + vid + "&tags=newsList_web", attrs);
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

	function tudou(vid, target, attrs) {
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
							show(target, a.url, attrs);
						}
					})
				});
		}

		var O = P(f, 0);
		var N = P(f, 1);
		var i = _.canPlayM3U8 ? "m3u8" : "mp4";
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
				show(target, x(m, 2, ""), attrs);
			else if ("mp4" == i)
				C(m, h)
		}, "__callback")
	}

	function fivesix(vid, target, attrs) {
		_.jsonp("http://vxml.56.com/h5json/" + vid + "/", {
			r: "",
			src: "m"
		}, function(param) {
			urlList = param.df;
			var urls = param.df[3].url;
			if (_.canPlayM3U8 || _.isChromeOnMac() || _.isMobile())
				show(target, urls, attrs);
		})

	}



	function sohu(vid, target, attrs) {
		var uid = 1e3 * +new Date + Math.round(1e3 * Math.random());;

		function shift_en(i) {
			var t = i.length,
				e = 0;
			return this.replace(/[0-9a-zA-Z]/g, function(s) {
				var a = s.charCodeAt(0),
					n = 65,
					o = 26;
				a >= 97 ? n = 97 : 65 > a && (n = 48, o = 10);
				var r = a - n;
				return String.fromCharCode((r + i[e++ % t]) % o + n)
			})
		}

		function m3u8() {
			_.jsonp("http://pad.tv.sohu.com/playinfo", {
				vid: vid,
				playlistid: 0,
				sig: shift_en.call("" + (new Date).getTime(), [23, 12, 131, 1321]),
				key: shift_en.call(vid, [23, 12, 131, 1321]),
				uid: uid
			}, function(param) {
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
			_.jsonp("http://api.tv.sohu.com/v4/video/info/" + vid + ".json", {
				site: 1,
				api_key: "695fe827ffeb7d74260a813025970bd5",
				sver: 1,
				partner: 1
			}, function(param) {
				show(target,
					param.data.url_high_mp4,
					attrs
				)
			})
		}
		if (_.canPlayM3U8)
			m3u8();
		else if (_.isChromeOnMac() || _.isMobile())
			mp4();
	}


	function qq(vid, target, attrs) {
		_.jsonp("http://vv.video.qq.com/geturl", {
			otype: "json",
			vid: vid,
			charge: 0
		}, function(param) {
			if (_.canPlayM3U8 || _.isChromeOnMac() || _.isMobile())
				show(target,
					param.vd.vi[0].url,
					attrs);
		})
	}


	function iqiyi(playPageInfo, target, attrs) {

		var _0 = ["native_java_obj", "concat", "push", "fromCharCode", "undefined", "PageInfo", "", "length", "height", "orientation", "width", "devicePixelRatio", "round", "screenTop", "outerHeight", "_", "UCW", "_boluoWebView", "BOL", "TUROak1qbGlZelkwZWNhNDNlYmJhNTk3MWFjY01UazNORFF3T0E9PQ==", "TUROak1qbGlZdz09VG1wU2JGa3lSVEJOTWxacFdXMUZQUT09VGxSck0wMVhSbXBaZHowOQ==", "getTime", "cache", "sin", "abs", "substr", "replace", "charCodeAt", "function%20javaEnabled%28%29%20%7B%20%5Bnative%20code%5D%20%7D", "null", "WebkitAppearance", "style", "documentElement", "javaEnabled", "sgve", "sijsc", "md", "jc", "d", "join", "URL", ";", ";&tim=", "src", "d846d0c32d664d32b6b54ea48997a589", "sc", "__refI", "qd_jsin", "qd_wsz", "t", "__jsT", "jfakmkafklw23321f4ea32459", "__cliT", "h5", "__sigC", "__ctmM"];

		function weorjjigh(_20, _49) {
			if (_34(_0[0])) {
				native_java_obj = {}
			};
			var _6 = [];
			_7(_6, 44);
			_7(_6, 2 * 5);
			_7(_6, 0 - 2);
			_7(_6, -1 * 2);
			_7(_6, -25);
			_7(_6, 5 * -11);
			_7(_6, 40);
			_7(_6, -16);
			_7(_6, 51);
			_7(_6, -4);
			_6[_0[1]]([44, -38, 43, -53, -8]);
			h5vd_detective_url = true;

			function _7(_44, _43) {
				_44[_0[2]](_43)
			};
			var _26 = function(_13) {
				return btoa(_13)
			};
			var _3 = function(_13) {
				return atob(_13)
			};

			function _31(_46) {
				return (String[_0[3]](_46))
			};
			var _53 = function() {
				//if (typeof Q != _0[4] && (typeof Q[_0[5]] != _0[4])) {
				_16 = _0[6];
				for (var _1 = _33[_0[7]] - 1; _1 >= 0; _1--) {
					_16 += _31(_33[_1])
				}
				//}
			};
			var _12 = screen[_0[8]];
			if (window[_0[9]] === 90 || window[_0[9]] === -90) {
				_12 = _12 > screen[_0[10]] ? screen[_0[10]] : _12
			};
			var _27 = window[_0[11]];
			_12 = Math[_0[12]](_12 / _27);
			var _32 = Math[_0[12]](window[_0[13]] / _27);
			var _36 = Math[_0[12]](window[_0[14]] / _27);
			var _47 = (_12 - _36 - _32);
			var _55 = {
				hmxt: _12 + _0[15] + _32 + _0[15] + _36 + _0[15] + _27
			};
			var _41 = btoa(_32 + _0[15] + _47);
			var _24 = (typeof ucweb != _0[4]) ? (_26(_0[16])) : _0[6];
			_24 += _34(_0[17]) ? ((_24 ? _0[15] : _0[6]) + _26(_0[18])) : _0[6];
			var _54 = [12, 32, 434, 12, 2112, 32, 3];
			var _16 = _0[19];
			var _33 = [57, 48, 84, 81, 80, 70, 122, 89, 69, 112, 86, 78, 74, 100, 48, 84, 111, 90, 107, 97, 79, 86, 84, 83, 69, 53, 48, 97, 71, 100, 48, 84, 49, 69, 69, 86, 80, 66, 122, 97, 85, 112, 49, 100, 82, 100, 86, 87, 57, 48, 122, 100, 78, 100, 88, 82, 85, 49, 85, 78, 106, 112, 88, 84];
			var _29 = _0[20];
			var _21 = [];
			for (var _1 = 0; _1 < _6[_0[7]]; _1++) {
				if (_1 % 2 == 0) {
					_21[_0[2]](_31(_6[_1] + _25))
				} else {
					_21[_0[2]](_31(_6[_1] - _25))
				}
			};
			var _5 = (new Date())[_0[21]]();
			var _25 = 7;
			_7(_21, _5 - _25);
			var _28 = {};
			_28[_0[22]] = _26((_5 - _25) + _0[6]);
			_7(_21, _20);
			var _39 = function(_19) {
				var _42 = [],
					_1 = 0;
				for (; _1 < 64;) {
					_42[_1] = 0 | (Math[_0[24]](Math[_0[23]](++_1)) * 4294967296)
				};

				function _17(_15, _35) {
					return (((_15 >> 1) + (_35 >> 1)) << 1) + (_15 & 1) + (_35 & 1)
				};
				var _50 = function(_8, _52) {
					_53();
					_8 = (_3(_28[_0[22]])) + _3((_3(_16))[_0[25]](0, 12)) + _3(_3(_16)[_0[25]](12, 20)) + _3(_3(_16)[_0[25]](32)) + _20;
					while (_8[_0[27]](0) == 0) {
						_8 = _8[_0[26]](String[_0[3]](0), _0[6])
					};
					if (_52) {
						_8 = (_3(_28[_0[22]])) + _3((_3(_29))[_0[25]](0, 12)) + _3(_3(_3(_29)[_0[25]](12, 24))) + _3(_3(_3(_29)[_0[25]](36))) + _20
					};
					var _9, _14, _5, _2, _15 = [],
						_40 = unescape(encodeURI(_8)),
						_4 = _40[_0[7]],
						_23 = [_9 = 1732584193, _14 = -271733879, ~_9, ~_14],
						_1 = 0;
					for (; _1 <= _4;) {
						_15[_1 >> 2] |= (_40[_0[27]](_1) || 128) << 8 * (_1++ % 4)
					};
					_15[_8 = (_4 + 8 >> 6) * _19 + 14] = _4 * 8;
					_1 = 0;
					for (; _1 < _8; _1 += _19) {
						_4 = _23,
						_2 = 0;
						for (; _2 < 64;) {
							_4 = [_5 = _4[3], _17(_9 = _4[1], (_5 = _17(_17(_4[0], [_9 & (_14 = _4[2]) | ~_9 & _5, _5 & _9 | ~_5 & _14, _9 ^ _14 ^ _5, _14 ^ (_9 | ~_5)][_4 = _2 >> 4]), _17(_42[_2], _15[[_2, 5 * _2 + 1, 3 * _2 + 5, 7 * _2][_4] % _19 + _1]))) << (_4 = [7, 12, 17, 22, 5, 9, 14, 20, 4, 11, _19, 23, 6, 10, 15, 21][4 * _4 + _2++ % 4]) | _5 >>> 32 - _4), _9, _14]
						};
						for (_2 = 4; _2;) {
							_23[--_2] = _17(_23[_2], _4[_2])
						}
					};
					_8 = _0[6];
					for (; _2 < 32;) {
						_8 += ((_23[_2 >> 3] >> ((1 ^ _2++ & 7) * 4)) & 15).toString(_19)
					};
					return _8
				};
				return _50
			}(16);
			var _26 = function(_13) {
				return btoa(_13)
			};
			var _3 = function(_13) {
				return atob(_13)
			};
			var _37 = function() {
				var _48 = _0[28];
				var _30 = _0[29];
				if (_0[30] in document[_0[32]][_0[31]]) {
					if (escape(navigator[_0[33]].toString()) === _48) {
						_30 = _0[34]
					} else {
						_30 = _0[35]
					}
				};
				return _30
			};
			if (_49) {
				var _11 = {};
				_11[_0[36]] = _39;
				_11[_0[37]] = _37;
				_11[_0[38]] = _5;
				return _11
			};
			var _38 = _39(_21[_0[39]](_0[6]));
			if (_38[_0[7]] > 4) {
				var _22 = _0[6];
				_22 += playPageInfo.url + _0[41] + window[_0[11]] + _0[42] + _5;
				_22 = encodeURIComponent(_22);
				var _10 = {};
				_10[_0[43]] = _0[44];
				_10[_0[45]] = _38;
				_10[_0[46]] = _22;
				if (_24) {
					_10[_0[47]] = _24
				};
				if (_41) {
					_10[_0[48]] = _41
				};
				_10[_0[49]] = _5 - 7;
				_10[_0[50]] = _37();
				return _10
			};

			function _34(_51) {
				return (typeof window[_51] != _0[4])
			}
		};

		function weorjjighly(_20) {
			var _11 = weorjjigh(_20, true);
			var _18 = {};
			var _45 = _0[51];
			_18[_0[52]] = _0[53];
			_18[_0[54]] = _11[_0[36]](_45, true);
			_18[_0[55]] = _11[_0[38]] - 7;
			_18[_0[50]] = _11[_0[37]]();
			return _18
		};

		var cupid = "qc_100001_100186"; // for android mp4

		var vid = playPageInfo.vid;
		var vinfo = playPageInfo;
		var r = weorjjigh(vinfo.tvId);

		if (_.canPlayM3U8) {
			_.jsonp("http://cache.m.iqiyi.com/jp/tmts/" + vinfo.tvId + "/" + vid + "/", {
					uid: "2007179977",
					cupid: cupid,
					platForm: "h5",
					type: "m3u8",
					rate: 1,
					src: r.src,
					sc: r.sc,
					t: r.t
				},
				function(param) {
					show(target,
						param.data.m3u,
						attrs
					)
				})
		} else if (_.isChromeOnMac() || _.isMobile()) {
			_.jsonp("http://cache.m.iqiyi.com/jp/tmts/" + vinfo.tvId + "/" + vid + "/", {
					uid: "2007179977",
					cupid: cupid,
					platForm: "h5",
					type: "mp4",
					rate: 1,
					src: r.src,
					sc: r.sc,
					t: r.t
				},
				function(param) {
					show(
						target,
						param.data.m3u,
						attrs
					)
				})
		}
	}