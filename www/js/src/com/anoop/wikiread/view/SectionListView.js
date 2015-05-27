fm.Package('com.anoop.wikiread.view');
fm.Class('SectionListView> com.anoop.wikiread.view.View', function(me){ this.setMe = function(_me){me=_me};

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
  };

  this.list = function (ctrl){
    var l = ctrl.sectionList.sections.map(function(s, index){
      return <li data-index={s.index} class="table-view-cell"> {s.line}</li>
    });
    return <ul class="table-view"> {l}</ul>
  };

  this.view = function(ctrl){
    return <div id="sectionlist" class="content">
          {me.list(ctrl)}
          </div>
  };

});