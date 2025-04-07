import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

// Import slice reducers here
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';

const persistConfig = {
  key: 'root',
  storage,
  // Blacklist orders.items to prevent serialization issues
  blacklist: ['orders'],
  // Optionally whitelist or blacklist specific slices
  // whitelist: ['products', 'orders']
};

// Combine reducers
const rootReducer = combineReducers({
  products: productReducer, 
  orders: orderReducer,     
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 