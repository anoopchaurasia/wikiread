fm.Package('com.anoop.wikiread.view');
fm.Class('ArticleView> jsfm.View', function(me){ this.setMe = function(_me){me=_me};
  'use strict';
  var instance;
  Static.getInstance = function() {
    if(!instance) {
      instance = new me();
    }
    return instance;
  };

  this.ArticleView = function (){
    this.base();
    this.events.push(['click', '.settings', 'openSettings']);
    this.events.push(['click', '.page-counter', 'gotoPage']);
    this.events.push(['click', '.sections', 'openSections']);
    this.events.push(['click', '.search', 'searchPage']);
    this.events.push(['click', '.parent', 'handlePageClick']);
  };

  this.view = function (ctrl){
    return <div style={{color: ctrl.starter.settings.colorcombo.color, background: ctrl.starter.settings.colorcombo.background, "minWidth": "100%", "minHeight": "100%"}}>
      <div className="content" id="articleContainer"
        style={{"paddingBottom": ctrl.starter.settings.controllerHeight + "px", 'background': 'inherit'}}></div>
        <div className="controlles" style={{height: ctrl.starter.settings.controllerHeight + "px"}}>
          <nav class="bar bar-tab" style="background: inherit; color: #aaa">
            <a  class="tab-item search" style="color:inherit">
              <span class="fa fa-search" style="color:inherit"></span>
            </a>
            <a  class="tab-item settings" style="color:inherit">
              <span class="fa fa-cog" style="color:inherit"></span>
            </a>
            <a  class="tab-item page-counter" style="color:inherit">
              <span class="" style="color:inherit"></span>
            </a>
            <a  class="tab-item sections" style="color:inherit">
              <span class="fa fa-puzzle-piece" style="color:inherit"></span>
            </a>
          </nav>
        </div>
      </div>
  }
});