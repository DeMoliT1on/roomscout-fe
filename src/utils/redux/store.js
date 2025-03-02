import { configureStore,combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import counterReducer from './counterSlice'
import authReducer from './authSlice'

// Configure persistence for authReducer
const persistConfig = {
  key: 'auth',
  storage,
}

const persistedAuthReducer = persistReducer(persistConfig, authReducer)

// Combine reducers if you have multiple slices
const rootReducer = combineReducers({
  counter: counterReducer,
  auth: persistedAuthReducer,
})

// Create the store
const store = configureStore({
  reducer: rootReducer,
})

// Create the persistor
export const persistor = persistStore(store)

export default store