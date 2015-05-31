fm.Package('com.anoop.wikiread.view');
fm.AbstractClass('View', function(me){ this.setMe = function(_me){me=_me};
	'use strict';
	this.View = function (){
		this.context = null;
		this.events = [];
	};

	this.attachComponent = function (elem, isinit, context, data){
		if(!isinit) {
			function ctrl(){ return data.attrs.ctrl;}

			m.render(elem, {controller: ctrl, view: data.attrs.view || data.attrs.ctrl.viewClass.view});
			data.attrs.ctrl[data.attrs.redraw || "redraw"] = function () {
				m.render(elem, {controller: ctrl, view: data.attrs.view || data.attrs.ctrl.viewClass.view});
			};
		}
	};

	 var cache = {}
	this.bindOnce = function(view, diff_str) {
		diff_str = view.toString() + (diff_str || "");
        if (!cache[diff_str]) {
            cache[diff_str] = true
            return typeof view === 'function' ? view() : view;
        }
        else return {subtree: "retain"}
    };
	this.reset = function (){
		cache = {};
	};
});