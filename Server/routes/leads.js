const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Lead = require('../modal/Lead');

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

// Route to upload leads data
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('File received:', req.file); // Log file information for debugging

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    const startTime = Date.now();

    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', async (data) => {
        console.log('Parsed row:', data); // Log each parsed row
        try {
          const leadData = {}; // Initialize an empty object to store lead data
          for (const key in data) {
            leadData[key] = data[key];
          }
          await Lead.create(leadData);
        } catch (error) {
          console.error(`Error saving lead: ${error.message}`);
        }
      })
      .on('end', () => {
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        console.log(`File processing completed in ${elapsedTime} ms`);

        fs.unlinkSync(req.file.path); // Delete the uploaded file after processing

        res.send('File uploaded and data saved');
      })
      .on('error', (error) => {
        console.error('CSV processing error:', error.message);
        res.status(500).send('Error processing CSV');
      });

    // Timeout to handle processing time
    setTimeout(() => {
      console.error('File processing took longer than one minute');
      res.status(500).send('File processing took longer than one minute');
    }, 6000000); // One minute timeout
  } catch (error) {
    console.error(`Error uploading file: ${error.message}`);
    res.status(500).send('Error uploading file');
  }
});

// Route to get all leads
router.get('/', async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    console.error(`Error fetching leads: ${error.message}`);
    res.status(500).send('Error fetching leads');
  }
});


router.put('/move/:id', async (req, res) => {
  const { id } = req.params;
  const { newStatus, assignedto } = req.body; // Add assignedto along with newStatus

  if (!newStatus && !assignedto) {
    return res.status(400).send('New status or assignedto field is required'); // Update error message
  }

  try {
    const updateFields = {}; // Create an object to hold the fields to update

    if (newStatus) {
      updateFields.status = newStatus; // Add status to the updateFields object
    }

    if (assignedto) {
      updateFields.assignedto = assignedto; // Add assignedto to the updateFields object
    }

    const updatedLead = await Lead.findByIdAndUpdate(id, updateFields, { new: true });

    if (!updatedLead) {
      return res.status(404).send('Lead not found'); // Ensure lead is found
    }

    res.json(updatedLead); // Return the updated lead
  } catch (error) {
    console.error(`Error updating lead: ${error.message}`); // Generalize error message
    res.status(500).send('Error updating lead'); // Generalize error message
  }
});

module.exports = router;
