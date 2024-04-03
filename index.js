const express = require("express");
const multer = require("multer");
const uuid = require("uuid").v4;
const app = express();

//Single file upload
// const upload = multer({ dest: "uploads/" });
// app.post("/upload", upload.single("file"), (req, res) => {
//    res.json({ status: "success" });
// });


//Multiple file Upload
// const upload = multer({ dest: "uploads/" });
// app.post("/upload", upload.array("file", 100), (req, res) => {
//     console.log(req.files);
//     res.json({ status: "success" });
// });


//custom Name
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        const { originalname } = file;
        cb(null, `${uuid()}-${originalname}`);
    },
});


//File Filtering
const fileFilter = (req, file, cb) => {
    if (file.mimetype.split("/")[0] === "application") {
        cb(null, true);
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false); 
    }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 3000000, files: 100 } });
app.post("/upload", upload.array("file"), (req, res) => {
    res.json({ status: "success" });
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