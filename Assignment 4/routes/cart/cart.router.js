const express = require("express");
const router = express.Router();

router.post("/cart/add", (req, res) => {
    const { title, price, picture, quantity } = req.body;
  
    if (!req.session.cart) {
      req.session.cart = [];
    }
  
    // Check if the product already exists in the cart
    const existingProduct = req.session.cart.find(item => item.title === title);
    if (existingProduct) {
      existingProduct.quantity = parseInt(existingProduct.quantity) + parseInt(quantity);
    } else {
      req.session.cart.push({ title, price, picture, quantity });
    }
  
    res.status(200).json({
      message: "Product added to cart successfully",
      cart: req.session.cart,
    });
  });
  
// Add to Cart
router.post("/cart/add", (req, res) => {
  const { productId, name, price, quantity } = req.body;

  // Initialize cart if it doesn't exist
  if (!req.session.cart) {
    req.session.cart = [];
  }

  // Check if product already exists in the cart
  const existingItem = req.session.cart.find(item => item.productId === productId);
  if (existingItem) {
    // Update quantity if product exists
    existingItem.quantity += quantity;
  } else {
    // Add new product to cart
    req.session.cart.push({ productId, name, price, quantity });
  }

  res.status(200).json({
    message: "Item added to cart",
    cart: req.session.cart
  });
});

// View Cart
router.get("/cart", (req, res) => {
  res.status(200).json({
    cart: req.session.cart || []
  });
});

// Remove from Cart
router.post("/cart/remove", (req, res) => {
  const { productId } = req.body;

  if (!req.session.cart) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  req.session.cart = req.session.cart.filter(item => item.productId !== productId);

  res.status(200).json({
    message: "Item removed from cart",
    cart: req.session.cart
  });
});

module.exports = router;
