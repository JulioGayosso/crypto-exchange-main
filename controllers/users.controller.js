const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

//models
const { User } = require("../models/user.model");
//utils
const { catchAsync } = require("../utils/catchAsync.util");
const { AppError } = require("../utils/appError.util");
const { Order } = require("../models/order.model");
const { Cart } = require("../models/cart.model");
const { Product } = require("../models/product.model");

const createUser = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  newUser.password = undefined;

  res.status(201).json({
    status: "success",
    data: { newUser },
  });
});
const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email, status: "active" } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError("Invalid credentials", 400));
  }

  user.password = undefined;

  const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.status(200).json({
    status: "success",
    data: { user, token },
  });
});
const getMySellingProducts = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const myProduscts = await Product.findAll({
    where: { userId: sessionUser.id },
  });

  if (myProduscts[0] == undefined) {
    return next(new AppError("you have no products yet", 404));
  }

  res.status(200).json({
    status: "success",
    data: { myProduscts },
  });
});
const updateMyUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { username, email } = req.body;

  await user.update({ username, email });

  res.status(200).json({
    status: "success",
    data: { user },
  });
});
const deleteMyUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: "deleted" });

  res.status(204).json({
    status: "success",
  });
});

const getAllOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const myOrders = await Order.findAll({
    where: { userId: sessionUser.id, status: "active" },
    include: { model: Cart },
  });

  if (myOrders[0] === undefined) {
    return next(new AppError("you have no orders yet", 404));
  }

  res.status(200).json({
    status: "success",
    data: { myOrders },
  });
});
const getOneOfMyOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;

  const oneOfMyOrders = await Order.findOne({
    where: { id, userId: sessionUser.id, status: "active" },
  });

  res.status(200).json({
    status: "success",
    data: { oneOfMyOrders },
  });
});

module.exports = {
  createUser,
  login,
  getMySellingProducts,
  updateMyUser,
  deleteMyUser,
  getAllOrders,
  getOneOfMyOrders,
};
