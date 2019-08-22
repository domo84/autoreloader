let address = "http://0.0.0.0:8010";
let socket = require("socket.io-client")(address);            

socket.on("connect", function()
{   
	socket.emit("reload", "web");
	socket.close();
}); 
