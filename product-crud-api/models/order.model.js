const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    productIds: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                return v && v.length > 0;
            },
            message: 'Order must have at least one product'
        }
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", OrderSchema);
