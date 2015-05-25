fm.Package("com.anoop.wikiread");
fm.Include("lib.pageslider");
fm.Include("lib.router");
fm.Class("Router", function (me) { this.setMe = function(_me){me=_me};
	'use strict';
	var starter;

	this.Router = function (st) {
		starter = st;
	};

	function loadPage (klass, cb, args) {
		fm.Include(klass, function () {
			var instance = new (fm.isExist(klass))(starter, args);
			destroy(instance);
			instance.render(function (element){
				starter.slider.slidePage(element);
			});
		});
	}

	function render (instance){
		destroy(instance);
		instance.render(function (element){
			starter.slider.slidePage(element);
		});
	}

	this.initialize = function(router, defaultPath) {
		router.addRoute('/search', function(path) {
			loadPage('com.anoop.wikiread.controller.SearchController', function(){});
		});
		router.addRoute('/article/:term', function(term) {
			loadPage('com.anoop.wikiread.controller.ArticleController', function(){}, arguments);
		});
		router.start();
		router.load("#/"+defaultPath);
		document.addEventListener("backbutton", Starter.onBackButton, false);
	};

	function destroy (currentPage) {
		if (starter.currentPage) {
			starter.currentPage.destroy();
		}
		starter.currentPage = currentPage;
	}

});