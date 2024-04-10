import fs from 'fs/promises';
import Jimp from 'jimp';
import multer from 'multer';
import path from 'path';
import { v4 as uuid } from 'uuid';

import HttpError from '../helpers/HttpError.js';
import serverConfigs from '../configs/serverConfigs.js';

const { TEMP_FOLDER } = serverConfigs.FILE;

const MEGABYTE = 1024 * 1024;
const destination = path.resolve(TEMP_FOLDER);

const storage = multer.diskStorage({
  destination,
  filename: (req, file, callback) => {
    const extention = file.originalname.split('.').pop();

    callback(null, `${req.user.id}-${uuid()}.${extention}`);
  },
});

const fileFilter = (_, file, callback) => {
  if (!file.mimetype.startsWith('image/')) {
    callback(new HttpError('Image formats supported only'), false);
  }

  callback(null, true);
};

const limits = { fileSize: 2 * MEGABYTE };

const removeFile = (imagePath) => fs.unlink(imagePath);

const imageResize = async (imagePath) => {
  const image = await Jimp.read(imagePath);

  return image.cover(250, 250).quality(90).writeAsync(imagePath);
};

const uploader = multer({ storage, fileFilter, limits });

export default {
  removeFile,
  imageResize,
  uploader,
};
