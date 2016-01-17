"use strict";
var renderer = require("./renderer.js");
var downloadVideo = require("./download");
var queryString = require("querystring");
var url;
var hd;

function home(request, response){
	if(request.url === "/"){
		//Home page, this will show the actuall form to start a download
		if(request.method.toUpperCase() === "GET"){
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
	} 
	else if(request.url === "/download" && request.method.toUpperCase() === "POST"){
		//Received the url from the form, start the download
		request.on("data", function(postBody){
			var query = queryString.parse(postBody.toString());
			if(query.hd === "hd"){
				hd = "&hd=yes"; 
			}
			else{
				hd = "";
			}
			url = query.url.replace("itpc", "https");
			downloadVideo.downloadVideo(url, hd);
		});

		response.writeHead(200, {"Content-Type": "text/html"});
		renderer.view("head", response);
		renderer.view("download", response);
		renderer.view("foot", response);
	}
	else{
		//Any url that doesn't exist or shouldn't be accessed, redirect to the homepage
		response.writeHead(301, {Location: 'http://127.0.0.1:8080/'});
		response.end();
	}
}

module.exports.home = home;