import { Typography } from "@material-ui/core";
import { motion, AnimatePresence } from "framer-motion";
import styles from "../styles/components/MainLoader.module.css";

export default function MainLoader({ open }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div 
            className={styles.mainLoader}
            exit = {{opacity: 0}}
        >
          <div className={styles.cont}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 1 }}
              className={styles.loader}
            ></motion.div>
            <Typography variant="h5" className={styles.txt}>
              Loading...
            </Typography>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
