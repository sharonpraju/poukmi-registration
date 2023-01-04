const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const accessControl = require('../utils/access-control').accessControl;

//middleware to validate token and user type based access control
const setAccessControl = (access_type) => {
    return (req, res, next) => {
        accessControl(access_type, req, res, next)
    }
};

router.get('/users', setAccessControl('1'), userController.fetchAll);
router.get('/users/:id', setAccessControl('1'), userController.fetchOne);
router.delete('/users', setAccessControl('1'), userController.deleteAll);
router.delete('/users/:id', setAccessControl('1'), userController.deleteOne);

module.exports = router;