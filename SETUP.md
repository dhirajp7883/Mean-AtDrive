# MEAN Stack Application - Setup Instructions

## Prerequisites

Make sure you have these installed:
- Node.js (v14+)
- MongoDB
- MySQL
- Angular CLI (`npm install -g @angular/cli`)

## Installation

### Backend Setup

1. Go to the backend folder:
```bash
cd product-crud-api
npm install
```

2. Create a `.env` file with your database credentials:
```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/meanstack-db
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=meanstack
JWT_SECRET=your_secret_key
```

3. Set up MySQL database:
```sql
CREATE DATABASE meanstack;
USE meanstack;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Frontend Setup

1. Go to the frontend folder:
```bash
cd product-crud-ui
npm install
```

## Running the Application

1. Start MongoDB (if not already running)

2. Start the backend:
```bash
cd product-crud-api
npm start
```
Server runs on http://localhost:3000

3. Start the frontend (in a new terminal):
```bash
cd product-crud-ui
ng serve
```
App runs on http://localhost:4200

## Features

- User registration and login (MySQL + JWT)
- Product CRUD operations (MongoDB)
- Order management API (MongoDB)
- Weather dashboard using Open-Meteo API

## API Endpoints

### Auth
- POST `/api/auth/register` - Register user
- POST `/api/auth/login` - Login user

### Products
- GET `/api/products/get-all-product` - Get all products
- POST `/api/products/create-product` - Create product
- PUT `/api/products/update-product-by-id/:id` - Update product
- DELETE `/api/products/delete-product-by-id/:id` - Delete product

### Orders
- GET `/api/orders/get-all-orders` - Get all orders
- POST `/api/orders/create-order` - Create order
- PUT `/api/orders/update-order-by-id/:id` - Update order
- DELETE `/api/orders/delete-order-by-id/:id` - Delete order

### Weather
- GET `/api/external/weather?city=Mumbai` - Get weather for city

## Testing

You can test the API using Postman or any HTTP client.

Example request to create an order:
```json
POST http://localhost:3000/api/orders/create-order
{
  "userId": "user123",
  "productIds": ["prod1", "prod2"],
  "totalAmount": 299.99
}
```

## Common Issues

**MongoDB connection error**: Make sure MongoDB service is running

**MySQL connection error**: Check your credentials in .env file

**Port already in use**: Change the PORT in .env or kill the process using that port

## Project Structure

```
product-crud-api/
├── config/          # Database connections
├── controller/      # Business logic
├── middleware/      # Middlewares
├── models/          # Database models
├── routes/          # API routes
└── index.js

product-crud-ui/src/
├── app/             # App module
├── components/      # UI components
└── services/        # HTTP services
```
