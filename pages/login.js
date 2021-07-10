import styles from "../styles/login.module.css";
import { useState } from "react";

const Login = () => {
  const [isLoginView, setIsLoginView] = useState(false);

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

        <form className={styles.form}>
          <div className={styles.inputFrame}>
            <div>
              <label className={styles.label}>User Name</label>
              <input
                type="text"
                required
                className={styles.inputuser}
                placeholder="User Name"
              />
            </div>
            <div>
              <label className={styles.label}>Password</label>
              <input
                type="password"
                required
                className={styles.inputpassward}
                placeholder="Password"
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
    </>
  );
};
export default Login;
