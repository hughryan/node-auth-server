module.exports = (req, res, next) => {
  // get token from headers
  const token = req.headers['x-access-token'];

  // token exists, let's verify it
  if (token) {
    req.app.locals.jwt.verify(token, req.app.locals.config.secret, (err, decoded) => {
      // token failed to authenticate, let's exit
      if (err) return res.json({
        success: false,
        message: 'Failed to authenticate token.'
      });

      // token is authentic, return payload
      req.decoded = decoded;
      next();
    });

    // there is no spoon...i mean token, let's exit
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });
  }
};
