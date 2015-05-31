fm.Package("org.wikipedia");
fm.Class("SearchList", function (me) { this.setMe=function(_me) {me=_me};
	'use strict';
	this.SearchList = function (unformated){
		var valueArray = unformated[1];
		var descArray = unformated [2];
		var linkArray = unformated[3];
		me.items = [];
		valueArray.forEach(function(item, index){
			me.items.push({
				key: item,
				desc: descArray[index],
				link: linkArray[index]
			});
		});
	};
});