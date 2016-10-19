global.DATABASE_URL = 'mongodb://localhost/eddieout-test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var User = require('../app/models/user-model');
var Location = require('../app/models/locations');
var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Eddie-out all user functions', function(){
    this.timeout(30000);
    before(function (done){
       server.runServer(function() {
            User.create([
                {email: 'chris@chris.com',
                 username: 'Chris',
                 password: '12345',
                 description: 'Another description',
                 favorites: []
                },
                {email: 'new@new.com',
                 username: 'newNew',
                 password: '12345',
                 description: 'Sweet little Description',
                 favorites: []
                },
                {email: 'chris@new.com',
                 username: 'kris',
                 password: '12345',
                 description: 'something',
                 favorites: []
                },], function(err) {
                            if(err){
                               return console.error(err);
                            }
                            
                done();
            });
        }); 
    });
    
    it.skip('Profile', function(done) {
        chai.request(app)
            .get('/profile')
            .end(function(err, res) {
                should.equal(err, null);
                res.redirects[0].should.be.empty;
                res.should.have.status(200);
                done();
            });
    });
    
    it.skip('Post New User with data', function(done) {
        // if success redirect /profile failure redirect /signup
        // test failure message
        chai.request(app)
            .post('/newuser')
            .end(function(err, res) {
                
                res.should.have.status(200);
                done();
            });
    });
    
    it.skip('Login User with data', function(done) {
        // success redirect /profile failure redirect /login
        chai.request(app)
            .post('/loginuser')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                done();
            });
    });
    
    it.skip('Get User Data logged in', function(done) {
        chai.request(app)
            .get('/user_data')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                done();
            });
    });
    
    it.skip('Send riverlocation to favorites', function(done) {
        chai.request(app)
            .post('/favorites'+ site)
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                done();
            });
    });
    
    it.skip('Delete user favorites location', function(done) {
        chai.request(app)
            .put('/deleteFavs' + site)
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                done();
            });
    });
    
    it.skip('Update User Details', function(done) {
        chai.request(app)
            .post('/updateDetails')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                done();
            });
    });
    
    it.skip('Update User Password', function(done) {
        chai.request(app)
            .post('/updatePass')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                done();
            });
    });
    
    //removes user info at end
    after(function(done) {
        Location.remove(function() {
            done();
        });
    });
});

describe('Eddie-out Location and page loads', function() {
    this.timeout(30000);
    before(function (done){
       server.runServer(function() {
            Location.create([
                {name: 'River Location 1',
                 lat: '-129.67',
                 long: '98.5656',
                 siteCode: '444444',
                 flow: []
                },
                {name: 'River Location 2',
                 lat: '-124.67',
                 long: '97.5656',
                 siteCode: '4435544',
                 flow: []
                },
                {name: 'River Location 3',
                 lat: '-121.67',
                 long: '92.5656',
                 siteCode: '333444',
                 flow: []
                },], function(err) {
                            if(err){
                               return console.error(err);
                            }
                            
                done();
            });
        }); 
    });

 
    it('Get Homepage', function(done) {
        chai.request(app)
            .get('/')
            .end(function(err, res) {
                should.equal(err, null);
                res.redirects.should.be.empty;
                res.should.have.status(200);
                done();
            });
    });
    
    it('Signup', function(done) {
        chai.request(app)
            .get('/signup')
            .end(function(err, res) {
                should.equal(err, null);
                res.redirects.should.be.empty;
                res.should.have.status(200);
                done();
            });
    });
    it('Login', function(done) {
        chai.request(app)
            .get('/login')
            .end(function(err, res) {
                should.equal(err, null);
                res.redirects.should.be.empty;
                res.should.have.status(200);
                done();
            });
    });
    it('Get Chat', function(done) {
        chai.request(app)
            .get('/chat')
            .end(function(err, res) {
                should.equal(err, null);
                res.redirects.should.be.empty;
                res.should.have.status(200);
                done();
            });
    });
    
    it('Post New User no data', function(done) {
        // if success redirect /profile failure redirect /signup
        // test failure message
        chai.request(app)
            .post('/newuser')
            .end(function(err, res) {
                should.equal(err, null);
                res.redirects[0].should.have.string('signup');
                res.should.have.status(200);
                done();
            });
    });
    
    
    it('Login User without data', function(done) {
        // success redirect /profile failure redirect /login
        chai.request(app)
            .post('/loginuser')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.redirects[0].should.have.string('login');
                done();
            });
    });
    
    it('Logout User', function(done) {
        chai.request(app)
            .get('/logout')
            .end(function(err, res) {
                should.equal(err, null);
                res.redirects[0].should.not.be.empty;
                res.should.have.status(200);
                done();
            });
    });
    
    it('Get User Data not logged in', function(done) {
        chai.request(app)
            .get('/user_data')
            .end(function(err, res) {
                should.equal(err, null);
                res.body.should.be.empty;
                res.should.have.status(200);
                done();
            });
    });

    it('Load Browse', function(done) {
        chai.request(app)
            .get('/browse')
            .end(function(err, res) {
                should.equal(err, null);
                res.redirects.should.be.empty;
                res.should.have.status(200);
                done();
            });
    });
    it('Get usgs site data', function(done) {
        var site = '11345500';
        chai.request(app)
            .get('/usgs/' + site)
            .end(function(err, res) {
                should.equal(err, null);
                res.body.should.be.an('array');
                res.body.length.should.equal(3);
                res.should.have.status(200);
                done();
            });
    });
    
    it('Get all river locations', function(done) {
        chai.request(app)
            .get('/locations')
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('_id');
                res.body[0].should.have.property('lat');
                res.body[0].should.have.property('long');
                res.body[0].should.have.property('name');
                res.body[0].should.have.property('siteCode');
                done();
            });
    });
    
    
    after(function(done) {
        Location.remove(function() {
            done();
        });
    });
});
