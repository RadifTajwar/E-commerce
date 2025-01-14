import CryptoJS from 'crypto-js';

const SECRET_KEY = "Tajwar@00452268";

const localStorageUtil = {
  setItem(key, value) {
    try {
      // Encrypt the value
      const encryptedValue = CryptoJS.AES.encrypt(JSON.stringify(value), SECRET_KEY).toString();
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error(`Error setting ${key} in local storage`, error);
    }
  },

  getItem(key) {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;

      // Decrypt the value
      const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
      const decryptedValue = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedValue;
    } catch (error) {
      console.error(`Error getting ${key} from local storage`, error);
      return null;
    }
  },

  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from local storage`, error);
    }
  },
};

export default localStorageUtil;
