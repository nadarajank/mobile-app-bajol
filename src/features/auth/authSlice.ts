import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  hydrated: boolean;
  token: string | null;
  user: Record<string, unknown> | null;
};

const initialState: AuthState = {
  hydrated: false,
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateSession: (
      state,
      action: PayloadAction<{
        token: string | null;
        user: Record<string, unknown> | null;
      }>,
    ) => {
      state.hydrated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<Record<string, unknown> | null>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { hydrateSession, logout, setToken, setUser } = authSlice.actions;
export default authSlice.reducer;
