const accessControl = require('../db/models/revoked_tokens');

exports.revoke = function (token) {
    return new Promise((resolve, reject) => {
        try {
            if (token == null || token == "null" || token == "" || token == "undefined") {
                reject({ "status": 400, "message": "Invalid Access Token" });
            }
            else {
                accessControl.findOneAndUpdate({ token: token }, { token: token }, { upsert: true }, function (err, data) {
                    if (err) reject({ "status": 400, "message": "Logout Failed" });
                    resolve({ "status": 200, "message": "Logout Successful" });
                });
            }
        }
        catch (error) {
            reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
        }
    });
}

exports.checkRevoked = function (token) {
    return new Promise(async (resolve, reject) => {
        try {
            let revoked = await accessControl.findOne({ token: token });
            if (revoked) resolve(true);
            resolve(false);
        }
        catch (error) {
            reject(error);
        }
    })
};