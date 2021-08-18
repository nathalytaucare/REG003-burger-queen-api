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
      resp.status(200).send({ product: productStored });
    });
  },
  getProducts: (req, resp) => {
    Product.find({}, (err, products) => {
      if (err) {
        return resp.status(500).send({ message: 'Error al mostrar datos de productos' });
      }
      if (!products) {
        return resp.status(404).send({ message: 'Error mo se encontaron productos' });
      }
      resp.send(200, { products });
    });
  },
  getProduct: (req, resp) => {
    const { productId } = req.params;
    Product.findById(productId, (err, product) => {
      if (err) {
        return resp.status(500).send({ message: 'Error al realizar la petición' });
      }
      if (!product) {
        return resp.status(404).send({ message: 'El producto no existe' });
      }
      resp.status(200).send({ product });
    });
  },
  deleteProduct: (req, resp) => {
    const { productId } = req.params;
    Product.findById(productId, (err, product) => {
      if (err) {
        return resp.status(500).send({ message: 'Error al realizar la petición' });
      }
      if (!product) {
        return resp.status(404).send({ message: 'El producto no existe' });
      }
      product.remove((err) => {
        if (err) {
          return resp.status(500).send({ message: 'Error al eliminar producto' });
        }
        resp.status(200).send({ message: 'se eliminó el producto' });
      });
    });
  },
  putProduct: (req, resp, next) => {
    if (!req.body.name && !req.body.price) {
      return next(400);
    }
    const { productId } = req.params;
    const update = req.body;
    Product.findByIdAndUpdate(productId, update, (err, productUpdate) => {
      if (err) {
        return resp.status(500).send({ message: 'Error al realizar la petición' });
      }
      if (!productUpdate) {
        return resp.status(404).send({ message: 'El producto no existe' });
      }
      resp.status(200).send({ product: productUpdate });
    });
  },
};
