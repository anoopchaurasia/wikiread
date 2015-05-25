fm.Package('com.anoop.wikiread.view');
fm.Class('SettingsView> com.anoop.wikiread.view.View', function(me){ this.setMe = function(_me){me=_me};

  var instance;
  Static.getInstance = function() {
    if(!instance) {
      instance = new me();
    }
    return instance;
  };

  this.SettingsView = function (){
    this.base();
    this.events.push(['click', '.color-selection a', 'colorChange']);
    this.events.push(['click', '.font-selection a', 'fontChange']);
  };

  this.colorSelectionView = function (ctrl){
    var list = ctrl.settings.colorcombos.map(function(colorcombo, index){
      return  <a data-index={index}>
      <div style={{"color": colorcombo.color, "background": colorcombo.background}} class={((ctrl.settings.colorcombo.color == colorcombo.color && ctrl.settings.colorcombo.background == colorcombo.background) ? 'selected': '')}>aA</div>
      </a>
    });
    return <div class="color-selection">
    {list}
    </div>
  };

  this.fontSelectionView = function (ctrl){
    var list = ctrl.settings.fonts.map(function(font, index){
      return  <a data-index={index}>
      <div style={{"fontSize": font + "px"}} class={(ctrl.settings.fontSize == font ? 'selected': '')}>aA</div>
      </a>
    });
    return <div class="font-selection">
    {list}
    </div>
  };

  this.demoView = function (ctrl){
    return <div style={{"fontSize": ctrl.settings.fontSize + "px", "color": ctrl.settings.colorcombo.color, "background": ctrl.settings.colorcombo.background}}>
      aAbBcCdDeEfF
    </div>
  };
  this.view = function (ctrl){
    return <div style="background: transparent">
      <div class="view settings">
        <div config={me.attachComponent} view={me.demoView} ctrl={ctrl} redraw="demoRedraw" class="demoRedraw"></div>
        <div config={me.attachComponent} view={me.colorSelectionView} ctrl={ctrl} redraw="colorChangedDraw"></div>
        <div config={me.attachComponent} view={me.fontSelectionView} ctrl={ctrl} redraw="fontChangedDraw"></div>
      </div>
    </div>
  };
});