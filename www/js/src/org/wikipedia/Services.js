fm.Package("org.wikipedia");
fm.Import("jsfm.Utility");
fm.Import("jsfm.Server");
fm.Import('org.wikipedia.SearchList');
fm.Import('org.wikipedia.SectionList');
fm.Import('org.wikipedia.SectionContent');
fm.Class("Services", function (me, Utility, Server, SearchList, SectionList, SectionContent) { this.setMe=function(_me) {me=_me};
	'use strict';
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
			format: me.format,
			search: query
		};
		Server.get(options, me.url, function(result){
			cb && cb(new SearchList(result));
		}, ecb);
	};

	this.resolveRedirect = function (term, cb, ecb){
		var options = {
			action: "query",
			titles: term,
			redirects:"",
			format: me.format
		}
		Server.get(options, me.url, function(result){
			var temp = result.query.pages;
			var term = temp[Object.keys(temp)[0]].title;
			cb && cb(term);
		}, ecb);
	};

	this.getZeroSection = function (term, cb){
		return me.getSectionByNumber(term, 0, cb);
	};

	this.getSectionList = function (term, cb, ecb) {
		var options = {
			action: "parse",
			page: term,
			prop: "sections",
			format: me.format
		}
		Server.get(options, me.url, function(result){
			cb && cb(new SectionList(result));
		}, ecb);
	};

	this.feturedArticle = function (cb ,ecb){
		var options= {
			action: "featuredfeed"
			,prop: "revisions"
			,feed: "featured"
			,rvparse: 1
			,limit: 1
			,format: me.format
		}
		Server.get(options, me.url, function(result){
			cb($($($(result).find('item:last description').text())[2]).find("a:first")[0].title)
		}, ecb);
	}

	this.getSectionByNumber = function (term, number, cb, ecb) {
		var options = {
			action: "query",
			titles: term,
			prop: "extracts",
			explaintext:"",
			format: me.format
		}
		Server.get(options, me.url, function(result){
			var temp = new SectionContent(term);
			if(temp.redirectPage){
				return false;
			}
			temp.extractFromExtract(result);
			cb(temp);
		}, ecb);
	};
});