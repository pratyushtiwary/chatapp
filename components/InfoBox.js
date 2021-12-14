import styles from "../styles/components/InfoBox.module.css";
import Image from "next/image";
import { Typography, IconButton, Icon } from "@material-ui/core";
import { useState } from "react";

const { motion, AnimatePresence } = require("framer-motion");

export default function InfoBox({data, mobile, onBack, onClick}){
    const avatarURL = "https://avatars.dicebear.com/api/bottts/";

    function goBack(){
        if(onBack){
            onBack();
        }
        else{
            window.location.href = "/";
        }
    }

    return (
        <>
            <motion.div 
                className={styles.infoBox}
                whileHover = {{
                    backgroundColor: "rgba(0,0,0,0.25)"
                }}
                onClick={onClick}
            >
                <div className={styles.avatar}>
                    {
                        mobile && (
                            <>
                                <IconButton onClick={goBack} className={styles.backBtn}>
                                    <Icon className={styles.backIcon}>arrow_back</Icon>
                                </IconButton>
                                <div className={styles.img}>
                                    <Image
                                        src={avatarURL+data.avatar+"?background=%23ffffff"}
                                        alt={data.name+"'s avatar"}
                                        layout="fill"
                                    />
                                </div>
                            </>
                        )
                    }
                    {
                        !mobile && (
                            <Image
                                src={avatarURL+data.avatar+"?background=%23ffffff"}
                                alt={data.name+"'s avatar"}
                                layout="fill"
                                className={styles.img}
                            />
                        )
                    }
                    
                </div>
                <div className={styles.block}>
                    <Typography className={styles.name} variant="h5">
                        {data.name}
                    </Typography>
                    <AnimatePresence>
                        {
                            data.isOnline && (
                                <Typography 
                                    className={styles.status} 
                                    variant="subtitle2"
                                    initial={{opacity: 0, scale: 0}}
                                    animate={{opacity:1,scale:1}}
                                    exit={{opacity:0,scale:0}}
                                >
                                    Online
                                </Typography>
                            )
                        }
                    </AnimatePresence>
                    
                </div>
            </motion.div>
        </>
    )
}