const express = require("express");
const router = express.Router();
const weatherController = require("../controller/weather.controller");

router.get("/weather", weatherController.getWeather);

module.exports = router;
