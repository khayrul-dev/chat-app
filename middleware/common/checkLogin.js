const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  const cookie =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
  if (cookie) {
    try {
      const token = cookie[process.env.COOKIE_NAME];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;

      if (res.locals.html) {
        res.locals.loggedInUser = decoded;
      }
      next();
    } catch (err) {
      if (res.locals.html) {
        res.render("/");
      } else {
        res.status(500).json({
          errors: {
            common: {
              msg: "Authentication failed!",
            },
          },
        });
      }
    }
  } else {
    if (res.locals.html) {
      res.render("index");
    } else {
      res.status(401).json({
        error: "Authentication failed!",
      });
    }
  }
};

const redirectLoggedIn = (req, res, next) => {
  const cookie =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
  if (!cookie) {
    next();
  } else {
    res.redirect("/inbox");
  }
};

module.exports = {
  checkLogin,
  redirectLoggedIn,
};
