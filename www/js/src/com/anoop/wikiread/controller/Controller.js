fm.Package("com.anoop.wikiread.controller");
fm.AbstractClass("Controller", function (me) {
	this.setMe = function (_me) {
		me = _me;
	};

	this.init = function (){
		Static.slider = new PageSlider($('body'));
	};

	this.Controller = function (viewClass, removeWraper) {
		this.starter = Starter.getInstance();
		this.destroyed = false;
		this.viewClass = viewClass.getInstance();
		this.infiniteScroll = false;
		this.$el = null;
		this.removeWraper = removeWraper || false;
		this.sub = this.getSub();
	};

	this.reRender = function (){
		m.render(me.$el[0], {controller: function(){return me.sub;}, view: me.sub.viewClass.view});
	};

	this.render = function (cb, data){
		if(me.destroyed) {
			return;
		}
		data = data || me.sub;
		//if(!me.$el){
			var d = document.createElement('div');
	        m.render(d , {controller: function(){return data;}, view: data.viewClass.view});
	        this.$el = me.removeWraper? $(d).children() : $(d);
        	//document.body.appendChild(this.$el[0]);
		//}
        cb && cb(this.$el);
        data.viewClass.events.forEach(function(event){
        	me.$el.on(event[0], event[1], me.sub[event[2]]);
        });
        if(me.sub.onScrollEnd) {
        	bindScroll();
        }
	}

	function bindScroll() {
		var dom = me.$el.find('.content');
		 if(!dom.length) return;
        var timeout;
        var height = dom[0].scrollHeight, window_height = $(window).height();
        dom.off('scroll').on("scroll", function(e, diff) {
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                if( dom[0].scrollTop + window_height >= height - 200) {
                    me.sub.onScrollEnd();
                }
            }, 500);
        });
	};

	this.renderOverlay = function (cb, data){
		me.render(function(){
			cb && cb.apply(this, arguments);
	        me.sub.afterRender && me.sub.afterRender(me.$el);
	        var slideFrom = me.sub.slide_from || "top";
	        me.slider.slidePageFrom(me.$el, slideFrom, true);
		}, data);
	};

	this.remove = function (html){
		if(me.destroyed) {
			return;
		}
		$(html).off();
		var slideFrom = me.sub.slide_from == "bottom" ? "top" : "bottom";
		me.slider.slidePageFrom($('body >div.page:first'), slideFrom, undefined, true);
		me.destroy();
	};

	this.destroy = function () {
		document.body.scrollTop = 0;
		if(!this.destroyed) {
			var sub = me.sub;
			if(sub.onBackButton) {
				Starter.releaseLast(sub.onBackButton);
			}
		}
		this.destroyed = true;

		var sub = me.sub;
		if(sub.onDestroy) {
			sub.onDestroy();
		}
	};
});