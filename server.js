const express = require('express');
const cors = require('cors');
require('dotenv').config();

const submitRoute = require('./routes/submitRoute');
const authRoute = require('./routes/authRoute'); // 🔹 new

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/submit', submitRoute);
app.use('/api/auth', authRoute); // 🔹 add this

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
