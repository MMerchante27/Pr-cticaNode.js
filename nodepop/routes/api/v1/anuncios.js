"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

//Si queremos llevar la autenticación a otros módulos, sólo hace falta copiar las dos líneas siguientes
var auth = require('../../../lib/auth');
router.use(auth());


/* GET anuncios listing. */
router.get('/', function(req, res, next) {
    let filters = {};
    let precio = {};

    if (req.query.sort !== undefined) {
        var sort = req.query.sort || 'nombre';
    };

    if (req.query.venta !== undefined) {
        filters.venta = req.query.venta;
    }

    if (req.query.tags !== undefined) {
        filters.tags = req.query.tags;
    }

    if (req.query.nombre !== undefined) {
        filters.nombre = new RegExp('^' + req.query.nombre, "i");
    }

    if (req.query.precio !== undefined) {
        if (req.query.precio.match(/^-[0-9]$/)) {
            precio.$lte = req.query.precio.substr(1);

        } else if (req.query.precio.match(/^[0-9]-$/)) {

            precio.$gte = req.query.precio.substr(0, req.query.precio.length - 1);

        } else if (req.query.precio.match(/^[0-9]+$/)) {
            precio = req.query.precio;

        } else if (req.query.precio.match(/[0-9]+(-){1}[0-9]+/)) {
            console.log(req.query.precio.indexOf("-") - 1);
            let subIzq = req.query.precio.substr(0, req.query.precio.indexOf("-"));
            console.log(subIzq);
            precio.$gte = subIzq;
            console.log("hola", precio.$gte);
            let subDer = req.query.precio.substr(req.query.precio.indexOf("-") + 1);
            console.log(subDer);
            precio.$lte = subDer;
            console.log(precio.$lte);

        }
        filters.precio = precio;

    }

    // star limit sort includeTotal filters

    var Anuncio = mongoose.model('Anuncio');

    Anuncio.list(filters, sort, function(err, rows) {
        if (err) {
            res.send('error', err);
            return;
        }
        //cuando estén disponibles mando la vista
        res.render('anunciosForm', { anuncios: rows });
        return;

    });

});

module.exports = router;
