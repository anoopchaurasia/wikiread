fm.Package("com.anoop.wikiread.app");
fm.Class("Settings", function (){  this.setMe = function(_me){me=_me};

	this.init = function (){
		Static.Const.colorcombos =[{
			color: '#fff',
			background: '#000'
		}, {
			color: "#000",
			background: '#fff'
		}];
		Static.Const.fonts = [16, 20, 26, 32];
	};

	this.Settings = function (settings) {
		settings = settings || {
			margin: {},
			padding: {}
		};
		this.colorcombo = settings.colorcombo || me.colorcombos[0];
		this.margin = {
			top:settings.margin.top || 10,
			bottom: settings.margin.bottom|| 10,
			left:settings.margin.left|| 10,
			right:settings.margin.right ||10
		};

		this.fontSize = settings.fontSize || me.fonts[1];
		this.controllerHeight = settings.controllerHeight || 50;
		this.padding = {
			top: settings.padding.top || 10,
			bottom: settings.padding.bottom ||  10 + this.controllerHeight,
			left: settings.padding.left || 10,
			right: settings.padding.right || 10
		};
	};


	this.horizontalGap = function () {
		return me.margin.left + me.margin.right + me.padding.left + me.padding.right;
	};

	this.verticalGap = function () {
		return me.margin.top + me.margin.bottom + me.padding.top + me.padding.bottom;
	};

	this.getLineHeight = function (){
		return me.fontSize * 1.2;
	};

	this.setColorByIndex = function(index) {
		this.colorcombo = me.colorcombos[index];
	};
	this.setFontByIndex = function(index) {
		this.fontSize = me.fonts[index];
	};
});