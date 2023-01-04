const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController.js');
const accessControl = require('../utils/access-control').accessControl;

//middleware to validate token and user type based access control
const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};

router.post('/login', setAccessControl('*'), authController.login);
router.post('/register', setAccessControl('*'), authController.register);
router.post('/logout', setAccessControl('1,2'), authController.logout);
module.exports = router;