const multer = require("multer");

const IMAGES_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = IMAGES_TYPE[file.mimetype];
    let err = new Error("Invaild image type");
    if (isValid) {
      err = null;
    }
    cb(err, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = IMAGES_TYPE[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

module.exports=  multer({ storage: storage }).single("image")

