const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  // find the account in the database
  req.app.locals.User.findOne({
    email: req.body.email
  }, (err, user) => {
    // check for database errors
    if (err) throw err;

    // account doesn't exist, let's exit
    if (!user) return res.json({
      success: false,
      message: 'Invalid credentials.'
    });

    // account exists, so let's check the password
    req.app.locals.pbkdf2.verify(user.salt, user.password, req.body.password, (err, valid) => {
      // check for hash errors
      if (err) throw err;

      // password doesn't match, let's exit
      if (!valid) return res.json({
        success: false,
        message: 'Invalid credentials.'
      });

      // password matches, create a token and give it to the user
      const payload = {
        email: user.email
      }; // token body
      const token = req.app.locals.jwt.sign(payload, req.app.locals.config.secret, {
        expiresIn: "24h" // expires in 24 hours
      });

      return res.json({
        success: true,
        message: 'Successfully logged in.',
        token: token
      });
    });
  });
});

module.exports = router;
