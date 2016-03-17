"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

//Si queremos llevar la autenticación a otros módulos, sólo hace falta copiar las dos líneas siguientes
var auth = require('../../../lib/auth');
router.use(auth());

/*----------------------------Get-----------------------------------------*/

/**
@api {get} /anuncios/ Obtener todos los anuncios disponibles
 * @apiExample {curl} Example usage:
 *     curl -i http://http://localhost:3000/api/v1/anuncios/
@apiPermission basicAuth
@apiVersion 1.0.0
@apiName GetAnuncio
@apiGroup Anuncio
@apiParam {String} sort Filtro de ordenación. Puede ser cualquier campo perteneciente a anuncio.
@apiParam {Boolean} venta Filtro de búsqueda. Si el valor es true, el producto se vende. En caso contrario, el usuario está en su búsqueda
@apiParam {String} tags Filtro de búsqueda. Muestra los tags relacionados con el producto.
@apiParam {String} nombre Filtro de búsqueda. Nombre del producto.
@apiParam {String} precio Filtro de búsqueda. Precio del producto que podrá tener 4 patrones: -xx precios menores que xx,  xx- precios mayores que xx, xx-zz rango de precios entre xx y zz, xx precio exacto.
@apiParam {Number} start Filtro de búsqueda. Indicará a partir de qué producto empezará. Valor por defecto: 0
@apiParam {Number} limit Filtro de búsqueda. Indicará cuantos productos serán mostrados a partir del start. Valor por defecto: 0

@apiSuccess {JSON} res Salida de todos los anuncios existentes en JSON
@apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *      "anuncios": [
            {
 *           "_id": "56e7c6faa1f0327808b5935c",
 *           "nombre": "Bicicleta",
 *           "venta": true,
 *           "precio": 230.15,
 *           "foto": "bici.jpg",
 *           "__v": 0,
 *           "tags": [
 *             "lifestyle",
 *             "motor"
 *            ]
 *     }
 }
 * @apiError AnuncioNotFound Ha habido un error
*/


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
    let limit = parseInt(req.query.limit) || 0;

    Anuncio.list(filters, sort, start, limit, function(err, rows) {
        if (err) {
            res.send('Ha habido un error', err);
            return;
        }
        //cuando estén disponibles mando la vista

        res.json({ result: true, anuncios: rows });
        return;



    });

});

/*----------------------------Post-----------------------------------------*/


/**
@api {post} /anuncios/ Añadir nuevo anuncio.
 * @apiExample {curl} Example usage:
 *     curl -i http://http://localhost:3000/api/v1/anuncios/
@apiPermission basicAuth
@apiVersion 1.0.0
@apiName PostAnuncios
@apiGroup Anuncio
@apiParam {String} nombre Nombre del producto.
@apiParam {Boolean} venta  Si el valor es true, el producto se vende. En caso contrario, el usuario está en su búsqueda.
@apiParam {String} precio Precio del producto si está en venta y si está en búsqueda, precio dispuesto a pagar.
@apiParam {String} tags Tags relacionados con el producto.


@apiSuccess {JSON} res Salida del anuncio creado en JSON con todos sus campos
@apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK

 *  {
  "result": true,
  "row": {
    "__v": 0,
    "nombre": "Coche",
    "venta": true,
    "precio": 5000,
    "_id": "56ea784c629e6a0c191e8d8b",
    "tags": [
      "motor"
    ]
  }
}
 * @apiError AnuncioNotFound Ha habido un error
*/



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


/**
@api {delete} /anuncios/:id Borrar anuncio existente
 * @apiExample {curl} Example usage:
 *     curl -i http://http://localhost:3000/api/v1/anuncios/78dad778
@apiPermission basicAuth
@apiVersion 1.0.0
@apiName DeleteAnuncios
@apiGroup Anuncio
@apiParam {String} id Identificador único del producto

@apiSuccess {String} res Anuncio eliminado
@apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
    "Anuncio eliminado"
 * @apiError AnuncioNotFound Identificador no encontrado
*/

router.delete('/:id', function(req, res) {
    Anuncio.remove({ _id: req.params.id }, function(err) {
        if (err) {
            res.send("Anuncio no encontrado", err);
            return;
        }
        res.send("Anuncio eliminado");
    });
});


/*----------------------------Update-----------------------------------------*/
/**
@api {update} /anuncios/:id Modificar anuncio existente.
 * @apiExample {curl} Example usage:
 *     curl -i http://http://localhost:3000/api/v1/anuncios/78dad778
@apiPermission basicAuth
@apiVersion 1.0.0
@apiName UpdateAnuncios
@apiGroup Anuncio

@apiParam {String} id Identificador único del producto
@apiParam {String} nombre Nombre del producto.
@apiParam {Boolean} venta  Si el valor es true, el producto se vende. En caso contrario, el usuario está en su búsqueda.
@apiParam {String} precio Precio del producto si está en venta y si está en búsqueda, precio dispuesto a pagar.
@apiParam {String} tags Tags relacionados con el producto.
@apiSuccess {String} res Anuncio modificado
@apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
    Anuncio modificado
 * @apiError AnuncioNotFound Anuncio no encontrado
*/

router.put('/:id', function(req, res) {
    //Para actualizar varios hay que usar en options
    var options = {};
    // var options = {multi:true}; Para actualizar varios usar multi
    Anuncio.update({ _id: req.params.id }, { $set: req.body }, options, function(err, data) {
        if (err) {
            res.send("Anuncio no encontrado", err);
            return;
        }

        res.send("Anuncio modificado");

    });
});

/*----------------------------Get tags-----------------------------------------*/
/**
@api {get} /anuncios/tags Obtener todos los tags existentes
 * @apiExample {curl} Example usage:
 *     curl -i http://http://localhost:3000/api/v1/anuncios/tags
@apiPermission basicAuth
@apiVersion 1.0.0
@apiName GetTags
@apiGroup Anuncio

@apiParam {String} sort Filtro de ordenación. Puede ser cualquier campo perteneciente a anuncio. Por defecto, ordenará por nombre.

@apiSuccess {JSON} res Salida de los tags en JSON
@apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *    {
        "tags": [
            "lifestyle",
            "motor",
            "mobile"
  ]
}
 * @apiError TagsNotFound Ha habido un error
*/




router.get('/tags', function(req, res, next) {
    let filters = {};
    if (req.query.sort !== undefined) {
        var sort = req.query.sort || 'nombre';
    };
    Anuncio.list(filters, sort, '0', '0', function(err, rows) {
        if (err) {
            res.send('Ha habido un error', err);
            return;
        }
        let allTags = [];
        for (var i = 0; i < rows.length; i++) {

            allTags = allTags.concat(rows[i].tags.filter(function(item) {
                return allTags.indexOf(item) < 0;
            }));

        }
        return res.json({ tags: allTags });
    });
});


module.exports = router;
