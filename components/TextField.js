import styles from "../styles/TextField.module.css";

export const TextField = (props) => {
  return (
    <div className={styles.root}>
      {props.title && <span className={styles.title}>{props.title} : </span>}
      {props.multiline ? (
        <textarea
          className={styles.text}
          multiline={props.multiline}
          rows={props.rows}
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
        />
      ) : (
        <input
          type="text"
          className={styles.text}
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
        />
      )}
    </div>
  );
};
