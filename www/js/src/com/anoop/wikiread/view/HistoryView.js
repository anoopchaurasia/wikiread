fm.Package('com.anoop.wikiread.view');
fm.Class('HistoryView> jsfm.View', function(me){ this.setMe = function(_me){me=_me};
  'use strict';
  var instance;
  Static.getInstance = function() {
    if(!instance) {
      instance = new me();
    }
    return instance;
  };

  this.HistoryView = function (){
    this.base();
    this.events.push(['click', 'li', 'open']);
    this.events.push(['click', '.cancel', 'remove']);
  };

   this.list = function (ctrl){
    var l = ctrl.starter.history.items.reverse().map(function(s, index){
      return <li style="color:black; background:#fff" data-data={s} class="table-view-cell"> {s}</li>
    });
    return <ul class="table-view" style="color:black; background:#fff"> {l}</ul>
  };

  this.view = function(ctrl){
    return <div id="historyList" style="color:black; background:#fff">
        <h3 class="bar-nav head" style="color:black; background:#fff">History</h3>
        <div class="list" style="padding:50px 0 50px 0;color:black; background:#fff;  border-left: 1px solid #ccc;">
          {me.list(ctrl)}
        </div>
        <div style="color:black; background:#fff;" class="bar-tab foot"> <button class="cancel btn large btn-primary"> close </button></div>
      </div>
  };
});