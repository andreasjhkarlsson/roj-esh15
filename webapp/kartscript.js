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
            stations[i].circle = createDepthCircle(stations[i]);
            //createTrafficCircles(stations[i]);
            addHoverListener(stations[i]);
            //addClickListener(stations[i]);
            updateDepth(stations[i]);

            //Skapar DOM-element (<li>) i vänstermenyn med stationsnamn och stations-id
            $(".top-li .stations").append("<li id="+stations[i].id+"><a class='station' href='#'>"+stations[i].name+"</a></li>");
        }


    });
}

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
        station.depth = roundFloat(sensorData.depth * 100.0, 1);
        station.info.setContent(createInfoWindowHTML(station));
    });
}

function updateCircle(station){
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
            radius: Math.sqrt(station.depth) * 10
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

//function addClickListener(station){
//    station.marker.addListener('click', function(){
//        station.info.open(map, station.marker);
//    });
//}

function createMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        center: focusMalmslatt,
        zoom: 13,
        //Gömmer google maps UI
        disableDefaultUI: true
    });

    // init directions service
    var dirService = new google.maps.DirectionsService();
    var dirRenderer = new google.maps.DirectionsRenderer({suppressMarkers: true});
    dirRenderer.setMap(map);

// highlight a street
    var request = {
        origin: "58.406393, 15.584572",
        destination: "58.409972, 15.634494",
        //waypoints: [{location:"48.12449,11.5536"}, {location:"48.12515,11.5569"}],
        travelMode: google.maps.TravelMode.DRIVING
    };
    dirService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            dirRenderer.setDirections(result);
        }
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

function createDepthCircle(station){
    new google.maps.Circle({
        strokeColor: '#7CB8C8',
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: '#7CB8C8',
        fillOpacity: 0.35,
        map: map,
        center: station.pos,
        radius: Math.sqrt(station.depth) * 20
    });
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