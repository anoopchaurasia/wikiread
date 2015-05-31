fm.Package("com.anoop.wikiread.app");
fm.Import("jsfm.Utility");
fm.Class("Settings", function (me, Utility){  this.setMe = function(_me){me=_me};
	'use strict';
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
		me.disable_left_right_click = Utility.getBool(settings.disable_left_right_click, false);
		this.textAlign =settings.textAlign || me.textAligns[0];
		this.colorcombo = settings.colorcombo || me.colorcombos[0];
		this.margin = {
			top:Utility.getInt(settings.margin.top, 10),
			bottom: Utility.getInt(settings.margin.bottom, 10),
			left:Utility.getInt(settings.margin.left, 10),
			right:Utility.getInt(settings.margin.right, 10)
		};

		this.fontSize = Utility.getInt(settings.fontSize, me.fonts[1]);
		this.controllerHeight = Utility.getInt(settings.controllerHeight, 50);
		this.padding = {
			top: Utility.getInt(settings.padding.top, 10),
			bottom: Utility.getInt(settings.padding.bottom, 10 + this.controllerHeight),
			left: Utility.getInt(settings.padding.left, 10),
			right: Utility.getInt(settings.padding.right, 10)
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

	this.setValueByKey = function (key, value){
		me[key] = value;
	};

	this.isChecked = function (key){
		return me[key];
	};
});
