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


	Private.DB = function (){
		this.db_required = false; //cordova.platformId === "android";
		if (this.db_required) {
			this.db = window.sqlitePlugin.openDatabase({name: "wikiread"});
		};
	};

	this.clearDB = function (){
		if (!this.db_required){
			localStorage.clear();
			return;
		}
		me.db.transaction(function(tx) {
		    tx.executeSql("DELETE from data_table;", [], function(tx, res) {
		    }, function(e) {
		      Bugsense.notify( new Error("DB Error"+ e.message), { status: 400});
		    });
		 });
	};

	this.removeKey = function (key) {
		if (!this.db_required){
			delete localStorage[key];
			return;
		}

		me.getIDForKey(key, function(id){
			me.db.transaction(function(tx) {
				if(id) {
					tx.executeSql("DELETE from "+me.table_name+" where id=?", [id], function(tx, res) {}, function(e) {
			      		Bugsense.notify( new Error("DB Error"+ e.message), { status: 400});
			    	});
				}
			});
		});
	}

	this.setSessionStorage = function (cb){
		if (!this.db_required){
			for(var k in localStorage) {
				if(localStorage.hasOwnProperty(k) && typeof localStorage[k] == 'string'){
                 	sessionStorage[k] = localStorage[k];
             	}
            }
			cb && cb();
			return;
		}
		me.db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS '+me.table_name+' (id integer primary key, data text, name VARCHAR(50))');
            tx.executeSql("select * from "+me.table_name+";", [], function(tx, res) {
                var temp;
                for(var k=0, len=res.rows.length; k < len; k++) {
                    temp = res.rows.item(k);
                    sessionStorage[temp["name"]] = temp["data"];
                }
                cb && cb();
            });
        });
	};

	this.setValues = function (key, value, cb) {
		if (!this.db_required){
			localStorage[key]= value;
			cb && cb();
			return;
		}
		me.getIDForKey(key, function(id){
			me.db.transaction(function(tx) {
				var q = "", args = [];
				if(id) {
					q= "UPDATE "+me.table_name+" set data=? where id=?";
					args = [value, id];
				}
				else {
					q="insert into  "+me.table_name+" (data, name) values(?, ?)";
					args = [value, key];
				}
			 	tx.executeSql(q, args, function(tx, res) {
			 	}, function(e) {
		      		Bugsense.notify( new Error("DB Error"+ e.message), { status: 400});
		    	});
			});
		});
	};

	this.getIDForKey = function (key, cb) {
		if (!this.db_required){
			cb && cb();
			return;
		}
		me.db.transaction(function(tx) {
		    tx.executeSql("select id from "+me.table_name+" where name=?;", [key], function(tx, res) {
		    	if(res.rows.length > 0) {
		    		cb(res.rows.item(0).id);
		    	} else {
		    		cb(null);
		    	}
		    }, function(e) {
		      Bugsense.notify( new Error("DB Error"+ e.message), { status: 400});
		    });
		});
	}
});