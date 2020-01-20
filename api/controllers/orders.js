const Order = require('../models/orders');
const mongoose = require('mongoose');
const Product = require('../models/product');

exports.get_all_orders = (req, res, next) => {
    Order.find().select('product quantity _id')
        .select('product quantity _id')
        .populate('product', 'name')
        .exec().then(docs => {
            res.status(200).json({
                count: docs.quantity,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })

            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
}


exports.create_orders = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                })
            } else {
                const order = new Order({
                    _id: mongoose.Types.ObjectId(),
                    quantity: req.body.quantity,
                    product: req.body.productId
                });
                return order.save()
                    .then((result) => {
                        res.status(200).json({
                            message: "Product Ordered",
                            createdOrder: {
                                _id: result._id,
                                product: result.product,
                                quantity: result.quantity
                            },
                            request: {
                                type: 'GET',
                                url: 'http://localhost:3000/orders/' + result._id
                            }
                        });
                    }).catch((err) => {
                        res.status(500).json({
                            error: err
                        })
                    });
            }
        });
}

exports.get_one_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(doc => {
            if (doc !== null) {
                res.status(200).json({
                    order: doc,
                    request: {
                        type: 'GET',
                        description: "All orders here",
                        url: 'http://localhost:3000/orders/'
                    }
                })
            } else {
                res.status(404).json({
                    message: "No order found with given id",
                    request: {
                        type: 'GET',
                        description: "All orders here",
                        url: 'http://localhost:3000/orders/'
                    }
                })
            }

        }).catch(err => {
            res.status(500).json({
                error: err
            })
        })

}

exports.delete_one_order = (req, res, next) => {
    Order.deleteOne({ _id: req.params.orderId }).exec()
        .then(result => {
            if (result.deletedCount !== 0) {
                res.status(200).json({
                    message: "Order deleted",
                    request: {
                        type: 'POST',
                        description: "Make New order",
                        url: 'http://localhost:3000/orders/',
                        body: { productId: "ID", quantity: "Number" }
                    }
                })
            } else {
                res.status(404).json({
                    message: "No order found with given id",
                    request: {
                        type: 'GET',
                        description: "All orders here",
                        url: 'http://localhost:3000/orders/'
                    }
                })
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            })
        });
}