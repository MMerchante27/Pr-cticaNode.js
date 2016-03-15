"use strict";
// Conectar con driver:  var conn = require('../lib/connectMongo');

var conn = require('../lib/connectMongoose');
var mongoose = require('mongoose');

// Creo el esquema

var anuncioSchema = mongoose.Schema({
    nombre: String,
    venta: Boolean,
    precio: Number,
    foto: String,
    tags: [String]
});

// Método estático
anuncioSchema.statics.list = function(filters,sort,cb) {
    // preparamos la query sin ejecutar ( no ponemos callback a find)
    var query = Anuncio.find(filters);  //Añadir filters

    //añadimos más parámetros a la query
    query.sort(sort);
    console.log('filtros: ', filters);

    //La ejecutamos
    query.exec(function(err, rows) {
        if (err) {
            cb(err);
            return;
        }
        cb(null, rows);
        return;

    });
};
//Lo registro en mongoose
var Anuncio = mongoose.model('Anuncio', anuncioSchema);
