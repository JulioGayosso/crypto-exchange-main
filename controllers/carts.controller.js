const { Cart } = require("../models/cart.model");
const { Product } = require("../models/product.model");
const { ProductInCart } = require("../models/productInCart.model");
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");
const { Order } = require("../models/order.model");

const addProductToCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { productId, quantity } = req.body;

  const product = await Product.findOne({
    where: { id: productId, status: "active" },
  });

  if (!product) {
    return next(new AppError("product not found", 404));
  } else if (quantity > product.quantity) {
    return next(
      new AppError(`this product only has ${product.quantity} items,`, 400)
    );
  }

  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: "active" },
  });

  if (!cart) {
    const newCart = await Cart.create({ userId: sessionUser.id });

    await ProductInCart.create({
      cartId: newCart.id,
      productId,
      quantity,
    });
  } else {
    const productInCart = await ProductInCart.findOne({
      where: { productId, cartId: cart.id },
    });

    if (!productInCart) {
      await ProductInCart.create({ cartId: cart.id, productId, quantity });
    } else if (productInCart.status === "active") {
      return next(new AppError("this product is already in your cart", 400));
    } else if (productInCart.status === "removed") {
      await productInCart.update({ status: "active", quantity });
    }
  }
  res.status(200).json({
    status: "success",
  });
});
const updateProductOnCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const { newQty, productId } = req.body;

  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: "active" },
  });

  if (!cart) {
    return next(new AppError("you dont have any active cart", 400));
  }

  const product = await Product.findOne({
    where: { id: productId, status: "active" },
  });

  if (!product) {
    return next(new AppError("product not found", 404));
  } else if (newQty > product.quantity) {
    return next(
      new AppError(`this product only has ${product.quantity} items,`, 400)
    );
  } else if (0 > newQty) {
    return next(new AppError("cant send negative values", 400));
  }

  const productInCart = await ProductInCart.findOne({
    where: { cartId: cart.id, productId, status: "active" },
  });

  if (!productInCart) {
    return next(new AppError("This product is not in your cart", 404));
  }

  if (newQty === 0) {
    await productInCart.update({ quantity: 0, status: "removed" });
  } else if (newQty > 0) {
    await productInCart.update({ quantity: newQty });
  }

  res.status(200).json({
    status: "success",
  });
});

const purchaseTheCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;

  const cart = await Cart.findOne({
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

  let totalPrice = 0;

  const productsInCartPromises = cart.productInCarts.map(
    async (productInCart) => {
      const product = await Product.findOne({
        where: { id: productInCart.productId },
      });

      const subTotal = product.price * productInCart.quantity;

      const newQuantity = product.quantity - productInCart.quantity;

      totalPrice += subTotal;

      await product.update({ quantity: newQuantity });

      await productInCart.update({ status: "purchased" });
    }
  );

  await cart.update({
    status: "purchased",
  });

  await Promise.all(productsInCartPromises);

  const order = await Order.create({
    userId: sessionUser.id,
    cartId: cart.id,
    totalPrice,
  });

  res.status(201).json({
    status: "success",
    data: { order },
  });
});

const deleteProductFromCart = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { productId } = req.params;

  const cart = await Cart.findOne({
    where: { userId: sessionUser.id, status: "active" },
  });

  if (!cart) {
    return next(new AppError("you havo no active cart", 400));
  }

  const product = await Product.findOne({
    where: { id: productId, status: "active" },
  });

  if (!product) {
    return next(new AppError("product not found", 404));
  }

  const productInCart = await ProductInCart.findOne({
    where: { cartId: cart.id, productId, status: "active" },
  });

  if (!productInCart) {
    return next(new AppError("Product not on cart", 404));
  }

  await productInCart.update({ quantity: 0, status: "removed" });

  res.status(204).json({
    status: "success",
    data: { productInCart },
  });
});

module.exports = {
  addProductToCart,
  updateProductOnCart,
  purchaseTheCart,
  deleteProductFromCart,
};
