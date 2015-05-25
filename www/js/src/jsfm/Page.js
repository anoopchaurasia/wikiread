fm.Package("jsfm");
fm.AbstractClass("Page", function (me) {
	this.setMe = function (_me) {
		me = _me;
	};

	this.Page = function () {
		this.destroyed = false;
		this.sub = this.getSub();
		this.react = null;
		Starter.onBackButton(me.sub.onBackButton);
	};

	this.onBackButton = function () {
        history.back();
    };

	this.render = function (cb){
		if(me.destroyed){
			console.error("Asking render for dead page", this.sub.getClass());
			return;
		}
    	var div = document.createElement('div');
		me.react = React.render(
            React.createElement(me.sub.reactObj.root, me.sub),
            div
        );
        cb && cb($(div));
	};

	this.remove = function (html){
		if(me.destroyed) {
			return;
		}
		$(html).off();
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