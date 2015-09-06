/**
 * Created by tjarles on 05/09/15.
 */

function drawChart(smhiData) {
    //Lista med alla datum från SMHI
    var dayList = [];
    var hourList = [];
    var snowList = [];
    for (x in smhiData.timeseries) {
        if (dayList[dayList.length-1] - dayList[0] > 5) {
            new Chartist.Bar('#chart1', {
                labels: hourList,
                series: [snowList]
            });
            break
        }
        var date = smhiData.timeseries[x].validTime;
        //Ta ut datum för dagarna
        var day = (date.substr(8, 2));
        //Ta ut varje timme
        var hour = (date.substr(11, 2));
        //Ta ut värdet från snöprognosen (Ändra från t till pis för snönederbörd)
        var snow = smhiData.timeseries[x].t;

        dayList.push(day);
        hourList.push(hour);
        snowList.push(snow);

        // Lägg till datumet på den timme där det blir ny dag
        // Om det är fler än en dag så kolla om den senaste tillagda dagen är större än den innan
        if (dayList.length > 1) {
            if (dayList[dayList.length-1] > dayList[dayList.length-2]) {
                var hourDate = hourList[dayList.length-1] + "\n" + dayList[dayList.length-1];
                    hourList[dayList.length-1] = hourDate;
            }
        }




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