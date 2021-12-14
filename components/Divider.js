import styles from "../styles/components/Divider.module.css";

export default function Divider({ vertical }){
    return (
        <div className={styles.divider+" "+(vertical&&styles.verticalHR)}>
            {
                !vertical && (<hr/>)
            }
        </div>
    );
}