const express = require("express");
const router = express.Router();
const Cart = require("../models/cart.model");

// Add item to cart
router.post("/cart/add", async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity; // Update quantity if item already exists
        } else {
            cart.items.push({ productId, quantity }); // Add new item to cart
        }

        await cart.save();
        res.status(200).send({ message: "Item added to cart successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// View cart
router.get("/cart", async (req, res) => {
    try {
        const { userId } = req.query;
        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        res.status(200).send(cart);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Remove item from cart
router.delete("/cart/remove", async (req, res) => {
    try {
        const { userId, productId } = req.body;
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();

        res.status(200).send({ message: "Item removed from cart successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;
