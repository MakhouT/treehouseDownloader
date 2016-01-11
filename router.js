"use strict";
var renderer = require("./renderer.js");
var downloadVideo = require("./download");
var queryString = require("querystring");
var url;

function home(request, response){
	if(request.url === "/"){
		//Home page, this will show the actuall form to start a download
		if(request.method.toUpperCase() === "GET"){
			console.log("home");
			response.writeHead(200, {"Content-Type": "text/html"});
			renderer.view("head", response);
			renderer.view("form", response);
			renderer.view("foot", response);
			response.end();
		}
		else{
			//When you submit the form, we should start downloading the video
			// We take the data from the form parse it then send it to the download module
			request.on("data", function(postBody){
				var query = queryString.parse(postBody.toString());
				url = query.url.replace("itpc", "https");
				downloadVideo.downloadVideo(url);
			});
		}
	} else if(request.url === "/download"){
		if(request.method.toUpperCase() === "POST"){
			request.on("data", function(postBody){
				var query = queryString.parse(postBody.toString());
				url = query.url.replace("itpc", "https");
				downloadVideo.downloadVideo(url);
			});

			console.log("tijd om te downloaden");
			response.writeHead(200, {"Content-Type": "text/html"});
			renderer.view("head", response);
			renderer.view("download", response);
			renderer.view("foot", response);
		}
		else{
			console.log("time to redirect to home");
		}
	}
}

function download(request, response){
	if(request.url.toLowerCase() === "/download"){
		console.log("downloading");
		response.writeHead(200, {"Content-Type": "text/html"});
		renderer.view("head", response);
		renderer.view("download", response);
		renderer.view("foot", response);
		
		response.end();
	}	
}

module.exports.home = home;
module.exports.download = download;