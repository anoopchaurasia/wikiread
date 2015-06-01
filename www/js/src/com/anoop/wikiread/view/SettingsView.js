fm.Package('com.anoop.wikiread.view');
fm.Class('SettingsView> jsfm.View', function(me){ this.setMe = function(_me){me=_me};
  'use strict';
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
    this.events.push(['click', '.close', 'close']);
    this.events.push(['click', '.text-align-selection a', 'textAlignChange']);
    this.events.push(['click', 'li.table-view-cell', 'extraSettingsChange']);
  };

  this.colorSelectionView = function (ctrl){
    var list = ctrl.settings.colorcombos.map(function(colorcombo, index){
      return  <a data-index={index}>
      <div style={{"color": colorcombo.color, "background": colorcombo.background}} class={((ctrl.settings.colorcombo.color == colorcombo.color && ctrl.settings.colorcombo.background == colorcombo.background) ? 'selected': '')}>{colorcombo.text}</div>
      </a>
    });
    return <div class="color-selection settings-selection">
    {list}
    </div>
  };

  this.fontSelectionView = function (ctrl){
    var list = ctrl.settings.fonts.map(function(font, index){
      return  <a data-index={index}>
      <div style={{"fontSize": font + "px"}} class={(ctrl.settings.fontSize == font ? 'selected': '')}>aA</div>
      </a>
    });
    return <div class="font-selection settings-selection">
    {list}
    </div>
  };

  this.textAlignView = function (ctrl){
    var list = ctrl.settings.textAligns.map(function(align, index){
      return  <a data-index={index}>
      <div style="text-align:center" class={(ctrl.settings.textAlign == align ? 'selected': '')}><i className={"fa fa-align-"+ align}></i></div>
      </a>
    });
    return <div class="text-align-selection settings-selection">
    {list}
    </div>
  };

  this.demoView = function (ctrl){
    return <div className="demo-container" style={{"text-align": ctrl.settings.textAlign, "fontSize": ctrl.settings.fontSize + "px", "color": ctrl.settings.colorcombo.color, "background": ctrl.settings.colorcombo.background}}>
      This is a demo text: Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </div>
  };

  this.extraSettingsView = function (ctrl){
    return <ul class="table-view" style="background-color: inherit; margin-top: 10px;">
        <li class="table-view-cell"  style="background-color: inherit; color: white; border-bottom: none"
         data-type="disable_left_right_click">
          <span className={"custom-checkbox fa " + (ctrl.starter.settings.disable_left_right_click ?  "fa-check-square-o" : "fa-square-o" )}></span>
          <span> Disable tap navigation </span>
        </li>
      </ul>
  };

  this.view = function (ctrl){
    return <div style="background: transparent">
      <div class="view settings">
        <div config={me.attachComponent} view={me.demoView} ctrl={ctrl} redraw="demoRedraw" class="demoRedraw"></div>
        <div config={me.attachComponent} view={me.colorSelectionView} ctrl={ctrl} redraw="colorChangedDraw"></div>
        <div config={me.attachComponent} view={me.fontSelectionView} ctrl={ctrl} redraw="fontChangedDraw"></div>
        <div config={me.attachComponent} view={me.textAlignView} ctrl={ctrl} redraw="textAlignChangeDraw"></div>
        <div config={me.attachComponent} view={me.extraSettingsView} ctrl={ctrl} redraw="extraSettingsChangeDraw"></div>
        <div className="close">
          <i className="fa fa-close"> </i>
        </div>
      </div>
    </div>
  };
});