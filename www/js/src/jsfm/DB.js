fm.Package("jsfm");
fm.Class("DB", function (me) { this.setMe=function(_me){me=_me};

	this.init = function (){
		Static.Const.table_name = "data_table";
		Static.db_version = 1.0;
	};
	var instance;
	Static.getInstance = function (){
		if(!instance) {
			instance = new me()
		}
		return instance;
	};


	this.DB = function (){
		this.setSessionStorage();
	};

	this.clearDB = function (){
		sessionStorage.clear();
		localStorage.clear();
	};

	this.removeKey = function (key) {
		delete sessionStorage[key];
		delete localStorage[key];
	}

	this.setSessionStorage = function (cb){
		for(var k in localStorage) {
			if(localStorage.hasOwnProperty(k) && typeof localStorage[k] == 'string'){
             	sessionStorage[k] = localStorage[k];
         	}
        }
	};

	this.setValues = function (key, value, cb) {
		localStorage[key]= value;
		sessionStorage[key] = value;
		cb && cb();
	};

	this.getIDForKey = function (key, cb) {
		cb && cb();
	}
});