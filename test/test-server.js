//global.DATABASE_URL = 'mongodb://localhost/eddieout-test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
//var Item = require('../models/item');
var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Eddie out', function() {
 
     it('should just work', function(done) {
        chai.request(app)
            .get('/')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                done();
            });
    });
});
