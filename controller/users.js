const User = require('../models/user.model');

module.exports = {
  // USERS
  // GET
  getUsers: (req, resp) => {
    // resp.status(200).json(req.rows);
    const { body } = req;
    User.find(body)
      .then(resp.send(body))
      .catch(console.log);
  },
};
