const Order = require('../models/order.model');
const Product = require('../models/product.model');

module.exports = {

  // ORDERS
  // GET
  getOrders: (req, resp) => {
    Order.find({}, (err, orders) => {
      Product.populate(orders, { path: 'products.product' },
        (fail, order) => {
          if (fail) {
            return resp.status(500).send({ message: 'error' });
          }
          if (!order) {
            return resp.status(404).send({ message: 'error' });
          }
          return resp.status(200).send(orders);
        });
    });
  },
  // GET/:ORDERSID
  getOrder: (req, resp) => {
    const { orderId } = req.params;

    Order.findById(orderId, (err, order) => {
      if (err) {
        return resp.status(500);
      }
      if (!order) {
        return resp.status(404);
      }
      return resp.status(200).send(order);
    });
  },
  // POST
  postOrder: async (req, resp, next) => {
    const newOrder = new Order();
    if (!req.body.products || req.body.products.length === 0) return next(400);
    newOrder.userId = req.body.userId;
    newOrder.client = req.body.client;
    newOrder.status = req.body.status;
    newOrder.products = req.body.products.map((product) => ({
      qty: product.qty,
      product: product.product,
    }));

    if (!req.body.products || req.body.products.length === 0) {
      return resp.send(400);
    }
    if (req.body.client === '') {
      return resp.send(400);
    }

    switch (req.body.status) {
      case 'pending':
        break;
      case 'canceled':
        break;
      case 'delivering':
        break;
      case 'delivered':
        break;
      default:
        return resp.status(400).send({ message: 'Estatus no valido' });
    }

    const newOrderSaved = await newOrder.save();

    const populatedOrder = await newOrderSaved
      .populate('products.product')
      .execPopulate();
    return resp.status(200).send(populatedOrder);
  },
  // DELETE
  deleteOrder: (req, resp) => {
    const { orderId } = req.params;
    Order.findById(orderId, (err, order) => {
      if (err) {
        return resp.status(500).send({ message: 'error' });
      }
      if (!order) {
        return resp.status(404).send({ message: 'La orden no existe' });
      }
      return order.remove((fail) => {
        if (fail) {
          return resp.status(500).send({ message: `Error al salvar la base de datos:${fail}` });
        }
        return resp.status(200).send({ message: 'se eliminó la orden' });
      });
    });
  },

  // PUT
  putOrder: (req, resp, next) => {
    if (!req.body.client) {
      return next(400);
    }
    const { orderId } = req.params;
    const update = req.body;
    return Order.findByIdAndUpdate(orderId, update, (err, orderUpdate) => {
      if (err) {
        return resp.status(500).send({ message: 'Error al realizar la petición' });
      }
      if (!orderUpdate) {
        return resp.status(404).send({ message: 'La orden no existe' });
      }
      return resp.status(200).send(orderUpdate);
    });
  },
};
