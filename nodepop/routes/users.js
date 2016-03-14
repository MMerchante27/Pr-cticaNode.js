"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


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

router.delete('/:id', function(req, res) {
    User.remove({ _id: req.params.id }, function(err) {
        if (err) {
            res.json({ err: err });
            return;
        }

    });
});

module.exports = router;
