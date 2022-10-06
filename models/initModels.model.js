const { Cart } = require("./cart.model");
const { Category } = require("./category.model");
const { Order } = require("./order.model");
const { Product } = require("./product.model");
const { ProductImg } = require("./productImg.model");
const { ProductInCart } = require("./productInCart.model");
const { User } = require("./user.model");

const initModels = () => {
  User.hasMany(Order, { foreignKey: "userId" });
  Order.belongsTo(User);

  User.hasMany(Product, { foreignKey: "userId" });
  Product.belongsTo(User);

  User.hasOne(Cart, { foreignKey: "userId" });
  Cart.belongsTo(User);

  Category.hasMany(Product, { foreignKey: "categoryId" });
  Product.belongsTo(Category);

  Product.hasMany(ProductImg, { foreignKey: "productId" });
  ProductImg.belongsTo(Product);

  Product.hasOne(ProductInCart, { foreignKey: "productId" });
  ProductInCart.belongsTo(Product);

  Cart.hasOne(Order, { foreignKey: "cartId" });
  Order.belongsTo(Cart);

  Cart.hasMany(ProductInCart, { foreignKey: "cartId" });
  ProductInCart.belongsTo(Cart);
};

module.exports = { initModels };
