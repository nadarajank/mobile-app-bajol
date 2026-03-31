import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type OtpState = {
  mobileNumber: string | null;
  otpSent: boolean;
  otpVerified: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: OtpState = {
  mobileNumber: null,
  otpSent: false,
  otpVerified: false,
  loading: false,
  error: null,
};

const otpSlice = createSlice({
  name: "otp",
  initialState,
  reducers: {
    setOtpLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setOtpSent: (state, action: PayloadAction<string>) => {
      state.mobileNumber = action.payload;
      state.otpSent = true;
      state.error = null;
    },
    setOtpVerified: (state) => {
      state.otpVerified = true;
      state.error = null;
    },
    setOtpError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetOtp: () => initialState,
  },
});

export const { resetOtp, setOtpError, setOtpLoading, setOtpSent, setOtpVerified } =
  otpSlice.actions;
export default otpSlice.reducer;
