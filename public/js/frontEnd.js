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


    addRiverTag: function(lat, lng, name, site) {
        //var image = './img/raft-icon.png';

        var latLng = new google.maps.LatLng(lat, lng);

        var marker = new google.maps.Marker({
            position: latLng,
            title: name,
            icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });
        marker.siteCode = site;
        marker.setMap(this.map);
        gMap.markers.push(marker);

        marker.addListener('click', function(){
        	var index = gMap.markers.indexOf(this);
        	usgs.getFlowData(this.siteCode);

        })
    },
}

var displayData = {
    
    addToLightbox : function(array){
        $('.lightbox').addClass('showLightbox');
        var siteName = array.pop();
        var siteNum  = array.shift();
        $('.riverTitle').text(siteName[0]);
        $('.addFavs').attr('id', siteNum);
        array.forEach(function(data){
            if(data.length == 1){
                
                $('.currFlow').text(data[0].value);
                
            }
            if(data.length > 1){
                var counter = 0;
                data.forEach(function(dayFlow, index){
                    counter ++;
                    var date            = dayFlow.dateTime.slice(0,-13);
                    var dateConverted   = displayData.convertDate(date);
                    var flowCfs         = dayFlow.value.toString(); 
                    var flowIndex       = index.toString();
                    
                    $('.date-'+flowIndex).text(dateConverted);
                    $('.flow-'+flowIndex).text(flowCfs+' CFS');
                    $('.proBar-'+flowIndex).attr('aria-valuenow', flowCfs);
                    $('.proBar-'+flowIndex).attr('style', 'width:'+flowCfs+'%');
                    
                    
                    
                });
            }
        });
    },
    
    
    convertDate : function(input) {
        var ptrn = /(\d{4})\-(\d{2})\-(\d{2})/;
            if(!input || !input.match(ptrn)) {
                return null;
            }
        return input.replace(ptrn, '$2/$3/$1');
    },
    
    addToFavorites : function(site){
        var url = '/favorites/'+site;
        $.post(url)
        .done(function(data) {
            displayData.favoriteAdded(data);
        });
    },
    
    favoriteAdded : function(site){
        $('.addFavs').text('Location Added To Favorites!');
        
        displayData.callFavBarSites(site);
        
    },
    
    callFavBarSites : function(site){
        
        var url = '/usgs/'+site;
        $.getJSON(url, function(data, status, xhr){
            data.unshift(site);
            displayData.addToFavBar(data);
            
        });
        
    },
    
    addToFavBar : function(riverSite){
        
        var siteName = riverSite.pop();
        var siteCode = riverSite.shift();
        riverSite.forEach(function(data){
            
            if(data.length == 1){
               
                $('.customDrop').append('<li id="'+siteCode+'"><span><a class="riverSite" href="#" onClick="usgs.getFlowData('+siteCode+');">'+siteName+' : <span style="color: #46924a">'+data[0].value+' cfs </span></a><a class = "removeFav" href="#" onClick="displayData.removeFavorite('+siteCode+');"><span><i class="fa fa-times" aria-hidden="true"></i></a><span></li>');
            }
            
        });
        
    },
    
    removeFavorite : function(site){
        
        $('#'+site).remove();
        
        var ajax = $.ajax('/deleteFavs/' + site, {
           type: 'PUT',
           dataType : 'json'
        });
        
        ajax.done();
    },
    
    getLoggedInUserData : function(){
        $.getJSON("/user_data", function(data) {
            
            if(data.user !== undefined){
                
                var userFavs = data.user.favorites;

                userFavs.forEach(function(oneFavorite, index){
                    displayData.callFavBarSites(oneFavorite);
                });
            }
        });
    },
    
    displayBrowseData: function(siteName, siteCode){
        console.log('does this fire');
        $('.riverList').append('<li id="'+siteCode+'"><a class="riverSite" href="#" onClick="usgs.getFlowData('+siteCode+');">'+siteName+'</li>');
        
    }
    
}

var usgs = {
    
    getLocations : function(){
        
        $.getJSON('/locations', function(data, status, xhr){
            
            usgs.pushRiverMarkers(data);
            
        });
    },
    
    getFlowData : function(site){
        
        var url = '/usgs/'+site;
        
        $.getJSON(url, function(data, status, xhr){
            data.unshift(site);
            displayData.addToLightbox(data);
            
        });
    },
    
    pushRiverMarkers : function(data){
        //browse data
        data.forEach(function(riverLocation, index){
            displayData.displayBrowseData(riverLocation.name, riverLocation.siteCode);
        });
        //gmaps data
        data.forEach(function(riverLocation, index){
            gMap.addRiverTag(riverLocation.lat, riverLocation.long, riverLocation.name, riverLocation.siteCode);
            
        });
        
    }
}

$(function(){
    // close lightbox
    $('#close').on('click', function(){
    	$('.lightbox').removeClass('showLightbox');
    	$('.addFavs').text('Add to Favorites!');
    });
    
    //get logged in user data
    displayData.getLoggedInUserData();
    
    
    usgs.getLocations();

    
    //add favorites listener
    
    $('.addFavs').on('click', function(){
        var locationId = $('.addFavs').attr('id');
        displayData.addToFavorites(locationId);
        locationId = '';
    })
    
});