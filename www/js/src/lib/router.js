var router = (function() {
    var routes = [];

    function addRoute(route, handler) {
        routes.push({parts: route.split('/'), handler: handler});
    }

    function load(route) {
        window.location.hash = route;
    }

    function start(e) {
        var serachIndex =  window.location.hash.indexOf("?");
        if(serachIndex !== -1) {
            serachIndex -= 1;
        } else {
            serachIndex = window.location.hash.length;
        }
        var path = window.location.hash.substr(1, serachIndex),
            parts = path.split('/'),
            partsLength = parts.length, oldPath, oldHash;
        if (e) {
            oldPath = e.originalEvent.oldURL || "";
            oldHash = oldPath.substring(oldPath.indexOf("#"));
        }
        console.log(path, "routepath");
        for (var i=0; i<routes.length; i++) {
            var route = routes[i];
            if (route.parts.length === partsLength) {
                var params = [];
                for (var j=0; j<partsLength; j++) {
                    if (route.parts[j].substr(0, 1) === ':') {
                        params.push(parts[j]);
                    } else if (route.parts[j] !== parts[j]) {
                        break;
                    }
                }
                params.push(oldHash);
                if (j === partsLength) {
                    route.handler.apply(undefined, params);
                    return;
                }
            }
        }
    }

    $(window).on('hashchange', start);

    return {
        addRoute: addRoute,
        load: load,
        start: start
    }

}());