const bcrypt = require('bcrypt');
const User = require('../models/user.model');

module.exports = {
  // POST
  postUser: (req, resp, next) => {
    const user = new User();
    user.email = req.body.email;
    if (req.body.email === '' || req.body.password === '') return next(400);
    user.password = bcrypt.hashSync(req.body.password, 10);
    // user.roles.admin = req.body.roles.admin;
    
    return user.save((err, userStored) => {
      if (err) {
        return resp.status(500).send({ message: `Error al salvar la base de datos:${err}` });
      }
      return resp.status(200).send({ user: userStored });
    });
  },
  // GET
  getUsers: (req, resp) => {
    const fullUrl = `<${req.protocol}://${req.get('Host')}${req.originalUrl}>`;
    console.log(fullUrl);
    const options = {
      limit: parseInt(req.query.limit, 10) || 10,
      page: parseInt(req.query.page, 10) || 1,
      select: '-password',
    };
    User.paginate({}, options, (err, users) => {
      if (err) {
        return resp.status(500).send({ message: 'error' });
      }
      if (!users) {
        return resp.status(404).send({ message: 'No hay usuarios' });
      }
      return resp.status(200).send({ users });
    });
  },
  // GET/:UID
  getUser: (req, resp) => {
    const { uid } = req.params;
    User.findById(uid, (err, user) => {
      if (err) {
        return resp.status(404).send({ message: 'Error al realizar la petición' }); // cambio 500 a 404
      }
      if (!user) {
        return resp.status(404).send({ message: 'El usuario no existe' });
      }
      return resp.status(200).send({ user });
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
      return user.remove((fail) => {
        if (fail) {
          return resp.status(500).send({ message: 'error' });
        }
        return resp.status(200).send({ message: 'se eliminó el usuario' });
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
    return User.findByIdAndUpdate(uid, update, (err, userUpdate) => {
      if (err) {
        return resp.status(500).send({ message: 'error' });
      }
      if (!userUpdate) {
        return resp.status(404).send({ message: 'El usuario no existe' });
      }
      return resp.status(200).send({ user: userUpdate });
    });
  },
};
