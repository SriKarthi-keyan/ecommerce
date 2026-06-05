import dotenv from 'dotenv';
import app from './src/app.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
const server = app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 EcoDelivery API Server is running!`);
  console.log(`📱 Local URL:   http://localhost:${PORT}`);
  console.log(`⚙️  Environment: ${NODE_ENV}`);
  console.log(`=============================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
