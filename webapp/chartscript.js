/**
 * Created by tjarles on 05/09/15.
 */

new Chartist.Line('#chart1', {
    labels: [1, 2, 3, 4],
    series: [[100, 120, 180, 200]]
});

function drawChart(smhiData) {
    console.log(smhiData);
}

$(function() {
    $.get("http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/58.41081/lon/15.62137/data.json",receiveSMHIData);
});

//
//var get_xaxis = $(function() {
//    $.get("http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/58.41081/lon/15.62137/data.json",
//        function(json) {
//            SMHIdata = json;
//            console.log(SMHIdata.timeseries[0].pis);
//        }
//    )
//});