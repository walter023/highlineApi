import multer from 'multer';
import AppError from './appError';
import aws from 'aws-sdk';
import multerS3 from 'multer-s3';
import url from 'url';
import { config } from '../../config';
import appError from '../utilities/appError';

aws.config.update({
    secretAccessKey: config.bucket.secretAccessKey,
    accessKeyId: config.bucket.accessKeyId,
    region: config.bucket.region
})
var s3 = new aws.S3();

const storage = multerS3({
    s3: s3,
    bucket: 'highlineguide',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
        cb(null, { FieldName: req.userData.userId });
    },
    key: function (req, file, cb) {
        cb(null, `highlines/${Date.now()}${file.originalname}`);
    }
   
});

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new AppError('invalide file'), false);
    }
};

export default multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

export const deleteS3Images = images => {
    var objects = [];
    for (let k of images) {
        objects.push({ Key: url.parse(k).path.substring(1) });
    }
    var options = {
        Bucket: 'highlineguide',
        Delete: {
            Objects: objects,
        },
    };
    s3.deleteObjects(options, function (err, data) {
        if (data) {
            console.log("File successfully deleted");
        } else {
            throw new appError("error deleting.", err);
        }
    });
}

