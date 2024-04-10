import { defaultEnv, envTypes } from '../constants/configConstants.js';

const {
  NODE_ENV: ENV = defaultEnv,
  API_URL,
  UI_URL,
  PORT = 3000,

  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,

  JWT_SECRET,
  JWT_EXPIRE = '1h',

  TEMP_FOLDER = 'temp',

  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_FOLDER,

  SMTP_HOST,
  SMTP_PORT,
  SMTP_USERNAME,
  SMTP_PASSWORD,
  SMTP_EMAIL_FROM,

  CRYPTO_IV,
  CRYPTO_KEY,
} = process.env;

const DB = {
  DB_HOST,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
};

const SMTP = {
  HOST: SMTP_HOST,
  PORT: SMTP_PORT,
  USERNAME: SMTP_USERNAME,
  PASSWORD: SMTP_PASSWORD,
  FROM: SMTP_EMAIL_FROM,
};

const IS_DEV = ENV === envTypes.DEVELOPMENT;
const IS_PROD = ENV === envTypes.PRODUCTION;

export default {
  APP: {
    PORT,
    UI_URL,
    BASE_API_URL: IS_PROD ? `${API_URL}/api` : `${API_URL}:${PORT}/api`,
    API_URL: IS_PROD ? API_URL : `${API_URL}:${PORT}`,

    ENV,
    IS_DEV,
    IS_PROD,
  },
  DB,
  JWT: {
    JWT_SECRET,
    JWT_EXPIRE,
  },
  FILE: {
    TEMP_FOLDER,
  },
  CLOUDINARY: {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    CLOUDINARY_FOLDER,
  },
  SMTP,
  CRYPTO: {
    IV: CRYPTO_IV,
    KEY: CRYPTO_KEY,
  },
};
