// Models
const { Cart } = require("../models/cart.model");
const { ProductInCart } = require("../models/productInCart.model");

// Utils
const { catchAsync } = require("../utils/catchAsync.util");

const cartIsActive = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  let cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: "active" },
    include: {
      model: ProductInCart,
      required: false,
      where: { status: "active" },
    },
  });

  if (!cart) {
    cart = await Cart.create({
      userId: sessionUser.id,
    });
  }

  req.cart = cart;

  next();
});

module.exports = { cartIsActive };
