"use strict";
var router = require("./router.js");
var http = require("http");

http.createServer(function(request, response){
	router.home(request, response);
	//router.download(request, response);
}).listen(8080, "127.0.0.1");
console.log("Server up and running on 127.0.0.1:8080");