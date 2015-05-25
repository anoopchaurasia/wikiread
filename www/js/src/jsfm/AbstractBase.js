fm.Package("jsfm");
fm.AbstractClass("AbstractBase");

jsfm.AbstractBase = function (me) { this.setMe = function(_me){me=_me};
	'use strict';
	this.setMe = function (_me) {
        me = _me;
    };
	this.AbstractBase = function (base) {
		this.name = base.name;
		this.id = base.id;
	};
};
