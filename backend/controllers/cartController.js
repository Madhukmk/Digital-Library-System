import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id }).populate('items');

    if (!cart) {
        cart = await Cart.create({
            user: req.user._id,
            items: []
        });
    }

    res.json(cart);
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
    const { bookId } = req.body;
    console.log(`Adding book ${bookId} to cart for user ${req.user._id}`);

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        console.log('No cart found, creating new one');
        cart = await Cart.create({
            user: req.user._id,
            items: [bookId]
        });
    } else {
        const itemExists = cart.items.some(item => item.toString() === bookId);
        if (!itemExists) {
            console.log('Item not in cart, adding');
            cart.items.push(bookId);
            await cart.save();
        } else {
            console.log('Item already in cart');
        }
    }

    const updatedCart = await Cart.findById(cart._id).populate('items');
    console.log('Cart updated successfully');
    res.json(updatedCart);
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.items = cart.items.filter(item => item.toString() !== req.params.id);
        await cart.save();
        const updatedCart = await Cart.findById(cart._id).populate('items');
        res.json(updatedCart);
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        cart.items = [];
        await cart.save();
        res.json(cart);
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
});

export { getCart, addToCart, removeFromCart, clearCart };
