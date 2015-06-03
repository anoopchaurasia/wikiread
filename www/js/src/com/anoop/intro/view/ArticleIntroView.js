fm.Package("com.anoop.intro.view");
fm.Class("ArticleIntroView> jsfm.View", function (me) {
	'use strict';
	this.setMe = function (_me) {
		me = _me;
	};

	var instance;
	Static.getInstance = function (){
		if(!instance) {
			instance = new me();
		}
		return instance;
	};

	this.ArticleIntroView = function () {
		me.base();
		me.events.push(['click', '.intro-cont', 'remove']);
	};

	this.view = function (){
		return <div>
			<div class="content colorlayer"></div>
			<div  class="content intro-cont">
				<div class="swype-intro">
					<div style="text-align:center;">
						<span> Tap to Close </span>
					</div>
					<div class="my-table-view arrow">
						<div class="swype left my-table-view-cell">
							<i style="margin-left:-44%" class="fa fa-long-arrow-left fa-3x"> </i>
						</div>
						<div class="swype right my-table-view-cell">
							<i  style="margin-right:-9%" class="fa fa-long-arrow-right fa-3x"> </i>
						</div>
					</div>
					<div class="my-table-view">
						<div class="swype left my-table-view-cell">
							Swipe Left
						</div>
						<div class="swype right my-table-view-cell">
							Swipe Right
						</div>
					</div>
					<div style="text-align:center;">
						<span> To Change Page </span>
					</div>
				</div>
				<div class="my-table-view bottom-intro">
					<div class="search my-table-view-cell">
						<h3> Controls </h3>
						Search Wikipedia. Change Color, Font, Style. Naviagete b/w pages. Navigate b/w Sections
						<div>
							<i class="fa fa-3x fa-hand-o-down"> </i>
						</div>
					</div>
				</div>
			</div>
		</div>
	};
});
