const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  req.app.locals.User.find({}, (err, users) => {
    return res.json(users);
  });
});

module.exports = router;
