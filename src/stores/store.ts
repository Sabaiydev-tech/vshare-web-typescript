// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import paymentSlice from "./features/paymentSlice";
import selectorSlice from "./features/selectorSlice";
import autoCloseMenuDropdownReducer from "./features/autoCloseSlice";
const store = configureStore({
  reducer: {
    payment: paymentSlice,
    selectorSlice,
    autoCloseMenuDropdown: autoCloseMenuDropdownReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
