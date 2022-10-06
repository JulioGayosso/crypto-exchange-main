const express = require("express");
const {
  getAllProducts,
  getOneProduct,
  getAllCategories,
  createProduct,
  createCategory,
  updateCategory,
  updateMyProduct,
  deleteMyProduct,
} = require("../controllers/products.controllers");
const {
  protectSession,
  protectUserAccount,
  protectUserProducts,
} = require("../middlewares/auth.middlewares");
const { categoryExist } = require("../middlewares/category.middlewares");
const { productExist } = require("../middlewares/product.middlewares");
const { userExist } = require("../middlewares/user.middlewares");
const {
  createProductValidations,
} = require("../middlewares/validators.middlewares");
const { upload } = require("../utils/multer.util");

const productsRouter = express.Router();
//Non protected

productsRouter.get("/", getAllProducts);
productsRouter.get("/categories", getAllCategories);
productsRouter.get("/:id", productExist, getOneProduct);

//Ptotected
productsRouter.use(protectSession);
productsRouter.post("/categories", createCategory);
productsRouter.post(
  "/",
  upload.array("productImg", 5),
  createProductValidations,
  createProduct
);
productsRouter.patch("/categories/:id", categoryExist, updateCategory);
productsRouter.patch(
  "/:id",
  productExist,
  protectUserProducts,
  updateMyProduct
);
productsRouter.delete(
  "/:id",
  productExist,
  protectUserProducts,
  deleteMyProduct
);

module.exports = { productsRouter };
