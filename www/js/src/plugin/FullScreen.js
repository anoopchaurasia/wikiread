fm.Package("plugin");
fm.Class("FullScreen", function  (me) {
	'use strict';
	this.setMe= function (_me){me=_me;};
	var instance;
	Static.getInstance = function (){
		if(!instance) {
			instance = new me();
		}
		return instance;
	};

	this.FullScreen = function (){
		this.isSupported = cordova.platformId === 'android';
		if(this.isSupported){
			this.plugin = window.AndroidFullScreen;
			this.isImmersiveEnabled = this.plugin.isImmersiveModeSupported();
		}
	};

	this.show = function (elem){
		if(this.isSupported){
			//elem.show();
			me.plugin.showSystemUI(successFunction, errorFunction);
		}
	};

	this.hide = function (elem){
		if(this.isSupported){
			//elem.hide();
			me.plugin.immersiveMode(successFunction, errorFunction);
		}
	};

	function successFunction(){

	}
	function errorFunction(){
	}
});