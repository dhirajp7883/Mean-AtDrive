const express = require("express");
const router = express.Router();
const orderController = require("../controller/order.controller");

router.post("/create-order", orderController.createOrder);
router.get("/get-all-orders", orderController.getOrders);
router.get("/get-order-by-id/:id", orderController.getOrderById);
router.put("/update-order-by-id/:id", orderController.updateOrder);
router.delete("/delete-order-by-id/:id", orderController.deleteOrder);

module.exports = router;
