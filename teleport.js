/**
 *  node.js server which streams a single file on http://localhost:4545
 */

var http = require("http"),
	path = require("path"),
	fs = require("fs");

// Check for file	
var filename = process.argv[2];
if (!path.existsSync(filename)) {
	console.error("No such file: " + filename)
	process.exit(1);
}
var stat = fs.statSync(filename);
if (stat.isDirectory()) {
	console.error("Not a file: " + filename)
	process.exit(1);
}

// Start server
http.createServer(function(req, res) {
	var now = new Date().getTime();
	res.writeHead(200, {
		'Content-Length': stat.size,
		'Content-Disposition': 'attachment; filename="' + path.basename(filename) + '"'
	});
	var s = fs.createReadStream(filename);
	s.on("open", function(fd) {
		s.pipe(res);
	})
	s.on("end", function() {
		console.log("OK " + (new Date().getTime() - now) + "ms");
		process.exit(0);
	})
}).listen(4545);

console.log("Serving '" + path.basename(filename) + "' at http://localhost:4545" + "/\nCTRL + C to shutdown");
