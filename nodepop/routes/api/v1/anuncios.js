"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

//Si queremos llevar la autenticación a otros módulos, sólo hace falta copiar las dos líneas siguientes
var auth = require('../../../lib/auth');
router.use(auth('admin', 'pass2'));


/* GET anuncios listing. */
router.get('/', function(req, res) {
    var sort = req.query.sort || 'name';
    Anuncio.list(sort, function(err, rows) {
        if (err) {
            res.json({ result: false, err: err });
            return;
        }
        //cuando estén disponibles mando la vista
        res.json({ result: true, rows: rows });
        return;

    });

});

module.exports = router;