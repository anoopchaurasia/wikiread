fm.Package('com.anoop.wikiread.view');
fm.Class('SearchView> com.anoop.wikiread.view.View', function(me){ this.setMe = function(_me){me=_me};
  'use strict';
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
    this.events.push(['click', '.history', 'openHistory']);
    this.events.push(['click', '.article-of-date', 'showTodaysArticle']);
  };

  this.getInstruction = function (){
    return <div class="type-instruction">
      <img src="img/search-term-help.png" />
    </div>
  };

  this.listView = function (ctrl){
    var list = ctrl.list.items.map(function(item){
      return <li className="table-view-cell" data-term={item.key}>
          {item.key}
        </li>
    });
    return <ul class="table-view" style="background:#fff;border:none">
      {list.length ?list: me.getInstruction()}
    </ul>
  };
  this.view = function (ctrl){
    return <div>
        <header class="bar bar-nav" style="height: 60px; border:none;">
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
        <div  class="content" style="background:#fff;padding-top:57px">
            <div config={me.attachComponent} ctrl={ctrl} view={me.listView}>
            </div>
        </div>
        <nav class="bar bar-tab" style="margin:0">
          <div class="article-of-date tab-item">
            Article of the day
          </div>
          <div class="history tab-item">
            history
          </div>
      </nav>
        <div class="clearfix"></div>
    </div>

  };
});
