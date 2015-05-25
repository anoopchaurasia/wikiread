fm.Package('');
fm.Import("jsfm.Server");
fm.Import("org.wikipedia.Services");
fm.Import("com.anoop.wikiread.Router");
fm.Import("com.anoop.wikiread.app.Settings");
fm.Class("Starter", function (me, Server, Services, Router, Settings) {
	'use strict';

	this.setMe = function (_me){
		me = _me;
	};
	Static.main = function (){
		new me();
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
		me.services = new Services();
		me.settings = new Settings();
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
