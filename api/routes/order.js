const Order = require('../models/orders');
const Product = require('../models/products')
const express = require('express')
const mongoose = require('mongoose');
const authCheck = require('../middleware/authCheck')


const router = express.Router()


// get all orders
router.get('/', authCheck, async (req, res, next) => {
    try {
        const data = await Order.find().populate('product')
            .exec()
        res.status(200).json({
            message: 'order fetched successfully',
            data
        })
    }
    catch (err) {
        res.status(500).json({
            message: 'error',
            err
        })
        console.log("error fetching data", err)
    }

})
// create order 
router.post('/', async (req, res, next) => {
    try {
        const isProductExist = await Product.findById(req.body.productId)
        if (isProductExist) {
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                product: req.body.productId,
                quantity: req.body.Qty
            })
            const order_ = await order.save()
            // .exec()
            res.status(201).json({
                message: 'create order',
                order_
            })
        }

    }
    catch (err) {
        res.status(500).json({
            message: 'Product not found',
            err
        })
    }
})

// get orderById 
router.get('/:id', async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)

        if (order) {
            res.status(200).json({
                message: 'success',
                order
            })
        }
    }
    catch (err) {
        res.status(404).json({
            message: 'order not found',
            err
        })
    }

})
// delete Order
router.delete('/:id', async (req, res, next) => {
    try {
        const order = await Order.remove({ id: req.params.id }).exec()
        res.status(200).json({
            message: 'delelted',
            order
        })
    }
    catch (err) {
        res.status(404).json({
            message: 'not found',
            err
        })
    }
})



module.exports = router


