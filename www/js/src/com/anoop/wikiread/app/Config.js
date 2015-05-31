fm.Package("com.anoop.wikiread.app");
fm.Interface("Config", function (){
	'use strict';
	this.proxy_server = 'http://localhost:8081/';
	this.server = "http://52.10.221.103:4321/";
	this.staging_server =  "http://52.10.221.103:4321/"
	//this.staging_server = 'http://localhost:3000/';
	this.app_version = "{{APP_VERSION}}";
	this.testing_browser_server = "{{BROWSER_TESTING}}";
	this.require_proxy = cordova.platformId == 'browser';

});