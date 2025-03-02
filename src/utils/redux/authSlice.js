import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: {
    role: -1,
    email: '',
  },
  token: null,
  refreshToken: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveUserInfo: (state, action) => {
      const { user, token, refreshToken } = action.payload
      state.user = user
      state.token = token
      state.refreshToken = refreshToken
    },
    logOut: (state) => {
      state.user = { role: -1, email: '' }
      state.token = null
      state.refreshToken = null
    },
  },
})

export const { saveUserInfo, logOut } = authSlice.actions
export default authSlice.reducer