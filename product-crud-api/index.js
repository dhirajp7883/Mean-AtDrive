const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT || 3000;
const connectDb = require('./config/dbConnection');
const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");
const orderRoutes = require("./routes/order.routes");
const weatherRoutes = require("./routes/weather.routes");
const cors = require("cors");

app.get('/health', (req, res) => {
    res.status(200).json({ message: 'Ok' })
})

app.use(cors())
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/weather", weatherRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});


// db connection 
connectDb()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on PORT: ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Failed to connect MongoDB:', err.message);
        process.exit(1);
    });