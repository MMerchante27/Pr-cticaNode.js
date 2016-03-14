"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');

//Si queremos llevar la autenticación a otros módulos, sólo hace falta copiar las dos líneas siguientes
var auth = require('../../../lib/auth');
router.use(auth('admin', 'pass2'));


/* GET users listing. */
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

// Añadir un user

router.post('/', function(req, res) {
    // Instanciamos objeto en memoria
    var user = new User(req.body);
    // Lo guardamos en la BD
    user.save(function(err, newRow) {
        if (err) {
            res.json({ result: false, err: err });
            return;
        }
        res.json({ result: true, row: newRow });
    });
});

//Actualizar un user

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
