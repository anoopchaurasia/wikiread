fm.Package('com.anoop.wikiread.controller');
fm.Import("com.anoop.wikiread.view.SettingsView");
fm.Class('SettingsController> com.anoop.wikiread.controller.Controller', function(me, SettingsView){
  'use strict';
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
    me.fontChangedDraw = null;
    me.textAlignChangeDraw = null;
    me.demoRedraw = null;
    me.extraSettingsChangeDraw = null;
  };

  this.render = function () {
    me.renderOverlay();
  };

  this.close = function (){
    me.remove();
  };

  this.colorChange = function(e) {
    var index = e.currentTarget.dataset.index;
    me.settings.setColorByIndex(index);
    me.demoRedraw();
    me.colorChangedDraw();
    return false;
  };

  this.fontChange = function (e) {
    var index = e.currentTarget.dataset.index;
    me.settings.setFontByIndex(index);
    me.demoRedraw();
    me.fontChangedDraw();
    return false;
  };

  this.textAlignChange = function (e){
    var index = e.currentTarget.dataset.index;
    me.settings.setTextAlignByIndex(index);
    me.demoRedraw();
    me.textAlignChangeDraw();
  };

  this.extraSettingsChange = function (e){
    var key = e.currentTarget.dataset.type;
    me.starter.settings.setValueByKey(key, !me.starter.settings[key]);
    me.extraSettingsChangeDraw();
  };

  this.onDestroy = function (){
    $(document).trigger('setting-changed');
  };
});