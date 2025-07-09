const crypto = require("crypto");
const mongoose = require("mongoose");
const { Readable } = require("stream");


const secretKey = Buffer.from(process.env.SECRET_KEY, "hex"); // 32-byte key

const conn = mongoose.connection;
let bucket;

// Initialize GridFSBucket when MongoDB is connected
conn.once("open", () => {
  bucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads"
  });
});

// Encrypt buffer using AES-256-CBC
function encrypt(buffer) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  return { encrypted, iv };
}

// Decrypt buffer using AES-256-CBC
function decrypt(buffer, iv) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", secretKey, iv);
  const decrypted = Buffer.concat([decipher.update(buffer), decipher.final()]);
  return decrypted;
}

// Upload a file (encrypted)
exports.uploadFile = async (req, res) => {
  try {
    const { encrypted, iv } = encrypt(req.file.buffer);

    const readable = new Readable();
    readable.push(encrypted);
    readable.push(null);

    const uploadStream = bucket.openUploadStream(req.file.originalname, {
      metadata: {
        owner: req.user,
        iv: iv.toString("hex")
      }
    });

    uploadStream.on("error", (err) => {
      console.error("Upload stream error:", err);
      res.status(500).json({ msg: "Upload failed" });
    });

    uploadStream.on("finish", () => {
      res.status(201).json({ msg: "File uploaded", fileId: uploadStream.id });
    });

    readable.pipe(uploadStream);

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// List all files owned by the user
exports.getFiles = async (req, res) => {
  try {
    const files = await bucket.find({ "metadata.owner": req.user }).toArray();
    if (!files.length) {
      return res.status(404).json({ msg: "No files found" });
    }
    res.json(files);
  } catch (err) {
    console.error("LIST FILES ERROR:", err);
    res.status(500).json({ msg: "Failed to list files" });
  }
};

// Download and decrypt a file
exports.downloadFile = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files.length) {
      return res.status(404).json({ msg: "File not found" });
    }

    const file = files[0];
    const iv = Buffer.from(file.metadata.iv, "hex");

    const downloadStream = bucket.openDownloadStream(fileId);
    const chunks = [];

    downloadStream.on("data", chunk => chunks.push(chunk));
    downloadStream.on("end", () => {
      const encryptedBuffer = Buffer.concat(chunks);
      const decrypted = decrypt(encryptedBuffer, iv);
      res.set("Content-Disposition", `attachment; filename="${file.filename}"`);
      res.send(decrypted);
    });

    downloadStream.on("error", (err) => {
      console.error("DOWNLOAD ERROR:", err);
      res.status(500).json({ msg: "Error downloading file" });
    });

  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete a file
exports.deleteFile = async (req, res) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    await bucket.delete(fileId);
    res.json({ msg: "File deleted" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ msg: "Deletion failed" });
  }
};


exports.getStats = async (req, res) => {
  try {
    

    const ownerId = req.user._id;
    const ownerIdString = ownerId.toString();
    const ownerIdObjectId = new mongoose.Types.ObjectId(ownerId);

    const filesCollection = mongoose.connection.db.collection("uploads.files");

    const query = {
      $or: [
        { "metadata.owner._id": ownerIdString },
        { "metadata.owner._id": ownerIdObjectId }
      ]
    };

    const totalFiles = await filesCollection.countDocuments(query);

    // calculate files uploaded in last 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const lastDayFilesCount = await filesCollection.countDocuments({
      ...query,
      uploadDate: { $gte: oneDayAgo }
    });

    // calculate % change compared to the previous day
    // you might want to store the total from exactly yesterday in the future for precision
    let totalFilesDelta = 0;
    if (totalFiles > 0) {
      totalFilesDelta = ((lastDayFilesCount / totalFiles) * 100).toFixed(1);
    }

    const files = await filesCollection.find(query).toArray();
    const totalStorageUsed = files.reduce((acc, file) => acc + file.length, 0);

    // security score calculation
    let securityScore = 100;
    if (totalFiles > 10) securityScore -= (totalFiles - 10);
    if (securityScore < 50) securityScore = 50;

    const lastBackup = new Date(Date.now() - 2 * 60 * 60 * 1000);

    res.json({
      totalFiles,
      totalFilesDelta,
      totalStorageUsed,
      securityScore,
      lastBackup,
      autoSync: true,
    });

  } catch (err) {
    console.error("STATS ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};
