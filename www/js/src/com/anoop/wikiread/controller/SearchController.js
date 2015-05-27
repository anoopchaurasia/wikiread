fm.Package('com.anoop.wikiread.controller');
fm.Import("com.anoop.wikiread.view.SearchView");
fm.Class('SearchController> com.anoop.wikiread.controller.Controller', function(me, SearcView){
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

  this.showTerm = function (e){
    me.starter.services.resolveRedirect(e.currentTarget.dataset.term, function(redirect_term){
      me.starter.load("article/"+ redirect_term);
    });
  };

});
