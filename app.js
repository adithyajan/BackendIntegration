// Importing required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initializing express app
const app = express();

// Using bodyParser middleware to parse incoming requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://adithya123:Adithya@cluster0.7cdgpav.mongodb.net/Employee?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB', err));

// Define the Employee schema
const employeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  department: String,
  // Add other fields as needed
});

// Create Employee model
const Employee = mongoose.model('Employee', employeeSchema);

// Get all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get a single employee by ID
app.get('/api/employees/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new employee
app.post('/api/employees', async (req, res) => {
  try {
    const newEmployee = new Employee(req.body);
    const savedEmployee = await newEmployee.save();
    res.json(savedEmployee);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update an employee by ID
app.put('/api/employees/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete an employee by ID
app.delete('/api/employees/:id', async (req, res) => {
  try {
    const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmployee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json(deletedEmployee);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Set up server to listen on port 3000 (replace with your desired port)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
