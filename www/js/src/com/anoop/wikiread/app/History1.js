fm.Package("com.anoop.wikiread.app");
fm.Class("History1", function (me){  this.setMe = function(_me){me=_me};
	'use strict';
	this.init = function (){};

	this.History1 = function (history) {
		try{
			this.items = JSON.parse(localStorage._history||"[]");
		} catch (e) {
			me.items = [];
		}
	};

	this.add = function (item) {
		this.items.push(item);
		if(this.items.length > 500){
			this.items.length === 500;
		}
		this.save();
	};

	this.save = function(){
		localStorage._history = JSON.stringify(me.items);
	};
});