import { v2 as cloudinary } from 'cloudinary';
//import fs from "fs";
import fs from 'node:fs';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});
console.log(`CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME} ${process.env.MONGO_URI}`, process.env.MONGO_URI)


const uploadOnCloudinary = async (localFilePath)=> {
    console.log("Local Path", localFilePath);
    try {
        if (!localFilePath) return null;
        console.log(fs.existsSync( localFilePath));


        //upload file on cloudinary 
        const response = await cloudinary.uploader.upload( localFilePath, {
            folder: "my_folder", // Optional: specify destination folder
            resource_type: "auto"
        } )
        
        //file has been uploaded on cloudinary successfully
        console.log("file has been uploaded on cloudinary successfully", response.url);
        console.log("response", response);

        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        /* if file has been uploaded unsuccessfully. File(may contain malicious/corrupted) present in server. for cleaning file we use unlink(delete) */
        console.log("Cloudinary upload error:", error);
        fs.unlinkSync(localFilePath)   // removes locally saved temporary file
        return null;

        
        
    }
}

export {uploadOnCloudinary}