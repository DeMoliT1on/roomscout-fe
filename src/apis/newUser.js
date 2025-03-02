import api from 'src/utils/api'
import { API_URLS } from 'src/utils/constants'

export const registerUser = async (requestObj) => {
  return await api.post(API_URLS.register_api, requestObj)
}

export const verfiyEmail = async (requestObj) => {
  return await api.post(API_URLS.verify_email_api, requestObj)
}

export const requestNewVerifyLink = async (requestObj) => {
  return await api.post(API_URLS.request_new_verify_link, requestObj)
}
