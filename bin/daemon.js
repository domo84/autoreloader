#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const name = "DAEMON";

if(argv.port == undefined) {
	console.log("Usage: npx autoreloader-daemon --port XXXX");
	return;
}

const io = require("socket.io")(argv.port);
console.log(name, "started", `port:${argv.port}`);

io.on("connection", function(socket)
{
	console.log(name, "client", socket.id, "connected");

	socket.on("room", function(room)
	{
		console.log(name, "client", socket.id, "has joined", room);
		socket.join(room);
	});

	socket.on("reload", function(room)
	{
		socket.broadcast.to(room).emit("reload");
		console.log(name, "client", socket.id, "says reload");
	});

	socket.on("disconnect", function(reason)
	{
		console.log(name, "client", socket.id, "disconnected");
	});
});
