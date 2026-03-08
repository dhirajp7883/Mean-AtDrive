const express = require("express");
const router = express.Router();
const productController = require("../controller/product.controller");

router.post("/create-product", productController.createProduct);
router.get("/get-all-product", productController.getProducts);
router.get("/get-product-by-id/:id", productController.getProductById);
router.put("/update-product-by-id/:id", productController.updateProduct);
router.delete("/delete-product-by-id/:id", productController.deleteProduct);

module.exports = router;
