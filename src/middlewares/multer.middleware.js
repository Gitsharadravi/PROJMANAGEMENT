import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {       // getting file from multer
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {     
    cb(null, `${Date.now()}-${file.originalname}`);  //for uniquely naming file to avoid repeation of file name
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 4 * 1000 * 1000,       //1mb
  },
});
