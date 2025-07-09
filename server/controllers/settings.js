

exports.getSettings = async (req, res) => {
    try {
       

        // 1. Validate user authentication
        if (!req.user || !req.user._id) {
          
            return res.status(401).json({ 
                error: "User not authenticated",
                details: "No user object attached to request"
            });
        }

        // 2. Validate database connection
        if (!mongoose.connection.readyState) {
          
            return res.status(500).json({ 
                error: "Database connection error",
                details: "Mongoose connection state: " + mongoose.connection.readyState
            });
        }

        // 3. Prepare query with proper error handling
        let files = [];
        try {
            const filesCollection = mongoose.connection.db.collection("uploads.files");
            const ownerId = req.user._id;
          
            
            files = await filesCollection.find({
                $or: [
                    { "metadata.owner._id": ownerId.toString() },
                    { "metadata.owner._id": new mongoose.Types.ObjectId(ownerId) }
                ]
            }).toArray();
            
        } catch (dbError) {
            
            return res.status(500).json({
                error: "Database operation failed",
                details: dbError.message,
                collection: "uploads.files"
            });
        }

        // 4. Calculate storage with null checks
        const totalStorageUsed = files.reduce((acc, file) => {
            return acc + (file?.length || 0);
        }, 0);

        // 5. Prepare response with fallbacks
        res.json({
            user: {
                username: req.user.username || "Unnamed User", // Fallback for missing username
                email: req.user.email || "no-email@example.com", // Fallback for missing email
                _id: req.user._id.toString() // Ensure ID is string
            },
            storage: {
                used: totalStorageUsed,
                max: 10 * 1024 * 1024 * 1024, // 10GB
                percentageUsed: Math.min(100, (totalStorageUsed / (10 * 1024 * 1024 * 1024)) * 100).toFixed(2)
            },
            twoFAEnabled: false,
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        console.error("SETTINGS ERROR:", err);
        res.status(500).json({ 
            error: "Server error",
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

const mongoose = require("mongoose");
const User = require("../models/User");

exports.getSettings = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ msg: "Not authenticated" });
    }

    const userDoc = await User.findById(req.user._id);
    if (!userDoc) {
      return res.status(404).json({ msg: "User not found" });
    }

    let files = [];
    try {
      const filesCollection = mongoose.connection.db.collection("uploads.files");
      const ownerId = req.user._id;
      files = await filesCollection
        .find({
          $or: [
            { "metadata.owner._id": ownerId.toString() },
            { "metadata.owner._id": new mongoose.Types.ObjectId(ownerId) },
          ],
        })
        .toArray();
    } catch (err) {
      return res.status(500).json({ msg: "Error fetching user files" });
    }

    const totalStorageUsed = files.reduce((acc, file) => acc + (file?.length || 0), 0);

    res.json({
      user: {
        _id: userDoc._id,
        username: userDoc.username,
        email: userDoc.email,
      },
      storage: {
        used: totalStorageUsed,
        max: 10 * 1024 * 1024 * 1024,
      },
      twoFAEnabled: userDoc.twoFAEnabled,
    });
  } catch (err) {
    console.error("SETTINGS ERROR", err);
    res.status(500).json({ msg: "Server error" });
  }
};



