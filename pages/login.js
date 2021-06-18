import styles from "../styles/login.module.css";
import { useSelector, useDispatch } from "react-redux";
import {
  editAuthen,
  fetchAsyncLogin,
  fetchAsyncRegister,
  selectAuthen,
  selectIsLoading,
} from "../lib/loginSlice";
import { useState } from "react";
import { useRouter } from "next/router";
import { Loading } from "../components/Loading";

const Login = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const authen = useSelector(selectAuthen);
  const isLoading = useSelector(selectIsLoading);
  const [isLoginView, setIsLoginView] = useState(false);

  // ユーザ名 入力時
  const handleUsername = (e) => {
    dispatch(
      editAuthen({
        authen: { ...authen, username: String(e.currentTarget.value) },
      })
    );
  };
  // パスワード入力時
  const handlePassword = (e) => {
    dispatch(
      editAuthen({
        authen: { ...authen, password: String(e.currentTarget.value) },
      })
    );
  };
  // ********************
  // ログイン処理
  const handleLoginSubmit = async (e) => {
    // ボタンクリック時に画面のリフレッシュをしないようにする
    e.preventDefault();
    if (isLoginView) {
      // 新規ユーザ登録
      const result = await dispatch(fetchAsyncRegister(authen));
      // ユーザ登録完了後に、トークンを取得して、タスク一覧へ遷移する
      if (fetchAsyncRegister.fulfilled.match(result)) {
        await dispatch(fetchAsyncLogin(authen));
        router.push("/");
      }
    } else {
      // 登録済ユーザのトークンを取得して、タスク一覧へ遷移する
      const result = await dispatch(fetchAsyncLogin(authen));
      if (fetchAsyncLogin.fulfilled.match(result)) {
        router.push("/");
      }
    }
  };

  return (
    <>
      <div className={styles.root}>
        <div className={styles.header}>
          <div>
            <img
              className={styles.headerImg}
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className={styles.headerH2}>Sign in to your account</h2>
          </div>
        </div>

        <form className={styles.form} onSubmit={handleLoginSubmit}>
          <div className={styles.inputFrame}>
            <div>
              <label className={styles.label}>User Name</label>
              <input
                type="text"
                required
                className={styles.inputuser}
                placeholder="User Name"
                value={authen.username}
                onChange={handleUsername}
              />
            </div>
            <div>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                required
                className={styles.inputpassward}
                placeholder="Password"
                value={authen.password}
                onChange={handlePassword}
              />
            </div>
          </div>

          <div className={styles.modeFrame}>
            <div className={styles.textFrame}>
              <button
                type="button"
                className={styles.text}
                onClick={() => {
                  setIsLoginView(!isLoginView);
                }}
              >
                {isLoginView
                  ? "ログイン画面へ戻る"
                  : "アカウントを新規登録する"}
              </button>
            </div>
            <div className={styles.textFrame}>
              <button type="button" className={styles.text}>
                パスワードを忘れた場合はこちら
              </button>
            </div>
          </div>

          <div>
            <button type="submit" className={styles.button}>
              {isLoginView ? "新規登録" : "ログイン"}
            </button>
          </div>
        </form>
      </div>
      <Loading open={isLoading} />
    </>
  );
};
export default Login;
