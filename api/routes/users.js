const mongoose = require('mongoose');
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()

const User = require('../models/user')

// creating a user 

router.post('/signup', async (req, res, next) => {
    try {
        const { email, password } = req.body
        const isUserExist = await User.find({ email })
        if (isUserExist.length >= 1) {
            return res.status(409).json({
                message: 'User Already exist',
            })

        }
        bcrypt.hash(password, 10, async (err, hash) => {
            if (err) {
                return res.status(500).json({
                    err,
                })
            }
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                email,
                password: hash
            })
            const createdUser = await user.save()
            res.status(201).json({
                message: 'user created',
                user: createdUser
            })
        })
    }
    catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'some thing went wrong',
            err
        })
    }
})

//login

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.find({ email: email })
        if (user.length < 1) {
            return res.status(401).json({
                message: 'auth fail',
            })
        } else {
            // console.log(user[0])
            bcrypt.compare(password, user[0].password, (err, isMatch) => {
                if (err) {
                    console.log("===>", err)
                    return res.status(401).json({
                        message: "Auth failed"
                    });
                } else {
                    console.log(user[0].password)

                    if (isMatch) {
                        console.log("resulty", isMatch)
                        const token = jwt.sign(
                            {
                                email: user[0].email,
                                password: user[0].password
                            },
                            '10',
                            {
                                expiresIn: "1h"
                            }

                        )
                        return res.status(200).json({
                            message: 'successfuly login',
                            token
                        })
                    } else {
                        return res.status(401).json({
                            message: 'auth fail'
                        })
                    }
                    // if (err) {
                    //     console.log("===>", err)
                    //     return res.status(401).json({
                    //         message: "Auth failed"
                    //     });
                    // }
                    // if (result) {
                    //     console.log("resulty", result)
                    //     const token = jwt.sign(
                    //         {
                    //             email: user[0].email,
                    //             password: user[0].password
                    //         },
                    //         '10',
                    //         {
                    //             expiresIn: "1h"
                    //         }

                    //     )
                    //     return res.status(200).json({
                    //         message: 'successfuly login',
                    //         token
                    //     })
                    // }
                }
            })
        }

    }
    catch (err) {
        console.log('err', err)
        res.status(500).json({
            message: 'something went wrong',
            err
        })
    }
})

module.exports = router