const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const users = require('../db/models/users');

exports.login = async function (email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            if (email && password) {
                let user = await users.findOne({ $and: [{ email: email }, { status: 'active' }] });
                if (user) {
                    //verifying password
                    bcrypt.compare(password, user.password, async (error, auth) => {
                        if (auth === true) {
                            //valid credentials
                            let access_token = jwt.sign({ "user_id": user._id, "user_type": user.type }, process.env.PRIVATE_KEY, { expiresIn: '10d' });
                            resolve({ "status": 200, "data": access_token, "message": "Login Successful" });
                        }
                        else {
                            reject({ "status": 401, "message": "Invalid Credentials" });
                        }
                    });
                }
                else {
                    reject({ "status": 401, "message": "Invalid Credentials" });
                }
            }
            else {
                if (!email) reject({ "status": 422, "message": "Email is required" });
                if (!password) reject({ "status": 422, "message": "Password is required" });
            }
        }
        catch (error) {
            reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
        }
    });
}

exports.register = async function (first_name, last_name, email, password) {
    return new Promise(async (resolve, reject) => {
        try {
            if (first_name && last_name && email && password) {
                //checking if user exist
                let user = await users.findOne({ email: email });
                if (user && user.status == 'active') {
                    //user exist
                    reject({ "status": 422, "message": "User Already Exist" });
                }
                else {
                    //user does not exist or the status is pending
                    //creating user
                    let salt = bcrypt.genSaltSync(10);
                    let password_hash = bcrypt.hashSync(password, salt)
                    let new_user = {
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        password: password_hash,
                        type: "user",
                        status: "active",
                        added_on: dayjs().format(),
                        added_by: null
                    };
                    await users.findOneAndUpdate({ email: email }, new_user, { upsert: true, new: true });
                    resolve({ "status": 200, "message": "Registration Successful" });
                }
            }
            else {
                if (!first_name) reject({ "status": 422, "message": "First name is required" });
                if (!last_name) reject({ "status": 422, "message": "Last name is required" });
                if (!email) reject({ "status": 422, "message": "Email is required" });
                if (!password) reject({ "status": 422, "message": "Password is required" });
            }
        }
        catch (error) {
            reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
        }
    });
}

exports.fetchOne = async function (id) {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await users.findOne({ _id: id }, '-password');
            if (user) {
                resolve({ "status": 200, "data": user });
            }
            else {
                reject({ "status": 404, "message": "User Not Found" })
            }
        }
        catch (error) {
            reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
        }
    });
}

exports.fetchAll = async function (page, limit) {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await users.find({ $and: [{ status: "active" }, { type: { $ne: "admin" } }] }, '-password').sort({ _id: -1 }).skip((page - 1) * limit).limit(limit);
            let count = await users.count({ $and: [{ status: "active" }, { type: { $ne: "admin" } }] });
            let users_data = {
                "count": count,
                "users": user
            };
            resolve({ "status": 200, "data": users_data });
        }
        catch (error) {
            reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
        }
    });
}

exports.deleteOne = async function (token, id) {
    return new Promise(async (resolve, reject) => {
        try {
            if (id) {
                let decoded = jwt.decode(token);
                let user_data = {
                    status: "deleted",
                    deleted_on: dayjs().format(),
                    deleted_by: decoded.user_id
                }
                let data = await users.updateOne({ _id: decoded.user_id }, user_data);
                if (data.matchedCount === 1 && data.modifiedCount === 1) resolve({ "status": 200, "message": "User deleted successfully" });
                else if (data.matchedCount === 0) reject({ "status": 404, "message": "User not found" });
                else reject({ "status": 400, "message": "Users deletion failed" });
            }
            else reject({ "status": 422, "message": "ID is required" });
        }
        catch (error) {
            reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
        }
    });
}

exports.deleteAll = async function (token) {
    return new Promise(async (resolve, reject) => {
        try {
            let decoded = jwt.decode(token);
            let user_data = {
                status: "deleted",
                deleted_on: dayjs().format(),
                deleted_by: decoded.user_id
            }
            let data = await users.updateMany({ type: { $ne: "admin" } }, { $set: user_data });
            if (data.matchedCount >= 1 && data.modifiedCount >= 1) resolve({ "status": 200, "message": "Users deleted successfully" });
            else if (data.matchedCount === 0) reject({ "status": 404, "message": "Users not found" });
            else reject({ "status": 400, "message": "Users deletion failed" });
        }
        catch (error) {
            reject({ "status": 400, "message": error ? (error.message ? error.message : error) : "Something went wrong" });
        }
    });
}