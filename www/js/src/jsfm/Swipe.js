fm.Package("jsfm");
fm.Class("Swipe", function (me) { this.setMe = function (_me){me=_me};

	Static.main = function (){
		new me();
	};

	this.Swipe = function () {
		$(window).on('touchstart', this.touchstart);
		$(window).on('touchend', this.touchend);
	};

	function getDirection(x, y) {
		    if (x === y) {
		        return ;
		    }

		    if (Math.abs(x) >= Math.abs(y)) {
		        return 'x';
		    }
		    return 'y';
		}

	var startpoint;
	this.touchstart = function (e) {
		if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length){
			touchstart = {x: e.originalEvent.changedTouches[0].pageX, y: e.originalEvent.changedTouches[0].pageY, timeStamp: e.timeStamp};
		}
	};

	this.touchend = function (e) {
		if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length){
			var finalPositon = {x: e.originalEvent.changedTouches[0].pageX, y: e.originalEvent.changedTouches[0].pageY};
			var x_diff = Math.abs(finalPositon.x - touchstart.x), y_diff = Math.abs(finalPositon.y - touchstart.y);
			var t_diff = e.timeStamp - touchstart.timeStamp;
			var x_speed = x_diff / t_diff;
			var y_speed = y_diff / t_diff;
			if(x_speed > .1 && getDirection(x_diff, y_diff) == 'x'){
				$(document).trigger('horizontal-scroll', [touchstart, finalPositon, finalPositon.x - touchstart.x]);
			} else  if(y_speed > .1 && getDirection(x_diff, y_diff) == 'y'){
				$(document).trigger('vertical-scroll', [touchstart, finalPositon, finalPositon.y - touchstart.y]);
			}
		}
	};

});