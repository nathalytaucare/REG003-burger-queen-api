/* eslint-disable consistent-return */
const User = require('../models/user.model');

module.exports = {
  // POST
  postUser: (req, resp, next) => {
    const user = new User();
    user.email = req.body.email;
    user.password = req.body.password;
    user.roles.admin = req.body.roles.admin;
    if (req.body.email === '' || req.body.password === '') {
      return next(400);
    }
    user.save((err, userStored) => {
      if (err) {
        return resp.status(500).send({ message: `Error al salvar la base de datos:${err}` });
      }
      return resp.status(200).send({ user: userStored });
    });
  },
  // GET
  getUsers: (req, resp) => {
    User.find({}, (err, users) => {
      if (err) {
        return resp.status(500).send({ message: 'error' });
      }
      if (!users) {
        return resp.status(404).send({ message: 'No hay usuarios' });
      }
      resp.send(200, { users });
    });
  },
  // GET/:UID
  getUser: (req, resp) => {
    const { uid } = req.params;
    User.findById(uid, (err, user) => {
      if (err) {
        return resp.status(500).send({ message: 'Error al realizar la petición' });
      }
      if (!user) {
        return resp.status(404).send({ message: 'El usuario no existe' });
      }
      resp.status(200).send({ user });
    });
  },
  // DELETE
  deleteUser: (req, resp) => {
    const { uid } = req.params;
    User.findById(uid, (err, user) => {
      if (err) {
        return resp.status(500).send({ message: 'error' });
      }
      if (!user) {
        return resp.status(404).send({ message: 'El usuario no existe' });
      }
      user.remove((fail) => {
        if (fail) {
          return resp.status(500).send({ message: 'error' });
        }
        resp.status(200).send({ message: 'se eliminó el usuario' });
      });
    });
  },
  // PUT
  putUser: (req, resp, next) => {
    if (!req.body.email && !req.body.password) {
      return next(400);
    }
    const { uid } = req.params;
    const update = req.body;
    User.findByIdAndUpdate(uid, update, (err, userUpdate) => {
      if (err) {
        return resp.status(500).send({ message: 'error' });
      }
      if (!userUpdate) {
        return resp.status(404).send({ message: 'El usuario no existe' });
      }
      resp.status(200).send({ user: userUpdate });
    });
  },
};
