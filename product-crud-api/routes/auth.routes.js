const express = require("express");
const router = express.Router();

const authController = require("../controller/auth.controller");

router.post("/register", authController.mongoRegister);
router.post("/login", authController.mongoLogin);

module.exports = router;
