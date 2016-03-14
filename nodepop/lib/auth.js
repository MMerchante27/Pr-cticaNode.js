"use strict";

var basicAuth = require('basic-auth');


var fn = function(user, pass) {
    return function(req, res, next) {
        var userRequest = basicAuth(req);
        console.log(user);
        if (!userRequest || userRequest.name !== user || userRequest.pass !== pass) {
            res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
            res.send(401);
            return;
        }
        next();

    };
};

module.exports = fn;
