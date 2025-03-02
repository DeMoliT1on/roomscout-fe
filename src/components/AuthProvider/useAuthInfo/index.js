import { useState } from "react";
import {
  getLocalStorageData,
  removeLocalStorageItem,
  setLocalStorageData,
} from "src/utils/storage";

export const useAuthInfo = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = getLocalStorageData(keyName);
      if (value) {
        return value;
      } else {
        if (defaultValue) {
          setLocalStorageData(keyName, defaultValue);
        }
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });

  const setValue = (newValue) => {
    try {
      if (newValue) {
        setLocalStorageData(keyName, newValue);
      } else {
        removeLocalStorageItem(keyName);
      }
    } catch (err) {}
    setStoredValue(newValue);
  };

  return [storedValue, setValue];
};
