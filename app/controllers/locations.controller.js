var unirest = require('unirest');
var events = require('events');
var mongoose = require('mongoose');

var Location = require('../models/locations');

var	getFromUSGS = function() {
    var emitter = new events.EventEmitter();
    unirest.get('http://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=ca&parameterCd=00060&siteType=ST&altMin=500')
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
	
	getUsgsData: (req, res) => {
	    
	    var getLocations = getFromUSGS();
		
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
	
	returnLocations: (req , res) => {
	    Location.find({}, function(err, location){
	        if(err){
	            throw err;
	        }
	        res.send(location);
	    });
	    
	}
	
}
