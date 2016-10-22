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
                 password: '$2a$08$OXkCdXiDs56JpYKdGhqUc.oghOniFC2lh51hEpcdVSjEBFvctqVpS',
                 description: 'Another description',
                 favorites: ['12345','6785','78654']
                },
                {email: 'new@grace.com',
                 username: 'newNew',
                 password: '$2a$08$OXkCdXiDs56JpYKdGhqUc.oghOniFC2lh51hEpcdVSjEBFvctqVpS',
                 description: 'Sweet little Description',
                 favorites: ['12345','6785','78654']
                },
                {email: 'chris@jeff.com',
                 username: 'kris',
                 password: '$2a$08$OXkCdXiDs56JpYKdGhqUc.oghOniFC2lh51hEpcdVSjEBFvctqVpS',
                 description: 'something',
                 favorites: ['12345','6785','78654']
                },], function(err) {
                            if(err){
                               return console.error(err);
                            }
                            
                done();
            });
        }); 
    });
    
    
    it('Post New User with data', function(done) {
        chai.request(app)
            .post('/newuser')
            .send({email: 'chris@gmail.com',
                 password: '12345'})
            .end(function(err, res) {
                should.equal(err, null);
                res.should.have.status(200);
                res.redirects[0].should.not.be.empty;
                res.redirects[0].should.have.string('profile');

                done();
            });
    });
    
    it('login user and test profile page', function(done){
        var agent = chai.request.agent(app);
        agent.post('/loginUser')
             .send({email: 'chris@chris.com', password: '12345'})
             .then(function(res){
                     agent.get('/profile')
                          .then(function(res2){
                              res2.should.have.status(200);
                              res2.redirects.should.be.empty;
                              done();
             });
        });
        
    });
    
    
    it('Get User Data logged in', function(done) {
        var agent = chai.request.agent(app);
        agent.post('/loginUser')
             .send({email: 'chris@chris.com', password: '12345'})
             .then(function(res){
                     agent.get('/user_data')
                          .then(function(res2){
                              res2.should.have.status(200);
                              res2.body.user.username.should.be.a('string');
                              res2.body.user.username.should.equal('Chris');
                              res2.body.user.email.should.equal('chris@chris.com');
                              done();
                        });
            });
    });
    
    it('Send riverlocation to favorites', function(done) {
        var agent = chai.request.agent(app);
        agent.post('/loginUser')
             .send({email: 'chris@chris.com', password: '12345'})
             .then(function(res){
                     agent.post('/favorites/123456')
                          .then(function(res2){
                              agent.get('/user_data')
                                  .then(function(res3){
                                      res3.should.have.status(200);
                                      res3.body.user.username.should.be.a('string');
                                      res3.body.user.username.should.equal('Chris');
                                      res3.body.user.email.should.equal('chris@chris.com');
                                      res3.body.user.favorites[3].should.be.a('string');
                                      res3.body.user.favorites[3].should.equal('123456');
                                      done();
                                });
                    });
            });
       
    });
    
    it('Delete user favorites location', function(done) {
        var agent = chai.request.agent(app);
        agent.post('/loginUser')
             .send({email: 'chris@chris.com', password: '12345'})
             .then(function(res){
                     agent.put('/deleteFavs/12345')
                          .then(function(res2){
                              agent.get('/user_data')
                                  .then(function(res3){
                                      res3.should.have.status(200);
                                      res3.body.user.username.should.be.a('string');
                                      res3.body.user.username.should.equal('Chris');
                                      res3.body.user.email.should.equal('chris@chris.com');
                                      res3.body.user.favorites.length.should.equal(3);
                                      res3.body.user.favorites[0].should.be.a('string');
                                      res3.body.user.favorites[0].should.not.equal('12345');
                                      done();
                                });
                    });
            });
    });
    
    it('Update User Details', function(done) {
        var agent = chai.request.agent(app);
        agent.post('/loginUser')
             .send({email: 'chris@chris.com', password: '12345'})
             .then(function(res){
                     agent.post('/updateDetails')
                          .send({username: 'Chris Reeder', shortDescription:'test works'})
                          .then(function(res2){
                              agent.get('/user_data')
                                  .then(function(res3){
                                      res3.should.have.status(200);
                                      res3.body.user.username.should.be.a('string');
                                      res3.body.user.username.should.equal('Chris Reeder');
                                      res3.body.user.email.should.equal('chris@chris.com');
                                      res3.body.user.description.should.be.a('string');
                                      res3.body.user.description.should.equal('test works');
                                      res3.body.user.favorites.length.should.equal(3);
                                      res3.body.user.favorites[0].should.be.a('string');
                                      done();
                                });
                    });
            });

    });
    
    it('Update User Password', function(done) {
        var agent = chai.request.agent(app);
        agent.post('/loginUser')
             .send({email: 'chris@chris.com', password: '12345'})
             .then(function(res){
                     agent.post('/updatePass')
                          .send({oldPass: '12345', newPass:'123456', newPassConfirm: '123456'})
                          .then(function(res2){
                              agent.get('/user_data')
                                  .then(function(res3){
                                      res3.should.have.status(200);
                                      res3.body.user.username.should.be.a('string');
                                      res3.body.user.username.should.equal('Chris Reeder');
                                      res3.body.user.email.should.equal('chris@chris.com');
                                      res3.body.user.password.should.not.equal('$2a$08$OXkCdXiDs56JpYKdGhqUc.oghOniFC2lh51hEpcdVSjEBFvctqVpS');
                                      done();
                                });
                    });
            });

    });
    
    //removes user info at end
    after(function(done) {
        User.remove(function() {
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
