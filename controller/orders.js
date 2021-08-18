const Order = require('../models/order.model');
const Product = require('../models/product.model');

module.exports = {

  getOrders: (req, resp) => {
    Order.find({}, (err, orders) => {
      Product.populate(orders, { path: 'products.product' }, (err, orders) => {
        resp.status(200).send(orders);
      });
    });
    // Order.find({}, (err, orders) => {
    //   if (err) {
    //     return resp.status(500).send({ message: 'error' });
    //   }
    //   if (!orders) {
    //     return resp.status(404).send({ message: 'error' });
    //   }
    //   resp.send(200, { orders });
    // });
  },
  getOrder: (req, resp) => {
    const { orderId } = req.params;

    Order.findById(orderId, (err, order) => {
      if (err) {
        return resp.send(500);
      }
      if (!order) {
        return resp.send(404);
      }
      resp.status(200).send({ order });
    });
  },
  postOrder: (req, resp, next) => {
    // Order.find({}, (err, order) => {
    //   Product.populate(order, { path: 'product' }, (err, orders) => {
    //     resp.status(200).send(orders);
    //   });
    // });
    const newOrder = new Order({
      ...req.body,
      products: req.body.products.map((product) => ({
        qty: product.qty,
        product: product.product,
      })),
    });
    if (req.body.client === '') {
      return next(400);
    }
    newOrder.save((err, orderStored) => {
      if (err) {
        return resp.status(500).send({ message: `Error al salvar la base de datos:${err}` });
      }
      if (!orderStored) {
        return resp.send(404);
      }
      resp.status(200).send({ order: orderStored });
    });
  },
  deleteOrder: (req, resp) => {
    const { orderId } = req.params;
    Order.findById(orderId, (err, order) => {
      if (err) {
        return resp.status(500).send({ message: 'error' });
      }
      if (!order) {
        return resp.status(404).send({ message: 'La orden no existe' });
      }
      order.remove((err) => {
        if (err) {
          return resp.status(500).send({ message: 'error' });
        }
        resp.status(200).send({ message: 'se eliminó la orden' });
      });
    });
  },

};
