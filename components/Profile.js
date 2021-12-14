import styles from "../styles/components/Profile.module.css";
import { IconButton, Icon, Typography, Button } from "@material-ui/core";
import Image from "next/image";

const { motion, AnimatePresence } = require("framer-motion");

export default function Profile({ data, open, onDismiss, onBlock, onUnBlock }){
    const avatarURL = "https://avatars.dicebear.com/api/bottts/";

    return (
        <AnimatePresence>
            {
                open && (
                    <div 
                        className={styles.profileContainer}
                    >
                        <motion.div
                            className={styles.overlay}
                            initial = {{ opacity: 0 }}
                            animate = {{ opacity: 1 }}
                            exit = {{ opacity: 0 }}
                            onClick={onDismiss}
                        >
                        </motion.div>
                        <motion.div 
                            className={styles.profile}
                            initial = {{x: 100, opacity: 0}}
                            animate = {{x: 0, opacity: 1}}
                            exit = {{x: 100, opacity: 0}}
                        >
                            <div className={styles.profileHeader}>
                                <IconButton onClick={onDismiss}>
                                    <Icon>close</Icon>
                                </IconButton>
                                <Typography variant="h4" className={styles.title}>View Profile</Typography>
                            </div>
                            <div className={styles.profileData}>
                                <div className={styles.profileAvatar}>
                                    <Image
                                        src={avatarURL+data.avatar+"?background=%23ffffff"}
                                        alt={data.name+"'s avatar"}
                                        layout="fill"
                                    />
                                </div>
                                <Typography variant="h5" className={styles.username}>{data.name}</Typography>
                                <Typography variant="body1" className={styles.email}>{data.email}</Typography>
                                {
                                    !data.isBlocked && (
                                        <Button
                                            variant="outlined"
                                            className = {styles.btn}
                                            onClick={onBlock}
                                        >
                                            <Icon className={styles.icon}>report</Icon>Block User
                                        </Button>
                                    )
                                }
                                {
                                    data.isBlocked && (
                                        <Button
                                            variant="outlined"
                                            className = {styles.btn}
                                            onClick={onUnBlock}
                                        >
                                            <Icon className={styles.icon}>report</Icon>Unblock User
                                        </Button>
                                    )
                                }
                            </div>
                        </motion.div>
                    </div>
                )
            }
        </AnimatePresence>
    )
}