var net = require('net');

if (process.argv.length < 3)
{
    console.log("Simulator usage: node roj-sensor-simulator.js <port>");
    process.exit();
}

var port = parseInt(process.argv[process.argv.length-1]);


var s1 = 2.300
var s2 = 2.308

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
