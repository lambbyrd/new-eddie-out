// exports.DATABASE_URL = process.env.DATABASE_URL ||
//                       global.DATABASE_URL ||
//                       (process.env.NODE_ENV === 'production' ?
//                             'mongodb://localhost/eddie-out' :
//                             'mongodb://localhost/eddie-out-dev');
// exports.PORT = process.env.PORT || 8080;

exports.DATABASE_URL = process.env.DATABASE_URL ||
                       global.DATABASE_URL ||
                       (process.env.NODE_ENV === 'production' ?
                            'mongodb://codepressd:Shasta89@ds033106.mlab.com:33106/mongo-shopping' :
                            'mongodb://codepressd:Shasta89@ds033106.mlab.com:33106/mongo-shopping');
exports.PORT = process.env.PORT || 8080;