const { Schema, model } = require('mongoose');

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: false,
      default: 'https://therockstore.com.ar/wp-content/uploads/2021/06/noImg-24.png',
    },
    type: {
      type: String,
      required: false,
    },
    dateEntry: {
      type: Date,
      default: Date.now(),
      required: true,
    },

  },
);

module.exports = model('Product', productSchema);
