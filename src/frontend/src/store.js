import { configureStore } from "@reduxjs/toolkit";
import { fsaApi } from "./FSA";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: {
    [fsaApi.reducerPath]: fsaApi.reducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(fsaApi.middleware)
});
setupListeners(store.dispatch);