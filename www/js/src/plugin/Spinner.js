fm.Package("plugin");
fm.Class("Spinner", function  (me) {
	'use strict';
	this.setMe= function (_me){me=_me;};
	var instance;
	Static.getInstance = function (){
		if(!instance) {
			instance = new me();
		}
		return instance;
	};

	this.Spinner = function (){
		this.plugin = window.plugins.spinnerDialog;
	};

	this.show = function (message){
		me.plugin.show(null, message, true);
	};

	this.hide = function (){
		me.plugin.hide();
	};
});