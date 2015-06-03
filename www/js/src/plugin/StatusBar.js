fm.Package("plugin");
fm.Class("StatusBar", function  (me) {
	'use strict';
	this.setMe= function (_me){me=_me;};
	var instance;
	Static.getInstance = function (){
		if(!instance) {
			instance = new me();
		}
		return instance;
	};

	this.StatusBar = function (){
		this.plugin = StatusBar;
	};

	this.hide= function (){
		StatusBar.hide();
	};

	this.show= function (){
		StatusBar.show();
	};

	this.changeColor = function (colorCombo){
		if(colorCombo.background === "#ffffff"){
			StatusBar.styleDefault();
		} else {
			StatusBar.styleLightContent();
		}
		StatusBar.backgroundColorByHexString(colorCombo.background);
	};
});