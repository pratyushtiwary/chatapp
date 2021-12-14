import { Modal, CircularProgress, Typography } from "@material-ui/core";
import styles from "../styles/components/Loader.module.css";

export default function Loader({loadingTxt, open}){
    return (
        <Modal
            open={open}
        >
            <div className={styles.modal}>
                <CircularProgress size={48} color="primary" className={styles.loader}/>
                <Typography className={styles.loadingTxt} variant="h5">{loadingTxt||"Loading..."}</Typography>
            </div>
        </Modal>
    )
}