"use strict";
var download = require("download");
var downloadStatus = require("download");
var https = require("https");
var xmlParser = require("xml2js").parseString;
var mkdirp = require('mkdirp');   

function downloadVideo(source, hd){
	// Retrieve xml from treehouse
	https.get(source, function(response){
		var xml = "";

		// Put all the xml data in a variable
		response.on("data", function(chunk){
			xml += chunk;
		});

		// When that's done, filter the xml
		// And add all the links in an array
		response.on("end", function(){
			xmlParser(xml, function (err, xmlObject) {
				var courseItem = xmlObject.rss.channel[0].item;
				var courseLinks = [];

				//I'm adding all the link
			   	courseItem.forEach(function(course){
			   		courseLinks.push(course.enclosure[0].$.url + hd);  	
			    });

			   	var moduleNumbering = 0;
			   	var previousModuleFolder = "";
			   	var courseFileNameNumbering;
			   	var firstVideoOfModule = true;

			   	courseLinks.forEach(function(course){
			   		var courseDetails = course.replace("https:\/\/teamtreehouse.com\/library\/", "").split("\/");
			   		var courseName = courseDetails[0];
			   		var courseModule = courseDetails[1];
			   		var courseVideo = courseDetails[2];
			   	
			   		if(courseModule !== previousModuleFolder){
			   			//Starting a new module
			   			moduleNumbering++;
			   			previousModuleFolder = courseModule;
			   			courseFileNameNumbering = 1;
			   		}
			   		
			   		//Form the name of the file with numbering so you can see the video's in the correct order
			   		//Also removing the token and options from the originel filename
			   		var courseFileName = courseFileNameNumbering + ". " + (courseDetails[3].substring(0, courseDetails[3].indexOf("?"))).replace("download", courseVideo); 
			   		courseFileNameNumbering++;
			   	
			   		var directory = courseName + "\/" + moduleNumbering + ". " + courseModule;

			   		//Make all the directories and download the video's in the correct directory
					//mkdirp.sync(directory);
			   		//new download({mode: "755"}).get(course).rename(courseFileName).dest(directory).run();
			   		if(courseLinks[0] === course){
			   			//Do a request to the course
			   			https.get(courseLinks[0], function(res){
			   				res.on("data", function(chunk){
			   					//But you get redirected, so doing a second request to the redirection url
			   					//Then read the content-length of the headers
			   					//The content-length is in format of bytes
			   					// 1 byte = 1024kb
			   					// 1kb = 1024mb
			   					// That's why we need to divide by 1048576 = 1024*1024
			   					// With the toFixed(2) we only show upto 2 decimals 
			   					https.get(res.headers.location, function(r){
			   						console.log((r.headers['content-length'] / 1048576).toFixed(2) + "mb");
			   						new download({mode: "755"}).get(course).rename(courseFileName).dest(directory).run(function(err, files){
			   							console.log(files[0].toString('utf-8'));
			   						});
			   					});
			   				});
			   			});
			   		}
			   		
			   	});		   	
			});
		});
	});
}

module.exports.downloadVideo = downloadVideo;