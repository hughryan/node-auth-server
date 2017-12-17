const fs = require('fs');

module.exports = {

  'secret': process.env.AUTH_SECRET,
  'database': 'mongodb://localhost/test',
  'port': '8443',
  'credentials': {
    'key': fs.readFileSync('./private.key'),
    'cert': fs.readFileSync('./certificate.pem')
  }

};
