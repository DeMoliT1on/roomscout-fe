import api from 'src/utils/api'

import { API_URLS } from 'src/utils/constants'

export default {
  listPropertyApi: async function (requestObj) {
    try {
      const response = api.post(API_URLS?.list_property_api, requestObj)
      return response
    } catch (error) {
      return error.data
    }
  },
  updatePropertyApi: async (requestObj) => {
    try {
      const response = api.post(API_URLS?.update_property_api, requestObj)
      return response
    } catch (error) {
      return error.data
    }
  },
  propertyUploadImage: async (requestObj) => {
    try {
      const response = await api.post(
        API_URLS?.property_upload_image_api,
        requestObj,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response
    } catch (error) {
      return error.data
    }
  },
  getPropertyListings: async () => {
    try {
      const response = await api.get(API_URLS?.get_property_listing_api)
      return response
    } catch (error) {
      return error.data
    }
  },
  getAllPropertyListings: async () => {
    try {
      const response = await api.get(API_URLS?.get_all_property_listing_api)
      return response
    } catch (error) {
      return error.data
    }
  },
  submitPropertyForVerification: async (propertyId) => {
    try {
      const response = await api.post(
        API_URLS?.submit_property_verification_api,
        {
          property_id: propertyId,
        }
      )
      return response
    } catch (error) {
      return error.data
    }
  },
  searchProperties: async (requestObj) => {
    try {
      const response = await api.get(API_URLS.search_properties_api, {
        params: {
          location: requestObj.location,
          radius: requestObj.radius,
          min_rent: requestObj.min_rent,
          max_rent: requestObj.max_rent,
          bathrooms: requestObj.bathrooms,
          bedrooms: requestObj.bedrooms,
          property_type: requestObj.property_type,
          page: requestObj.page,
          per_page: requestObj.per_page,
          sort_by: requestObj.sort_by,
        },
      })
      return response
    } catch (error) {
      return error.data
    }
  },
  addToWishlist: async (requestObj) => {
    try {
      const response = await api.post(API_URLS?.wishlist_api, requestObj)
      return response
    } catch (error) {
      return error.data
    }
  },
  validateAddress: async (requestObj) => {
    try {
      return await api.post(API_URLS?.validate_address, requestObj)
    } catch (error) {
      return error.data
    }
  },
  getWishlistedProperties: async (requestObj) => {
    try {
      return await api.get(API_URLS?.wishlist_api, {
        params: {
          page: requestObj.page,
          per_page: requestObj.per_page,
        },
      })
    } catch (error) {
      return error.data
    }
  },
  getMyListings: async (requestObj) => {
    try {
      return await api.get(API_URLS?.my_listings_api, {
        params: {
          page: requestObj.page,
          per_page: requestObj.per_page,
        },
      })
    } catch (error) {
      return error.data
    }
  },
  getPropertyListing: async (requestObj) => {
    try {
      return await api.get(`${API_URLS?.get_property_listing_api}${requestObj.property_id}/`, {
      })
    } catch (error) {
      return error.data
    }
  },
  updatePropertyVerificationStatus: async ({ property_id, action }) => {
    try {
      const response = await api.post(API_URLS?.update_property_verification_status_api, {
        property_id,
        action
      })
      return response
    } catch (error) {
      return error.data
    }
  },
  deleteProperty: async (propertyId) => {
    try {
      const response = await api.post(API_URLS?.delete_property_api, {
        property_id: propertyId
      })
      return response
    } catch (error) {
      return error.data
    }
  },
}
