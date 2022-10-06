const express = require("express");

//controlers
const {
  createUser,
  login,
  getMySellingProducts,
  updateMyUser,
  deleteMyUser,
  getAllOrders,
  getOneOfMyOrders,
} = require("../controllers/users.controller");
//middlewares
const {
  protectSession,
  protectUserAccount,
} = require("../middlewares/auth.middlewares");
const { orderExist } = require("../middlewares/order.middlewares");
const { userExist } = require("../middlewares/user.middlewares");
const {
  createUserValidations,
} = require("../middlewares/validators.middlewares");

const usersRouter = express.Router();

usersRouter.post("/", createUserValidations, createUser);
usersRouter.post("/login", login);

usersRouter.use(protectSession);

usersRouter.get("/me", getMySellingProducts);
usersRouter.get("/orders", getAllOrders);
usersRouter.get("/orders/:id", orderExist, getOneOfMyOrders);
usersRouter.patch("/:id", userExist, protectUserAccount, updateMyUser);
usersRouter.delete("/:id", userExist, protectUserAccount, deleteMyUser);

module.exports = { usersRouter };
