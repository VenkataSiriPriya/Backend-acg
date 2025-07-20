const express = require('express');
const cors = require('cors');
require('dotenv').config();

const submitRoute = require('./routes/submitRoute');
const authRoute = require('./routes/authRoute');
const contactRoute = require('./routes/contactRoute');
const userRoute = require('./routes/userRoutes'); // Adjust path if needed



const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/submit', submitRoute);
app.use('/api/auth', authRoute);
app.use('/api/contact', contactRoute);
app.use('/api', userRoute); // 👈 This enables /api/users


app.use('/uploads', express.static('uploads'));


// ✅ Root route for Render status check
app.get('/', (req, res) => {
  res.send('🚀 ACG Backend is Live!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
