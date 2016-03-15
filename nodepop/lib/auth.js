"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../models/userModel');
var crypto = require("crypto");
var User = mongoose.model('User');

var basicAuth = require('basic-auth');


var fn = function() {
    return function(req, res, next) {
        var userRequest = basicAuth(req);

        if (!userRequest || userRequest.name === "" || userRequest.pass === "") {
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            res.send(401);
            return;
        }
        var password = userRequest.pass;
        var sha256 = crypto.createHash("sha256");
        sha256.update(password, "utf8"); //utf8 here
        var result = sha256.digest("base64");

        let filter = {};
        filter.nombre = userRequest.name;
        User.list(filter, function(err, rows) {
            if (err) {
                res.send('error', err);
                return;
            }
            for (row in rows) {
                row.clave = result;
                next();
            }
        })
    };
};

module.exports = fn;
