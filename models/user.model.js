const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  email: {
    type: String,
    require: true,
    // validate:{
    //   validator: /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i
    // }
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  roles: { admin: { type: Boolean, default: false } },

});

module.exports = model('User', UserSchema);
