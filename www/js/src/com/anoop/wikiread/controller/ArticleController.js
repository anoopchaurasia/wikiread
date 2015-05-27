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
    me.starter.services.getSectionByNumber(me.term, index, function (sectionContent){
      me.fillContent.reset();
      me.fillContent.start(sectionContent.formatedData);
    });
  };

  this.render = function (cb){
  	this.base.render(cb);

  	me.starter.services.getZeroSection(me.term, function (sectionContent){
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
    var placeholder = "type page from 1 to "+ me.fillContent.total_pages;
    $("<div id='goto'><form><input placeholder='"+placeholder+"'' type='text'/><a class='btn btn-primary'>GO</a></form></div>")
    .appendTo(document.body).on('click', '.btn', function(){
      me.fillContent.gotToPage($(this).prev().val()-1);
      $(this).parent().remove();
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
      new com.anoop.wikiread.controller.SectionListController(me, me.term).render();
    });

  };

  this.swipe = function (e, start, end, diff){
    if(diff > 0) {
        me.fillContent.goToPrevPage();
    } else {
        me.fillContent.goToNextPage();
    }
  };
  this.handleKey = function(e) {
    if(e.which === 37){
      me.fillContent.goToPrevPage();
    }
    if(e.which === 39){
      me.fillContent.goToNextPage();
    }
  };
});