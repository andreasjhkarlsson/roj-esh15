/**
 * Created by samthellman on 05/09/15.
 */

//http://localhost:63342/webapp/index.html



var stations;
var map;
var focusMalmslatt = {lat: 58.407728, lng: 15.599847};
var image = 'images/snowstick_sne_64px.png';

function initMap() {
    $.get( "/api/all", function(teststations) {
        stations = teststations;
        createMap();
        for(var i = 0; i < stations.length; i++){
            stations[i].traffic = 50;
            stations[i].depth = 30;
            stations[i].marker = createMarker(stations[i]);
            stations[i].info = createInfoWindow(stations[i]);
            createTrafficCircles(stations[i]);
            createDepthCircles(stations[i]);
            addHoverListener(stations[i]);
            updateDepth(stations[i]);

            $(".top-li .stations").append("<li><a class='station' href='#'>"+stations[i].name+"</a></li>");
        }


    });
}


function createInfoWindowHTML(station) {
    return '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<p>Station: ' + station.name + '</p>' +
        '<p>Snödjup: ' + station.depth + ' mm</p>' +
        '<p>Trafik: ' + station.traffic + ' fordon/h</p>' +
        '</div>'+
        '</div>';
    
}

function updateDepth(station){
    $.get("/api/depth?id="+station.id,function(sensorData){
        station.depth = sensorData.depth;
        station.info.setContent(createInfoWindowHTML(station));
    });
    
}

function addHoverListener(station){
    station.marker.addListener('mouseover', function(){
        station.info.open(map, station.marker);
    });
    station.marker.addListener('mouseout', function(){
        station.info.close(map, station.marker);
    });
}


function createMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: focusMalmslatt,
        zoom: 14
    });
}


function createInfoWindow(station){
    var contentString = createInfoWindowHTML(station);
    return new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 150
    });
}

function createMarker(station){
    return new google.maps.Marker({
        id: station.id,
        position: station.pos,
        map: map,
        icon: image
    })
}

function createTrafficCircles(station){
    new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: map,
        center: station.pos,
        radius: Math.sqrt(station.traffic) * 10
    });
}

function createDepthCircles(station){
    new google.maps.Circle({
        strokeColor: '#0000FF',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#0000FF',
        fillOpacity: 0.35,
        map: map,
        center: station.pos,
        radius: Math.sqrt(station.depth) * 10
    });
}

