var express = require('express');

var net = require('net');

var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('roj.db');

var webappDir = "../webapp";

function sendSensorCommand(ip,port,command,onSuccess) {
    var client = new net.Socket();

    
    client.on("error", function(error) {
       console.log("Couldn't connect to sensor "+ip+":"+port); 
    });
    
    client.connect(port, ip, function() {
        client.write(command);
    });

    client.on('data', function(data) {
        onSuccess(data.toString());
        client.destroy(); // kill client after server's response
    }); 

};

function getCurrentDepth(ip,port,onSuccess) {
    sendSensorCommand(ip,port,"R",function(response) {
        var values = response.split(" ");
        onSuccess ([parseFloat(values[0]),parseFloat(values[1])]);
    });
}

function sampleStation(dbStation,onDone) {
    var addressComponents = dbStation.ADDRESS.split(":");
    var ip = addressComponents[0];
    var port = parseInt(addressComponents[1]);
    getCurrentDepth(ip,port,function(values) {
        var meanValue = (values[0] + values[1]) / 2.0;
        var snowDepth = dbStation.REFERENCE_VALUE - meanValue;

        console.log(dbStation.NAME+" reported depth of "+(snowDepth*100.0)+ " cm");
        var statement = db.prepare("INSERT INTO READING(STATION,TIMESTAMP,DEPTH) VALUES(?,CURRENT_TIMESTAMP ,?)");
        statement.run(dbStation.ID,snowDepth);
        statement.finalize();
    });   
}

function sampleAllStations() {
    console.log("Start sampling round robin...");
    db.each("SELECT * FROM STATION;",function(err,row) {
        sampleStation(row,function(){});
    });
}

setInterval(sampleAllStations,1000);

var app = express();

app.use(express.static(__dirname + '/' + webappDir));


function apiPath(endpoint) {
    return "/api/" + endpoint;
}


app.get(apiPath("all"), function (req, res) {
    console.log("/all");

    var result = [];
    
    db.each("SELECT * FROM STATION;",function(err,row) {
        
        var station = {
            id: row.ID,
            name: row.NAME,
            pos: {lat: row.LAT, lng: row.LONG}
        };
        
        result.push(station);
    }, function() {
        res.json(result);   
    });
});

app.get(apiPath("depth"),function(req,res) {
    
    var id = req.query.id;
    db.all("SELECT * FROM READING WHERE STATION = ? ORDER BY TIMESTAMP DESC LIMIT 1;",id,function(err,rows) {
        
        if (rows.length < 1) {
            res.json({});
        } else {
            res.json( {
                depth: rows[0].DEPTH,
                timestamp: rows[0].TIMESTAMP
            });             
        }

    });
});

app.post(apiPath("calibrate"),function(req,res){
    console.log("calibrate");
    var id = req.query.id;
    db.all("SELECT * FROM STATION WHERE ID = ?",id,function(err,rows) {
        console.log(rows[0].NAME); 
        
        db.run("DELETE FROM READING WHERE STATION = ?",rows[0].ID);
        var addressComponents = rows[0].ADDRESS.split(":");
        var ip = addressComponents[0];
        var port = parseInt(addressComponents[1]);        
        
        getCurrentDepth(ip,port,function(values) {
            
            var meanValue = (values[0] + values[1]) / 2.0; 
                    
            db.run("UPDATE STATION SET REFERENCE_VALUE = ? WHERE ID = "+id,meanValue);
            
        });

        
        res.json({});
    });
    
    
    
});

app.listen(3000, function () {
  console.log('Server listening on', 3000)
});
