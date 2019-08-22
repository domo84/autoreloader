#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));

if(argv.port == undefined) {
	console.log("Usage: npx autoreloader-nudger --port XXXX");
	return;
}

let address = `http://0.0.0.0:${argv.port}`;
let socket = require("socket.io-client")(address);            

socket.on("connect", function()
{   
	socket.emit("reload", "web");
	socket.close();
}); 
