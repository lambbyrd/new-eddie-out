var mongoose = require('mongoose');

var LocationSchema = new mongoose.Schema({
    name: { 
    	type: String, 
    	required: true 
    },
    lat: { 
    	type: String, 
    	required: true 
    },
    long: { 
    	type: String, 
    	required: true 
    },
    siteCode:{
        type: String,
        required: true
    },
    flow:{
    	type: Array
    }
});

var Location = mongoose.model('Location', LocationSchema);

module.exports = Location; 