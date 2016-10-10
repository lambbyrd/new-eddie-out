//connect to database
exports.DATABASE_URL = process.env.DATABASE_URL ||
                      global.DATABASE_URL ||
                      (process.env.NODE_ENV === 'production' ?
                            'mongodb://codepressd:Shasta89@ds033106.mlab.com:33106/mongo-shopping' :
                            'mongodb://codepressd:Shasta89@ds033106.mlab.com:33106/mongo-shopping');
exports.PORT = process.env.PORT || 8080;