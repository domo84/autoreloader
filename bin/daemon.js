const io = require("socket.io")(8010);
const name = "DAEMON";

// const attach = require('neovim-client'); // npm install neovim-client
// const net = require("net");

console.log(name, "started");

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

	socket.on("xerror", function(errors)
	{
		let vim = net.Socket();

		console.log(name, "client", socket.id, "sent error", JSON.stringify(errors[0]));

		vim.on("connect", function()
		{
			attach(vim, vim, function(err, nvim)
			{
				let qflist = [];

				errors.forEach(function(error)
				{
					qflist.push(
					{
						lnum: error.lineNumber,
						col: error.colNumber,
						filename: error.fileName.replace("src/", ""),
						text: error.functionName
					});
				});

				let json = JSON.stringify(qflist);
				let cmd = "call setqflist(" + json + ")";

				nvim.command(cmd, function(err, res)
				{
					if(err)
					{
						console.error(name, "neovim-client", "error", err);
					}
					vim.destroy();
				});
				/*
				nvim.command('vsplit', function(err, res)
				{
					socket.destroy();
					// process.exit(0);
				}); 
				*/
			});
		});

		vim.on("error", function(e)
		{
			console.error("error", JSON.stringify(e));
		});

		vim.connect("/tmp/kek");
	});

	socket.on("disconnect", function(reason)
	{
		console.log(name, "client", socket.id, "disconnected");
	});
});
