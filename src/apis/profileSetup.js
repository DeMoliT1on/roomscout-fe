import api from 'src/utils/api'
import { API_URLS } from 'src/utils/constants'

export const saveLesseeProfile = async (userId, requestObj) => {
  return await api.put(`${API_URLS.lessee_profile}/${userId}/`, requestObj, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const getLesseeProfile = async (userId) => {
  return await api.get(`${API_URLS.lessee_profile}/${userId}/`)
}

export const saveLessorProfile = async (userId, requestObj) => {
  return await api.put(`${API_URLS.lessor_profile}/${userId}/`, requestObj)
}

export const getLessorProfile = async (userId) => {
  return await api.get(`${API_URLS.lessor_profile}/${userId}/`)
}
