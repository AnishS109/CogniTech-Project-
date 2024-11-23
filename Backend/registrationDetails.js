// const express = require("express");
// const db = require("./utils/database");
// const cors = require("cors");

// const registrationDetails = express();

// registrationDetails.use(cors());
// registrationDetails.use(express.json());
// registrationDetails.use(express.urlencoded({ extended: true }));

// // Helper function to remove circular references
// function removeCircularReferences() {
//   const seen = new WeakSet();
  
//   return function (key, value) {
//     // If the value is an object and has been seen before, remove it
//     if (typeof value === 'object' && value !== null) {
//       if (seen.has(value)) {
//         return undefined; // Remove circular reference
//       }
//       seen.add(value);
//     }
//     return value;
//   };
// }

// registrationDetails.post("/registration-details", async (req, res) => {
//   const { name, phone_number, email, username, password, subject, experience, type } = req.body;

//   // Check if all required fields are provided
//   if (!name || !phone_number || !email || !username || !password) {
//     return res.status(400).json({ message: "All required fields must be filled." });
//   }

//   try {
//     const sanitizedSubject = subject || null;
//     const sanitizedExperience = experience || null;

//     const query = `
//       INSERT INTO registration_details 
//       (name, phone_number, email, username, password, subject, experience, type) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `;
//     const values = [name, phone_number, email, username, password, sanitizedSubject, sanitizedExperience, type];

//     // Execute the query
//     const result = await db.execute(query, values);

//     // Simplifying the result to avoid sending unnecessary details
//     const simplifiedResult = {
//       message: "Data inserted successfully",
//       insertedId: result.insertId,  // assuming `insertId` is the primary key of the inserted row
//     };

//     // Send the response with sanitized result (remove circular references)
//     res.status(200).json(JSON.parse(JSON.stringify(simplifiedResult, removeCircularReferences())));
//   } catch (error) {
//     console.error("Error inserting data:", error);
//     res.status(500).json({ message: "An error occurred while saving the data." });
//   }
// });

// module.exports = registrationDetails;

const express = require("express");
const db = require("./utils/database"); // Assuming db is the connection object
const cors = require("cors");

const registrationDetails = express();

registrationDetails.use(cors());
registrationDetails.use(express.json());
registrationDetails.use(express.urlencoded({ extended: true }));

// Helper function to remove circular references
function removeCircularReferences() {
  const seen = new WeakSet();
  
  return function (key, value) {
    // If the value is an object and has been seen before, remove it
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return undefined; // Remove circular reference
      }
      seen.add(value);
    }
    return value;
  };
}

registrationDetails.post("/registration-details", (req, res) => {
  const { name, phone_number, email, username, password, subject, experience, type } = req.body;

  // Check if all required fields are provided
  if (!name || !phone_number || !email || !username || !password) {
    return res.status(400).json({ message: "All required fields must be filled." });
  }

  // Sanitize inputs if necessary
  const sanitizedSubject = subject || null;
  const sanitizedExperience = experience || null;

  // Construct the query
  const query = `
    INSERT INTO registration_details 
    (name, phone_number, email, username, password, subject, experience, type) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [name, phone_number, email, username, password, sanitizedSubject, sanitizedExperience, type];

  // Using db.query() with callback
  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err.message);
      if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        return res.status(500).json({ message: "Database connection was closed unexpectedly. Please try again later." });
      }
      return res.status(500).json({ message: "An error occurred while saving the data.", details: err.message });
    }

    // Prepare the response with simplified result
    const simplifiedResult = {
      message: "Data inserted successfully",
      insertedId: result.insertId,  // Assuming `insertId` is the primary key of the inserted row
    };

    // Send the response with sanitized result (remove circular references)
    res.status(200).json(JSON.parse(JSON.stringify(simplifiedResult, removeCircularReferences())));
  });
});

module.exports = registrationDetails;

