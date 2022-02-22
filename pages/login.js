import styles from "../styles/login.module.css";
import { APPNAME } from "../globals";
import Head from "next/head";
import Image from "next/image";
import { Typography, TextField, Button } from "@material-ui/core";
import PasswordInput from "../components/PasswordInput";
import useHit from "../components/useHit";
import useStorage from "../components/useStorage";
import { useState, useEffect } from "react";
import { Error, Success } from "../components/Message";
import { encrypt, verify_token } from "../components/crypto";
import Link from "next/link";
import Loader from "../components/Loader";
const URL = "https://chatappbackend123.herokuapp.com";
// const URL = "http://localhost:5000";

export default function Login(props) {
  const hit = useHit(URL);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const storage = useStorage();
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = storage.get("token");
    if (verify_token(token)) {
      window.location.href = "/";
    } else {
      setVisible(true);
    }
  }, [storage]);

  function login(e) {
    e.preventDefault();
    setIsLoading(true);
    hit("login", {
      email,
      password,
    })
      .then((c) => {
        setIsLoading(false);
        setError(null);
        setSuccess("Login Successful!");
        const token = {
          email: email,
          token: c.message.token,
        };
        storage.set("token", encrypt(JSON.stringify(token)));
        window.location.href = "/";
      })
      .catch((err) => {
        setIsLoading(false);
        setSuccess(null);
        setError(err.message);
      });
  }

  return (
    <>
      <Head>
        <title>Login - {APPNAME}</title>
      </Head>
      <Link href="/credits" passHref>
        <a className={styles.credits}>Credits</a>
      </Link>
      <div className={styles.main}>
        <form className={styles.login} onSubmit={login}>
          <Success open={Boolean(success)} message={success} />
          {visible && (
            <>
              <Image src="/logo.svg" alt="logo" height={75} width={75} />
              <Typography variant="h4" className={styles.title}>
                {APPNAME}
              </Typography>
              <center>
                <Typography variant="subtitle">
                  <Link href="/register">Click Here To Register</Link>
                </Typography>
              </center>
              <Error open={Boolean(error)} message={error} />
              <TextField
                type="email"
                label="Email"
                variant="outlined"
                className="input"
                required
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              <PasswordInput
                visibility={true}
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              <Button color="primary" className="button" type="submit">
                Login
              </Button>
            </>
          )}
        </form>
      </div>
      <Loader open={isLoading} loadingTxt={"Logging you in..."} />
    </>
  );
}
