"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');



/* GET anuncios listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* GET anuncios listing. */
router.get('/form', function(req, res, next) {
    let filters = {};

    if (typeof req.query.sort !== undefined) {
        var sort = req.query.sort || 'nombre';
    };

    if(typeof req.query.venta !== undefined){
        filters.venta = req.query.venta;
    }


    if (typeof req.query.tag !== undefined) {
        filters.tags = req.query.tag;
    }

    // star limit sort includeTotal filters

    var Anuncio = mongoose.model('Anuncio');
    Anuncio.list(filters,sort, function(err, rows) {
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
