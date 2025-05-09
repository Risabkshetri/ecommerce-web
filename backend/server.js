require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const server = express();

server.get('/', (req, res) => {
  res.send('Hello From ElectroStore Backend!');
});

const productRouter = require('./routes/products');
const userRouter = require('./routes/users');


// Database connection
main().catch(err => console.log('Database connection error:', err));

async function main() {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URL is not defined in the environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected');
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    process.exit(1);
  }
}


// Middleware setup 
server.use(express.json());
server.use(cors({
  origin: ['http://localhost:3000', 'http://frontend:3000'],
  credentials: true
}));

server.use(morgan('combined'));

const publicDir = process.env.PUBLIC_DIR || path.join(__dirname, 'public');
server.use(express.static(publicDir));

// Route handling
server.use('/api/products', productRouter.router);
server.use('/api/users', userRouter.router);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
