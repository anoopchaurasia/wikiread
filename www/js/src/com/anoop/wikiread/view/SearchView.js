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
    return <div>
        <header class="bar bar-nav" style="height: 60px;">
          <div class="title search-cont">
              <input
                autocomplete="off"
                placeholder="Search Wikipedia .... "
                name="q"
                value=""
                style="color:#555; font-weight: 200"
                type="text"
                class="header-search"/>
              <i class="fa fa-search search-icon"></i>
          </div>
        </header>
        <div  class="content" style="background:#fafafa;padding-top:57px">
            <div config={me.attachComponent} ctrl={ctrl} view={me.listView}>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>

  };
});
