"use client";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../utils/apiUrl";
import { toast } from "sonner";

interface UserState {
  user: { user: object; token: string } | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// ! Login thunk
export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string; tasks: Array<any> },
    { rejectWithValue }
  ) => {
    try {
      const response: any = await axios.post(
        `${API_URL}/auth/login`,
        credentials
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
      }

      if (response.status === 200) {
        window.location.href = "/todo";
        toast.success("Login successful", {
          description: `Welcome back ${response.data.user.name}`,
        });
        
        if (typeof window !== "undefined") {
          localStorage.setItem("tasks", [] as any);
        }
      } else {
        toast.error("Login failed", { description: response.data.message });
      }
      return response.data;
    } catch (error: any) {
      toast.error("Login failed", {
        description: error.response?.data?.message || "Login failed",
      });
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);
// ! Signup thunk
export const signup = createAsyncThunk(
  "auth/signup",
  async (
    credentials: {
      email: string;
      password: string;
      name: string;
      tasks: Array<any>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response: any = await axios.post(
        `${API_URL}/auth/register`,
        credentials
      );

      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
      }

      if (response.status === 201) {
        toast.success("Signup successful", {
          description: `Welcome ${response.data.user.name}`,
        });
        window.location.href = "/todo";
        if (typeof window !== "undefined") {
          localStorage.setItem("tasks", [] as any);
        }
      } else {
        toast.error("Signup failed", { description: response.data.message });
      }
      return response.data;
    } catch (error: any) {
      toast.error("Signup failed", {
        description: error.response?.data?.message || "Signup failed",
      });
      return rejectWithValue(error.response?.data?.message || "Signup failed");
    }
  }
);

// ! Auth slice if their is already a token in the device

interface AuthResponse {
  token: string;
  user: { name: string };
}
export const authUser = createAsyncThunk(
  "auth/authUser",
  async (_, { rejectWithValue }) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/auth-user`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.info("Log in successful", {
        description: `Welcome back ${response.data?.user?.name}`,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error: any) {
      toast.error("Failed to fetch user", {
        description: error.response?.data?.message || "Failed to fetch user",
      });
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(authUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(authUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(authUser.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
