const express = require('express');
const router = express.Router()
const mongoose = require('mongoose')
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + file.originalname)
    }
})
const fileFilter = (req, file, cb) => {

}
const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 5, }, fileFilter })


const Product = require('../models/products')

// get all products
router.get('/', async (req, res, next) => {
    try {
        const result = await Product.find()
            .select('name age')
            .exec()
        res.status(200).json({
            message: 'success',
            result
        })
    }
    catch (err) {
        res.status(500).json({
            message: 'error',
            err
        })
    }

})
// get single products
router.get('/:id', async (req, res, next) => {
    try {
        const product = Product.findById(req.params.id)
        res.status(200).json({
            message: 'success',
            product
        })
    }
    catch (err) {
        res.status(404).json({
            message: 'not found',
            err
        })
    }
})

// create product
router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log("file==>", req.file)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        Qty: req.body.Qty,
        // productImage: req.file
    });
    product
        .save()
        .then(result => {
            console.log('result----', result)
            res.status(200).json({
                message: 'handling post request to /products',
                createdProduct: result
            })
        })
        .catch((err) => {
            res.status(500).json({
                error: err,
            })
        })
})

// update product
router.patch('/:id', (req, res, next) => {
    res.status(200).json({
        message: 'product updated '
    })
})
// delete 
router.delete('/:id', async (req, res, next) => {

    try {
        const { id } = req.params


        const product = await Product.findByIdAndRemove({ _id: id })
        console.log("deleted", product)
        if (product) {
            res.status(200).json({ message: 'deleted successfully', id })
            return
        }
        res.status(404).json({
            message: 'not found',

        })

    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'error',
            err
        })
    }


})
module.exports = router