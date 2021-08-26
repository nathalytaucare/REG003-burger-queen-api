const bcrypt = require('bcrypt');
const User = require('../models/user.model');

// PAGINATION
/*
const paginate = (sourceList, page, perPage) => {
  const totalCount = sourceList.length;
  const lastPage = Math.floor(totalCount / perPage);
  const sliceBegin = page * perPage;
  console.log(sliceBegin);
  const sliceEnd = sliceBegin + perPage - 5;
  console.log(sliceEnd);
  const pageList = sourceList.slice(sliceBegin, sliceEnd);
  console.log(pageList);
  return {
    pageData: pageList,
    nextPage: page < lastPage ? page + 1 : null,
    totalCount,
  };
};
*/

module.exports = {
  // POST
  postUser: async (req, resp, next) => {
    try {
      const user = await new User();
      user.email = req.body.email;
      user.password = bcrypt.hashSync(req.body.password, 10);
      user.roles = req.body.roles;

      if (req.body.email === '' || req.body.password === '') {
        return next(400);
      }
      const emailRegex = /[\w._%+-]+@[\w.-]+/g;
      if (!emailRegex.test(req.body.email) || req.body.password.length < 5) {
        return next(400);
      }
      return user.save((err, userStored) => {
        if (err) {
          return resp.status(403).send({ message: `Error al salvar la base de datos:${err}` });
        }
        // console.log({ user: userStored.email, userStored._id, userStored.roles });
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

      const links = {
        first: `${url}?limit=${options.limit}&page=1`,
        prev: users.hasPrevPage ? `${url}?limit=${options.limit}&page=${options.page - 1}` : `${url}?limit=${options.limit}&page=${options.page}`,
        next: users.hasNextPage ? `${url}?limit=${options.limit}&page=${options.page + 1}` : `${url}?limit=${options.limit}&page=${options.page}`,
        last: `${url}?limit=${options.limit}&page=${users.totalPages}`,
      };
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

      // const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
      const emailRegex = /[\w._%+-]+@[\w.-]+/g;
      const user = (emailRegex.test(uid))
        ? await User.findOne({ email: uid })
        : await User.findById(uid);

      /*   User.findOne({ email: uid }, (err, myUser) => {
        console.log(myUser);
      }); */
      if (!user) {
        return next(404);
      }
      return resp.status(200).send(user);

      /*  await User.findById(uid, (err, user) => {
        if (err) {
          console.log(`Error: ${err}`);
          return next(404);
        }
        if (!user) {
          console.log('No user');
          return next(404);
        }
        return resp.status(200).send({ user });

      } ) */
    } catch (error) {
      console.log(`Error: ${error}`);
      return next(404);
    }
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
  putUser: async (req, resp, next) => {
    try {
      const { uid } = req.params;
      const update = req.body;
      const emailRegex = /[\w._%+-]+@[\w.-]+/g;
      const user = (emailRegex.test(uid))
        ? await User.findOneAndUpdate({ email: uid }, update)
        : await User.findByIdAndUpdate(uid, update);
      console.log(user);

      if (!user) {
        return resp.status(404).send({ message: 'El usuario no existe' });
      }
      if (!req.body.email && !req.body.password) {
        return next(400);
      }

      return resp.status(200).send({ user });
    } catch (error) {
      return next(404);
    }
  },
};
