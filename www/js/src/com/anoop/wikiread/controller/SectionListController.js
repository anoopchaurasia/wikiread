fm.Package('com.anoop.wikiread.controller');
fm.Import("com.anoop.wikiread.view.SectionListView");
fm.Class('SectionListController> com.anoop.wikiread.controller.Controller', function(me, SectionListView){
  'use strict';
  this.setMe = function(_me){me=_me};

  var instance;
  Static.getInstance = function() {
    if(!instance) {
      instance = new me();
    }
    return instance;
  };

  this.SectionListController = function (articleController, term, SectionContent){
  	me.term = term;
  	me.articleController=articleController;
  	me.sectionList = SectionContent.sectionWiseData;
  	this.base(SectionListView, true);
  };

  this.render = function (){
  	// me.starter.services.getSectionList(me.term, function(sections){
  	// 	me.sectionList = sections;
  	// 	me.reRender();
  	// });
  	me.renderOverlay();
  };

  this.openSection = function (e){
  	var index = e.currentTarget.dataset.index;
  	me.articleController.openIndex(index);
  	me.remove();
  }
});