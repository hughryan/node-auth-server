const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  // check the database to see if the email already exists
  req.app.locals.User.findOne({
    email: req.body.email
  }, (err, user) => {
    // check for database errors
    if (err) throw err;

    // account already exists, let's exit
    if (user) return res.json({
      success: false,
      message: 'An account for ' + req.body.email + ' already exists.'
    });

    // account doesn't exist, let's create it
    req.app.locals.pbkdf2.secureHash(req.body.password, (err, passwordHash, newSalt) => {
      // create user with email and hashed password
      const newUser = new req.app.locals.User({
        email: req.body.email,
        password: passwordHash,
        salt: newSalt
      });

      // save new user to database
      newUser.save((err) => {
        if (err) throw err;
        console.log('Account for ' + req.body.email + ' created.');
        return res.json({
          success: true,
          message: 'An account for ' + req.body.email + ' was successfully created.'
        });
      });
    });
  });
});

module.exports = router;
