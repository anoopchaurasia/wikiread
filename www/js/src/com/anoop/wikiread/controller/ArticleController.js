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
    this.fillContent = new PageCreater(me.starter.settings);
    $(document).off('horizontal-scroll').on('horizontal-scroll', me.swipe);
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
  this.gotoPage = function (){

  };
  this.openSections = function (){

  };

  this.swipe = function (e, start, end, diff){
        if(diff > 0) {
            me.goToPrevPage();
        } else {
            me.goToNextPage();
        }
    };

    this.goToNextPage = function (){
        setTransformValue ("-");
    };

    function setTransformValue (operator) {
        switch(operator) {
            case "+" :{
                if(me.fillContent.isFirstPage()) {
                    return;
                }
                break;
            }
            case "-" : {
                if(me.fillContent.isEndReach()) {
                    return;
                }
                break;
            }
        }
        var w= me.fillContent.columnWidth;
        var articleContainer = me.fillContent.$container;
        var oldStyle = articleContainer[0].style.transform.match(/((-|)\d+)/g);
        if(oldStyle) {
            oldStyle = oldStyle[1]*1;
        }else {
            oldStyle = 0;
        }
        var newValue;
        switch(operator) {
            case "+" :{
                newValue = oldStyle + w;
                me.fillContent.decreasePage();
                break;
            }
            case "-" : {
                newValue = oldStyle - w;
                me.fillContent.increasePage();
                break;
            }
        }
        articleContainer.css({
            "-webkit-transform": "translate3d("+newValue+"px, 0, 0)",
            "transform": "translate3d("+newValue+"px, 0, 0)"
        });
    }

     this.goToPrevPage = function (){
       setTransformValue ("+");
    };
});