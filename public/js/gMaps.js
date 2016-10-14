var index = null;


var gMap = {

	markers: [],

    map: null,

    mapArea: $('#map-area')[0],

    mapOptions: {
        zoom: 6,
        center: {
            lat: 37.7749,
            lng: -122.4194
        }
    },

    init: function() {

        this.map = new google.maps.Map(this.mapArea, this.mapOptions);
    },


    addRiverTag: function(lat, lng, name, flow) {
        //var image = './img/raft-icon.png';

        var latLng = new google.maps.LatLng(lat, lng);

        var marker = new google.maps.Marker({
            position: latLng,
            title: name,
            icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });

        marker.setMap(this.map);
        gMap.markers.push(marker);

        marker.addListener('click', function(){
        	var index = gMap.markers.indexOf(this);
        	$('.lightbox').addClass('showLightbox');
        	//gCharts.doDrawAreaChart(usgs.riverLocations[index]);
        	//console.log('click works', index);
        })
    },
}

var usgs = {
    
    getLocations : function(){
        
        return $.getJSON('/locations', function(data, status, xhr){
            
            usgs.pushRiverMarkers(data);
            
        });
    },
    
    pushRiverMarkers : function(data){
       
        data.forEach(function(riverLocation, index){
            gMap.addRiverTag(riverLocation.lat, riverLocation.long, riverLocation.name);
        });
        
    }
}

$(function(){
    
    usgs.getLocations();
    
    //  promise.done(function(){
    //     usgs.pushRiverMarkers();
    //  })
    
});