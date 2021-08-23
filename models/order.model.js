const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const orderSchema = new Schema(
  {
    userId: {
      type: String,
    },
    client: {
      type: String,
    },
    products: [
      {
        _id: false,
        qty: {
          type: Number,
          default: 1,
        },
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'canceled', 'delivering', 'delivered'],
      default: 'pending',
    },
    dateEntry: {
      type: Date,
      default: Date.now(),
      required: false,
    },
    dateProcessed: {
      type: Date,
      require: false,
    },

  },
  { versionKey: false },
);

module.exports = mongoose.model('Order', orderSchema);
