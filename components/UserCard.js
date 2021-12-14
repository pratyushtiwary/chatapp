import styles from "../styles/components/UserCard.module.css";
import Image from "next/image";
import { Typography, useMediaQuery } from "@material-ui/core";
const { motion } = require("framer-motion");

export default function UserCard({ data, delay, index, onClick }){
    const maxWidth = useMediaQuery("(max-width: 679px)");
    const avatarURL = "https://avatars.dicebear.com/api/bottts/";

    function openChat(e){
        e.preventDefault();
        if(window.history.pushState){
            window.history.pushState({index: index}, null, "/chat/"+data.email);
        }
        else{
            window.location.href = "/chat/"+data.email;
        }
        onClick();
    }

    return (
        <motion.a 
            href={"/chat/"+data.email+"/"}
            onClick={openChat}
            className={styles.userCard}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay||0 }}
            whileHover = {{
                scale: 1.025,
                backgroundColor: "rgba(0,0,0,0.25)"
            }}
            whileFocus = {{
                scale: 1.025,
                backgroundColor: "rgba(0,0,0,0.25)"
            }}
            whileTap = {{
                scale: 0.925
            }}
        >
            <div className={styles.avatar}>
                <Image
                    src={avatarURL+data.avatar+"?background=%23ffffff"}
                    alt={data.name+" profile avatar"}
                    width={70}
                    height={70}
                />
            </div>
            <div className={styles.details}>
                <Typography variant="h4" className={styles.name}>{data.name}</Typography>
                <Typography variant="body1" className={styles.recentMessage}>{data.recentMessage}</Typography>
            </div>
        </motion.a>
    )
}