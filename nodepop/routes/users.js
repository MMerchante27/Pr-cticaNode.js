"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
require('../models/userModel');
var crypto = require("crypto");
var User = mongoose.model('User');


/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* GET users listing. */
router.get('/form', function(req, res, next) {
    var sort = req.query.sort || 'nombre';
    var User = mongoose.model('User');
    User.list(sort, function(err, rows) {
        if (err) {
            res.send('error', err);
            return;
        }
        //cuando estén disponibles mando la vista
        res.render('userForm', { users: rows });
        return;

    });

});

router.post('/', function(req, res, next) {
    var nombre = req.body.nombre;
    var email = req.body.email;
    var password = req.body.clave;
    var sha256 = crypto.createHash("sha256");
    sha256.update(password, "utf8"); //utf8 here
    var result = sha256.digest("base64");
    console.log(result);
    var user = new User({ nombre: nombre, email: email, clave: result });
    user.save(function(err, userCreado) {
        if (err) {
            console.log("Error!" + err);
            return;
        }
        res.send('User creado.- \n' + "Nombre: "+userCreado.nombre+"\n" + "Email: "+ userCreado.email);
        return;

        console.log('User creado: ' + userCreado);

    });

});



module.exports = router;
