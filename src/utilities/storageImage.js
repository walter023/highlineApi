import multer from "multer";
import AppError from "./appError";
import aws from "aws-sdk";
import multerS3 from "multer-s3";
import url from "url";
import appError from "../utilities/appError";
require("dotenv").config();

aws.config.update({
  secretAccessKey: process.env.SECRET_BUCKET_KEY,
  accessKeyId: process.env.BUCKET_KEY_ID,
  region: "ap-southeast-2"
});
const s3 = new aws.S3();

const storage = multerS3({
  s3: s3,
  bucket: "highlineguide",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadata: (req, file, cb) => {
    cb(null, { FieldName: req.userData.userId });
  },
  key: (req, file, cb) => {
    cb(null, `highlines/${Date.now()}`);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new AppError("invalide file"), false);
  }
};

export default multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

export const deleteS3Images = imageUrls => {
  const imageNames = [];
  for (let k of imageUrls) {
    imageNames.push({ Key: url.parse(k).path.substring(1) });
  }
  const options = {
    Bucket: "highlineguide",
    Delete: {
      Objects: imageNames
    }
  };
  s3.deleteObjects(options, (err, data) => {
    if (data) {
      console.log("File successfully deleted");
    } else {
      throw new appError("error deleting.", err);
    }
  });
};
