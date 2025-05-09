// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const { authenticateToken } = require('../middleware/authentication');

router
.post("/register", userController.register)
.post("/login", userController.login)
.post("/refresh-token", userController.refreshToken)
.post("/logout", userController.logout)
.get("/current", authenticateToken,  userController.getCurrentUser);
exports.router = router;