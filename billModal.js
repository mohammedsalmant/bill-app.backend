let mongoose  = require('mongoose');

let billSchema = mongoose.Schema({
    name: String,
    invoiceId: Number,
    date: String,
    items: Array,
    total:Number,
});

let Bill = module.exports = mongoose.model('Bill', billSchema);