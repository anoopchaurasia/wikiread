fm.Package('com.anoop.wikiread.view');
fm.Class('ArticleView> com.anoop.wikiread.view.View', function(me){ this.setMe = function(_me){me=_me};

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
  };

  this.view = function (ctrl){
    return <div>
      <div className="content" id="articleContainer" style={{"paddingBottom": ctrl.starter.settings.controllerHeight + "px"}}></div>
      <div className="controlles" style={{height: ctrl.starter.settings.controllerHeight + "px"}}>
      <nav class="bar bar-tab">
        <a  class="tab-item settings">
          <span class="fa fa-cog"></span>
        </a>
        <a  class="tab-item counter">
          <span class=""></span>
        </a>
        <a  class="tab-item sections">
          <span class="fa fa-puzzle-piece"></span>
        </a>
    </nav>

      </div>
      </div>
  }
});