import crypto from 'crypto';
import bcrypt from 'bcryptjs';

import serverConfigs from '../configs/serverConfigs.js';

const { IV, KEY } = serverConfigs.CRYPTO;

const algorithm = 'aes256';
const cipherArgs = [algorithm, KEY, IV];
const inEncode = 'utf8';
const outEncode = 'hex';

const encrypt = (text) => {
  const cipher = crypto.createCipheriv(...cipherArgs);

  return cipher.update(text, inEncode, outEncode) + cipher.final(outEncode);
};
const decrypt = (encyption) => {
  const decipher = crypto.createDecipheriv(...cipherArgs);

  return (
    decipher.update(encyption, outEncode, inEncode) + decipher.final(inEncode)
  );
};

const generateToken = () => crypto.randomBytes(32).toString(outEncode);

const generateMd5Hash = (text) =>
  crypto.createHash('md5').update(text).digest(outEncode);

const bCrypt = (text) => bcrypt.hashSync(text, bcrypt.genSaltSync(10));

const bCryptCompare = (text, bcrypted) => bcrypt.compareSync(text, bcrypted);

export default {
  encrypt,
  decrypt,
  generateToken,
  generateMd5Hash,
  bCrypt,
  bCryptCompare,
};
