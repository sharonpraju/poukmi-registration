const userModel = require('../models/userModel.js');
const revokeModel = require('../models/revokeModel.js');
const success_function = require('../utils/response-handler').success_function;
const error_function = require('../utils/response-handler').error_function;

exports.login = function(req, res)
{
    let email = req.body.email;
    let password = req.body.password;

    userModel.login(email, password)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}

exports.register = function(req, res)
{
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let password = req.body.password;

    userModel.register(first_name, last_name, email, password)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}

exports.logout = function(req, res)
{
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    revokeModel.revoke(token)
    .then((result)=>{
        let response = success_function(result)
        res.status(result.status).send(response);
    }).catch((error)=>{
        let response = error_function(error)
        res.status(error.status).send(response);
    });
}

exports.checkRevoked = function(req, res) 
{
    return new Promise((resolve, reject)=>{
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];

        revokeModel.checkRevoked(token).then((message)=>{
            resolve(message);
        }).catch((error)=>{
            reject(error);
        });
    });
};