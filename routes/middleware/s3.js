const S3 = require('aws-sdk')
const fs = require('fs')
const dotenv = require('dotenv');

dotenv.config();




const bucketName = process.env.DO_BUCKET_NAME
const region = process.env.DO_REGION
const accessKeyId = process.env.DO_ACCESS_KEY
const secretAccessKey = process.env.DO_SECRET_KEY
const endpoint = process.env.DO_END_POINT
// S3.config.update({
//   bucketName,
//   accessKeyId,
//   secretAccessKey
// })


const s3 = new S3.S3({
    
    region,
    endpoint,
    bucketName,
    accessKeyId,
    secretAccessKey,
    
  })


function uploadFile(file,item) {        // item is folder name in s3 bucket

  let Location = '';
  // const folder = ( "banners/");
   
  if(file !== undefined){
    
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {  
      Bucket: bucketName,
      Body: fileStream,
      Key:  item + "/" + file.filename,
      ACL: 'public-read',
      ContentType:"image/jpeg"  
    }
    return s3.upload(uploadParams).promise()

  }
  return Location;

     
  }


  function uploadMultiple(fileName)  {

    let Location = '';
     
    if(fileName !== undefined){
      const fileStream = fs.createReadStream(fileName[0].path)
     
    
      const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: fileName[0].filename,
        ACL: 'public-read',
        ContentType:"image/jpeg"
      }
    
      //return s3.upload(uploadParams).promise()
      return s3.upload(uploadParams).promise()
  
    }
    return Location;
  
       
    }
  
    
 function deleteimage(item,filename){    // item is folder name in s3 bucket
    const delParams = {
      Bucket: bucketName,
      Key: item + "/" + filename
    }
    s3.deleteObject(delParams, function(err, data){
      if(err) console.log(err, err.stack);
      else console.log(data);
    })
 }  
  

  exports.uploadFile = uploadFile
  
  exports.uploadMultiple = uploadMultiple   

  exports.deleteimage = deleteimage