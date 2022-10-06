const express = require("express");

//middlewares
const { protectSession } = require("../middlewares/auth.middlewares");

//controllers
const {
  addProductToCart,
  updateProductOnCart,
  deleteProductFromCart,
  purchaseTheCart,
} = require("../controllers/carts.controller");

const cartsRouter = express.Router();

//Protected
cartsRouter.use(protectSession);
cartsRouter.post("/add-product", addProductToCart);
cartsRouter.patch("/update-cart", updateProductOnCart);
cartsRouter.post("/purchase", purchaseTheCart);
cartsRouter.delete("/:productId", deleteProductFromCart);

module.exports = { cartsRouter };
