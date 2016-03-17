"use strict";
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypto = require("crypto");
var User = mongoose.model('User');


//Si queremos llevar la autenticación a otros módulos, sólo hace falta copiar las dos líneas siguientes
var auth = require('../../../lib/auth');
router.use(auth());


/*----------------------------Get-----------------------------------------*/

/**
@api {get} /users/ Obtener todos los users disponibles
 * @apiExample {curl} Example usage:
 *     curl -i http://http://localhost:3000/api/v1/users/
@apiPermission basicAuth
@apiVersion 1.0.0
@apiName GetUsers
@apiGroup Users

@apiSuccess {JSON} res Salida de los usuarios en JSON
@apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *   {
        "result": true,
        "rows": [
     {
         "_id": "56e921788ba3f99c0307d429",
         "nombre": "prueba1",
         "email": "prueba1@gmail.com",
         "clave": "75lOcmKni5fAOa31ghTuffEHaCSn5HU4lIumGuArBcc=",
         "__v": 0
         },
     {
        "_id": "56e9218c8ba3f99c0307d42a",
        "nombre": "prueba2",
        "email": "prueba2@gmail.com",
        "clave": "klcwCcntMovZ1H1xh+AesKvkuZX7ar4HJLT1O+1ZAmQ=",
         "__v": 0
    }
}
 * @apiError UserNotFound Ha habido un error
*/

router.get('/', function(req, res) {
    User.list(function(err, rows) {
        if (err) {
            res.send("Ha habido un error", err);
            return;
        }
        //cuando estén disponibles mando la vista
        res.json({ result: true, rows: rows });
        return;

    });

});

/*----------------------------Post-----------------------------------------*/
/**
@api {post} /users/ Añadir nuevo usuario
 * @apiExample {curl} Example usage:
 *     curl -i http://http://localhost:3000/api/v1/users/
@apiPermission basicAuth
@apiVersion 1.0.0
@apiName PostUser
@apiGroup Users
@apiParam {String} nombre Nombre del usuario. En caso de que exista ese nombre, no se guardará el usuario. 
@apiParam {String} email Email del usuario
@apiParam {String} clave Password del usuario que se guardará con hash.


@apiSuccess {String} res Salida del nombre y email del usuario creado.
@apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK

    User creado.- 
    Nombre: Paco6
    Email: paco5@email.com

 * @apiError UserNotFound Ha habido un error
*/
router.post('/', function(req, res, next) {
    var nombre = req.body.nombre;
    var email = req.body.email;
    var password = req.body.clave;
    let filter = {};
    filter.nombre = nombre;
    User.findOne(filter, function(err, row) {
        if (err) {
            res.send('Ha habido un error', err);
            return;
        }
        if (!row) {
            var sha256 = crypto.createHash("sha256");
            sha256.update(password, "utf8"); //utf8 here
            var result = sha256.digest("base64");
            var user = new User({ nombre: nombre, email: email, clave: result });
            user.save(function(err, user) {
                if (err) {
                    console.log("Error!" + err);
                    return;
                }
                res.send('User creado.- \n' + "Nombre: " + user.nombre + "\n" + "Email: " + user.email);
                return;

                console.log('User creado: ' + User);

            });
        } else res.send("Usuario ya registrado");

    });
});




/*----------------------------Delete-----------------------------------------*/
/**
@api {delete} /users/:id Borrar usuario existente
 * @apiExample {curl} Example usage:
 *     curl -i http://http://localhost:3000/api/v1/users/78dad778
@apiPermission basicAuth@apiVersion 1.0.0
@apiVersion 1.0.0
@apiName DeleteUser
@apiGroup Users
@apiParam {String} id Identificador único del usuario

@apiSuccess {String} res Usuario eliminado
@apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
    "Usuario eliminado"
 * @apiError UserNotFound Identificador no encontrado
*/

router.delete('/:id', function(req, res) {
    User.remove({ _id: req.params.id }, function(err) {
        if (err) {
            res.send("Usuario no encontrado", err);
            return;
        }
        res.json("Usuario eliminado");
    });
});

/*----------------------------Update-----------------------------------------*/

/**
@api {update} /users/:id Modificar usuario existente.
 * @apiExample {curl} Example usage:
 *     curl -i http://http://localhost:3000/api/v1/users/78dad778
@apiPermission basicAuth
@apiVersion 1.0.0
@apiName UpdateUser
@apiGroup Users
@apiParam {String} id Identificador único del usuario
@apiParam {String} nombre Nombre del usuario. Si el nombre de usuario ya existe en la base de datos, no se realizará la modificación
@apiParam {String} email Email del usuario
@apiParam {String} clave Password del usuario que se guardará con hash.
@apiSuccess {String} res User modificado
@apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 User modificado
 * @apiError UserNotFound User no encontrado
*/


router.put('/:id', function(req, res) {
    //Para actualizar varios hay que usar en options
    var options = {};
    // var options = {multi:true}; Para actualizar varios usar multi

    User.findOne({ nombre: req.body.nombre }, function(err, row) {
        if (err) {
            res.send("Error", err);
            return;
        }
        console.log("Row: ", row);
        if (!row) {
            User.update({ _id: req.params.id }, { $set: req.body }, options, function(err, data) {
                if (err) {
                    res.send("User no encontrado", err);
                    return;
                }

                res.send("Usuario modificado");

            });
        } else {
            res.send("El usuario ya está registrado");

        }

    })

});

module.exports = router;
