import { createContext, useContext, useMemo } from "react";
import { getLocalStorageData, localStorageKey } from "src/utils/storage";
import { useAuthInfo } from "./useAuthInfo";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  let defaultUser = {
    role: -1,
  };

  try {
    defaultUser = getLocalStorageData(localStorageKey.user) || defaultUser;
  } catch (e) {
    // DO nothing
  }

  let defaultToken = null;

  try {
    defaultToken = getLocalStorageData(localStorageKey.token);
  } catch (e) {
    // DO nothing
  }

  let defautlRefreshToken = null;

  try {
    defautlRefreshToken = getLocalStorageData(localStorageKey.refreshToken);
  } catch (e) {
    // DO nothing
  }

  const [user, setUser] = useAuthInfo(
    localStorageKey.user,
    JSON.stringify(defaultUser)
  );

  const [token, setToken] = useAuthInfo(localStorageKey.token, defaultToken);

  const [refreshToken, setRefreshToken] = useAuthInfo(
    localStorageKey.refreshToken,
    defautlRefreshToken
  );

  const navigate = useNavigate();

  // call this function when you want to authenticate the user
  const login = async (data) => {
    if (data.user) {
      setUser(JSON.stringify(data.user));
    }
    if (data.token) {
      setToken(data.token);
    }
    if (data.refreshToken) {
      setRefreshToken(data.refreshToken);
    }
  };

  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    navigate("/login");
  };

  const value = useMemo(
    () => ({
      user: user && typeof user === "string" ? JSON.parse(user) : user,
      token,
      refreshToken,
      login,
      logout,
    }),
    [user, token, refreshToken]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
