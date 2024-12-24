const express = require("express");
const router = express.Router();
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");

// Create a new order
router.post("/order/create", async (req, res) => {
    try {
        const { userId, paymentMethod } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).send({ message: "Cart is empty" });
        }

        const order = new Order({
            userId,
            items: cart.items,
            paymentMethod
        });

        await order.save();
        res.status(201).send({ message: "Order created successfully", order });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// View orders for a user
router.get("/order", async (req, res) => {
    try {
        const { userId } = req.query;
        const orders = await Order.find({ userId }).populate("items.productId");

        res.status(200).send(orders);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
