const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
//controller
const { globalErrorHandler } = require("./controllers/error.controller");

//routes
const { usersRouter } = require("./Routes/users.routes");
const { productsRouter } = require("./Routes/products.routes");
const { cartsRouter } = require("./Routes/carts.routes");

const app = express();

app.use(express.json());

app.use(helmet());

app.use(compression());

if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
else if (process.env.NODE_ENV === "production") app.use(morgan("combine"));

app.use("/api/v1/users", usersRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/carts", cartsRouter);

app.use(globalErrorHandler);

app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `${req.method} ${req.url} doesn't exist in our server`,
  });
});

module.exports = { app };
