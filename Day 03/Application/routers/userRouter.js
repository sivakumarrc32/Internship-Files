const express = require('express');
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();

// Define routes
router.route('/user').get(getAllUsers);
router.route('/user/:id').get(getUserById);
router.route('/user').post(createUser);
router.route('/user/:id').put(updateUser);
router.route('/user/:id').delete(deleteUser);

module.exports = router;
