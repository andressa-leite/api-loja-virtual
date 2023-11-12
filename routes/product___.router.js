const express = require("express");
const router = express.Router();
const productController = require("../controllers/product___.controller");
//const authMiddleware = require("../middleware/auth.middleware");




router.post("/", productController.createProduct);

//router.use(authMiddleware(["ADMIN"]));

router.get("/", productController.getProducts); 

router.get("/:id", productController.getProductById); 

router.put("/:id", productController.updateProduct);

router.patch("/:id", productController.updateProduct);

router.patch("/:id/image", productController.uploadImage);

router.delete("/:id", productController.deleteProduct);



module.exports = router;