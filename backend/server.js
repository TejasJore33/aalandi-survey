const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = 5000;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true, useUnifiedTopology: true });

// MongoDB User Model
const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: { type: String, default: 'user' },
});
const User = mongoose.model('User', UserSchema);

// MongoDB Form Data Model
const FormDataSchema = new mongoose.Schema({
  wardNo: String,
  houseNo: String,
  residentName: String,
  mobileNo: String,
  address: String,
  totalHouseholds: Number,
  propertyType: String,
  propertyTypeDetails: [String],
  industryType: String,
  municipalWaterConnection: String,
  authorizedWaterConnections: [String],
  authorizedConnectionDiameter: [String],
  propertyPhoto: String,
  pipelinePhoto: String,
  waterTaxBill: String,
});
const FormData = mongoose.model('FormData', FormDataSchema);

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Register a new user
app.post('/api/add-user', async (req, res) => {
  const { username, password, role } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) return res.status(400).json({ error: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, password: hashedPassword, role });

  await newUser.save();
  res.json({ message: 'User registered successfully', user: newUser });
});



// Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});



// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id, role: user.role }, 'secret', { expiresIn: '1h' });

  res.json({ token });
});

// Form submission endpoint
app.post('/api/submit-form', upload.fields([
  { name: 'propertyPhoto', maxCount: 1 },
  { name: 'pipelinePhoto', maxCount: 1 },
  { name: 'waterTaxBill', maxCount: 1 }
]), async (req, res) => {
  try {
    console.log("Received form data:", req.body);
    console.log("Received files:", req.files);

    const formData = new FormData({
      wardNo: req.body.wardNo,
      houseNo: req.body.houseNo,
      residentName: req.body.residentName,
      mobileNo: req.body.mobileNo,
      address: req.body.address,
      totalHouseholds: req.body.totalHouseholds,
      propertyType: req.body.propertyType,
      propertyTypeDetails: req.body.propertyTypeDetails?.split(',') || [],
      industryType: req.body.industryType,
      municipalWaterConnection: req.body.municipalWaterConnection,
      authorizedWaterConnections: req.body.authorizedWaterConnections?.split(',') || [],
      authorizedConnectionDiameter: req.body.authorizedConnectionDiameter?.split(',') || [],
      propertyPhoto: req.files?.propertyPhoto ? req.files.propertyPhoto[0].path : '',
      pipelinePhoto: req.files?.pipelinePhoto ? req.files.pipelinePhoto[0].path : '',
      waterTaxBill: req.files?.waterTaxBill ? req.files.waterTaxBill[0].path : '',
    });

    await formData.save();
    res.status(200).json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error("Form submission error:", error);
    res.status(500).json({ error: 'Failed to submit form' });
  }
});

// fetch form data
app.get('/api/form-data', async (req, res) => {
  try {
    const data = await FormData.find();
    res.json(data);
  } catch (error) {
    console.error('Error fetching form data:', error);
    res.status(500).json({ error: 'Failed to fetch form data' });
  }
});



// Starting the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
