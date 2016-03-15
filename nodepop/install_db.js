'use strict';
//Cargar librería del API
var fs = require('fs');
var conn = require('./lib/connectMongoose');
var mongoose = require('mongoose');
require('./models/advModel');
require('./models/userModel');
var Anuncio = mongoose.model('Anuncio');
var User = mongoose.model('User');


// lee fichero de anuncios para inicializar la db
fs.readFile('./anuncios.json', { encoding: 'utf8' }, function(err, data) {
    if (err) {
        console.log("Error!" + err);
        return;
    }
    Anuncio.remove(function(err) {
        if (err) {
            console.log("Error!" + err);
            return;
        } 
        var dataAnuncios = JSON.parse(data);
        for (var i = 0; i < 2; i++) {
            var anuncio = new Anuncio(dataAnuncios.anuncios[i]);
            anuncio.save(function(err, anuncioCreado) {
                if (err) {
                    console.log("Error!" + err);
                    return;
                }
                console.log('Anuncio creado: ' + anuncioCreado);

            });
        };
    })


});


fs.readFile('./users.json', { encoding: 'utf8' }, function(err, data) {
    if (err) {
        console.log("Error!" + err);
        return;
    }
    User.remove(function(err) {
        if (err) {
            console.log("Error!" + err);
            return;
        } 
        var dataUser = JSON.parse(data);
        for (var i = 0; i < 2; i++) {
            var user = new User(dataUser.users[i]);
            user.save(function(err, userCreado) {
                if (err) {
                    console.log("Error!" + err);
                    return;
                }
                console.log('User creado: ' + userCreado);

            });
        };
    })


});

