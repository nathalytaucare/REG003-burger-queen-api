const User = require('../models/user.model');

module.exports = {
  // USERS
  // GET
  getUsers: (req, resp) => {
    User.find({}, (err, users) => {
      if (err) {
        return resp.status(500).send({ message: 'error' });
      }
      if (!users) {
        return resp.status(404).send({ message: 'error' });
      }
      resp.send(200, { users });
    });
  },

  postUser: (req, res) => {
    console.log('POST/users');
    console.log(req.body);

    const user = new User();
    user.email = req.body.email;
    user.password = req.body.password;
    user.roles.admin = req.body.roles.admin;

    user.save((err, userStored) => {
      if (err) res.status(500).send({ message: 'Error en en la base de datos' });

      res.status(200).send({ user: userStored });
    });
  },
  deleteUser: (req, resp) => {
    const { uid } = req.params;
    User.findById(uid, (err, user) => {
      if (err) {
        return resp.status(500).send({ message: 'error' });
      }
      user.remove((err) => {
        if (err) {
          return resp.status(500).send({ message: 'error' });
        }
        resp.status(200).send({ message: 'se eliminó el usuario' });
      });
    });
  },
  putUser: (req, resp) => {
    const { uid } = req.params;
    const update = req.body;

    User.findByIdAndUpdate(uid, update, (err, userUpdate) => {
      if (err) {
        resp.status(500).send({ message: 'error' });
      }
      resp.status(200).send({ user: userUpdate });
    });
  },
};
