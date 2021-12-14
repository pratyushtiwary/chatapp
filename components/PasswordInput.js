import { TextField, IconButton, Icon } from "@material-ui/core";
import styles from "../styles/components/PasswordInput.module.css";
import { useState } from "react";

export default function PasswordInput({ label, visibility, value, onChange, forgetPassword, error, helperText }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div
            className="input"
        >
            <div
                className={styles.passwordInput}
            >
                <TextField
                    type={showPassword ? "text" : "password"}
                    label={label||"Password"}
                    variant="outlined"
                    color="primary"
                    className={styles.passwordInputField}
                    required
                    value={value}
                    onChange={onChange}
                    error={error}
                    helperText={helperText}
                />
                {
                    visibility && (
                        <IconButton
                            className={styles.icon}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <Icon>{
                                !showPassword ? "visibility" : "visibility_off"    
                            }</Icon>
                        </IconButton>
                    )
                }
            </div>
            {
                forgetPassword && (
                    <a 
                        href="/forget_password"
                        className={styles.forgetPassword}
                    >
                        Forgot Password?
                    </a>
                )
            }
        </div>
    )
}