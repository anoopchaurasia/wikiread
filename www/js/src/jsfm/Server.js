fm.Package("jsfm");
fm.Implements("com.anoop.wikiread.app.Config");
fm.Class("Server");
jsfm.Server = function (me, SignUp) {
	'use strict';
	this.setMe = function(_me) {
		me = _me;
	};
	var $http;
	Static.patch = function(data, url, cb, error) {
		send("PATCH", url, data, cb, error);
	};

	Static.put = function(data, url, cb, error) {
		send("PUT", url, data, cb, error);
	};

	Static.getGetUrl = function (data, url){
		return url + "?" + $.param(data);
	};

	Static.getJSONP = function (data, url, cb, error){
		send("GET", url + "?" + $.param(data), {}, cb, error, true);
	}

	Static.post = function(data, url, cb, error) {
		send("POST", url, data, cb, error);
	};
	Static.get = function(data, url, cb, error) {
		send("GET", url + "?" + $.param(data), {}, cb, error);
	};
	Static.head = function(data, url, cb, error) {
		send("HEAD", url + "?" + $.param(data), data, cb, error);
	}

	Static.delete = function(data, url, cb, error) {
		send("DELETE", url, data, cb, error);
	};

	Static.setHttp = function(http) {
		$http = http;
	};

	function send(method, url, data, cb, error, is_jsonp) {
		var copy;
		try {
			copy = typeof data.serialize === 'function' ? data.serialize() : serialize(data);
			copy = copy || {};
		} catch (e) {
			delete e.stack;
			alert(e);
			error();
			return;
		}

		if(url.indexOf("http://") === -1) {
			url = me.server + url;
		}
		if (me.require_proxy) {
			url = me.proxy_server + url.replace("http://", "");
		}
		jQuery.ajax({
			method: method,
			url: url,
			dataType: is_jsonp ? 'jsonp': null,
			data: method === "GET" ? copy : JSON.stringify(copy),
			headers: {
				'Content-Type': 'application/json',
				'Authorization': localStorage.access_token
			},
			success: function(resp, status, header) {
				console.log(typeof resp);
				if(typeof resp == 'string') {
				} else {
					cb && cb.call(this, resp, method, data);
				}
			},
			error: function(resp, status, header) {
				try {
					if(navigator.connection && navigator.connection.type === 'none') {
						resp.statusText = "No Network";
					}
					Bugsense.notify( new Error("error" + resp.statusText + " status " + status + " responseText " + resp.responseText + " url "+ url+ " header "+ url ), { status: status});
				} catch (e) {
					Bugsense.notify( new Error("error while saving error" + resp+ " responseText " + resp.responseText), { status: status});
				}
				if(error) error.apply(this, [resp]);
			}
		});
	}

	function serialize(obj) {
		var newObj = jQuery.isArray(obj) ? [] : {};
		var transient = $.extend([], obj.transient || []);
		var patchTransient = obj.patchTransient || [];
		transient.push("$$hashKey", "transient", 'base');
		for (var k in obj) {
			if (k == 'error' && obj[k]) {
				throw "There are some errors on the page, please fix them before proceeding.";
			}
			if (obj.hasOwnProperty(k) && transient.indexOf(k) == -1 && obj[k] != null) {
				if (obj.id && patchTransient.indexOf(k) !== -1) continue;
				if (typeof obj[k] == "object") {
					newObj[k] = serialize(obj[k]);
				} else if (typeof obj[k] == "function" || typeof obj[k] == "undefined") {

				} else {
					newObj[k] = obj[k];
				}
			}
		}
		return newObj;
	}
};