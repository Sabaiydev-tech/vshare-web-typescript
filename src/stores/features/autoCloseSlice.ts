// eventSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "stores/store";

interface IMenuDropdownClose {
  isOpen: boolean;
}

const initialState: IMenuDropdownClose = {
  isOpen: false,
};

const autoCloseMenuProvideSlice = createSlice({
  name: "autoCloseMenuDropdown",
  initialState,
  reducers: {
    setIsOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload;
    },
  },
});

export const { setIsOpen } = autoCloseMenuProvideSlice.actions;

export default autoCloseMenuProvideSlice.reducer;
