const { Order } = require("../models/order.model");
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const orderExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const order = await Order.findOne({ where: { id } });

  if (!order) {
    return next(new AppError("the order dosn't exist", 404));
  }

  req.order = order;
  next();
});

module.exports = { orderExist };
