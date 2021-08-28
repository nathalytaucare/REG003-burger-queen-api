const Order = require('../models/order.model');
const Product = require('../models/product.model');
// const { pagination } = require('./util/util');

module.exports = {

  // ORDERS
  // GET
  getOrders: async (req, resp, next) => {
    try {
      /*
      const options = {
        page: parseInt(req.query.page, 10) || 1,
        limit: parseInt(req.query.limit, 10) || 10,
      };
      const orders = await Order.paginate({}, options);

      const url = `${req.protocol}://${req.get('host') + req.path}`;

      const links = pagination(orders, url, options.page, options.limit, orders.totalPages);

      resp.links(links);
      return resp.status(200).json(orders.docs); */
      await Order.find({}, (err, orders) => {
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
    } catch (error) {
      return next(404);
    }
  },
  // GET/:ORDERSID
  getOrder: async (req, resp, next) => {
    try {
      const { orderId } = req.params;

      await Order.findById(orderId, (err, order) => {
        if (err) {
          return resp.status(500);
        }
        Product.populate(order, { path: 'products.product' },
          (fail, orderPopulate) => {
            if (fail) {
              return resp.status(500);
            }
            if (!orderPopulate) {
              return resp.status(404);
            }
            return resp.status(200).send(orderPopulate);
          });
      });
    } catch (error) {
      return next(404);
    }
  },
  // POST
  postOrder: async (req, resp, next) => {
    try {
      const newOrder = new Order();
      if (!req.body.products || req.body.products.length === 0) return next(400);
      newOrder.userId = req.body.userId;
      newOrder.client = req.body.client;
      newOrder.products = req.body.products.map((product) => ({
        qty: product.qty,
        product: product.productId,
      }));

      if (!req.body.products || req.body.products.length === 0) {
        return resp.send(400);
      }
      if (req.body.client === '') {
        return resp.send(400);
      }

      const newOrderSaved = await newOrder.save();

      const populatedOrder = await newOrderSaved
        .populate('products.product')
        .execPopulate();

      return resp.status(200).send(populatedOrder);
    } catch (error) {
      return next(404);
    }
  },
  // DELETE
  deleteOrder: async (req, resp, next) => {
    try {
      const { orderId } = req.params;
      await Order.findById(orderId, (err, order) => {
        if (err) {
          return resp.status(404).send({ message: 'error' });
        }
        if (!order) {
          return resp.status(404).send({ message: 'La orden no existe' });
        }
        order.remove((fail) => {
          if (fail) {
            return resp.status(500).send({ message: `Error al salvar la base de datos:${fail}` });
          }
          return resp.status(200).send({ message: 'se eliminó la orden' });
        });
      });
    } catch (error) {
      return next(404);
    }
  },

  // PUT
  putOrder: async (req, resp, next) => {
    try {
      const { orderId } = req.params;
      const update = req.body;

      if (update.status === 'delivered') {
        update.dateProcessed = Date.now();
      }

      await Order.findByIdAndUpdate(orderId, update, async (err, orderUpdate) => {
        if (err) {
          return resp.status(404).send({ message: 'Error al realizar la petición' });
        }

        if (!update.userId && !update.client && !update.products && !update.status) {
          return next(400);
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
          case 'preparing':
            break;
          default:
            return resp.status(400).send({ message: 'Estatus no valido' });
        }

        if (!orderUpdate) {
          return resp.status(404).send({ message: 'La orden no existe' });
        }
        const OrderNew = await Order.findById(orderId);

        return resp.status(200).send(OrderNew);
      });
    } catch (error) {
      return next(404);
    }
  },
};
