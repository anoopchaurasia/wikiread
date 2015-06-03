fm.Package("com.anoop.intro");
fm.AbstractClass("Intro > jsfm.Controller", function (me) {
	'use strict';
	this.setMe = function (_me) {
		me = _me;
	};

	this.Intro = function (view) {
		this.base(view);
	};

	this.afterRender = function ($el){
		$el.addClass('page center intro').css({background:"transparent"});
	};

	this.render = function (){
		me.base.render(function(){
			$('body').append(me.$el);
		});
	};

	this.remove = function (){
		me.$el.remove();
	};
});