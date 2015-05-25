fm.Package('com.anoop.wikiread.controller');
fm.Import("com.anoop.wikiread.view.SettingsView");
fm.Class('SettingsController> com.anoop.wikiread.controller.Controller', function(me, SettingsView){
  this.setMe = function(_me){me=_me};

  var instance;
  Static.getInstance = function() {
    if(!instance) {
      instance = new me();
    }
    return instance;
  };

  this.SettingsController = function (){
    this.base(SettingsView, true);
    this.settings = me.starter.settings;
    this.slide_from = "bottom";
    me.colorChangedDraw = null;
    me.fontChangeDraw = null;
    me.demoRedraw = null;
  };

  this.render = function () {
    me.renderOverlay();
  };

  this.colorChange = function(e) {
    var index = e.currentTarget.dataset.index;
    me.settings.setColorByIndex(index);
    me.demoRedraw();
    return false;
  };

  this.fontChange = function (e) {
    var index = e.currentTarget.dataset.index;
    me.settings.setFontByIndex(index);
    me.demoRedraw();
    return false;
  };
});