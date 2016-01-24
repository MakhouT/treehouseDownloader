"use strict";
var xray = require("x-ray");
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
			var protocol = query.url.substring(0,7);
			var hdOption = query.hd;

			//If HD option is enabled we add that option to the final url
			if(hdOption === "hd"){
				hd = "&hd=yes"; 
			}
			else{
				hd = "";
			}
			
			//if the protocol is itpc then we're downloading a single track
			//else we're downloading a whole track
			if(protocol === "itpc://"){
				//url = query.url.replace("itpc", "https");
				//downloadVideo.downloadVideo(url, hd);
			}
			else{
				var token = query.url.substring(query.url.indexOf("?")+1);
				var trackUrl = query.url.substring(0, query.url.indexOf("?"));	

				var x = xray();
				x(trackUrl, "#track-steps li.card.course a.card-title", ["@href"])(function(err, data){
					data.forEach(function(course){
						console.log(course + ".rss?feed_token=" + token);
					});
				});

			}
			
			//url = query.url.replace("itpc", "https");
			//downloadVideo.downloadVideo(url, hd);
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