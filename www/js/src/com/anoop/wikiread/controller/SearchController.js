fm.Package('com.anoop.wikiread.controller');
fm.Import("com.anoop.wikiread.view.SearchView");
fm.Class('SearchController> com.anoop.wikiread.controller.Controller', function(me, SearcView){
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
  };

  this.search = function (e){
    var v = e.currentTarget.value;
    me.starter.services.searchString(v, function (list){
      me.list = list;
      me.redraw();
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
    me.starter.services.resolveRedirect(str, function(redirect_term){
      me.starter.history.add(redirect_term);
      me.starter.load("article/"+ redirect_term);
    });
  };

  this.showTodaysArticle = function (){
    me.starter.services.feturedArticle(function(redirect_term){
      me.starter.history.add(redirect_term);
      me.starter.load("article/"+ redirect_term);
    });
  };
});
