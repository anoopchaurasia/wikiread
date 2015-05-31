fm.Package("com.anoop.intro");
fm.Class("SearchIntro> com.anoop.intro.Intro", function (me) {
	this.setMe = function (_me) {
		me = _me;
	};

	this.SearchIntro = function () {
		me.base();
		me.drawArray = [
			[10, 20], [10, 100], [100, 100], [100, 20], [10, 20]
		];
	};
});