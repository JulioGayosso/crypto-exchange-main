//models
const { Category } = require("../models/category.model");
const { Product } = require("../models/product.model");
const { ProductImg } = require("../models/productImg.model");
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

//utils
const {
  getProductsImgsUrls,
  uploadProductImgs,
} = require("../utils/firebase.util");

const getAllProducts = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: { status: "active" },
    include: { model: ProductImg },
  });

  const productsWithImgs = await getProductsImgsUrls(products);

  if (products[0] === undefined) {
    return next(new AppError("There are not products available", 404));
  }

  res.status(200).json({
    status: "success",
    data: { products: productsWithImgs },
  });
});

const getOneProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  res.status(200).json({
    status: "success",
    data: { product },
  });
});

const getAllCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({ where: { status: "active" } });

  res.status(200).json({
    status: "success",
    data: { categories },
  });
});

const createProduct = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { title, description, price, categoryId, quantity } = req.body;

  const newProduct = await Product.create({
    title,
    description,
    quantity,
    price,
    categoryId,
    userId: sessionUser.id,
  });

  await uploadProductImgs(req.files, newProduct.id);

  res.status(201).json({
    status: "success",
    data: { newProduct },
  });
});

const updateMyProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, quantity } = req.body;
  const { product } = req;

  await product.update({
    title,
    description,
    price,
    quantity,
  });

  res.status(200).json({
    status: "success",
    data: { product },
  });
});

const deleteMyProduct = catchAsync(async (req, res, next) => {
  const { product } = req;

  await product.update({ status: "deleted" });

  res.status(204).json({
    status: "success",
  });
});

const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const newCategory = await Category.create({ name });

  res.status(201).json({
    status: "success",
    data: { newCategory },
  });
});

const updateCategory = catchAsync(async (req, res, next) => {
  const { category } = req;
  const { name } = req.body;

  await category.update({ name });

  res.status(200).json({
    status: "success",
    data: { category },
  });
});

module.exports = {
  getAllProducts,
  getOneProduct,
  getAllCategories,
  createProduct,
  updateMyProduct,
  deleteMyProduct,
  createCategory,
  updateCategory,
};
