var unirest = require('unirest');
var events = require('events');
var mongoose = require('mongoose');

var Location = require('../models/locations');

var	getFromUSGS = function(url) {
    var emitter = new events.EventEmitter();
 //   http://waterservices.usgs.gov/nwis/iv/?format=json&sites='+ site +'&period=P3D&parameterCd=00060&siteType=ST&siteStatus=active&altMin=500
    
    unirest.get(url)
           .end(function(response) {
                if (response.ok) {
                    emitter.emit('end', response.body);
                }
                else {
                    emitter.emit('error', response.code);
                }
            });
    return emitter;
	};

module.exports = {
    
    getUsgsFlow : (req, res) => {
        var site = req.params.site;
        var urls = ['http://waterservices.usgs.gov/nwis/iv/?format=json&sites='+site+'&parameterCd=00060&siteStatus=active','http://waterservices.usgs.gov/nwis/dv/?format=json,1.1&sites='+site+'&period=P3D&parameterCd=00060&siteStatus=active'];
        var flowData = [];
        var counter = 0;
        urls.forEach(function(url){
            var getFlow = getFromUSGS(url);
        
        
            getFlow.on('end', function(data){
                
                counter ++;
                
                if(typeof data.value.timeSeries !== undefined && data.value.timeSeries.length > 0){
                    
                    flowData.push(data.value.timeSeries[0].values[0].value);
                    
                    if(counter == urls.length){
                    
                        flowData.push([data.value.timeSeries[0].sourceInfo.siteName]);
                        res.json(flowData);
                    }
                }
                if(counter == urls.length && flowData.length == 0){
                    res.json(flowData);
                }
                
            });
            
            getFlow.on('error', function(code) {
                console.log('this is firing',code);
                res.sendStatus(code);
            });
            
        });
        
    },
	
	getUsgsData: (req, res) => {
	    var url = 'http://waterservices.usgs.gov/nwis/dv/?format=json&stateCd=ca&parameterCd=00060&siteType=ST&siteStatus=active&altMin=500'
	    var getLocations = getFromUSGS(url);
		console.log('getusgs firing');
		getLocations.on('end', function(locations){
		    
		    
		    
		    locations.value.timeSeries.forEach(function(oneLocation, index){
		        
		        Location.findOne({'sitecode': oneLocation.sourceInfo.siteCode[0].value}, function(err, location){
		            
		            if(err){
		               
		                throw err;
		            }
		            
		            if(!location){
		            
		                var newLocation         = new Location();
		                newLocation.name        = oneLocation.sourceInfo.siteName;
		                newLocation.siteCode    = oneLocation.sourceInfo.siteCode[0].value;
		                newLocation.lat         = oneLocation.sourceInfo.geoLocation.geogLocation.latitude;
		                newLocation.long        = oneLocation.sourceInfo.geoLocation.geogLocation.longitude;

		                newLocation.save(function(err){
		                    if (err){
		                        console.log('this is firing');
		                        throw err;
		                    }
		                });
		            }
		            
		        });
		    
		   });
		    
		});
		
		getLocations.on('error', function(code) {
            console.log('this is firing',code);
            res.sendStatus(code);
        });
		
	},
	
	returnLocations: (req, res) => {
	    Location.find({}, function(err, location){
	        if(err){
	            throw err;
	        }
	        res.send(location);
	    });
	    
	},
	
	
}
