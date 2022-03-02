require("dotenv").config()
const multer = require('multer');
const fs = require("fs")
const S3 = require("aws-sdk/clients/s3")
const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_REGION
const accessId = process.env.AWS_ACCESS_KEY
const secretKeyId = process.env.AWS_SECRET_KEY

const s3 = new S3({
    region,
    accessKeyId:accessId,
    secretAccessKey:secretKeyId
})

function uploadS3(file){
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket:bucketName,
        Body: fileStream,
        Key: file.filename
    }
    return s3.upload(uploadParams).promise()
}

/**
 * 
 * @param {*} fileKey 
 * @returns 
 */
function downloadS3(fileKey){
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return s3.getObject(downloadParams).createReadStream()
}

exports.destroyBucketImage = function(fileKey) {
    var params = {
        Key: fileKey,
        Bucket: bucketName
    };
    return s3.deleteObject(params).promise()
    // s3.deleteObject(params, function(err, data) {
    //   if (err) {
    //     console.log(err);
    //     callback(err);
    //   } else {
    //     callback(null);
    //   }
    // });
  }

// let storage = multer.diskStorage({
//     destination: function(req,file,cb){
//         cb(null,"./images");
//     },
//     filename: function(req,file,cb){
//         cb(null,new Date().toISOString()+file.originalname)
//     }
// })

const fileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(png|PNG|jpeg|jpg)$/)){
        return cb(new Error("Please upload a .png or .jpeg"))
    }
    return cb(null,true)
};

const upload = multer({
    // storage:storage,
    dest: "images",
    limits:{
        fileSize: 1024 * 1024 *4  // 4mb
    },
    fileFilter
})

exports.upload = upload
exports.uploadS3 = uploadS3
exports.downloadS3 = downloadS3