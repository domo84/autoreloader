# Automatically reload [the webpage you are developing]

A tool for automating the process of refreshing the webpage you just updated. It is using sockets to communicate.

**PARTS:**
- `daemon`: Starts a websocket server on assigned port.
- `nudger`: A client that connects to the daemon and sends a reload event.
- `client` (not supplied): A client that connects to the daemon and listens for a reload event and triggers `location.reload()`. Use code snippet or a browser extension.

## Usage

Install the package

```
npm install autoreloader
```

Start the daemon

```
npx autoreloader-daemon --port 9000
```

Nudge the daemon

```
npx autoreloader-nudger --port 9000
```

**PRO TIP**: Use `inotifywait` for monitoring changes to your generated files.

```bash
#/bin/bash
while inotifywait -r -e modify ./gen; do
	npx autoreloader-nudger --port 9000
done
```

### Client snippet

Include this code somewhere in your HTML on the website. Also make sure to grab the [socket.io-client](https://github.com/socketio/socket.io-client).

```html
<script src="/socket.io.js"></script>
<script>
const host = "0.0.0.0"; // Matches all the network interfaces
const port = 9000; // Should match daemon port
const socket = io(`http://${host}:${port}`);
socket.on("connect", function() {
	console.debug("autoreloader", "connected");
	socket.emit("room", "web");
	socket.on("reload", function() {
		location.reload();
	});
});
</script>
```
