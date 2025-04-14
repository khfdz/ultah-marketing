const express = require('express');
require('dotenv').config();
const db = require('./config/db');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const pasienRoutes = require('./routes/pasienRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, 
  }));
  

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.use('/api/auth', authRoutes);
app.use('/api/pasien', pasienRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server berjalan di port ${port}`);
});