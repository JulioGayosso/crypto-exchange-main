const { app } = require("./app");
//models
const { initModels } = require("./models/initModels.model");
//utils
const { db } = require("./utils/db.util");

const startServer = async () => {
  try {
    await db.authenticate();

    initModels();

    await db.sync();

    const PORT = process.env.PORT || 4020;

    app.listen(PORT, () => {
      console.log("Express app is running! :)", PORT);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
