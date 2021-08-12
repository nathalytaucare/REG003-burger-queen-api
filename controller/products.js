const Product = require('../models/product.model');

module.exports = {
  // USERS
  // GET
  postProduct: (req, resp, next) => {
    const product = new Product();
    product.name = req.body.name;
    product.price = req.body.price;
    product.image = req.body.image;
    product.dateEntry = req.body.dateEntry;

    if (req.body.name === '' || req.body.price === '') {
      return next(400);
    }
    product.save((err, productStored) => {
      if (err) {
        return resp.status(500).send({ message: `Error al salvar la base de datos:${err}` });
      }
      resp.status(200).send({ user: productStored });
    });
  },
  getProducts: (req, resp) => {
    Product.find({}, (err, products) => {
      if (err) {
        return resp.status(500).send({ message: 'error' });
      }
      if (!products) {
        return resp.status(404).send({ message: 'error' });
      }
      resp.send(200, { products });
    });
  },
  // getUser: (req, resp) => {
  //   const { uid } = req.params;
  //   User.findById(uid, (err, user) => {
  //     if (err) {
  //       return resp.status(500).send({ message: 'Error al realizar la petición' });
  //     }
  //     if (!user) {
  //       return resp.status(404).send({ message: 'El usuario no existe' });
  //     }
  //     resp.status(200).send({ user });
  //   });
  // },
  // deleteUser: (req, resp) => {
  //   const { uid } = req.params;
  //   User.findById(uid, (err, user) => {
  //     if (err) {
  //       return resp.status(500).send({ message: 'error' });
  //     }
  //     if (!user) {
  //       return resp.status(404).send({ message: 'El usuario no existe' });
  //     }
  //     user.remove((err) => {
  //       if (err) {
  //         return resp.status(500).send({ message: 'error' });
  //       }
  //       resp.status(200).send({ message: 'se eliminó el usuario' });
  //     });
  //   });
  // },
  // putUser: (req, resp, next) => {
  //   if (!req.body.email && !req.body.password) {
  //     return next(400);
  //   }
  //   const { uid } = req.params;
  //   const update = req.body;
  //   User.findByIdAndUpdate(uid, update, (err, userUpdate) => {
  //     if (err) {
  //       return resp.status(500).send({ message: 'error' });
  //     }
  //     if (!userUpdate) {
  //       return resp.status(404).send({ message: 'El usuario no existe' });
  //     }
  //     resp.status(200).send({ user: userUpdate });
  //   });
  // },
};
