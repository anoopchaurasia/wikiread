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
		this.pageIndex = [];
		this.onRenderComplete = null;
	};

	this.start = function (content, onRenderComplete) {
		this.content = content ||  me.content;
		me.onRenderComplete = onRenderComplete;
		clearTimeout(me.setTimeOut);
		this.$container = this.$container || $("#articleContainer");
		this.$container.empty().css('fontSize', me.settings.fontSize);
		me.tagObj = me.tagObj || me.getTagObj();
		me.initialize();
		me.pageIndex = [];
		columnRecursive([]);
	};

	this.reset = function (){
		me.tagObj= null;
        me.$container.css({
            "-webkit-transform": "translate3d(0, 0, 0)",
            "transform": "translate3d(0, 0, 0)"
        });
	};

	this.initialize = function () {
        me.columnWidth = Math.min(jQuery(window).width(), me.settings.fontSize * me.multiplier);
        me.articleHeight = window.innerHeight - me.$container[0].offsetTop - me.settings.controllerHeight;
        me.renderWidth = me.columnWidth - me.settings.horizontalGap();
        me.renderHeight = me.articleHeight - me.settings.verticalGap();
        me.total_pages = 0;
        me.current_page_number = 1;
    }

    this.renderComplete = function(){
    	me.onRenderComplete && me.onRenderComplete();
    	me.setPage();
    };

    function columnRecursive (current_rendered_array) {
        if(!current_rendered_array) {
        	me.renderComplete();
            return;
        }
        me.pageIndex.push(current_rendered_array.slice());
    	me.total_pages++;
        if(me.total_pages !== 1 && !current_rendered_array.length) {
        	alert("Sorry! Something not working");
        	return;
        }
        me.$container.width((me.total_pages+ 4) * me.columnWidth);
        var htmls = createParentTags();
        me.$container[0].appendChild(htmls[0]);
        me.setTimeOut = setTimeout (function () {
            truncateWithHeight(htmls[1], me.tagObj, columnRecursive, current_rendered_array);
            htmls[0].style.textAlign = me.settings.textAlign;
        }, me.total_pages === 1? 200 : 10);
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

    var currentDom;

    function truncateWithHeight  (dom, obj, cb, arr) {
        currentDom = dom;
 		var limit = me.articleHeight;
 		var t = addElem(dom, obj, limit, arr);
 		cb(t);
	}

    function createElem (obj, dom) {
        var elem;
        if(obj.tag === "#text") {
            elem = document.createTextNode(" " + obj.content);
        } else {
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
        }
		return elem;
	};

    function getOffset(elem) {
        return currentDom.scrollHeight;
    }

	function addElem (dom, obj, limit, arr){
		var elem = createElem(obj, dom);
 		dom.appendChild(elem);

 		if(getOffset(elem) > limit) {
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
        var htmlStr = me.content;
	       //  .replace(/>|</gim, function(a){ return a=='>'?"> ": " <"})
	       //  .replace(/\sstyle=""/gim, " ")
	       //  .replace( /(\s*)<\/?[^<>]*\/?>|(\s*)(.*?)\s/gim,function(a, b){
	       //      if(a.match(/<\/?[^<>]*\/?>/gim)) return a;
	       //      return "<span class='a'>"+ a+" </span>";
        // });
		var html = $("<div>"+htmlStr+"</div>");
       // html.find("iframe, img").remove();
		return createTags(html[0], {});
	};

	function createTags(elem, storage) {
		storage = storage || {};
        storage.tag =  elem.nodeName;
        storage.childs = [];
        if(elem.nodeName == "#text") {
            return elem.textContent.split(" ").map(function(c){
                return {
                    tag: "#text",
                    content: c,
                    childs: []
                };
            });
        }
        var t, temp;
        for (var i = 0, len = elem.childNodes.length; i < len; i++) {
            t= elem.childNodes[i];
            if( !(t.nodeName == "#text" && t.nodeValue.trim() == "")) {
                temp = createTags(t, {});
                if(jQuery.isArray(temp)){
                    Array.prototype.push.apply(storage.childs, temp);
                }else {
                    storage.childs.push(temp);
                }
            }
        };
        return storage;
    }

    this.getCurrentPageIndex = function (){
    	return me.pageIndex[me.current_page_number-1];
    };

    this.gotToPage = function (page){
        var page = page + 1;
        if(page <1 || page > me.total_pages) return;
    	me.current_page_number = page;
    	me.setPage();
    };

    this.gotToPageIndex = function (pageIndex){
		var index = pageIndex.length  -1;
		index = index > 0 ? index : 0;
		var filteredold, currentFiltered= me.pageIndex;
		while(true) {
    		currentFiltered= currentFiltered.filter(function(item){
			  return item[index] === pageIndex[index];
			});
			if(currentFiltered.length) {
				filteredold = currentFiltered;
			}else{
				break;
			}

			if(index-- === 0) {
				break
			}
		}
		if(index <=0 && filteredold.length === 1) {
			me.gotToPage(me.pageIndex.indexOf(filteredold[0]));
			return;
		}
		for(var k =0; k < filteredold.length; k++) {
			if(filteredold[k] && filteredold[k][index] < pageIndex[index] && filteredold[k+1] && filteredold[k+1][index] > pageIndex[index]) {
				me.gotToPage(me.pageIndex.indexOf(filteredold[k]));
				break;
			}
		}
    };

    this.setPage = function() {
    	me.$container.next().find('.page-counter span').html(me.current_page_number + "/"+ me.total_pages);
        var current = $(me.$container[0].childNodes[me.current_page_number - 1])
        current.addClass('selected').siblings('.selected').removeClass('selected');
        var w= - me.columnWidth*(me.current_page_number-1);
    	me.$container.css({
            "-webkit-transform": "translate3d("+w+"px, 0, 0)",
            "transform": "translate3d("+w+"px, 0, 0)"
        });
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

	this.goToNextPage = function (){
       return setTransformValue ("-");
    };

    function setTransformValue (operator) {
        switch(operator) {
            case "+" :{
                if(me.isFirstPage()) {
                    return false;
                }
                break;
            }
            case "-" : {
                if(me.isEndReach()) {
                    return false;
                }
                break;
            }
        }
        switch(operator) {
            case "+" :{
                me.decreasePage();
                break;
            }
            case "-" : {
                me.increasePage();
                break;
            }
        }
        me.setPage();
        return true;
    }

     this.goToPrevPage = function (){
       return setTransformValue ("+");
    };

};
