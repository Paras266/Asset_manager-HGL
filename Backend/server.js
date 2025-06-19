// backend/server.js
import dotenv from 'dotenv';
dotenv.config();
import {connectDB} from './config/db_connection.js';
import app from './app.js';



connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

