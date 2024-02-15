import { configureStore } from "@reduxjs/toolkit";
import { fsaApi } from "./FSA";
import { setupListeners } from "@reduxjs/toolkit/query";

export const createStore = () => {
    const store = configureStore({
        reducer: {
            [fsaApi.reducerPath]: fsaApi.reducer
        },
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware().concat(fsaApi.middleware),
        // https://vitejs.dev/guide/env-and-mode#env-variables
        devTools: import.meta.env.DEV
    });
    setupListeners(store.dispatch);
    return store;
};