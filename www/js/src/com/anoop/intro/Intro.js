fm.Package("com.anoop.intro");
fm.AbstractClass("Intro", function (me) {
	this.setMe = function (_me) {
		me = _me;
	};

	this.Intro = function () {
		this.canvas = document.createElement('canvas');
		this.context = me.canvas.getContext('2d');
		this.drawArray = [];
		this.canvas.height = $(window).height();
		this.canvas.width = $(window).width();
		this.canvas.style.zIndex = 1000;
		this.canvas.style.position = "absolute";
		this.canvas.style.top = 0;
		this.canvas.style.left = 0;
		$('body').append(this.canvas);
	};

	this.draw = function (arr){
		var ctx = this.context;
		ctx.beginPath();
		arr = arr || me.drawArray;
		arr.forEach(function(xy, index){
			ctx.lineTo.apply(ctx, xy);
		});
		ctx.stroke();
	};

	this.drawArc = function (){
		var ctx = this.context;
		var x = 100; y= 100;
		var w= 50; h=30;
		 var kappa = .5522848,
            ox = (w / 2) * kappa, // control point offset horizontal
            oy = (h / 2) * kappa, // control point offset vertical
            xe = x + w, // x-end
            ye = y + h, // y-end
            xm = x + w / 2, // x-middle
            ym = y + h / 2; // y-middle
        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);


	};

	function drawArrow(context, x, y, startX, startY, endy) {
        var arrowLength = 10;
        var angle = Math.atan2(startY - endy, x - startX);
        context.moveTo(x, y);
        context.closePath();
        context.stroke();
        context.beginPath();
        context.lineTo(x - arrowLength * Math.cos(angle - Math.PI / 6), y - arrowLength * Math.sin(angle - Math.PI / 6));
        context.lineTo(x - arrowLength * Math.cos(angle), y - arrowLength * Math.sin(angle));
        context.lineTo(x - arrowLength * Math.cos(angle + Math.PI / 6), y - arrowLength * Math.sin(angle + Math.PI / 6));
        context.lineTo(x, y);
        context.fill();
        context.closePath();
    }
});