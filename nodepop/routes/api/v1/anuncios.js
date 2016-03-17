"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

//Si queremos llevar la autenticación a otros módulos, sólo hace falta copiar las dos líneas siguientes
var auth = require('../../../lib/auth');
router.use(auth());

/*----------------------------Get tags-----------------------------------------*/

router.get('/tags', function(req, res, next) {
    let filters = {};
    if (req.query.sort !== undefined) {
        var sort = req.query.sort || 'nombre';
    };
    Anuncio.list(filters, sort, '0', '0', function(err, rows) {
        if (err) {
            res.send('error', err);
            return;
        }
        let allTags = [];
        console.log(rows.length);
        for (var i = 0; i < rows.length; i++) {

            allTags = allTags.concat(rows[i].tags.filter(function(item) {
                return allTags.indexOf(item) < 0;
            }));

        };
        return res.json({ tags: allTags });
    })
});

/*----------------------------Get-----------------------------------------*/
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
        if ((/^(-){1}[0-9]+/).test(req.query.precio)) {
            precio.$lte = req.query.precio.substr(1);

        } else if ((/^[0-9]+(-){1}$/).test(req.query.precio)) {
            precio.$gte = req.query.precio.substr(0, req.query.precio.length - 1);

        } else if ((/^[0-9]+$/).test(req.query.precio)) {
            precio = req.query.precio;

        } else if ((/^[0-9]+(-){1}[0-9]+$/).test(req.query.precio)) {
            let subIzq = req.query.precio.substr(0, req.query.precio.indexOf("-"));
            precio.$gte = subIzq;
            let subDer = req.query.precio.substr(req.query.precio.indexOf("-") + 1);
            precio.$lte = subDer;

        }
        filters.precio = precio;

    }

    let start = parseInt(req.query.start) || 0;
    console.log(start);
    let limit = parseInt(req.query.limit) || 0;
    console.log(limit);

    // star limit sort includeTotal filters



    Anuncio.list(filters, sort, start, limit, function(err, rows) {
        if (err) {
            res.send('error', err);
            return;
        }
        //cuando estén disponibles mando la vista

        res.render('anunciosForm', { anuncios: rows });
        return;



    });

});

/*----------------------------Post-----------------------------------------*/


router.post('/', function(req, res) {
    // Instanciamos objeto en memoria
    var anuncio = new Anuncio(req.body);
    // Lo guardamos en la BD
    anuncio.save(function(err, newRow) {
        if (err) {
            res.json({ result: false, err: err });
            return;
        }
        res.json({ result: true, row: newRow });
    });
});


/*----------------------------Delete-----------------------------------------*/
router.delete('/:id', function(req, res) {
    Anuncio.remove({ _id: req.params.id }, function(err) {
        if (err) {
            res.json({ err });
            return;
        }
        res.json("Anuncio eliminado");
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
