import cloudinary from 'cloudinary';
import serverConfigs from '../../configs/serverConfigs.js';

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER,
} = serverConfigs.CLOUDINARY;

cloudinary.v2.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

const upload = async (fromPath, toFolder) => {
  const { url } = await cloudinary.v2.uploader.upload(fromPath, {
    folder: `${CLOUDINARY_FOLDER}/${toFolder}`,
  });

  return url;
};

export default {
  upload,
};
