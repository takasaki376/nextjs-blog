import styles from "../styles/Button.module.css";
import cc from "classcat";

export const Button = (props) => {
  const classes = cc([
    styles.button,
    {
      [styles.outline]: props.variant === "outline",
      [styles.contained]: props.variant === "contained",
    },
    props.className,
  ]);
  return (
    <div className={styles.root}>
      <button
        className={classes}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.children}
      </button>
    </div>
  );
};
// Propsのデフォルト値
Button.defaultProps = {
  variant: "contained",
  disabled: false,
};
