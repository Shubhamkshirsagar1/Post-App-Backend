const isAuth = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    return res.status(400).json({
      message: "Invalid Session. Please Login Again!!",
    });
  }
};

module.exports = { isAuth };
