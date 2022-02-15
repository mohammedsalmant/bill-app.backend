let mongoose  = require('mongoose');

let billSchema = mongoose.Schema({
    name: String,
    // address: '',
    // mobile: '',
    invoiceId: {
      type:Number,
      isRequired:true
    },
    date: Date,
    items: [],
  //  amount:Number,
    total:Number,

});

let Bill = module.exports = mongoose.model('Bill', billSchema);