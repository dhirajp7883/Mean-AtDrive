const Order = require("../models/order.model");
const asyncHandler = require("../middleware/asyncHandler");

// Create new order
exports.createOrder = asyncHandler(async (req, res, next) => {
    const { userId, productIds, totalAmount } = req.body;

    if (!userId || !productIds || !totalAmount) {
        const error = new Error('Please provide userId, productIds, and totalAmount');
        error.statusCode = 400;
        return next(error);
    }

    if (!Array.isArray(productIds) || productIds.length === 0) {
        const error = new Error('productIds must be a non-empty array');
        error.statusCode = 400;
        return next(error);
    }

    if (totalAmount < 0) {
        const error = new Error('totalAmount must be a positive number');
        error.statusCode = 400;
        return next(error);
    }

    const order = await Order.create({ userId, productIds, totalAmount });

    res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order
    });
});

// Get all orders
exports.getOrders = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find()
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

    const total = await Order.countDocuments();

    res.json({
        success: true,
        count: orders.length,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        data: orders
    });
});

// Get order by ID
exports.getOrderById = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        const error = new Error(`Order not found for the id ${req.params.id}`);
        error.statusCode = 404;
        return next(error);
    }

    res.json({
        success: true,
        data: order
    });
});

// Update order by ID
exports.updateOrder = asyncHandler(async (req, res, next) => {
    let order = await Order.findById(req.params.id);

    if (!order) {
        const error = new Error(`Order not found for the id ${req.params.id}`);
        error.statusCode = 404;
        return next(error);
    }

    const { productIds, totalAmount } = req.body;

    if (productIds && (!Array.isArray(productIds) || productIds.length === 0)) {
        const error = new Error('productIds must be a non-empty array');
        error.statusCode = 400;
        return next(error);
    }

    if (totalAmount !== undefined && totalAmount < 0) {
        const error = new Error('totalAmount must be a positive number');
        error.statusCode = 400;
        return next(error);
    }

    order = await Order.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    res.json({
        success: true,
        message: 'Order updated successfully',
        data: order
    });
});

// Delete order by ID
exports.deleteOrder = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        const error = new Error(`Order not found for the id ${req.params.id}`);
        error.statusCode = 404;
        return next(error);
    }

    await order.deleteOne();

    res.json({
        success: true,
        message: 'Order deleted successfully'
    });
});
