fm.Package("org.wikipedia");
fm.Class("SectionList", function (me) { this.setMe=function(_me) {me=_me};
	

	this.SectionList = function (data){
		me.sections = data.parse.sections;
	};
});
