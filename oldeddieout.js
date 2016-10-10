var index = null;

var gMap = {

	markers: [],

    map: null,

    mapArea: $('#map-area')[0],

    mapOptions: {
        zoom: 5,
        center: {
            lat: 39.09024,
            lng: -92.712891
        }
    },

    init: function() {

        this.map = new google.maps.Map(this.mapArea, this.mapOptions);
    },


    addRiverTag: function(lat, lng, name, flow) {
        var image = './img/raft-icon.png';

        var latLng = new google.maps.LatLng(lat, lng);

        var marker = new google.maps.Marker({
            position: latLng,
            title: name,
            icon: image
        });

        marker.setMap(this.map);
        gMap.markers.push(marker);

        marker.addListener('click', function(){
        	var index = gMap.markers.indexOf(this);
        	$('.lightbox').addClass('showLightbox');
        	gCharts.doDrawAreaChart(usgs.riverLocations[index]);
        	//console.log('click works', index);
        })
    },
}

/*Get USGS Data*/
var usgs = {

    riverLocations: [],

    getData: function() {

        var url = 'http://waterservices.usgs.gov/nwis/dv/?format=json&sites=11185500,11186000,11187200,11189700,11189500,11187500,11192500,11192950,11185400,11204100,11202750,11208730,11208000,11208800,11209500,11218400,11215000,11216400,11213000,11212423,11215000,11230070,11230530,11234750,11238500,11242000,11246700,11244050,11244000,11231600,11231500,11267300,374224119192700,11266500,11265000,11268000,373637119573801,374017119472301,11279400,11277200,11277300,11277500,11275500,11276500,11276600,11278400,11283500,11278500,11285000,11299200,11277000,11283250,11297500,11292900,11292615,11292000,11291500,11293200,11296500,11297000,11294500,11295401,11308900,11308500,11293760,11293500,11293462,11319500,11317000,11316700,11316670,11316605,11316500,10310000,10296500,10296630,10296000,10308200,10308200,11313472,11436999,11438000,11436000,11439500,11441900,11441500,11442700,11443500,11444500,11445000,11445500,11446030,11446220,11433790,11433500,11427000,11433300,11426500,11427770,11426400,11426197,11422500,390346121000701,11428800,11427960,11433212,10337500,391859120115600,10344505,10346000,10348000,11414000,11414100,11414210,11421710,11421770,11421790,11414250,11414280,11417100,11416500,11408700,11408880,11417500,11418000,11418000,11409400,11413000,11413100,11411000,11410500,11395030,11395200,11396000,11396200,11404500,11404330,11393500,11403200,11401112,11403000,11401500,10356500,11367100,11367800,11353500,11348500,11365500,11368000,11342000,11341500,11367760,11341400,11341300,11519500,11522500,11516530,11517500,11517800,11510700,11520500,11522260,11522500,11519000,11522400,11522300,11518200,11522350,11523200,11363000,11361450,11355010,11523700,11525500,11526250,11527000,11526500,11529000,11527500,11527400,11530000,11481500,11481000,11482500,11481200,11530500,11523000,11521500,11532500,11531500,11477000,11477700,11528700,11480410,11528100,11476500,11476620,11475800,11475940,11473900,11468500,11471500,11468000,11461500,11462080,11467553,11463000,11451510,11111500,11121000,11308500&period=P3D&parameterCd=00060';

       return $.getJSON(url, function(data, status, xhr) {

            usgs.convertData(data.value.timeSeries);
            //console.log(data.value.timeSeries);
        });

    },

    convertData: function(data) {
    	//console.log(data[0].values[0].value);
        for (var i = 0; i < data.length; i++) {

            usgs.riverLocations.push({
                name: data[i].sourceInfo.siteName,
                lat: data[i].sourceInfo.geoLocation.geogLocation.latitude,
                lng: data[i].sourceInfo.geoLocation.geogLocation.longitude,
                flow: scrubData(data[i].values[0].value)
            });


            function scrubData(val) {
            	//console.log(val);
                var fixedArray = [];
                if (val) {
                	for (var j = 0; j < val.length; j++) {
                	var date = val[j].dateTime.slice(0,10);
                	fixedArray.push([date, parseInt(val[j].value)]);
                	}
                    return fixedArray;
                } else {
                    return "no value"
                }
            }    
            gMap.addRiverTag(usgs.riverLocations[i].lat, usgs.riverLocations[i].lng, usgs.riverLocations[i].name, usgs.riverLocations[i].flow);
        	
        }
        	console.log(usgs.riverLocations);
    }
}

/*Create Charts*/
//makes charts responsive
/*$(window).on("throttledresize", function (event) {
    gCharts.drawAreaChart();
    gCharts.drawGauge();
});*/

var gCharts = {

    init: function(site) {
        google.charts.load('current', { 'packages': ['corechart','gauge'] });
        
        //google.charts.setOnLoadCallback(gCharts.drawGauge);
    },

    doDrawAreaChart: function(site){
    	google.charts.setOnLoadCallback(drawAreaChart(site));
    	function drawAreaChart(site){

    	var data = google.visualization.arrayToDataTable([
          ['Date', 'Flow'],
          [site.flow[0][0],  site.flow[0][1]],
          [site.flow[1][0],  site.flow[1][1]],
          [site.flow[2][0],  site.flow[2][1]]
        ]);

        var options = {
          title: site.name,
          backgroundColor:'#EAEAEA', 
          hAxis: {title: 'Date',  titleTextStyle: {color: '#333'}},
          vAxis: {minValue: 0}
        };

        var chart = new google.visualization.AreaChart($('.chart')[0]);
        chart.draw(data, options);
      }
    },

    drawGauge : function(){
    	var data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ['River CFS', 200]
        ]);

        var options = {
          width: '100%', height: '100%',
          redFrom: 90, redTo: 100,
          yellowFrom:75, yellowTo: 90,
          minorTicks: 5
        };

        var chart = new google.visualization.Gauge($('.gauge')[0]);

        chart.draw(data, options);

    }

}


$(function() {

    //usgs.getData();
    
    $('#close').on('click', function(){
    	$('.lightbox').removeClass('showLightbox');
    	index = null;
    });

    var promise = usgs.getData();

    promise.done(function () {
    	gCharts.init(usgs.riverLocations[0]);
        // usgs.riverLocations.forEach(function (obj) {
        //     gMap.addTag(obj.lat, obj.lng, obj.name);
        });
    });