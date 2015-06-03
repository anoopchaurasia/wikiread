fm.Package('');
fm.Import("jsfm.Server");
fm.Import("org.wikipedia.Services");
fm.Import("com.anoop.wikiread.Router");
fm.Import("com.anoop.wikiread.app.History1");
fm.Import("com.anoop.wikiread.app.Settings");
fm.Import("jsfm.DB");
fm.Import("plugin.Spinner");
fm.Import("plugin.FullScreen");
fm.Import("plugin.StatusBar");
fm.Class("Starter", function (me, Server, Services, Router, History1, Settings, DB) {
	'use strict';

	this.setMe = function (_me){
		me = _me;
	};
	Static.main = function (){
		new me();
	};

	function offlineCB () {
		$('body').prepend("<div id='network-warning'><i class='fa-warning fa'></i> Unable to connect, Please check Network!! <i class='fa-close close fa pull-right' style='font-size:1.3em;margin-top:6px;'></i></div>");
		var temp = $("#network-warning");
		me.slider.slidePageFrom(temp, 'left', true);
		setTimeout(function(){
			temp.removeClass('page transition').addClass("keep-animation");
		}, 250);
		$(".close", temp).click(function(){
			$("#network-warning").remove();
		});
	}

	function onLine(){
		$("#network-warning").remove();
		Server.onNetConnect();
	};

	this.setToStorage = function(key, value){
		DB.getInstance().setValues(key, value);
		sessionStorage.setItem(key, value);
	};

	this.getFromStorage = function (key){
		return sessionStorage.getItem(key);
	};

	this.removeFromStorage = function(key){
		DB.getInstance().removeKey(key);
		return sessionStorage.removeItem(key);
	};

	var singleton;
	Static.getInstance = function (instance) {
		if(instance){
			singleton = instance;
		}
		return singleton;
	};

	Static.load = function (path) {
		router.load("#/"+path);
	};

	this.Starter = function (){
		DB.getInstance();
		document.addEventListener("online", onLine, false);
		document.addEventListener("offline", offlineCB, false);
		me.services = new Services();
		me.history = new History1();
		var _settings = window.localStorage._settings;
		if(_settings) {
			_settings = JSON.parse(_settings);
		}
		me.settings = new Settings(_settings);
		Starter.getInstance(me);
		if(!window.localStorage){
			window.localStorage = {};
		}
		Server.setHttp(jQuery.ajax);
		me.currentPage = null;
		me.slider = new PageSlider($('body'));
		new Router(me).initialize(router, location.hash.substring(2) ||'search');
	};

	var backList = [];
	Static.onBackButton = function (cb){
		if( typeof cb === 'function') {
			backList.push(cb);
		} else if (backList.length) {
			backList[backList.length -1]();
		}
	};

	Static.releaseLast = function  (cb) {
		var index = backList.indexOf(cb);
		backList.splice(index, 1);
	};
});
