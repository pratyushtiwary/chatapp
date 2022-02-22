import styles from "../styles/register.module.css";
import { APPNAME } from "../globals";
import Head from "next/head";
import Image from "next/image";
import { Typography, TextField, Button } from "@material-ui/core";
import PasswordInput from "../components/PasswordInput";
import useHit from "../components/useHit";
import useStorage from "../components/useStorage";
import { useState, useEffect } from "react";
import { Error, Success } from "../components/Message";
import { verify_token } from "../components/crypto";
import Loader from "../components/Loader";
import Link from "next/link";
const URL = "https://chatappbackend123.herokuapp.com";
// const URL = "http://localhost:5000";

export default function Register(props) {
  const hit = useHit(URL);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpass, setCPass] = useState("");
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

  function register(e) {
    e.preventDefault();
    setIsLoading(true);
    if (password === cpass) {
      hit("register", {
        email,
        password,
        username,
      })
        .then((c) => {
          setIsLoading(false);
          setError(null);
          setSuccess("Register Successful!");
          window.location.href = "/login";
        })
        .catch((err) => {
          setIsLoading(false);
          setSuccess(null);
          setError(err.message);
        });
    } else {
      setError("Passwords don't match!");
    }
  }

  return (
    <>
      <Head>
        <title>Register - {APPNAME}</title>
      </Head>
      <Link href="/credits" passHref>
        <a className={styles.credits}>Credits</a>
      </Link>
      <div className={styles.main}>
        <form className={styles.login} onSubmit={register}>
          <Success open={Boolean(success)} message={success} />
          {visible && (
            <>
              <Image src="/logo.svg" alt="logo" height={75} width={75} />
              <Typography variant="h4" className={styles.title}>
                {APPNAME}
              </Typography>
              <center>
                <Typography variant="subtitle">
                  <Link href="/login">Click Here To Login</Link>
                </Typography>
              </center>
              <Error open={Boolean(error)} message={error} />
              <TextField
                type="text"
                label="Username"
                variant="outlined"
                className="input"
                required
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
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
              <PasswordInput
                label="Confirm Password"
                visibility={true}
                value={cpass}
                onChange={(e) => setCPass(e.currentTarget.value)}
              />
              <Button color="primary" className="button" type="submit">
                Register
              </Button>
            </>
          )}
        </form>
      </div>
      <Loader open={isLoading} loadingTxt="Registering..." />
    </>
  );
}
