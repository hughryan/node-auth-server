module.exports = (req, res, next) => {
  // check for missing parameters
  if (!req.body.email) {
    return res.json({
      success: false,
      message: 'Email address required.'
    });
  }
  if (!req.body.password) {
    return res.json({
      success: false,
      message: 'Password required.'
    });
  }

  // validate the request
  req.checkBody('email', 'Invalid email address.').notEmpty().isEmail();
  req.checkBody('password', 'Invalid password.').notEmpty().isLength({
    min: 8,
    max: 30
  });

  // sanitize request
  req.sanitizeBody('email').normalizeEmail();

  // check for errors
  const err = req.validationErrors();
  if (err)
    return res.json({
      success: false,
      message: err[0].msg
    });

  next();
};
