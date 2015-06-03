fm.Package('com.anoop.wikiread.controller');
fm.Import("com.anoop.wikiread.view.ArticleView");
fm.Import("jsfm.PageCreater");
fm.Import('jsfm.Swipe');
fm.Class('ArticleController> jsfm.Controller', function(me, ArticleView, PageCreater){
  'use strict';
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
    this.viewControllers = null;
    this.fillContent = new PageCreater(me.starter.settings);
    $(document).off('horizontal-scroll').on('horizontal-scroll', me.swipe);
    $(document).off('custom-longpress').on('custom-longpress', me.longpress);
    $(document).on('keyup', me.handleKey);
    $(document).on('setting-changed', function (){
      me.fillContent.$container.css({
          "-webkit-transform": "translate3d(0, 0, 0)",
          "transform": "translate3d(0, 0, 0)"
      });
      var indexPage = me.fillContent.getCurrentPageIndex();
      me.reRender();

      plugin.Spinner.getInstance().show();
      me.fillContent.start(undefined, function(){
        plugin.StatusBar.getInstance().changeColor(me.starter.settings.colorcombo);
        me.fillContent.gotToPageIndex(indexPage);

      plugin.Spinner.getInstance().hide();
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

      plugin.Spinner.getInstance().show();
      me.fillContent.start(me.sectionContent.formatedData, function(){
        plugin.StatusBar.getInstance().changeColor(me.starter.settings.colorcombo);
        plugin.Spinner.getInstance().hide();
      });
    // me.starter.services.getSectionByNumber(me.term, index, function (sectionContent){
    // });
  };

  this.render = function (cb){
    window.plugins.insomnia.keepAwake();
    this.base.render(cb);
    this.viewControllers = me.$el.find("#controlles");
    plugin.FullScreen.getInstance().hide(me.viewControllers);
    plugin.Spinner.getInstance().show();
  	me.starter.services.getZeroSection(me.term, function (sectionContent){
      me.sectionContent = sectionContent;
  		me.fillContent.start(sectionContent.formatedData, function(){
        plugin.StatusBar.getInstance().changeColor(me.starter.settings.colorcombo);
        if(!me.starter.getFromStorage('article_intro_done')){
          fm.Include("com.anoop.intro.ArticleIntro", function(){
            var v = new com.anoop.intro.ArticleIntro();
            v.render();
            me.starter.setToStorage('article_intro_done', true);
          });
        }
        plugin.Spinner.getInstance().hide();
      });
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
    $("<div id='goto' style='"+style+"'><form><input placeholder='"+placeholder+"'' type='number'/><a class='btn large btn-primary'>GO</a></form></div>")
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
        me.goToPrevPage();
    } else {
        me.goToNextPage();
    }
  };

  this.goToNextPage = function (e){
    if(me.fillContent.goToNextPage() === false){
        me.renderNextSection();
    }
  };

  this.goToPrevPage = function (e){
    if(me.fillContent.goToPrevPage() === false){
        me.renderPrevSection();
    }
  };

  this.longpress = function (){
    $(document.body).removeClass('noselect');
  }

  this.handlePageClick = function (e){
    if(me.starter.settings.disable_left_right_click) {
      return;
    }
    var target = e.currentTarget;
    var w = $(window).width();
    var offset= e.offsetX;
    if(offset - w/2  < -(w/2-30)){
      me.goToPrevPage();
    } else if( offset-w/2 > (w/2-30)){
      me.goToNextPage();
    } else {
      plugin.FullScreen.getInstance().show(me.viewControllers);
      setTimeout(function(){
        plugin.FullScreen.getInstance().hide(me.viewControllers);
      }, 2000);
    }
  };
  this.handleKey = function(e) {
    if(e.which === 37){
      me.goToPrevPage();
    }
    if(e.which === 39){
      me.goToNextPage();
    }
  };

  this.onDestroy = function (){
    plugin.FullScreen.getInstance().show(me.viewControllers);
    window.plugins.insomnia.allowSleepAgain();
  };
});