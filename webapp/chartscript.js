/**
 * Created by tjarles on 05/09/15.
 */

function drawChart(smhiData) {
    //Lista med alla datum från SMHI
    var dayList = [];
    var snowList = [];
    for (x in smhiData.timeseries) {
        if (dayList[dayList.length-1] - dayList[0] > 5) {
            new Chartist.Line('#chart1', {
                labels: dayList,
                series: [snowList]
            });
            break
        }
        var date = smhiData.timeseries[x].validTime;
        //Ta ut datum för dagarna
        var day = (date.substr(8, 2));
        //Ta ut värdet från snöprognosen
        var snow = smhiData.timeseries[x].pis;

        dayList.push(day);
        snowList.push(snow);







    }
}

$(function() {
    $.get("http://opendata-download-metfcst.smhi.se/api/category/pmp1.5g/version/1/geopoint/lat/58.41081/lon/15.62137/data.json",drawChart);
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