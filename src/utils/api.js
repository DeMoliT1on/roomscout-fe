import axios from 'axios'
import { AUTH_NOT_REQUIRED_APIS } from './constants'
import { LOGIN } from './routes'
import {
  localStorageKey,
  clearAuthOnLogout,
  getLocalStorageData,
  setLocalStorageData,
} from './storage'

const isAuthRequired = (url) => !AUTH_NOT_REQUIRED_APIS.includes(url)

const getTokenFromStorage = (url) => {
  console.log(url)
  if (isAuthRequired(url)) {
    if (url === '/refreshtoken') {
      return {
        authorization: `Bearer ${getLocalStorageData(localStorageKey.token)}`,
        isRefreshToken: true,
        refreshToken: `${getLocalStorageData(localStorageKey.refreshToken)}`,
      }
    } else {
      return {
        authorization: `Bearer ${getLocalStorageData(localStorageKey.token)}`,
      }
    }
  }
}

const checkTokenExpiration = (err) =>
  err.response.status === 403 &&
  err.response.data.status === 403 &&
  err.response.data.msg === 'Token Expired' &&
  !err.config._retry

const handleRefreshToken = async () => {
  const newTokenResponse = await api.get('/refreshtoken')
  if (newTokenResponse) {
    setLocalStorageData(localStorageKey.token, newTokenResponse.token)
  }
}

const handleUnauthorizedAccess = (err) => {
  const data = err.response.data

  if (data && data.error && data.error.status) {
    return data
  } else {
    clearAuthOnLogout()
    window.location.href = LOGIN
  }
}

const handleForbiddenAccess = (err) => {
  if (err.response.data && err.response.data.error === 'Email Unverified') {
    return err.response.data
  } else {
    //handle others
  }
}

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 30000,
})

api.interceptors.request.use(async (config) => {
  return {
    ...config,
    headers: {
      ...config.headers,
      ...getTokenFromStorage(config.url),
    },
  }
})

api.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201) {
      return response.data
    } else {
      return null
    }
  },
  async (err) => {
    const originalRequest = err.config
    if (err.response) {
      if (checkTokenExpiration(err)) {
        originalRequest._retry = true
        await handleRefreshToken()
        return api(originalRequest)
      } else if (err.response.status && err.response.status === 401) {
        return handleUnauthorizedAccess(err)
      } else if (err.response.status && err.response.status === 403) {
        return err.response.data
      } else if (err.response.status && err.response.status === 400) {
        return err.response.data
      } else {
        return err.response.data
      }
    }
    return Promise.reject(err)
  }
)

export default api
