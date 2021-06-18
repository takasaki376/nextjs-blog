import { Modal } from "./Modal";
import styles from "../styles/Loading.module.css";

export const Loading = (props) => {
  if (!props.open) {
    return null;
  }
  return (
    <Modal open={props.open}>
      <div className={styles.frame}>
        <div className={styles.loader}>Loading...</div>
        <div className={styles.back} />
      </div>
    </Modal>
  );
};
