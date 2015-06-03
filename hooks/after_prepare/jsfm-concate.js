#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var UglifyJS = require('cordova-minify/node_modules/uglify-js');
var CleanCSS = require('cordova-minify/node_modules/clean-css');
var ImageMin = require('cordova-minify/node_modules/image-min');
var imagemin = new ImageMin();
var cssMinifier = new CleanCSS({
    keepSpecialComments: 0
});


var deleteList = [];
var rootDir = process.argv[2];
var platformPath = path.join(rootDir, 'platforms');
var platform = process.env.CORDOVA_PLATFORMS;
var cliCommand = process.env.CORDOVA_CMDLINE;
var isRelease = true;
var minifest = {};
var isRelease = (cliCommand.indexOf('--release') > -1); // comment the above line and uncomment this line to turn the hook on only for release
var fs = require('fs');
var path = require('path');
var UglifyJS = require('cordova-minify/node_modules/uglify-js');
var CleanCSS = require('cordova-minify/node_modules/clean-css');
var ImageMin = require('cordova-minify/node_modules/image-min');
var imagemin = new ImageMin();
var cssMinifier = new CleanCSS({
    keepSpecialComments: 0
});

var appVersion = fs.readFileSync(path.join(rootDir, "config.xml"))
	.toString('utf-8')
	.match(/widget(.*?)version=(.*?)\s/i)[2].trim().replace(/"|'/gim, "");
var fileVersion;
var processed_top_files = [];

var rootDir = process.argv[2];
var platformPath = path.join(rootDir, 'platforms');
var platform = process.env.CORDOVA_PLATFORMS;
var cliCommand = process.env.CORDOVA_CMDLINE;

var IncludedInside = [], circulerReference = {};

function mkdir( path, root ) {
	if (!path) {
		return;
	}
	var dirs = path.split('/'), dir = dirs.shift(), root = (root || '') + dir + '/';
	try {
		fs.mkdirSync(root);
	}
	catch (e) {
		// dir wasn't made, something went wrong
		if (!fs.statSync(root).isDirectory())
			throw new Error(e);
	}
	return !dirs.length || mkdir(dirs.join('/'), root);
}

function Concatenation( sourceDir, destinDir ) {
	var isConcatinatedAdded = false, concatenatedString = "", ConcatenatedFiles = {};
	function executeFile( data, updateFile, path_file1 ) {
		var result, classIndex = 0;
		var d = data.replace(/\s/g, ""), reg;
		if (d.indexOf("prototype.$add=function(obj,key,val,isConst)") != -1) {
			concatenatedString += data;
			return data;
		}
		result = /fm.class\((.*?)\)/gi.exec(d) || /fm.Interface\((.*?)\)/gi.exec(d) || /fm.AbstractClass\((.*?)\)/gi.exec(d);
		if (result) {
			classIndex = result.index;
			result = result[1];
			var temp = result.replace(/"/g, "").split(">");
			if(temp.length === 2) {
				result = temp[1].match(/(.*?),/)[0].replace(/\s|,/g,"");
			}
			else {
				result = result.substring(1, result.length - 1).split(",")[1];
				if(result && result.indexOf('function') !== -1) {
					result = null;
				}
				if(result) {
					result = result.substring(1).trim();
				}
			}
			if (result) {
				result = result.replace(/\./g, "/") + ".js";
				deleteList.push((sourceDir + result).replace(/"|'/g, ""));
				processFile((sourceDir + result).replace(/"|'/g, ""), updateFile, result);
			}
		}

		reg = /fm.include\((.*?)(function|\))/gi;
		var index,temp;
		while (result = reg.exec(d)) {
			index = result.index;
			result = result[1];
			result = result.substring(1, result.length - 1).replace(/\./g, "/") + ".js";
			if (index > classIndex) {
				temp = result.split(",")[0];
				console.log(temp, "classIndex");
				if(temp.match(/"/gm) == null) continue;
				IncludedInside.push(temp.replace('"',""));
				continue;
			}
			deleteList.push((sourceDir + result.replace('"',"")).replace(/"|'/g, ""));
			processFile((sourceDir + result.replace('"',"")).replace(/"|'/g, ""), updateFile, result);
		}

		reg = /fm.depend\((.*?)(function|\))/gi;
		var index,temp;
		while (result = reg.exec(d)) {
			index = result.index;
			result = result[1];
			result = result.substring(1, result.length - 1).replace(/\./g, "/") + ".js";
			temp = result.split(",")[0];
			console.log(temp, "classIndex");
			if(temp.match(/"/gm) == null) continue;
			IncludedInside.push(temp.replace('"',""));
			continue;
		}


		reg = /fm.import\((.*?)\)/gi;
		while (result = reg.exec(d)) {
			result = result[1];
			result = result.substring(1, result.length - 1).replace(/\./g, "/") + ".js";
			deleteList.push((sourceDir + result).replace(/"|'/g, ""));
			processFile((sourceDir + result).replace(/"|'/g, ""), updateFile, result);
		}

		reg = /fm.Implements\((.*?)\)/gi;
		if (result = reg.exec(d)) {
			result = result[1].split(",");
			var temp;
			for ( var k = 0; k < result.length; k++) {
				temp = result[k].substring(1, result[k].length - 1).replace(/\./g, "/") + ".js"
				deleteList.push((sourceDir + temp).replace(/"|'/g, ""));
				processFile((sourceDir + temp).replace(/"|'/g, ""), updateFile, temp);
			}
		}

		reg = /\/\/TMPL:START(.*?):END/gi;
		data = data.replace(reg, function(){
			var key = arguments[1].trim().split("|");
			var html = fs.readFileSync(sourceDir + key.join("/")).toString('utf-8').replace(/\n/g, "");
			return "Cache.getI().addTmpl('" + html + "', '"+ key[1] +"');";
		});

		if (!isConcatinatedAdded) {
			isConcatinatedAdded = true;
			concatenatedString += "\nfm.isConcatinated = true; \n fm.version=" + fileVersion + ";\n";
		}
		if (data.indexOf("\/\/\/concatelocation\/\/\/") !== -1) {
			concatenatedString = data.replace("\/\/\/concatelocation\/\/\/", concatenatedString);
		} else {
			concatenatedString += data + "\n";
		}
		return data;
	}

	function processFile( path, updateFile, filepath ) {
		if (!ConcatenatedFiles[path]) {
			console.log("processing", path, filepath);
			ConcatenatedFiles[path] = true;
			try {
				var fileData = fs.readFileSync(path.replace(/"|'/g, "")).toString('utf-8');
				//updateFile(path, fileData);
				//isRelease && deleteFile(path);
				executeFile(fileData, updateFile, filepath);
			}
			catch (e) {
				console.error(e.stack);
			}
		}
	}

	function deleteFile( dir ) {
		console.log("deleting", dir);
		fs.unlink(dir.replace(/"|'/g, ""), function( ) {
		// dfdfdf
		});
	}
	function clone(obj){
		var newobj = {};
		for(var k in obj){
			newobj[k]= obj[k];
		}
		return newobj;
	}
	this.concatenateJSFiles = function( sFiles, concate, updatefile ) {
		ext = "js";
		backSlash = "";
		var len = sFiles.length;
		var dFile = sFiles[len - 1];
		mkdir(dFile.substring(0, dFile.lastIndexOf("/")), destinDir);

		concatenatedString += "";

		ConcatenatedFiles = concate;
		for ( var i = 0; i < sFiles.length; i++) {
			processFile(sourceDir + sFiles[i], updatefile, sFiles[i]);
		}

		concatenatedString += ";\n\n fm.isConcatinated = false;\n";
		var temp1 = [];
		var kk = 100, strlen = sourceDir.length;
		for(var k in ConcatenatedFiles){
			temp1.push("js.bundle.ceb.asset"+ (kk++) +" = "+ k.substring(strlen));
		}
		//var crypto = require('crypto');
		//var hash = crypto.createHash('md5').update(concatenatedString).digest('hex');
		//minifest[destinDir + dFile] = hash;
		fs.writeFileSync(destinDir + dFile, concatenatedString, 'utf8', function( e ) {
			console.log("response", e, arguments);
		});
		//saveminiFied(concatenatedString, dFile);
		var s, fname;
		//console.log("IncludedInside", IncludedInside);
		while (IncludedInside.length) {
			fname = IncludedInside.pop();
			if (fname.indexOf('http') != -1) {
				continue;
			}
			s = (fname + ".js").replace(".js.js", ".js").replace(/"|'/g, "");
			if(processed_top_files.indexOf(sourceDir+s) !==-1){
				continue;
			}
			processed_top_files.push(sourceDir+s);
			console.log(s, "frame");
			new Concatenation(sourceDir, destinDir).concatenateJSFiles([ s ], clone(ConcatenatedFiles), updatefile );
		}
	};
}

function createJFM( lastRun ) {
	function executeFile( data ) {
		var imports = [ 'me' ], add = true, result;
		var d = data.replace(/\s/g, ""), reg = /fm.class|fm.AbstractClass/mi;
		if (d.indexOf("prototype.$add=function(obj,key,val,isConst)") != -1) {
			return;
		}
		if (!d.match(reg)) {
			return;
		}
		if (d.indexOf("this.setMe=function(_me){me=_me;}") != -1) {
			add = false;
		}

		reg = /fm.import\((.*?)\)/gi;
		while (result = reg.exec(d)) {
			result = result[1];
			result = result.substring(1, result.length - 1).split(".");
			imports.push(result[result.length - 1]);
		}
		reg = /fm.class\((.*?)\)/gi;
		if (result = reg.exec(d)) {
			//console.log("result",result);
			result = result[1];
			var temp = result.replace(/"/g, "").split(">");
			if(temp.length === 2) {
				result = temp[1].match(/(.*?),/)[0].replace(/\s|,/g,"");
			}
			else {
				result = result.substring(1, result.length - 1).split(",")[1];
				if(result && result.indexOf('function') !== -1) {
					result = null;
				}
				if(result) {
					result = result.substring(1).trim();
				}
			}
			if (result) {
				result = result.replace(/\./g, "/") + ".js";
				imports.push(result[result.length - 1]);

			}
		}
		reg = /fm.abstractclass\((.*?)\)/gi;
		if (result = reg.exec(d)) {
			//console.log("result",result);
			result = result[1];
			var temp = result.replace(/"/g, "").split(">");
			if(temp.length === 2) {
				result = temp[1].match(/(.*?),/)[0].replace(/\s|,/g,"");
			}
			else {
				result = result.substring(1, result.length - 1).split(",")[1];
				if(result && result.indexOf('function') !== -1) {
					result = null;
				}
				if(result) {
					result = result.substring(1).trim();
				}
			}
			if (result) {
				result = result.replace(/\./g, "/") + ".js";
				imports.push(result[result.length - 1]);

			}
		}
		if (add) {
			reg = /(=|,)\s*function\s*\((.*?){/mi;
			return data.replace(reg, function (){
				return arguments[1]+" function (" + imports.join(", ") + "){this.setMe=function(_me){me=_me;};"
			});
		}else {
			reg = /(=|,)\s*function\s*\((.*?)\)/mi;
			return data.replace(reg, function  () {
				return arguments[1] +" function (" + imports.join(", ") + ")"
			});
		}
	}

	this.create = function( sFile, d ) {

		var stat = fs.statSync(sFile);
		//do not modify file if it has no change.
		if((new Date(stat.mtime).getTime()) < lastRun ){
			return;
		}
		d = d || fs.readFileSync(sFile).toString('utf-8');
		var data = executeFile(d);
		data && fs.writeFileSync(sFile, data, 'utf-8');
	};
}

function walk( dir, cb, lastRun ) {
	var stat, file, list = fs.readdirSync(dir);
	if (list) {
		for ( var l = 0; l < list.length; l++) {
			file = list[l];
			if (!file)
				continue;
			file = dir + '/' + file;
			stat = fs.statSync(file);
			if (stat && stat.isDirectory()) {
				walk(file, cb, lastRun);
			}
			else {
				(new Date(stat.mtime).getTime()) > lastRun && cb(file);
			}
		}
	}
}
function list(val) {
  return val.split(",");
}
function runall( source, dest, file ) {
		console.log(source, dest, file);
	var updateFile = new createJFM(0);
	try{
		var ajt = new Concatenation(source, dest);
		processed_top_files.push(source+file);
		ajt.concatenateJSFiles([file], {},  updateFile.create);
	}catch(e){
		console.log(e);
	}
}


switch (platform) {
    case 'android':
        platformPath = path.join(platformPath, platform, "assets", "www");
        break;
    case 'ios':
    case 'browser':
        platformPath = path.join(platformPath, platform, "www");
        break;
    default:
        console.log('Hook currently supports only Android and iOS');
        return;
}

var foldersToProcess = ['js'];
var destin = path.join( platformPath, 'js')+"/";
try{
	fs.unlinkSync(path.join( platformPath, 'js', "jscont")+"/");
} catch (e) {

}
if(!isRelease) {
	destin = path.join( platformPath, 'js', "jscont")+"/";
	try{
		fs.mkdirSync(destin);
	} catch(e) {
		console.error(e);
	}
}



var exec = require('child_process').exec;
var counter = 0;
function generateTemplate(dir, generatedDir) {
	fs.mkdir(generatedDir);
	var stat, file, list = fs.readdirSync(dir);
	if (list) {
		for ( var l = 0; l < list.length; l++) {
			file = list[l];
			if (!file)
				continue;
			var filename = file;
			file = dir + '/' + file;
			stat = fs.statSync(file);
			if (stat && stat.isDirectory()) {
				generateTemplate(file, generatedDir  + "/"+ filename);
			}
			else {
				if(file.indexOf(".DS_Store")!=-1) continue;
				(function(file, filename){
					counter++;
					fs.writeFileSync(file, fs.readFileSync(file).toString('utf-8').replace(/\>*\\n+(\s)*\<*/gm, '><'));
					var command = "handlebars " + file + " -f " + path.join(generatedDir, filename.replace(".html", ".js"));
					console.log(command);
					exec(command, function (e, b, c){
						try {
							fs.unlink(file);
						}catch (e){
							console.error(e);
						}
						counter--;
						if(counter === 0) {
							jsManage();
						}
						console.log(e, b, c);
					});
				})(file, filename);
			}
		}
	}
}

//generateTemplate(path.join(platformPath, "html", "html", "templates"), path.join(platformPath, 'js', "handlebars"));

function jsManage() {
	foldersToProcess.forEach(function(folder) {
		var configdir = path.join(platformPath, folder, "src/com/anoop/wikiread/app/Config.js");
		var data = fs.readFileSync(configdir).toString('utf-8');
		data = data.replace("{{APP_VERSION}}", appVersion)
			.replace("\"{{BROWSER_TESTING}}\"", (platform === 'browser' && process.env.BROWSER_TESTING) || false);
		fs.writeFileSync(configdir, data);
		if (isRelease){
	   		runall(path.join(platformPath, folder)+"/", destin, "Starter.js");
		}
	});
	if(isRelease) {
		var dupl = {};
		deleteList.filter(function(f){
			if(dupl[f]) return false;
			dupl[f]=true;
			return true;
		}).forEach(function(f){
			fs.unlink(f, function(err){
				console.log("deleting file ", f, err);
			})
		});
	}
}
console.log("msx");
var command = "msx -x  js "+ path.join(platformPath, "js/src/com/anoop/wikiread", "view")+ " " + path.join(platformPath, "js/src/com/anoop/wikiread","view");
exec(command, function(a, b){
	console.log(a,b);
});
var command = "msx -x  js "+ path.join(platformPath, "js/src/com/anoop/intro", "view")+ " " + path.join(platformPath, "js/src/com/anoop/intro","view");
exec(command, function(a, b){
	console.log(a,b);
});

jsManage();

function copyOnBoardingImages() {
	var dir = platform;
	if(platform == 'browser'){
		dir = 'ios';
	}
	var sourceDir = path.join(rootDir, "res", "onboarding", dir);
	var destinDir = path.join(platformPath, "img", 'onboarding');
	//fs.mkdirSync(destinDir);
	var fse = require('fs-extra')
	fse.copy(sourceDir, destinDir, function (err) {
	  if (err) return console.error(err)
	  console.log('success!')
	})
}
//copyOnBoardingImages();
