const express = require('express');
const router = express.Router();
const {
    createProducts,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} = require('../controllers/products');

router
.post("/create_products", createProducts)
.get("/get_all_products", getAllProducts)
.get("/get_product/:id", getProductById)
.put("/update_product/:id", updateProduct)
.delete("/delete_product/:id", deleteProduct);
exports.router = router;