"use strict";
var fs  = require("fs");

//Renders the files that are passed as arguments
function view(templateName, response){
	var fileContents = fs.readFileSync("./views/" + templateName + ".html");
	response.write(fileContents);
}

module.exports.view = view;