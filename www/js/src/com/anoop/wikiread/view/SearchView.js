fm.Package('com.anoop.wikiread.view');
fm.Class('SearchView> com.anoop.wikiread.view.View', function(me){ this.setMe = function(_me){me=_me};

  var instance;
  Static.getInstance = function() {
    if(!instance) {
      instance = new me();
    }
    return instance;
  };

  this.SearchView = function (){
    this.base();
    this.events.push(['keyup', '.header-search', 'search']);
    this.events.push(['click', 'li', 'showTerm']);
  };

  this.listView = function (ctrl){
    var list = ctrl.list.items.map(function(item){
      return <li className="table-view-cell" data-term={item.key}>
          {item.key}
        </li>
    });
    return <ul class="table-view" style="background:#fafafa;">
      {list}
    </ul>
  };
  this.view = function (ctrl){
    return <div class="rotate-page-show">
        <header class="bar bar-nav event-listing">
          <div id="event-search">
            <span style="  overflow: hidden;padding-left: 20px;width: 80px;"
              class="icon icon-bars pull-left user-info-btn show-anim"></span>
            <div style="position: relative; width: 100%; display:table-cell;">
              <input
                autocomplete="off"
                placeholder="Tech, Startups, Business Events..."
                name="q"
                value=""
                type="text"
                class="header-search"/>
              <i class="fa fa-search search-icon"></i>
            </div>
            <span style="visibility: hidden;display:table-cell; padding: 0px; width:61px; overflow:hidden; margin-right: -46px" class="cancel-circle" >
              <i class="fa fa-times"></i>
            </span>
          </div>
        </header>
        <div  class="content " style="background:#fafafa;padding-top:100px">
            <div config={me.attachComponent} ctrl={ctrl} view={me.listView}>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>

  };
});
