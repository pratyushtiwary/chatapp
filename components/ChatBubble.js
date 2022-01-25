import styles from "../styles/components/ChatBubble.module.css";
import { Typography } from "@material-ui/core";
import { useState, useEffect } from "react";
const { motion, AnimatePresence } = require("framer-motion");

export default function CharBubble({msg, byMe, on, index}){
    const [show,setShow] = useState(false);

    const updateShow = (val) => () => {
        setShow(val);
    }

    useEffect(()=>{
        let k = setTimeout(()=>{
            setShow(false);
            clearTimeout(k);
        },1500);
        return ()=>clearTimeout(k)
    },[show]);

    return (
      <motion.div
        className={styles.chatBubble + " " + (byMe && styles.byMe)}
        initial={{
          y: byMe ? 25 : 25,
        }}
        animate={{
          y: 0,
        }}
        transition={{
          duration: 0.25,
          stiffness: 20,
        }}
        key={index}
        whileHover={updateShow(true)}
        whileTap={updateShow(true)}
      >
        <Typography variant="body1" className={styles.content}>
          {msg}
        </Typography>
        <AnimatePresence>
          {show && (
            <motion.div
              className={styles.container}
              initial={{
                opacity: 0,
                y: "-100%",
              }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.25,
                  ease: "easeIn",
                },
              }}
              exit={{
                opacity: 0,
                y: "-100%",
                transition: {
                  duration: 0.25,
                  ease: "easeOut",
                },
              }}
            >
              <Typography variant="caption" className={styles.on}>
                {new Date(on).toLocaleString()}
              </Typography>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
}