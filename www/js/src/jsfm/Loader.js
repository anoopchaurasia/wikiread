fm.Package("jsfm");
fm.Import("view.LoaderView");
fm.Class("Loader", function (me, LoaderView) {
	'use strict';
    this.setMe = function(_me) {
        me = _me;
    };
	this.Loader = function(options){
		options = options || {};
		this.redraw = function(){};
		this.viewClass = LoaderView.getInstance();
		this.hide_message = options.hide_message;
		this.is_loading = false;
		this.data_loaded_text = null;
		this.component = {view: me.viewClass.view, controller: function(){return me;}};
	};

	this.loading = function (){
		me.is_loading = true;
		me.redraw();
	};

	this.reset = function (){
		me.is_loading = false;
		this.data_loaded_text = null;
	};

	this.loaded = function (){
		me.is_loading = false;
		me.redraw();
	};

	this.noDataLeft = function (text){
		me.is_loading = false;
		me.data_loaded_text = text || "that's it!";
		me.redraw();
	};
});