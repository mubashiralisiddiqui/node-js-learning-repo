const mongoose = require('mongoose');


const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    product: { type: String, required: true, ref: 'products' },
    quantity: { type: Number, default: 1 }

})
module.exports = mongoose.model('orders', orderSchema)