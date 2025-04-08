const express = require('express');
require('dotenv').config();
const db = require('./config/db');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const pasienRoutes = require('./routes/pasienRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, 
  }));
  

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/pasien', pasienRoutes);

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});