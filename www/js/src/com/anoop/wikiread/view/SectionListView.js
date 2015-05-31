fm.Package('com.anoop.wikiread.view');
fm.Class('SectionListView> com.anoop.wikiread.view.View', function(me){ this.setMe = function(_me){me=_me};
  'use strict';
  var instance;
  Static.getInstance = function() {
    if(!instance) {
      instance = new me();
    }
    return instance;
  };

  this.SectionListView = function (){
    this.base();
    this.events.push(["click", 'li', 'openSection']);
    this.events.push(["click", '.cancel', 'remove']);
  };

  this.list = function (ctrl){
    var l = ctrl.sectionList.map(function(s, index){
      return <li style={ctrl.starter.settings.getColorStyle()} data-index={index} class={"table-view-cell"+ (ctrl.articleController.currentSectionIndex === index ? ' selected': "")}>{(index+1)}. {s.title}</li>
    });
    return <ul class="table-view" style={ctrl.starter.settings.getColorStyle()}> {l}</ul>
  };

  this.view = function(ctrl){
    return <div id="sectionlist" >
              <h3 class="bar-nav head" style={ctrl.starter.settings.getColorStyle()}>Sections</h3>
              <div  class="list" style={ctrl.starter.settings.getColorStyle()}>
                {me.list(ctrl)}
              </div>
              <div style={ctrl.starter.settings.getColorStyle()} class="bar-tab foot"> <button class="cancel btn large btn-primary"> close </button></div>
          </div>
  };

});