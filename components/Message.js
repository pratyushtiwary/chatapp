import styles from "../styles/components/Message.module.css";
const { motion, AnimatePresence } = require("framer-motion");

export function Error({ open, message }){
    return (
        <AnimatePresence>
            {
                open && (
                    <motion.div 
                        className={styles.msg+" "+styles.error}
                        initial = {{
                            opacity: 0
                        }}
                        animate = {{
                            opacity: 1
                        }}
                        exit = {{
                            opacity: 0
                        }}
                    >
                        {message}
                    </motion.div>
                )
            }
            
        </AnimatePresence>
    )
}

export function Success({ open, message }){
    return (
        <AnimatePresence>
            {
                open && (
                    <motion.div 
                        className={styles.msg+" "+styles.success}
                        initial = {{
                            opacity: 0
                        }}
                        animate = {{
                            opacity: 1
                        }}
                        exit = {{
                            opacity: 0
                        }}
                    >
                        {message}
                    </motion.div>
                )
            }
        </AnimatePresence>
    )
}