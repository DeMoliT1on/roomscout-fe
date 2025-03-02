import api from "src/utils/api";
import { API_URLS } from "src/utils/constants";


export const authenticateUser = async (requestObj) => {
  return await api.post(API_URLS?.login_api, requestObj);
};
