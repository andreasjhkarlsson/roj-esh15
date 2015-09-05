/**
 * Created by samthellman on 05/09/15.
 */


var linkopingstationer = {
    malmslatt: {
        pos: {lat: 58.407728, lng: 15.599847},
        address: 'Malmslättsvägen',
        traffic: 100,
        depth: 10
    },
    universitetsvägen: {
        pos: {lat: 58.397790, lng: 15.571051},
        address: 'Universitetsvägen',
        traffic: 20,
        depth: 15
    },
    drottninggatan: {
        pos: {lat: 58.409207, lng: 15.628723},
        address: 'Drottninggatan',
        traffic: 90,
        depth: 7
    },
    industrigatan: {
        pos: {lat: 58.415945, lng: 15.587524},
        address: 'Industrigatan',
        traffic: 75,
        depth: 2
    },
    djurgardsgatan: {
        pos: {lat: 58.400447, lng: 15.609149},
        address: 'Djurgårdsgatan',
        traffic: 50,
        depth: 24
    }
};

var map;
var image = 'images/snowstick-1.png';

function initMap() {
    // Create map, zoom  and center on default station
    map = new google.maps.Map(document.getElementById('map'), {
        center: linkopingstationer.malmslatt.pos,
        zoom: 14
    });

    var station1 = new google.maps.Marker({
        position: linkopingstationer.malmslatt.pos,
        map: map,
        icon: image
    });
    var station2 = new google.maps.Marker({
        position: linkopingstationer.universitetsvägen.pos,
        map: map,
        icon: image
    });
    var station3 = new google.maps.Marker({
        position: linkopingstationer.drottninggatan.pos,
        map: map,
        icon: image
    });
    var station4 = new google.maps.Marker({
        position: linkopingstationer.djurgardsgatan.pos,
        map: map,
        icon: image
    });
    var station5 = new google.maps.Marker({
        position: linkopingstationer.industrigatan.pos,
        map: map,
        icon: image
    });

//        for (var station in linkopingstationer) {
//            // Create markers
//            for (var i = 0; i < linkopingstationer.length; ++i) {
//                var station[i] = new google.maps.Marker({
//                    position: linkopingstationer[i].pos,
//                    map: map,
//                    icon: image
//                });
//            }
//
//        }

    for (var station in linkopingstationer) {
        // Create circle indicating traffic
        var trafficCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map: map,
            center: linkopingstationer[station].pos,
            radius: Math.sqrt(linkopingstationer[station].traffic) * 10
        });
    }
    for (var station in linkopingstationer) {
        // Create cicle indicating snow depth
        var depthCircle = new google.maps.Circle({
            strokeColor: '#0000FF',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#0000FF',
            fillOpacity: 0.35,
            map: map,
            center: linkopingstationer[station].pos,
            radius: Math.sqrt(linkopingstationer[station].depth) * 20
        });
    }

    // temporary info window text
    var contentString = '<div id="content">'+
        '<div id="siteNotice">'+
        '</div>'+
        '<p id="depthText" class="firstHeading">Depth: 11mm</p>'+
        '<p id="trafficText" class="firstHeading">Traffic: 20 v/min</p>'+
        '</div>'+
        '</div>';

    // create info-window
    var infowindow = new google.maps.InfoWindow({
        content: contentString,
        maxWidth: 200
    });

    //add clicklistener to marker to show info window on click
    station1.addListener('click', function() {
        infowindow.open(map, station1);
    });

}

//    Orange color = #ff5400