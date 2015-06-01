var sys = require('sys')
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout) }
exec("corsproxy localhost 8081", puts);


var sys = require('sys'),
fs = require("fs");

var cnst;
function watch(path) {
	console.log(path);
	// fs.watch(path, function (){
	// 	clearTimeout(cnst);
	// 	cnst = setTimeout(function (){
	// 		exec("cordova build browser", puts);
	// 	}, 3000);
	// });
}
__dirname = process.cwd();
watch(__dirname + "/www/css");
watch(__dirname + "/www/js/src/com/anoop/wikiread/view");
watch(__dirname + "/www/js/src/com/anoop/wikiread/controller");
//watch(__dirname + "/www/js/src/jsfm");
exec("cordova serve", puts);