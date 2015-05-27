fm.Package("org.wikipedia");
fm.Include('lib.wiky');
fm.Class("SectionContent", function (me) { this.setMe=function(_me) {me=_me};

	this.SectionContent = function (unformateddata){
		var data = unformateddata.query.pages[Object.keys(unformateddata.query.pages)[0]].revisions[0]["*"];
		var parsedData = wtf_wikipedia.parse(data);
		if(parsedData.type==="redirect") {
			Starter.load('article/'+ parsedData.redirect);
			this.redirectPage = true;
		}
		this.formatedData = wtf_wikipedia.parseToPlain(parsedData)//.replace(/{{(.*?)}}/g, ""));
	}

	function removeAllBracket (data){
		var startIndex = 0;
		var indexSet = [];
		var len = data.length;
		for(var i=0; i < len; i++) {
			if(data[i] == "{") {
				indexSet.push({start: i});
			}
			if(data[i]=="}"){
				getLastIncompelete(indexSet).end = i;
			}
		}
		c = indexSet[0];
		var newSet = [c];
		var index =0;
		for (var i = 0; i < indexSet.length; i++) {
			if(indexSet[i].end - indexSet[i].start > 300){
				index =i;
				break;
			}
		};
		indexSet.slice(0, index+1).forEach(function(t){
		 if(t.start > c.end) {
		    c= t;
		    newSet.push(c)
		  }

		});
		newSet.reverse().forEach(function(d){
			data= data.substring(0, d.start)+ data.substring(d.end+1);
		});
		return data.replace(/\n(\s*?)\n/g, "");
	}

	function getLastIncompelete(indexSet) {
		for(var k=indexSet.length -1; k >= 0; k--) {
			if(!indexSet[k].end) return indexSet[k];
		}
	}
});
