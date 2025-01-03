const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Lead = require('./Lead');

// Configure storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      // Specify the directory to save uploaded files
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      // Save the file with its original name
    cb(null, file.originalname);
  },
}); 

// Initialize multer with the specified storage configuration
const upload = multer({ storage });

// Route to handle file upload and save CSV data to the database
router.post('/upload', upload.single('file'), (req, res) => {
  const results = []; // Array to hold parsed CSV data
// Read the uploaded CSV file
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      // Process each row of the CSV file
      for (const lead of results) {
        const { name, email } = lead;
        try {
           // Save the lead data to the database
          await Lead.create({ name, email });
        } catch (error) {
          console.error(`Error creating lead: ${error.message}`);
        }
      }
      res.send('File uploaded and data saved');
    });
});

// Route to fetch all leads from the database
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find(); // Fetch all leads
    res.json(leads);// Send the leads as JSON
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Route to update a lead's status and assigned user by ID
router.put('/:id', async (req, res) => {
  const { status, assignedto } = req.body; // Extract updated fields from the request body
  try {
    await Lead.findByIdAndUpdate(req.params.id, { status, assignedto }); // Update the lead in the database
    res.send('Lead status updated');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Route to delete a lead by ID
router.delete('/:id', async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);// Delete the lead from the database
    res.send('Lead deleted');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
