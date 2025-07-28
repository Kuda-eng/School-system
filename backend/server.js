require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Connect to MongoDB (no deprecated options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    // ✅ Session setup AFTER successful MongoDB connection
    app.use(session({
      secret: process.env.SESSION_SECRET || 'mySecret',
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: 'sessions',
      }),
      cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
    }));

    // ✅ Import Routes
    const authRoutes = require('./routes/authRoutes');
    const adminRoutes = require('./routes/adminRoutes');
    const studentRoutes = require('./routes/studentRoutes');
    const timetableRoutes = require('./routes/timetableRoutes');
    const attendanceRoutes = require('./routes/attendanceRoutes');
    const resultRoutes = require('./routes/resultRoutes');
    const feeRoutes = require('./routes/feeRoutes');
    const libraryRoutes = require('./routes/libraryRoutes');

    // ✅ Use Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/student', studentRoutes);
    app.use('/api/timetable', timetableRoutes);
    app.use('/api/attendance', attendanceRoutes);
    app.use('/api/results', resultRoutes);
    app.use('/api/fees', feeRoutes);
    app.use('/api/library', libraryRoutes);

    // ✅ Protected Test Routes
    const { isAuthenticated, isRole } = require('./middleware/authMiddleware');

    app.get('/', (req, res) => {
      res.send('Server is running 🚀');
    });

    app.get('/api/protected', isAuthenticated, (req, res) => {
      res.json({ message: `Welcome user ${req.session.userId}, your role is ${req.session.userRole}` });
    });

    app.get('/api/admin-only', isAuthenticated, isRole(['admin']), (req, res) => {
      res.json({ message: 'Welcome Admin, this is a protected admin route' });
    });

    // ✅ Start server
    app.listen(5000, () => console.log('Server running on http://localhost:5000'));
  })
  .catch(err => console.error('MongoDB connection error:', err));
