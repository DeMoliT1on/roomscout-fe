export const setLocalStorageData = (name, value) => {
  if (sessionStorage) {
    sessionStorage.setItem(name, value);
  }
};

export const getLocalStorageData = (name) => {
  if (sessionStorage) {
    const item = sessionStorage.getItem(name);
    if (name === localStorageKey.user) {
      return item
        ? JSON.parse(item)
        : {
            role: -1,
          };
    } else {
      return item;
    }
  }
};

export const removeLocalStorageItem = (key) => {
  if (sessionStorage) {
    sessionStorage.removeItem(key);
  }
};

export const localStorageKey = {
  user: "userInfo",
  token: "authToken",
  refreshToken: "refreshToken",
};

export const clearAuthOnLogout = () => {
  removeLocalStorageItem(localStorageKey.user);
  removeLocalStorageItem(localStorageKey.token);
  removeLocalStorageItem(localStorageKey.refreshToken);
};
