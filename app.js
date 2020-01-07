
const express = require('express')
const morgan = require('morgan')
const productRoutes = require('./api/routes/productes')
const orderRoutes = require('./api/routes/order')
const userRoutes = require('./api/routes/users')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

// console.log("env==", process.env)
mongoose.connect(`mongodb+srv://mubashir:${process.env.MONGO_PASS}@cluster0-rdluk.mongodb.net/test?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('connneted')
}).catch((err) => {
    console.log('error in connection', err)
})
app.use(bodyParser.json());

app.use(morgan('dev'))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With,Content-type,Accept,Authorization'
    )
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,PATCH,POST,DELETE,GET')
        return res.status(200).json({})
    }
    next()
})



app.use('/orders', orderRoutes)
app.use('/products', productRoutes)
app.use('/user', userRoutes)
app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)
})
app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        message: error.message
    })
})
module.exports = app;
