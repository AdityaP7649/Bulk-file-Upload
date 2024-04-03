require("dotenv").config()
const express = require("express");
const multer = require("multer");
const { s3Uploadv3 } = require("./s3service");

const app = express();
const storage = multer.memoryStorage()

//File Filtering
const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "application") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

//Setting file size limit and number of files to upload at once
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3000000, files: 100 }
});


app.post("/upload", upload.array("file"), async (req, res) => {
  try {
    const results = await s3Uploadv3(req.files)
    console.log(results);
    return res.json({ status: "success" });
  } catch (err) {
    console.log(err);
  };
});

//Error Handling
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File is too large",
      });
    }

    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        message: "File limit reached",
      });
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: "File must be in pdf format",
      });
    }
  }
});


app.listen(4000, () => console.log("listening on port 4000"));