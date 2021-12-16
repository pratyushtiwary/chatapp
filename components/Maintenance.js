import { Typography } from "@material-ui/core";
import styles from "../styles/components/Maintenance.module.css";

export default function Maintenance() {
  return (
    <div className={styles.cont}>
      <Typography variant="h5" className={styles.txt}>
        Site is under maintenance.
      </Typography>
    </div>
  );
}
