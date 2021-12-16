import { Typography } from "@material-ui/core";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/components/ConnectError.module.css";

export default function ConnectError({ shown }) {
  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.cont}
        >
          <div className={styles.main}>
            <div className={styles.errorImg}></div>
            <Typography variant="h5" className={styles.errorTxt}>
              Unable to connect to server, please make sure you have an active
              internet connection!
            </Typography>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
