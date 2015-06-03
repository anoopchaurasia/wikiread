fm.Package("com.anoop.intro");
fm.Import("com.anoop.intro.view.ArticleIntroView");
fm.Class("ArticleIntro> com.anoop.intro.Intro", function (me, ArticleIntroView) {
	'use strict';
	this.setMe = function (_me) {
		me = _me;
	};

	this.ArticleIntro = function () {
		me.base(ArticleIntroView);
	};

});