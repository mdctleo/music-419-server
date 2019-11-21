
const express = require("express");
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
const net = require('net');
const dgram = require("dgram");
var port = 80;
let users = {};
const OSC = require('osc-js');
const projWidth = 1920;
const projHeight = 1080;


app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/controller.js', express.static(__dirname + '/controller.js'));
app.use('/hammer', express.static(__dirname + '/node_modules/hammerjs'));
app.use('/body-scroll-lock.js', express.static(__dirname + '/node_modules/body-scroll-lock/lib/bodyScrollLock.js'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
// let max = net.createConnection({port: 4000});
let max = dgram.createSocket('udp4');

io.on('connection', function(socket){
    console.log('a user connected');
    users[socket.id] = [];
    socket.on('click', function(coordScreenArr){
        let coordinate = coordScreenArr[0];
        let screenSize = coordScreenArr[1];
        console.log(coordinate);
        console.log(screenSize);
        let scaledCoordinate = scaleCoordinates(coordinate, screenSize);
        console.log(scaledCoordinate);

        let message = new OSC.Message('/node', socket.id, scaledCoordinate.x, scaledCoordinate.y);
        let binary = message.pack();
        let dataBuf = new Buffer(binary);
        max.send(dataBuf, 0, binary.byteLength, 4000, '192.168.1.7');
        max.send(dataBuf, 0, binary.byteLength, 4000, '192.168.1.2');
    });
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
});

function scaleCoordinates(coordinate, screenSize) {
    let scaledX = coordinate.x / screenSize.screenWidth * projWidth;
    let scaledY = coordinate.y / screenSize.screenHeight * projHeight;
    return {
        x: scaledX,
        y: scaledY
    };
}

http.listen(port, function(){
    console.log('listening on *:' + port);
});


