var mongoose = require('mongoose');

var LocationSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

var Location = mongoose.model('Location', LocationSchema);

module.exports = Location; 