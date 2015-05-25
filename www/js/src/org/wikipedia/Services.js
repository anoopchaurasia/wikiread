fm.Package("org.wikipedia");
fm.Import("jsfm.Utility");
fm.Import("jsfm.Server");
fm.Import('org.wikipedia.SearchList');
fm.Import('org.wikipedia.SectionList');
fm.Import('org.wikipedia.SectionContent');
fm.Class("Services", function (me, Utility, Server, SearchList, SectionList, SectionContent) { this.setMe=function(_me) {me=_me};

	this.init = function (){
		Static.url = "http://en.wikipedia.org/w/api.php";
		Static.format = "json";
	};

	this.Services = function (){
	};

	this.searchString = function (query, cb, ecb){
		var options = {
			action: "opensearch",
			limit: 10,
			//format: me.format,
			search: query
		};
		Server.get(options, me.url, function(result){
			cb && cb(new SearchList(result));
		}, ecb);
	};

	this.getZeroSection = function (term, cb){
		return me.getSectionByNumber(term, 0, cb);
	};

	this.getSectionList = function (term, cb, ecb) {
		var options = {
			action: "parse",
			page: term,
			prop: sections,
			format: me.format
		}
		Server.get(options, me.url, function(result){
			cb && cb(new SectionList(result));
		}, ecb);
	};

	this.getSectionByNumber = function (term, number, cb, ecb) {
		var options = {
			action: "query",
			titles: term,
			rvprop: "content",
			rvsection: number,
			prop: "revisions",
			format: me.format
		}
		Server.get(options, me.url, function(result){
			cb && cb(new SectionContent(result));
		}, ecb);
	};
});