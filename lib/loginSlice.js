import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ログイン時のトークン作成
export const fetchAsyncLogin = createAsyncThunk("login/post", async (auth) => {
  const res = await axios
    .post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}auth/jwt/create`, auth, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .catch((error) => {
      throw error;
    });
  return res.data;
});

// 新規ユーザ作成
export const fetchAsyncRegister = createAsyncThunk(
  "login/register",
  async (auth) => {
    const res = await axios
      .post(`${process.env.NEXT_PUBLIC_RESTAPI_URL}auth/users/`, auth, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .catch((error) => {
        throw error;
      });
    return res.data;
  }
);

// ログイン中のチェック
export const fetchAsyncAuth = createAsyncThunk("auth/jwt/verify/", async () => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_RESTAPI_URL}auth/users/me/`,
    {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    }
  );
  return res.data;
});

// 初期値の設定
export const initialState = {
  authen: {
    username: "",
    password: "",
  },
  isLoading: false,
  isLoggedIn: false,
  error: {
    isError: false,
    errorMessage: "",
  },
  loginUser: {
    email: "",
    id: 0,
    username: "",
  },
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    // ログイン画面でメールアドレス、パスワードを入力された際に値を格納する
    editAuthen(state, action) {
      state.authen = action.payload.authen;
    },
    editLogout(state) {
      localStorage.removeItem("localJWT");
      state.isLoggedIn = false;
      state.loginUser = {};
    },
  },
  extraReducers: (builder) => {
    // ログイン成功
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.setItem("localJWT", action.payload.access);
      // ログインに成功
      state.isLoading = false;
      state.isLoggedIn = true;
      state.authen = initialState.authen;
      console.log("ログインに成功");
    });
    // ログイン処理中のローディング
    builder.addCase(fetchAsyncLogin.pending, (state) => {
      state.error.isError = false;
      state.error.errorMessage = "";
      return {
        ...state,
        isLoading: true,
      };
    });
    // ログインの異常終了
    builder.addCase(fetchAsyncLogin.rejected, (state, action) => {
      state.error.isError = true;
      state.error.errorMessage = action.error.message;
      return {
        ...state,
        isLoading: false,
      };
    });
    // ユーザ作成失敗
    builder.addCase(fetchAsyncRegister.rejected, (state, action) => {
      return {
        ...state,
        isError: true,
        errorMessage: action.error.message,
      };
    });
    // ユーザ取得成功
    builder.addCase(fetchAsyncAuth.fulfilled, (state, action) => {
      state.isLoggedIn = true;
      state.loginUser.id = action.payload.id;
      state.loginUser.username = action.payload.username;
      state.loginUser.email = action.payload.email;
    });
    // ユーザ取得失敗
    builder.addCase(fetchAsyncAuth.rejected, (state) => {
      console.log("認証期限切れ");
      localStorage.removeItem("localJWT");
      state.isLoggedIn = false;
      state.loginUser = {};
    });
  },
});

export const { editAuthen, editLogout } = loginSlice.actions;

export const selectAuthen = (state) => state.login.authen;
export const selectIsLoading = (state) => state.login.isLoading;
export const selectIsLoggedIn = (state) => state.login.isLoggedIn;
export const selectErrorLogin = (state) => state.login.error;
export const selectLoginUser = (state) => state.login.loginUser;

export default loginSlice.reducer;
