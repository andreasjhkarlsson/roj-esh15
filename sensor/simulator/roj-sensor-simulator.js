var net = require('net');

if (process.argv.length < 3)
{
    console.log("Simulator usage: node roj-sensor-simulator.js <port>");
    process.exit();
}

var port = parseInt(process.argv[process.argv.length-1]);


var s1 = 0.0 // Sensor1
var s2 = 0.0 // Sensor2
var t = 0.0;

setInterval(function() {
        t += 10;
        var height = 3.0;
        var depth = (((Math.sin(t/100000) + 1.0) / 2.0) * 5.0) / 100.0; // 0-5 cm
        s1 = height - depth;
        s2 = height - depth + (Math.random() / 200.0); // Random variation by 0.5 cm
    
    }, 10);

var server = net.createServer(function(socket) {
    
    console.log("New connection from " + socket.remoteAddress);
    
    function handleCommand(command) {
        if (command == "H")
        {
            console.log("BLINK BLINK!");
            socket.write("OK");
        }
        
        if (command == "C")
        {
            console.log("Resetting simulator..");
            socket.write("OK");
            
        }
        
        if (command == "R")
        {
            console.log("Serving readout");
            socket.write(String(s1) + " " + String(s2));
            
        }
        
    }
    
    socket.on("data",function(data) {
        for(i=0;i<data.length;i+=1)
            handleCommand(String.fromCharCode(data[i]));
    });
});

console.log("Starting simulator on port: " + port);

server.listen(port, '0.0.0.0');
