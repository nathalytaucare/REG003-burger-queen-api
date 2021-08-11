const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
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
      default: 'burger1.jpg',
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

module.exports = mongoose.model('Product', productSchema);
