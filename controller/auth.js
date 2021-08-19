const moongose = require('mongoose');
const User = require('../models/user.model');

module.exports = {
  signUp: () => {

  },
  signIn: (req, res) => {
    User.find({ email: req.body.email, password: req.body.password }, (err, user) => {
      if (err) {
        return res.status(500).send({ message: 'error' });
      }
    });
  },
};
