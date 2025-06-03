import { configureStore } from '@reduxjs/toolkit';
import { productApi } from '../services/productService';
import { orderApi } from '../services/orderService';

export const store = configureStore({
  reducer: {
    [productApi.reducerPath]: productApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware, orderApi.middleware),
});