const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = (req, res, next) => {
    User.find({ email: req.body.email }).exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "User alredy exist"
                })
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save().then(result => {
                            res.status(201).json({
                                message: "New User created",
                                user: user
                            });
                        }).catch(err => {
                            res.status(500).json({
                                error: err
                            });
                        })
                    }
                });
            }
        }).catch(err => {
            res.status(500).json(err);
        })
}

exports.login = (req, res, next) => {
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Invalid user"
                });
            } else {
                bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                    if (result) {

                        const toekn = jwt.sign({
                            email: user[0].email,
                            userId: user[0]._id
                        },
                            "secret",
                            {
                                expiresIn: "1h"
                            },
                        );

                        return res.status(200).json({
                            message: 'Login Success',
                            token: toekn
                        })

                    }
                    else {
                        return res.status(401).json({
                            message: "Invalid password"
                        });
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json(err);
        })
}


exports.delete_user = (req, res, next) => {
    User.deleteOne({ _id: req.params.userId }).exec()
        .then(result => {
            if (result.deletedCount !== 0) {
                res.status(200).json({
                    message: "User deleted"
                })
            } else {
                res.status(404).json({
                    message: "User Not found"
                })
            }
        }).catch(err => {
            res.status(500).json(err);
        });
}