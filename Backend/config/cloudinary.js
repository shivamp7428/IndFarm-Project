import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// 1. Cloudinary ko Configure karein
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Storage Setting (Folder ka naam aur formats)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'KisanMitra_Profiles', // Cloudinary par is naam ka folder ban jayega
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

// 3. Multer Middleware
const upload = multer({ storage: storage });

export { cloudinary, upload };