var express = require('express');
var q = require('q')
var router = express.Router();
var Util = require('./Util');
var ObjectID = require("mongodb").ObjectID
//var popup = require('window-popup').windowPopup;
//var popupS = require('popups');
var paramsProvided = {}
var validateReturnData;

router.post('/', function (req, res) {
    var db = req.app.locals.db
    console.log("line no 10 >>>>>>>>")
    return Util.getRequestParams(req).then(function (params) {
        paramsProvided = params;
        console.log("data >> >>> >>> >>", JSON.stringify(params))
        if (params.hasOwnProperty('username') && params.hasOwnProperty('password')) {
            console.log("data >> >>> >>> >>", params)

            return validateUser(params, db)
        }
    }).then(function (data) {
        validateReturnData = data
        console.log("data >> >>> >>> >> 20 " + JSON.stringify(data))
        if (data) {
            //req.path = "/signing_up/home"
            return saveUserConnection(paramsProvided, res, db)
        }
        else {
            res.render('already_exist');
        }
    }).then(function(token){
        console.log("33")
        if(validateReturnData){
            console.log("35")
            res.cookie("token", token, { maxAge: 10*60*1000 });
            res.redirect('/home')
            res.path('/home')
        }
    })
})


function validateUser(params, db) {
    console.log("params >> >>> >>> >> ", params)
    if (params && params.username && params.password) {
        return findAlreadySignUpUser(params, db).then(function (data) {
            console.log("data.result >> >>> >>> " + JSON.stringify(data))
            if (data && data._id) {
                return false;

            }
            else {
                return insertNewUserDeatils(params, db).then(function (doc) {
                    return true
                })

            }
        })
    }

}

function findAlreadySignUpUser(params, db) {
    var d = q.defer()
    db.collection('pl.users').findOne({name: params.username}, function (err, doc) {
        d.resolve(doc)
    })
    return d.promise;
}
function insertNewUserDeatils(params, db) {
    var d = q.defer()
    db.collection('pl.users').insertOne({name: params.username, password: params.password}, function (err, doc) {
        d.resolve(doc)
    })
    return d.promise;
}


function saveUserConnection(params, res, db) {
    console.log(params)
    var token = genrateToken()
    console.log(">>>>>>>", token)
    var d = q.defer();
    db.collection('pl.connections').insertOne({
        token: token,
        username: params.username,
        "login_time": new Date()
    }, function (err, doc) {
        if (err) {
            d.reject(err);
        } else {
            d.resolve(token);
        }
    });
    return d.promise;
}
function genrateToken() {
    console.log("token >>> >>> >>>> >")
    return require("crypto").createHash('sha1').update(ObjectID().toString()).digest("hex")
}
module.exports = router;
