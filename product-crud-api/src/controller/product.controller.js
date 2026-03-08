const Product = require("../../models/product.model");
const asyncHandler = require("../../middleware/asyncHandler");

// create new product
exports.createProduct = asyncHandler(async (req, res, next) => {
    const { name, price, description } = req.body;

    if (!name || !price) {
        const error = new Error('Please provide name and price');
        error.statusCode = 400;
        return next(error);
    }

    const existingProduct = await Product.findOne({ name });
    if (existingProduct) {
        const error = new Error('Product already exists with the same name');
        error.statusCode = 409;
        return next(error);
    }

    const product = await Product.create({ name, price, description });

    res.status(201).json({
        success: true,
        data: product
    });
});

// get all products
exports.getProducts = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find()
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

    const total = await Product.countDocuments();

    res.json({
        success: true,
        count: products.length,
        pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit)
        },
        data: products
    });
});

// getting a product by id
exports.getProductById = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        const error = new Error(`Product not found for the id ${req.params.id}`);
        error.statusCode = 404;
        return next(error);
    }

    res.json({
        success: true,
        data: product
    });
});

// updating the product by id
exports.updateProduct = asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        const error = new Error(`Product not found for the id ${req.params.id}`);
        error.statusCode = 404;
        return next(error);
    }

    product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    res.json({
        success: true,
        data: product
    });
});

//deleting the product by id
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        const error = new Error(`Product not found for the id ${req.params.id}`);
        error.statusCode = 404;
        return next(error);
    }

    await product.deleteOne();

    res.json({
        success: true,
        message: 'Product deleted successfully'
    });
});