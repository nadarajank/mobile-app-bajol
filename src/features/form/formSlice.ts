import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type FormState = Record<string, unknown> & {
  authUser?: Record<string, unknown>;
};

const initialState: FormState = {};

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<Record<string, unknown>>) => ({
      ...state,
      ...action.payload,
    }),
    resetForm: () => ({}),
    setAuthUser: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.authUser = action.payload;
    },
  },
});

export const { resetForm, setAuthUser, updateFormData } = formSlice.actions;
export default formSlice.reducer;
