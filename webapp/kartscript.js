/**
 * Created by samthellman on 05/09/15.
 */

//http://localhost:63342/webapp/index.html

var stations;
var map;
var focusMalmslatt = {lat: 58.407728, lng: 15.599847};
var image = 'images/snowstick_sne_64px.png';

$(document).ready(function(){
    setInterval(function(){
        for(var i = 0; i < stations.length; i++){
            updateDepth(stations[i]);
            updateCircle(stations[i]);
        }

    }, 1000);

    $('.modal-trigger').leanModal();
});


var trafficLayer;

function initMap() {
    $.get( "/api/all", function(teststations) {
        stations = teststations;
        createMap();
        trafficLayer = new google.maps.TrafficLayer();
        for(var i = 0; i < stations.length; i++){
            updateDepth(stations[i]);
            createCircle(stations[i]);
            stations[i].marker = createMarker(stations[i]);
            stations[i].info = createInfoWindow(stations[i]);
            addHoverListener(stations[i]);
            addClickListener(stations[i]);


            //Skapar DOM-element (<li>) i vänstermenyn med stationsnamn och stations-id
            $(".top-li .stations").append("<li id="+stations[i].id+"><a class='station' href='#'>"+stations[i].name+"</a></li>");
        }

        //displayDirections();
    });
}

$('#trafficToggle').click(function() {
 
    if (trafficLayer.getMap() == null) {
        trafficLayer.setMap(map);
    }
    else {
        trafficLayer.setMap(null);
    }

})

function createInfoWindowHTML(station) {
    return '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<p><i class="material-icons" style="float:right;">settings_remote</i>Station: ' + station.name + '</p>' +
        '<p>Snödjup: ' + station.depth + ' mm </p>' +
        '</div>'+
        '</div>';
    
}

function updateDepth(station){
    $.get("/api/depth?id="+station.id,function(sensorData){
        station.depth = Math.abs(roundFloat(sensorData.depth * 1000.0, 1));
        station.info.setContent(createInfoWindowHTML(station));
    });
}

function updateCircle(station){
    station.circles.setRadius(Math.sqrt(Math.abs(station.depth)) * Math.sqrt(Math.abs(station.depth)) * 30);
}

function createCircle(station){
    $.get("/api/depth?id="+station.id,function(sensorData){
        station.depth = roundFloat(sensorData.depth * 100.0, 1);
        station.circles = new google.maps.Circle({
            strokeColor: '#7CB8C8',
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: '#7CB8C8',
            fillOpacity: 0.35,
            map: map,
            center: station.pos,
            radius: Math.sqrt(Math.abs(station.depth)) * Math.sqrt(Math.abs(station.depth)) * 30
        });
    });
}

function roundFloat(n,precision) {
    var p = Math.pow(10,precision);
    return Math.round(n*p)/p;
}

function addHoverListener(station){
    station.marker.addListener('mouseover', function(){
        station.info.open(map, station.marker);
        highlightStationMenu(station);
    });
    station.marker.addListener('mouseout', function(){
        station.info.close(map, station.marker);
        resetStationMenu();
    });
}

function calibrateStation(id){
    $.post("/api/calibrate?id=" + id);
}




function addClickListener(station){
    station.marker.addListener('click', function(){
        var html = '<a class="waves-effect waves-light btn modal-trigger" href="#modal1">Modal</a>';
        html += '<div id="modal1" class="modal">';
        html += '<div class="modal-content"><h5>Kalibrering</h5><p>Mätstationen omkalibreras och äldre värde förloras</p>';
        html += '</div><div class="modal-footer">';
        html += '<a href="#" onclick="calibrateStation(' + station.id + ')"  id="calibrate" class="modal-action modal-close waves-effect waves-green btn-flat">Acceptera</a>';
        html += '</div></div>';
        document.getElementById("modals").innerHTML = html;
        $('#modal1').openModal();
    });
}

function createMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: focusMalmslatt,
        zoom: 13,
        //Gömmer google maps UI
        disableDefaultUI: true
    });
}

function createInfoWindow(station){
    var contentString = createInfoWindowHTML(station);
    return new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 100
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



function highlightStationMenu(station) {
    $(".top-li .stations > li").each( function( index, element ){
        //Ändrar bakgrundsfärg i menyn (för element med matchande id) då muspekaren hovrar över kartmarkör
        if ($(this).get(0).id == station.id) {
            $(this).css("background-color", "#7CB8C8");
        }
    });
}

function resetStationMenu() {
    $(".top-li .stations > li").each(function (index, element) {
        //Sätter bakgrundsfärgen till vit för listelementen med stationsnamn i vänstermenyn (kallas då muspekaren lämnar markör på kartan)
        $(this).css("background-color", "#fff");
    });
}

//Bounce animation for map markers
$(".stations").on('mouseenter','li', function () {
    var menuItemId = $(this).get(0).id - 1;

    stations[menuItemId].marker.setAnimation(google.maps.Animation.BOUNCE);
}).on('mouseleave', 'li', function () {
    var menuItemId = $(this).get(0).id - 1;

    stations[menuItemId].marker.setAnimation(google.maps.Animation.NULL);
    });

//Visa highlights för vägar
/*
function displayDirections() {
    var directionDisplay;
    var directionsService = new google.maps.DirectionsService();

    var start = new google.maps.LatLng(58.407728, 15.599847);

    function renderDirections(result) {
        var directionsRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
        directionsRenderer.setMap(map);
        directionsRenderer.setDirections(result);
    }

    function requestDirections(start, end) {
        directionsService.route({
            origin: start,
            destination: end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        }, function(result) {
            renderDirections(result);
        });
    }

    requestDirections('(58.406393, 15.584572)', '(58.409972, 15.634494)');
    requestDirections('(58.419614, 15.615540)', '(58.409489, 15.631074)');
    requestDirections('(58.420134, 15.596547)', '(58.408835, 15.609144)');
}*/

