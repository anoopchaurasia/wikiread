var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
exec("corsproxy localhost 8081", puts);


var sys = require('sys'),
fs = require("fs");

var cnst;
function watch(path) {
	console.log(path);
	fs.watch(path, function (){
		clearTimeout(cnst);
		cnst = setTimeout(function (){
			exec("cordova build browser", puts);
		}, 3000);
	});
}
watch(__dirname + "/www/css");
watch(__dirname + "/www/js");
//watch(__dirname + "/www/js/src/com/feedly");
watch(__dirname + "/www");
watch(__dirname + "/www/js/src/jsfm");
exec("cordova build browser", puts);
exec("cordova serve", puts);