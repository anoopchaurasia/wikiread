fm.Package("jsfm");
fm.Import('jsfm.Server');
fm.Class("Autocomplete");
jsfm.Autocomplete = function (me, Server) {
	this.setMe = function (_me) {
		me = _me;
	};

	this.Autocomplete = function (page, path) {
		me.page = page;
		this.path = path;
	};

    this.search  = function (str, keyPressed){
        onKeyup.apply({value: str}, [{
            which: keyPressed,
        }]);
    };

    var onKeyup;

	this.bind = function (inputName, cont, params, key) {
		cont = jQuery(cont);
		var timeoutCont;
		if(inputName) {
			delete params[inputName];
		}
		params = jQuery.param(params);
		var baseurl = "#/events?";
		if(params) {
			baseurl += params + "&";
		}
		var oldValue;
		$('input[name="'+ inputName +'"]').off("keyup").keyup();
        onKeyup = function (e){
            if(e.which === 13 && me.page.searchOnEnter) {
                location.hash = baseurl + inputName + "=" + this.value;
                me.page.remove();
                return;
            }
            var value = this.value.trim();
            if(!value || oldValue === value) {
                return;
            }
            oldValue = value;
            cont.html("");
            clearTimeout(timeoutCont);
            timeoutCont = setTimeout( function(){
                render(cont, baseurl, value, inputName, key);
            }, 400);
        }
	};
	function render(cont, baseurl, value, inputName, key) {
        Server.get({query: value}, me.path + "/autocomplete.json", function (resp){
            var html = "";
            if(resp.length === 0) {
                html += "<li class='table-view-cell media'>No Match</a></li>";
            }
            resp.forEach(function(item){
                html += me.page.getHtml ? me.page.getHtml(item, baseurl) : getHtml(item, baseurl, inputName, key);
            });
            cont.html(html);
        });
    }

    function getHtml(item, url, inputName, key){
        url += inputName + "=" + item[key];
        return "<li class='table-view-cell media'><a href='"+ url +"'>" + (item.name||item.title) + "</a></li>";
    };
};