import Head from "next/head";
import styles from "../styles/credits.module.css";
import { Typography } from "@material-ui/core";
import { APPNAME } from "../globals";

export default function Credits() {
  return (
    <>
      <Head>
        <title>Credits - {APPNAME}</title>
      </Head>
      <div className={styles.cont}>
        <center>
          <Typography variant="h4">Credits</Typography>
        </center>
        <center className={styles.link}>
          <Typography variant="h6">
            <a
              href="https://github.com/pratyushtiwary/"
              target="_blank"
              rel="noreferrer"
            >
              Pratyush Tiwary
            </a>
          </Typography>
        </center>
        <center className={styles.link}>
          <Typography variant="h6">
            <a
              href="https://github.com/RakshitaBhole11/"
              target="_blank"
              rel="noreferrer"
            >
              Rakshita Bhole
            </a>
          </Typography>
        </center>
        <center className={styles.link}>
          <Typography variant="h6">
            <a
              href="https://github.com/Shruti-22-bliss"
              target="_blank"
              rel="noreferrer"
            >
              Shruti Rawat
            </a>
          </Typography>
        </center>
      </div>
    </>
  );
}
