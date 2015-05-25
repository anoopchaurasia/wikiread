fm.Package("jsfm");
fm.Class("PageCreater");
jsfm.PageCreater = function (me) {
	'use strict';

	this.init = function (){
		Static.setTimeOut = null;
		Static.Const.multiplier = 18;
	};
	this.setMe = function( _me ) {
		me = _me;
	};

	this.PageCreater = function(settings) {
		this.content = null;
		me.total_pages = 0;
		me.current_page_number = 1;
		me.columnWidth = 0
		me.articleHeight = 0;
		me.renderWidth = 0;
		me.renderHeight = 0;
		me.tagObj= null;
		this.settings = settings;
		this.$container = null
	};

	this.start = function (content) {
		this.content = content;
		clearTimeout(me.setTimeOut);
		this.$container = this.$container || $("#articleContainer");
		this.$container.empty().css('fontSize', me.settings.fontSize);
		me.tagObj = me.tagObj || me.getTagObj();
		me.initialize();
		columnRecursive([]);
	};

	this.initialize = function () {
        me.columnWidth = Math.min(jQuery(window).width(), me.settings.fontSize * me.multiplier);
        me.articleHeight = window.innerHeight - me.$container[0].offsetTop - me.settings.controllerHeight;
        me.renderWidth = me.columnWidth - me.settings.horizontalGap();
        me.renderHeight = me.articleHeight - me.settings.verticalGap();
        me.total_pages = 0;
        me.current_page_number = 1;
    }

    function columnRecursive (current_rendered_array) {
        if(!current_rendered_array) {
            return;
        }
    	me.total_pages++;
        if(me.total_pages !== 1 && !current_rendered_array.length) {
        	alert("Sorry! Something not working");
        	return;
        }
        me.$container.width((me.total_pages+ 1) * me.columnWidth);
        var htmls = createParentTags();
        me.$container[0].appendChild(htmls[0]);
        me.setTimeOut = setTimeout (function () {
            truncateWithHeight(htmls[1], me.tagObj, columnRecursive, current_rendered_array);
        }, 200);
    }

    function createParentTags (articleHeight) {
    	var htm = document.createElement('div');
    	htm.style.width = me.columnWidth + "px";
    	htm.style.height = me.articleHeight + "px";
        htm.className = "parent selector";
        var s = document.createElement("div");
        s.className="s";
        htm.appendChild(s);
        return [htm, s];
    }

    function truncateWithHeight  (dom, obj, cb, arr) {
 		var limit = me.articleHeight - me.settings.getLineHeight() * 1.5;
 		var t = addElem(dom, obj, limit, arr);
 		cb(t);
	}

    function createElem (obj, dom) {
		var elem = document.createElement(obj.tag);
		if(obj.src){
			elem.src=obj.src;
			elem.style.maxHeight=100+"px";
			elem.style.maxWidth=100+"px";
			dom.style.height = "100px";
			dom.style.width = "100px";
			dom.style.float = "right";
		}
		if(obj.content) {
			elem.innerHTML = obj.content;
		}
		return elem;
	};

	function addElem (dom, obj, limit, arr){
		var elem = createElem(obj, dom);
 		dom.appendChild(elem);

 		if(elem.offsetTop > limit) {
 			$(elem).detach();
 			return [];
 		}
 		var t;
 		for (var i = (arr.pop()||0); i < obj.childs.length; i++) {
 			t = addElem(elem, obj.childs[i], limit, arr);
 			if(t) {
 				t.push(i);
 				return t;
 			}
 		};
	}

    this.getTagObj = function (){
    	return stripHTML();
    };

    function stripHTML() {
        var htmlStr = me.content
	        .replace(/>|</gim, function(a){ return a=='>'?"> ": " <"})
	        .replace(/\sstyle=""/gim, " ")
	        .replace( /(\s*)<\/?[^<>]*\/?>|(\s*)(.*?)\s/gim,function(a, b){
	            if(a.match(/<\/?[^<>]*\/?>/gim)) return a;
	            return "<span class='a'>"+ a+" </span>";
        });
		var html = $("<div>"+htmlStr+"</div>");
        html.find("iframe, img").remove();
		return createTags(html[0], {});
	};

	function createTags(elem, storage) {
		storage = storage || {};
        storage.tag = elem.tagName;
        storage.childs = [];
        if(elem.className == "a") {
            storage.content = elem.innerHTML;
            return storage;
        }
        var t;
        for (var i = 0, len = elem.childNodes.length; i < len; i++) {
            t= elem.childNodes[i];
            if( !(t.nodeName == "#text" && t.nodeValue.trim() == "")) {
                storage.childs.push(createTags(t, {}));
            }
        };
        return storage;
    }

	this.isEndReach = function (){
		return me.current_page_number === me.total_pages;
	};
	this.isFirstPage = function (){
		return me.current_page_number === 1;
	};
	this.increasePage = function (){
		me.current_page_number++;
		return this;
	};
	this.decreasePage = function (){
		me.current_page_number--;
	};

};
