console.log("server is starting");

var express = require("express");

var app = express();

var server = app.listen(5000, listening);

function listening()
{
    console.log("listenning...");
}

app.use(express.static("public"))