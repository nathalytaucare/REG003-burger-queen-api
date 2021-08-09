const mongoose = require('mongoose');
Schema = mongoose.Schema;

const UserSchema = new Schema({
  email:{
    type:String, 
    require:true,
  // validate:{
  //   validator: /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i

  // } 
},
  roles:{admin:{type:Boolean,default:false}},

})