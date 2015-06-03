fm.Package('com.anoop.wikiread.controller');
fm.Import("com.anoop.wikiread.view.HistoryView");
fm.Class('HistoryController> jsfm.Controller', function(me, HistoryView){
  'use strict';
  this.setMe = function(_me){me=_me};

  var instance;
  Static.getInstance = function() {
    if(!instance) {
      instance = new me();
    }
    return instance;
  };

  this.HistoryController = function (searchController){
  	this.base(HistoryView, true);
    this.searchController = searchController;
  };

  this.render = function (){
  	me.renderOverlay();
  };

  this.open = function (e){
  	var data = e.currentTarget.dataset.data;
  	me.searchController.searchForTerm(data);
  	me.remove();
  }
});