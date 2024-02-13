// const mongoose = require('mongoose');

// const appointmentSchema = new mongoose.Schema({
//   doctor: String,
//   date: Date,
//   patientName: String,
//   petName: String,
// });

// module.exports = mongoose.model('Appointment', appointmentSchema);
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

// mongoose.connect('mongodb://localhost:27017/doctorAppointments', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

const appointmentSchema = new mongoose.Schema({
  name: String,
  email: String,
  appointmentDate: Date,
  doctor: String,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

app.post('/api/appointments', async (req, res) => {
  const newAppointment = new Appointment({
    name: req.body.name,
    email: req.body.email,
    appointmentDate: req.body.appointmentDate,
    doctor: req.body.doctor,
  });

  try {
    const savedAppointment = await newAppointment.save();
    res.status(200).json(savedAppointment);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// app.listen(5000, () => {
//   console.log('Server is running on port 5000');
// });