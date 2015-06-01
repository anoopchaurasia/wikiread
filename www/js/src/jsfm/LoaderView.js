fm.Package('jsfm');
fm.Class('LoaderView> jsfm.View', function(me){ this.setMe = function(_me){me=_me};

	var instance;
	Static.getInstance = function() {
		if(!instance) {
			instance = new me();
		}
		return instance;
	};

	this.LoaderView = function() {
		this.events = [
			['click', '.btn', 'loadMore']
		];
	};

	this.loadingView = function (ctrl) {
		return <div className="loader"></div>
	};

	this.loadedView = function (ctrl) {
		if(!ctrl.hide_message) {
			return <button className="btn">Load</button>
		}
	};

	this.allDataLoaded = function (ctrl){
		return <span> {ctrl.data_loaded_text} </span>
	};

  	this.view = function (ctrl){
    	return <div id="loader-cont" className="loadmore" style="margin-bottom:20px; text-align:center;">
        	{ctrl.data_loaded_text? me.allDataLoaded(ctrl) : ctrl.is_loading ? me.loadingView() : me.loadedView(ctrl)}
    	</div>
  	};
});
