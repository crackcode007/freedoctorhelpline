var express = require('express');
var router = express.Router();
var Util = require('./Util')
var q = require('q')
//var myDB = require('../bin/www')
var paramsProvided = {};

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("inside index page ")
  res.render('index');
    next()
});
router.post('/sign_in',function(req,res){
    var db = req.app.locals.db
    return Util.getRequestParams(req).then(function (params) {
        paramsProvided = params;
        console.log("data >> >>> >>> >>", JSON.stringify(params))
        if (params.hasOwnProperty('username') && params.hasOwnProperty('password')) {
            console.log("data >> >>> >>> >>", params)

            return validateUser(params, db)
        }
    }).then(function (data) {
        console.log("25 >>>>>>>>>>> ",data)
        if(data){
            req.path = "/home"
            res.redirect('/home')
        }
        else{
            res.send("You are not registered !!")
        }
    })
})

router.all('/home', function (req, res) {
    res.render('freedoctorhelpline');
});


function validateUser(params, db) {
    console.log("params >> >>> >>> >> ", params)
    if (params && params.username && params.password) {
        return findAlreadySignUpUser(params, db).then(function (data) {
            console.log("data.result >> >>> >>> " + JSON.stringify(data))
            if (data && data._id) {
                return true;
            }
            else {
                    return false
            }
        })
    }

}

function findAlreadySignUpUser(params, db) {
    var d = q.defer()
    db.collection('pl.users').findOne({name: params.username}, function (err, doc) {
        console.log(" 125 >> >> >> >>" + JSON.stringify(doc))
        d.resolve(doc)
    })
    return d.promise;
}




module.exports = router;
