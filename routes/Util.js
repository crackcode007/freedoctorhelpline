
var q = require('q')
exports.getRequestParams  = function(req){
    var Q = q.defer();
    var allParams = {}
    var params = req.params || {};
    var body = req.body || {};
    var query = req.query || {};
    for(var key in params) {
        if (params.hasOwnProperty(key)) {
            allParams[key] = params[key];
        }
    }
    for(var key in query) {
        if (query.hasOwnProperty(key)) {
            allParams[key] = query[key];
        }
    }
    for(var key in body) {
        if(body.hasOwnProperty(key)){
            allParams[key] = body[key];
        }
    }
    console.log("allParams  >>>> >> >> >>> >",allParams)
    Q.resolve(allParams)
    return Q.promise


}