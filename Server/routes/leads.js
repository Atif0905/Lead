const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Lead = require('../modal/Lead')

// const Deal = require('../modal/Deal')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

//This is upload route to upload csv file of leads
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('File received:', req.file); // Log file information for debugging

  // Check if a file was uploaded; if not, respond with a 400 Bad Request
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
// Record the start time to calculate the processing duration
    const startTime = Date.now();

    const results = [];
     // Create a readable stream from the uploaded CSV file
    fs.createReadStream(req.file.path)
    // Pipe the file stream to the csv-parser library to process the CSV data
      .pipe(csv())
      .on('data', async (data) => {
        console.log('Parsed row:', data); // Log each parsed row
        try {
          const leadData = {}; // Initialize an empty object to store lead data
          for (const key in data) {
            leadData[key] = data[key];  // Populate the lead data object with key-value pairs
          }
           // Save the lead data to the database
          await Lead.create(leadData);
        } catch (error) {
          console.error(`Error saving lead: ${error.message}`);
        }
      })
      .on('end', () => {
        // Calculate the total time taken to process the file
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

//Route to fetch leads
router.get('/', async (req, res) => {
  try {
     // Fetch all leads from the database using the Lead model
    const leads = await Lead.find();
      // Send the leads as a JSON response
    res.json(leads);
  } catch (error) {
    console.error(`Error fetching leads: ${error.message}`);
    res.status(500).send('Error fetching leads');
  }
});

// This endpoint for updating a lead by its ID
router.put('/move/:id', async (req, res) => {
   // Extract the 'id' parameter from the route
  const { id } = req.params;
  const { newStatus, assignedto } = req.body;

  if (!newStatus && !assignedto) {
    return res.status(400).send('New status or assignedto field is required');
  }

  try {
      // Create an object to store fields to be updated
    const updateFields = {};
 // Add 'status' to the update object if 'newStatus' is provided
    if (newStatus) {
      updateFields.status = newStatus;
    }
// Add 'assignedto' to the update object if it is provided
    if (assignedto) {
      updateFields.assignedto = assignedto;
    }
  // Find the lead by ID and update it with the provided fields
    const updatedLead = await Lead.findByIdAndUpdate(id, updateFields, { new: true });

    if (updatedLead) {
      return res.status(404).send('Lead not found');
    }
 // Send the updated lead back as a JSON response
    res.json(updatedLead);
  } catch (error) {
    console.error(`Error updating lead: ${error.message}`);
    res.status(500).send('Error updating lead');
  }
});

// This endpoint for deleting a lead by its ID
router.delete('/delete/:id', async (req, res) => {
   // Extract the 'id' parameter from the route
  const { id } = req.params;

  try {
     // Attempt to find and delete the lead by its ID
    const deletedLead = await Lead.findByIdAndDelete(id);
 // Check if the lead was found and deleted
    if (!deletedLead) {
       // If not found, send a 404 Not Found response
      return res.status(404).send('Lead not found');
    }

    res.status(200).json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error(`Error deleting lead: ${error.message}`);
    res.status(500).json({ error: 'Error deleting lead' });
  }
});

// This endpoint for creating a new lead
router.post('/create', async (req, res) => {
  try {
     // Extract fields from the request body
    const { name, email, number, status, assignedto,  } = req.body;

    if (!status) {
      return res.status(400).send('status');
    }
      // Create a new lead instance with the provided data
    const newLead = new Lead({
      name,
      email,
      number,
      status,
      assignedto,
     
    });
     // Save the new lead to the database
    const savedLead = await newLead.save();
    res.status(201).json(savedLead);
  } catch (error) {
    console.error(`Error creating lead: ${error.message}`);
    res.status(500).send('Error creating lead');
  }
});

// This endpoint for update to an existing lead by its ID
router.put('/update/:id', async (req, res) => {
    // Extract the 'id' parameter from the route
   const { id } = req.params;
    // Extract fields to be updated from the request body
   const { status, contactperson1, budget, pipeline, property, username, contactperson2, contactnumber, comment, lostreason, lostcomment, callbackTime, callbackDate} = req.body;
   try {
     // Attempt to find the lead by ID and update it with the provided fields
     const updatedLead = await Lead.findByIdAndUpdate(id, { status, contactperson1, budget, pipeline, property, username, contactperson2, contactnumber, comment,lostreason,lostcomment,callbackTime, callbackDate,

           }, { new: true });// Ensure the updated document is returned

      if (!updatedLead) {
     return res.status(404).json({ message: 'Lead not found' });
     }
 // Send the updated lead back as a JSON response
     res.json(updatedLead);
   } catch (error) {
     console.error('Error updating lead:', error);
     res.status(500).json({ message: 'Server error' });
   }
});

// This endpoint for appending updates to an existing lead by its ID
router.post('/:id', async (req, res) => {
   // Extract the lead ID from the route parameters
  const { id } = req.params;
   // Extract the update fields from the request body
  const {
    status, contactperson1, budget, pipeline, property,
    contactperson2, contactnumber, comment, callbackTime, callbackDate, reason,
  } = req.body;

  try {
    // Find the lead by its ID
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

     // Append the new update data to the `updates` array in the lead document
    lead.updates.push({
      status, contactperson1, budget, pipeline, property,
      contactperson2, contactnumber, comment, callbackTime, callbackDate, reason
    });

     // Save the lead document with the appended updates
    await lead.save();

    res.status(200).json({ message: 'Lead updated successfully', lead });
  } catch (error) {
    console.error('Error updating lead:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// This endpoint to fetch updates for a specific lead by its ID
router.get('/:id', async (req, res) => {
  // Extract the lead ID from the route parameters
  const { id } = req.params;

  try {
    // Find the lead in the database by its ID
    const lead = await Lead.findById(id);
  // If the lead is not found, return a 404 Not Found response
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Respond with the updates array from the lead document
    res.status(200).json({ updates: lead.updates });
  } catch (error) {
    console.error('Error fetching lead updates:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
