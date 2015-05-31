fm.Package("com.anoop.wikiread.app");
fm.Class("Settings", function (){  this.setMe = function(_me){me=_me};

	this.init = function (){
		Static.Const.colorcombos =[{
			color: '#fff',
			text: "Black",
			background: '#000'
		}, {
  			color: "#6D683E",
  			text : "Sepia",
			background: "#DBD9C1"
		},{
			color: "#000",
			text: "White",
			background: '#fff'
		}];
		Static.Const.fonts = [16, 20, 26, 32];
		Static.Const.textAligns = ['justify', 'left', 'right', 'center'];
	};

	this.Settings = function (settings) {
		settings = settings || {
			margin: {},
			padding: {}
		};
		this.textAlign = settings.textAlign || me.textAligns[0];
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
		this.save();
	};

	this.setFontByIndex = function(index) {
		this.fontSize = me.fonts[index];
		this.save();
	};

	this.setTextAlignByIndex = function(index) {
		this.textAlign = me.textAligns[index];
		this.save();
	};

	this.save = function (){
		window.localStorage._settings = JSON.stringify(me.serialize());
	};

	this.getColorStyle= function (){
		return {color: me.colorcombo.color, background: me.colorcombo.background};
	};
});
