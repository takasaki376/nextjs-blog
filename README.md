# 検索処理　 V1 までの対応概要

## axios インストール

yarn add axios

## .env ファイル作成

バックエンドのローカル開発サーバを参照する URL を設定する

# lib/blogApi.js 作成

# 登録・更新・削除処理　 V2 までの対応概要

## SWR のインストール

yarn add swr

## classcat のインストール

yarn add classcat

## ビルドする

yarn build

# ログイン画面の作成

## ログイン画面を作成

[tailwind UI の画面](https://tailwindui.com/components/application-ui/forms/sign-in-forms)を参考に login.js を作成

## redux toolkit のインストール

yarn add redux react-redux @reduxjs/toolkit
yarn add -D @types/react-redux

## Redux 用の Chrome 拡張機能

[Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=ja)

## slice の作成 (今回は /lib/loginSlice.js を作成する )

Redux toolkit の createSlice を使用して slice を作成する。

```
// 初期値
export const initialState: スライスの型 = {
  count: 0,
};

// スライスの内容を定義する。
// name           : slice の名前
// initialState   : slice の初期値
// reducers       : slice の更新処理を記述する
const xxxSlice = createSlice({
  name: 'xxx',
  initialState,
  reducers: {
    // count をプラスする例
    incrementCounter: (state, action: PayloadAction<number>) => ({
      ...state,
      count: state.count + action.payload,
    }),
    // count をマイナスする例
    decrementCounter: (state, action: PayloadAction<number>) => ({
      ...state,
      count: state.count - action.payload,
    }),
  },
});
```

- createAsyncThunk : 非同期処理を定義する。
- ## createSlice : slice を定義する。

## store の作成 (今回は /lib/store.js を作成する )

slice をまとめる。

## \_app.js の修正

store を追加する。

## 各ページを修正する。

今回はログインページ

- useSelector : store に定義されている状態を参照する際に使用する。
- useDispatch : store に定義されている状態を変更する際に使用する。具体的には reducers に定義している処理を呼びだす。
