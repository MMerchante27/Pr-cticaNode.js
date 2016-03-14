"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


/* GET anuncios listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* GET anuncios listing. */
router.get('/form', function(req, res, next) {
    var sort = req.query.sort || 'nombre';
    var Anuncio = mongoose.model('Anuncio');
    Anuncio.list(sort, function(err, rows) {
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
