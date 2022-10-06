const { User } = require("../models/user.model");
const { AppError } = require("../utils/appError.util");
const { catchAsync } = require("../utils/catchAsync.util");

const userExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findOne({
    attributes: { exclude: ["password"] },
    where: { id },
  });

  if (!user) {
    return next(new AppError("the user dosen't exist", 404));
  }

  req.user = user;
  next();
});

module.exports = { userExist };
