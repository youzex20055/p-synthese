import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { useLocation } from 'react-router-dom';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:1337/api/' }),
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => 'products?populate=*',
      transformResponse: (response) => {
        console.log('Products Response:', response);
        return response;
      },
    }),
    getProshirts: builder.query({
      query: () => 'proshirts?populate=*',
      transformResponse: (response) => {
        console.log('Shirts Response:', response);
        return response;
      },
    }),
    getProacc: builder.query({
      query: () => 'proaccs?populate=*',
    }),
  }),
});

export const { 
  useGetProductsQuery,
  useGetProshirtsQuery,
  useGetProaccQuery
} = productApi;

// Import useLocation from react-router-dom
export const useCustomProductsQuery = () => {
  const location = useLocation();
  const isShirts = location.pathname.toLowerCase().includes("proshirt");
  
  return createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:1337/api/' }),
    endpoints: (builder) => ({
      getProducts: builder.query({
        query: () => isShirts ? 'proshirts?populate=*' : 'products?populate=*',
      }),
    }),
  });
};