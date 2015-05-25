

fm.Package("jsfm");
fm.Import('jsfm.Utility');
fm.Import('jsfm.Server');
fm.AbstractClass("AbstractList");

jsfm.AbstractList = function (me, Utility, Server) {
    'use strict';

    this.setMe = function (_me) {
        me = _me;
    };

	var itemType, keyValue, items;

	this.AbstractList = function (type) {
        keyValue = {};
        itemType = type;
        items = [];
        me.serverCount = 0;
        this.items = items;
    };

    this.add = function (item, arg1, arg2) {
        this.items.push(new itemType(item, arg1, arg2));
        keyValue[item.id] = items.length - 1;
    };

    function resetKeyValue() {
        var items_temp = me.items;
        keyValue = {};
        for (var i = 0; i < items_temp.length; i++) {
            keyValue[items_temp[i].id] = i;
        }
    }

    this.resetKeyValue = resetKeyValue;

    this.replaceItems = function (items) {
        this.items = items;
        resetKeyValue();
    };

    this.replaceItem = function (index, replaceWith, arg1, arg2) {
        this.items[index] = new itemType(replaceWith, arg1, arg2);
    };

    this.set = function (item, arg1, arg2, noSett) {
        var index = this.indexOf(item);
        if (index !== -1) { ///update
            this.items[index] = new itemType(item, arg1, arg2);
        } else { //Add at last
            this.items.push(new itemType(item, arg1, arg2));
            keyValue[item.id] = this.items.length - 1;
        }
    };

    this.multiSet = function (items, arg1, arg2) {

        for (var i = 0; i < items.length; i++) {
            this.set(items[i], arg1, arg2);
        }
        resetKeyValue();
    };

    this.indexOf = function (item) {
        if (typeof item === 'object' && item.id && keyValue[item.id]  !== undefined) {
            return keyValue[item.id];
        }
        if (!item.id) {
            return me.items.indexOf(item);
        }

        return -1;
    };

    this.remove = function (item, noSett) {
        var temp, index = this.indexOf(item);
        if (index !== undefined) {
            temp = this.items.splice(index, 1);
            resetKeyValue();
        }
        return temp;
    };

    this.getById = function (id) {
        if (!id) {
            return;
        }
        return this.items[keyValue[id]];
    };

    this.getByIdFromServer = function (id, cb) {
        if (!id) {
            return;
        }
        if(!me.items[keyValue[id]]){
            Server.get( {}, me.getSub().url + "/" + id  +".json", function (resp) {
                me.set(resp);
                cb(me.getById(id));
            });
        }else{
            cb && cb(me.items[keyValue[id]]);
            return me.items[keyValue[id]];
        }
    };

    this.inValidateData = function  () {
        dataLoaded = false;
        this.items.length = 0;
        keyValue = {};
    };

    this.loadAll = function (cb, data) {

        this.loadData(cb, data, true);
    };

    this.loadPage =  function (cb, data){
        if(me.count() < data.page * 10) {
            me.loadData(cb, data);
        } else {
            cb(me.getSub());
        }
    };

    var dataLoading, dataLoadingCBs = [], dataLoaded;
    this.loadData = function (cb, data, loadAll) {
        dataLoadingCBs.push(cb);
        if(dataLoaded && isAllDataLoaded(data) ) {
            while(cb = dataLoadingCBs.shift()) {
                cb(me.getSub());
            }
            return false;
        }

        if(dataLoading){
            return;
        }
        var all_url = "";
        if(loadAll) {
            all_url = "/all";
        }
        dataLoading = true;
        Server.get(data || {}, me.getSub().url+ all_url + ".json", function (resp) {
            dataLoading = false;
            dataLoaded = true;
            if(!Utility.isArray(resp)) {
                me.multiSet(resp[me.getSub().url]);
                me.serverCount = resp.count;
            }else{
                me.multiSet(resp);
            }
            while(cb = dataLoadingCBs.shift()) {
                cb(me.getSub());
            }
        }, function (){
            dataLoading= false;
            dataLoaded = true;
        });
    };

    function isAllDataLoaded(data) {
        if (!data || !data.page || me.count() % 10 != 0 || me.count() === me.serverCount) {
            return true;
        }
        return false;
    };

    this.getPropList = function (key) {
        var nested = key.split("."),
        isNested = nested.length > 1;
        if(isNested){
            var key = nested.shift(),
            remainingKeys = nested.join('.');
        }
        var items = [];
        me.forEach(function (item){
            if (isNested) {
                if(item[key][remainingKeys] !== undefined){
                    items.push(item[key][remainingKeys]);
                } else {
                    Array.prototype.push.apply(items, item[key].getPropList(remainingKeys));
                }
            } else {
                items.push(item[key]);
            }
        });
        return items;
    };

    this.filter = function (cb){
        var items = this.items, item, i =0, filterList = [];
        while(item = items[i++]) {
            if(cb(item)){
                filterList.push(item);
            }
        }

        return new (me.getSub().getClass())(filterList);
    };

    this.getIdList = function () {
        var items = this.items, item, i =0, idlist = [];
        while(item = items[i]) {
            idlist.push(item.id);
        }
        return idlist;
    };

    this.createNew = function (newItem, cb) {
        Server.post(newItem, me.getSub().url, function (resp) {
            me.add(resp);
            cb(resp);
        });
    };

    this.sort = function (sort_key) {
        this.items.sort(function (a, b){
            return a[sort_key] > b[sort_key] ? 1 : a[sort_key] < b[sort_key] ? -1 : 0;
        });
        resetKeyValue();
    };

    var in_process;
    this.save = function (item, cb){
        if (in_process) {
            alert("Saving! in progress");
            return;
        }
        in_process = true;
        if(item.id) {
            Server.put(item, me.getSub().url + "/"+item.id, function (resp){
                in_process = false;
                me.set(resp);
                cb && cb(me.getById(resp.id));
            }, function (argument) {
                in_process = false;
            });
        } else {
            Server.post(item, me.getSub().url + ".json", function (resp){
                in_process = false;
                me.set(resp);
                cb && cb(me.getById(resp.id));
            }, function (argument) {
                in_process = false;
            });
        }
    };

    this.forEach = function (cb) {
        this.items.forEach(cb);
    };

    this.count = function (){
        return this.items.length;
    };
};