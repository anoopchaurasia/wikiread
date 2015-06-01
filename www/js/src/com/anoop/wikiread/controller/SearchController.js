fm.Package('com.anoop.wikiread.controller');
fm.Import("com.anoop.wikiread.view.SearchView");
fm.Class('SearchController> com.anoop.wikiread.controller.Controller', function(me, SearcView ){
  'use strict';
  this.setMe = function(_me){me=_me};

  var instance;
  Static.getInstance = function() {
    if(!instance) {
      instance = new me();
    }
    return instance;
  };

  this.SearchController = function (){
    this.base(SearcView);
    me.list = {items: []};
    me.redraw = null;
    me.no_data_loaded = false;
    me.loading = false;
    me.loaderRedraw = null;
  };

  var currentSearchString;
  this.search = function (e){
    me.no_data_loaded = false;
    var v = e.currentTarget.value.trim();
    if(currentSearchString === v) {
      return
    }
    currentSearchString = v;
    me.list = {items: []};
    me.redraw();
    if(!currentSearchString) {
      me.loaderRedraw();
      return;
    }
    me.loading = true;
    me.loaderRedraw();
    me.starter.services.searchString(v, function (list){
      me.list = list;
      me.loading = false;
      me.no_data_loaded = true;
      me.redraw();
      me.loaderRedraw();
    });
  };

  this.afterRender = function (){
    // fm.Include("com.anoop.intro.SearchIntro", function(){
    //   var intro = new com.anoop.intro.SearchIntro();
    //   intro.draw();
    // });
  };

  this.showTerm = function (e){
    me.searchForTerm(e.currentTarget.dataset.term);
  };

  this.openHistory = function () {
    fm.Include('com.anoop.wikiread.controller.HistoryController', function(){
      new com.anoop.wikiread.controller.HistoryController(me).render();
    });
  };

  this.searchForTerm = function(str) {
    plugin.Spinner.getInstance().show();
    me.starter.services.resolveRedirect(str, function(redirect_term){
      me.starter.history.add(redirect_term);
      me.starter.load("article/"+ redirect_term);
      plugin.Spinner.getInstance().hide();
    });
  };

  this.showTodaysArticle = function (){
    plugin.Spinner.getInstance().show();
    me.starter.services.feturedArticle(function(redirect_term){
      me.starter.history.add(redirect_term);
      me.starter.load("article/"+ redirect_term);
      plugin.Spinner.getInstance().hide();
    });
  };
});
