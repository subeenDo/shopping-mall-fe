import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { showToastMessage } from "../common/uiSlice";
import api from "../../utils/api";
import { initialCart, getCartList } from "../cart/cartSlice";

// 이메일 로그인
export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async ({ email, password }, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      // 로그인 성공
      sessionStorage.setItem("token", response.data.token);
      dispatch(initialCart());
      dispatch(getCartList());
      return response.data;
    } catch (error) {
      // 실패 시 에러 메시지 반환
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 구글 로그인
export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/google", { token });
      sessionStorage.setItem("token", response.data.token);

      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.error);
    }
  }
);

// 로그아웃
export const logout = () => (dispatch) => {
  sessionStorage.removeItem("token");
  dispatch(clearUser());
};

// 회원가입
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ email, name, password, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.post("/user", { email, name, password });
      dispatch(
        showToastMessage({
          message: "회원가입 성공했습니다!",
          status: "success",
        })
      );
      navigate("/login");
      return response.data.data;
    } catch (error) {
      dispatch(
        showToastMessage({
          message: "회원가입에 실패했습니다.",
          status: "error",
        })
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 토큰으로 로그인
export const loginWithToken = createAsyncThunk(
  "user/loginWithToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user/me");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// 리덕스 슬라이스 정의
const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    loginError: null,
    registrationError: null,
    success: false,
  },
  reducers: {
    clearErrors: (state) => {
      state.loginError = null;
      state.registrationError = null;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationError = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.registrationError = action.payload;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.loginError = null;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      })
      .addCase(loginWithToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.loginError = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.loginError = action.payload;
      });
  },
});

export const { clearErrors, clearUser } = userSlice.actions;
export default userSlice.reducer;
