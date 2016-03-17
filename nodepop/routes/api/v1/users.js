"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypto = require("crypto");
var User = mongoose.model('User');


//Si queremos llevar la autenticación a otros módulos, sólo hace falta copiar las dos líneas siguientes
var auth = require('../../../lib/auth');
router.use(auth());


/*----------------------------Get-----------------------------------------*/
router.get('/', function(req, res) {
    var sort = req.query.sort || 'name';
    User.list(sort, function(err, rows) {
        if (err) {
            res.json({ result: false, err: err });
            return;
        }
        //cuando estén disponibles mando la vista
        res.json({ result: true, rows: rows });
        return;

    });

});

/*----------------------------Post-----------------------------------------*/

router.post('/', function(req, res, next) {
    var nombre = req.body.nombre;
    var email = req.body.email;
    var password = req.body.clave;
    let filter = {};
    filter.nombre = nombre;
    console.log(filter.nombre);

    User.findOne(filter, function(err, row) {
        if (err) {
            res.send('error', err);
            return;
        }
        if (!row) {
            console.log("row",row);
            var sha256 = crypto.createHash("sha256");
            sha256.update(password, "utf8"); //utf8 here
            var result = sha256.digest("base64");


            var user = new User({ nombre: nombre, email: email, clave: result });
            user.save(function(err, user) {
                if (err) {
                    console.log("Error!" + err);
                    return;
                }
                res.send('User creado.- \n' + "Nombre: " + user.nombre + "\n" + "Email: " + user.email);
                return;

                console.log('User creado: ' + user);

            });
        } else res.send("Usuario ya registrado");

    });
});




/*----------------------------Delete-----------------------------------------*/


router.delete('/:id', function(req, res) {
    User.remove({ _id: req.params.id }, function(err) {
        if (err) {
            res.json({ err });
            return;
        }
        res.json("Usuario eliminado");
    });
});

/*----------------------------Update-----------------------------------------*/

router.put('/:id', function(req, res) {
    //Para actualizar varios hay que usar en options
    var options = {};
    // var options = {multi:true}; Para actualizar varios usar multi
    User.update({ _id: req.params.id }, { $set: req.body }, options, function(err, data) {
        if (err) {
            res.json({ result: false, err: err });
            return;
        }

        res.json({ result: true, row: data });

    });
});

module.exports = router;
