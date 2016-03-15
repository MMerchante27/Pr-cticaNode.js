"use strict";
// Conectar con driver:  var conn = require('../lib/connectMongo');

var conn = require('../lib/connectMongoose');
var mongoose = require('mongoose');

// Creo el esquema

var userSchema = mongoose.Schema({
    nombre: String,
    email: String,
    clave: String
});

// Método estático
userSchema.statics.list = function(filter, cb) {
    // preparamos la query sin ejecutar ( no ponemos callback a find)
    var query = User.find({filter});

    //añadimos más parámetros a la query

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
var User = mongoose.model('User', userSchema);



