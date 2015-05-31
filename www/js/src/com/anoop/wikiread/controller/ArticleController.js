fm.Package('com.anoop.wikiread.controller');
fm.Import("com.anoop.wikiread.view.ArticleView");
fm.Import("jsfm.PageCreater");
fm.Import('jsfm.Swipe');
fm.Class('ArticleController> com.anoop.wikiread.controller.Controller', function(me, ArticleView, PageCreater){
  this.setMe = function(_me){me=_me};

  var instance;
  Static.getInstance = function() {
    if(!instance) {
      instance = new me();
    }
    return instance;
  };

  this.ArticleController = function (starter, args){
  	this.base(ArticleView);
  	this.term = args[0];
    this.currentSectionIndex= 0;
    this.sectionContent = null;
    this.currentContent = null;
    this.fillContent = new PageCreater(me.starter.settings);
    $(document).off('horizontal-scroll').on('horizontal-scroll', me.swipe);
    $(document).on('keyup', me.handleKey);
    $(document).on('setting-changed', function (){
      me.fillContent.$container.css({
          "-webkit-transform": "translate3d(0, 0, 0)",
          "transform": "translate3d(0, 0, 0)"
      });
      var indexPage = me.fillContent.getCurrentPageIndex();
      me.reRender();
      me.fillContent.start(undefined, function(){
        me.fillContent.gotToPageIndex(indexPage);
      });
    });
  };

  this.openIndex = function (index){
    if(index < 0 || index >= me.sectionContent.sectionWiseData.length) {
      return;
    }
      me.currentSectionIndex = parseInt(index);
      me.sectionContent.setIndex(index);
      me.fillContent.reset();
      me.fillContent.start(me.sectionContent.formatedData);
    // me.starter.services.getSectionByNumber(me.term, index, function (sectionContent){
    // });
  };

  this.render = function (cb){
  	this.base.render(cb);

  	me.starter.services.getZeroSection(me.term, function (sectionContent){
      me.sectionContent = sectionContent;
  		me.fillContent.start(sectionContent.formatedData);
  	});
  };

  this.openSettings = function (){
    fm.Include('com.anoop.wikiread.controller.SettingsController', function(){
      new com.anoop.wikiread.controller.SettingsController().render();
    });
  };

  this.searchPage = function (){
    me.starter.load('search');
  };

  this.gotoPage = function (){
    var _goto = $("#goto");
    if(_goto.length){
      _goto.remove();
      return;
    }
    var placeholder = "type page from 1 to "+ me.fillContent.total_pages;
    var style="color:"+me.starter.settings.colorcombo.color;
    style +=";background:"+ me.starter.settings.colorcombo.background;
    $("<div id='goto' style='"+style+"'><form><input placeholder='"+placeholder+"'' type='text'/><a class='btn large btn-primary'>GO</a></form></div>")
    .appendTo(document.body).on('click', '.btn', function(){
      me.fillContent.gotToPage($(this).prev().val()-1);
      $("#goto").remove();
    }).on('keyup', 'input',function(){
      if(this.value < 1 || this.value > me.fillContent.total_pages) {
        this.value = "";
      }
    }).on('submit', 'form', function (){
      me.fillContent.gotToPage($('input',this).val()-1);
      $("#goto").remove();
      return false;
    });
  };
  this.openSections = function (){
    fm.Include('com.anoop.wikiread.controller.SectionListController', function(){
      new com.anoop.wikiread.controller.SectionListController(me, me.term, me.sectionContent).render();
    });
  };

  this.renderNextSection = function () {
    me.openIndex(me.currentSectionIndex+1);
  };
  this.renderPrevSection = function () {
    me.openIndex(me.currentSectionIndex-1);
  };

  this.swipe = function (e, start, end, diff){
    if(diff > 0) {
        if(me.fillContent.goToPrevPage() === false){
          me.renderPrevSection();
        }
    } else {
        if(me.fillContent.goToNextPage() === false){
          me.renderNextSection();
        }
    }
  };

  this.goToNextPage = function (e){
    if(me.fillContent.goToNextPage() === false){
        me.renderNextSection();
    }
  };
  this.handlePageClick = function (e){
    var target = e.currentTarget;
    var w = $(window).width();
    var offset= e.offsetX;
    if(offset - w/2  < -(w/2-30)){
      if(me.fillContent.goToPrevPage() === false){
        me.renderPrevSection();
      }
    } else if( offset-w/2 > (w/2-30)){
      if(me.fillContent.goToNextPage() === false){
        me.renderNextSection();
      }
    }
  };
  this.handleKey = function(e) {
    if(e.which === 37){
      if(me.fillContent.goToPrevPage() === false){
        me.renderPrevSection();
      }
    }
    if(e.which === 39){
      if(me.fillContent.goToNextPage() === false){
        me.renderNextSection();
      }
    }
  };
});