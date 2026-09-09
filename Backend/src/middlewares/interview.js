import multer from "multer";
const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 3 * 1024 * 1024,
  },

  fileFilter: (req, file, cb) => {
    console.log("FILE:", file.originalname);
    console.log("MIMETYPE:", file.mimetype);

    if (
      file.mimetype === "application/pdf" &&
      file.originalname.toLowerCase().endsWith(".pdf")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

export default upload;
