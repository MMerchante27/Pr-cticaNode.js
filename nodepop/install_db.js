'use strict';
//Cargar librería del API
var fs = require('fs');
var conn = require('./lib/connectMongoose');
var mongoose = require('mongoose');
require('./models/advModel');
require('./models/userModel');
var async = require('async');
var Anuncio = mongoose.model('Anuncio');
var User = mongoose.model('User');


// lee fichero de anuncios para inicializar la db
function leerAnuncios() {
    return new Promise(function(resolve, reject) {
        fs.readFile('./anuncios.json', { encoding: 'utf8' }, function(err, data) {
            if (err) {
                reject(new Error('Fatal'));
                return;
            }

            var dataAnuncios = (JSON.parse(data));
            resolve(dataAnuncios);

        });
    });
}

function borrarAnuncios() {
    return new Promise(function(resolve, reject) {
        Anuncio.remove(function(err) {
            if (err) {
                reject(new Error('Fatal'));
                return;
            }
            resolve('resuelta');
        });


    });
}

function guardarAnuncios(anuncios) {
    return new Promise(function(resolve, reject) {
        async.eachSeries(anuncios.anuncios,
            function cada(item, siguiente) {
                let item2 = new Anuncio(item);
                item2.save(function(err) {
                    if (err) {
                        reject(new Error('Fatal'));
                        return;
                    }
                    siguiente(null);
                });

            },
            function fin(err) {
                if (err != null) {
                    reject("Error");

                }
                resolve(console.log('Anuncios creados'));

            }

        );

    });
}


function leerUsuarios() {
    return new Promise(function(resolve, reject) {
        fs.readFile('./users.json', { encoding: 'utf8' }, function(err, data) {
            if (err) {
                reject(new Error('Fatal'));
                return;
            }

            var dataUsers = (JSON.parse(data));
            resolve(dataUsers);

        });
    });
}

function borrarUsers() {
    return new Promise(function(resolve, reject) {
        User.remove(function(err) {
            if (err) {
                reject(new Error('Fatal'));
                return;
            }
            resolve('resuelta');
        });


    });
}

function guardarUsers(users) {
    return new Promise(function(resolve, reject) {
        async.eachSeries(users.users,
            function cada(item, siguiente) {
                let item2 = new User(item);
                item2.save(function(err) {
                    if (err) {
                        reject(new Error('Fatal'));
                        return;
                    }
                    siguiente(null);
                });

            },
            function fin(err) {
                if (err != null) {
                    reject("Error");

                }
                resolve(console.log('Usuarios creados'));

            }

        );

    });
}




borrarAnuncios()
    .then(leerAnuncios)
    .then(guardarAnuncios)
    .then(borrarUsers)
    .then(leerUsuarios)
    .then(guardarUsers)
    .then(function() {
        process.exit();
    })
    .catch(function(err) {
        console.log('ERROR', err);
        process.exit(1);

    });


// fs.readFile('./anuncios.json', { encoding: 'utf8' }, function(err, data) {
//     if (err) {
//         console.log("Error!" + err);
//         return;
//     }
//     Anuncio.remove(function(err) {
//         if (err) {
//             console.log("Error!" + err);
//             return;
//         }
//         var dataAnuncios = JSON.parse(data);
//         for (var i = 0; i < 2; i++) {
//             var anuncio = new Anuncio(dataAnuncios.anuncios[i]);
//             anuncio.save(function(err, anuncioCreado) {
//                 if (err) {
//                     console.log("Error!" + err);
//                     return;
//                 }
//                 console.log('Anuncio creado: ' + anuncioCreado);

//             });
//         };
//     })


// });


// fs.readFile('./users.json', { encoding: 'utf8' }, function(err, data) {
//     if (err) {
//         console.log("Error!" + err);
//         return;
//     }
//     User.remove(function(err) {
//         if (err) {
//             console.log("Error!" + err);
//             return;
//         }
//         var dataUser = JSON.parse(data);
//         for (var i = 0; i < 2; i++) {
//             var user = new User(dataUser.users[i]);
//             user.save(function(err, userCreado) {
//                 if (err) {
//                     console.log("Error!" + err);
//                     return;
//                 }
//                 console.log('User creado: ' + userCreado);

//             });
//         };
//     })


// });
