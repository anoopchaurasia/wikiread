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
		this.plugin = window.AndroidFullScreen;
		this.isImmersiveEnabled = this.plugin.isImmersiveModeSupported();
	};

	this.show = function (){
		me.plugin.showSystemUI(successFunction, errorFunction);
	};

	this.hide = function (){
		me.plugin.immersiveMode(successFunction, errorFunction);
	};

	function successFunction(){

	}
	function errorFunction(){
	}
});