const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const { isAdmin } = require('../middleware/auth');
const { validateEmail, pagination } = require('./util/util');

module.exports = {
  // POST
  postUser: async (req, resp, next) => {
    try {
      const user = await new User();
      user.email = req.body.email;
      user.password = bcrypt.hashSync(req.body.password, 10);
      user.roles = req.body.roles;

      if (req.body.email === '' || req.body.password === '') return next(400);

      if (!validateEmail(req.body.email) || req.body.password.length < 3) return next(400);

      return user.save((err, userStored) => {
        if (err) return resp.status(403).send({ message: `Error al salvar la base de datos:${err}` });

        return resp.status(200).send({
          _id: userStored._id,
          email: userStored.email,
          roles: userStored.roles,
        });
      });
    } catch (err) {
      return next(400);
    }
  },

  // GET
  getUsers: async (req, resp, next) => {
    try {
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };

      const users = await User.paginate({}, options);

      const url = `${req.protocol}://${req.get('host') + req.path}`;

      const links = pagination(users, url, options.page, options.limit, users.totalPages);

      resp.links(links);
      return resp.status(200).json(users.docs);
    } catch (err) {
      next(err);
    }
  },
  // GET/:UID
  getUser: async (req, resp, next) => {
    try {
      const { uid } = req.params;
      const user = (validateEmail(uid))
        ? await User.findOne({ email: uid })
        : await User.findById(uid);
      if (!user) {
        return next(404);
      }
      return resp.status(200).send(user);
    } catch (error) {
      return next(404);
    }
  },
  // DELETE
  deleteUser: async (req, resp, next) => {
    try {
      const { uid } = req.params;
      const user = (validateEmail(uid));
      // ? await User.findOne({ email: uid })
      // : await User.findById(uid);
      if (!user) {
        await User.findById(uid, async (err, userId) => {
          if (err) {
            return resp.status(404).send({ message: 'Error' });
          }
          if (!userId) {
            return resp.status(404).send({ message: 'El usuario no existe' });
          }
          await userId.remove((fail) => {
            if (fail) {
              return resp.status(500).send({ message: 'error' });
            }
            return resp.status(200).send({ message: 'se eliminó el usuario' });
          });
        });
      }
      await User.findOne({ email: uid }, async (err, userEmail) => {
        if (err) {
          return resp.status(404).send({ message: 'Error' });
        }
        if (!userEmail) {
          return resp.status(404).send({ message: 'El usuario no existe' });
        }
        await userEmail.remove((fail) => {
          if (fail) {
            return resp.status(404).send({ message: 'error' });
          }
          return resp.status(200).send({ message: 'se eliminó el usuario' });
        });
      });
    } catch (error) {
      return next(404);
    }
  },
  // PUT
  putUser: async (req, resp, next) => {
    try {
      const { uid } = req.params;
      const update = req.body;
      if (!isAdmin(req) && req.body.roles) return next(403);
      const user = (validateEmail(uid))
        ? await User.findOne({ email: uid })
        : await User.findById(uid);
      if (!user) return next(404);
      if (!req.body.email && !req.body.password) return next(400);
      update.password = bcrypt.hashSync(req.body.password, 10);
      if (!user) {
        await User.findByIdAndUpdate(uid, update, (err, userUpdate) => {
          if (err) {
            return resp.status(500).send({ message: 'Error al realizar la petición' });
          }
          if (!userUpdate) {
            return resp.status(404).send({ message: 'El usuario no existe' });
          }
          return resp.status(200).send({ product: userUpdate });
        });
      }
      await User.findOneAndUpdate({ email: uid }, update, (err, userUpdate) => {
        if (err) {
          return resp.status(500).send({ message: 'Error al realizar la petición' });
        }
        if (!userUpdate) {
          return resp.status(404).send({ message: 'El usuario no existe' });
        }
        return resp.status(200).send({ product: userUpdate });
      });
    } catch (err) {
      return next(404);
    }
  },
};
