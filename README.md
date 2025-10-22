# Vanzari Auto - Server Backend

Server backend pentru aplicația de vânzări și închirieri auto.

## Features
- MongoDB Atlas integration
- User authentication
- Car sales and rentals
- File uploads
- Real-time messaging

## Tech Stack
- Node.js + Express
- MongoDB Atlas
- JWT Authentication
- Multer for file uploads

## Deploy to Railway
1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically

## Environment Variables
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret for JWT tokens
- `NODE_ENV`: production

## API Endpoints
- `POST /api/car-sales` - Create car sale listing
- `POST /api/car-rentals` - Create car rental listing
- `GET /api/car-sales` - Get all sales
- `GET /api/car-rentals` - Get all rentals