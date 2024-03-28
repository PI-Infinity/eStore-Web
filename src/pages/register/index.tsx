import {
  Alert,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { BounceLoader } from "react-spinners";
import styled from "styled-components";
import Button from "../../components/button";
import { Input } from "../../components/input";
import { useAppContext } from "../../context/app";
import { useCurrentUserContext } from "../../context/currentUser";
import { useShippingContext } from "../../context/shipping";
import { useTheme } from "../../context/theme";
import Verify from "./emailCodeVerify";

const Register = () => {
  const navigate = useNavigate();

  // current user
  const { setCurrentUser, currentUser } = useCurrentUserContext();

  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser]);

  // Function to navigate programmatically

  // theme
  const { theme } = useTheme();

  // identify states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Add these variables to your component to track the state
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  // verify email states
  const [verify, setVerify] = useState(false);
  const [code, setCode] = useState("");
  const [codeInput, setCodeInput] = useState("");

  // app context
  const { backendUrl, isMobile } = useAppContext();

  // alert message
  const [alert, setAlert] = useState({ active: false, type: "", text: "" });

  /**
   * Send verify email
   */
  // sending loading state
  const [sendingLoading, setSendingLoading] = useState(false);

  const SendEmail = async () => {
    if (
      firstName?.length < 1 ||
      lastName?.length < 1 ||
      email?.length < 1 ||
      password?.length < 1 ||
      confirmPassword?.length < 1
    ) {
      return setAlert({
        active: true,
        text: activeLanguage.pleaseInputFields,
        type: "error",
      });
    }
    if (!email?.includes("@") || email?.length < 6 || email?.length > 40) {
      return setAlert({
        active: true,
        text: activeLanguage.incorrectEmail,
        type: "error",
      });
    }

    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      return setAlert({
        active: true,
        text: activeLanguage.incorrectEmail,
        type: "error",
      });
    }

    if (firstName?.length < 2 || firstName?.length > 30) {
      return setAlert({
        active: true,
        text: activeLanguage.firstNameLengthIncorrect,
        type: "error",
      });
    }
    if (lastName?.length < 2 || lastName?.length > 30) {
      return setAlert({
        active: true,
        text: activeLanguage.lastNameLengthIncorrect,
        type: "error",
      });
    }
    if (password?.length < 8 || password?.length > 40) {
      return setAlert({
        active: true,
        text: activeLanguage.incorrectPassword,
        type: "error",
      });
    }
    if (password !== confirmPassword) {
      return setAlert({
        active: true,
        text: activeLanguage.passwordsDoNotMatch,
        type: "error",
      });
    }
    try {
      setSendingLoading(true);
      const response = await axios.post(
        backendUrl + "/emails/sendVerifyEmail",
        {
          email: email,
        }
      );

      setVerify(true);
      setCode(response.data.code);

      setSendingLoading(false);
    } catch (error: any) {
      console.log(error.response);
      setSendingLoading(false);
      setAlert({
        active: true,
        text: error.response.data.message,
        type: "error",
      });
    }
  };

  /**
   * Registration
   */
  const [registerLoading, setRegisterLoading] = useState(false);

  const Register = async () => {
    // console.log(code);
    // if hone includes country code continue, if not alert error
    try {
      // Signup user
      setRegisterLoading(true);
      const response = await axios.post(backendUrl + "/api/v1/users/signup", {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
      });
      setCurrentUser(response.data.user);
      localStorage.setItem(
        "eStore:currentUser",
        JSON.stringify(response.data.user)
      );
      navigate("/");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setCode("");
      setCodeInput("");
      setTimeout(() => {
        setVerify(false);
        setRegisterLoading(false);
      }, 500);
    } catch (err: any) {
      setCode("");
      setCodeInput("");
      // error handlers
      console.log(err.response.data.message);
      setAlert({
        active: true,
        text: err.response.data.message,
        type: "error",
      });
    }
  };

  const { activeLanguage } = useAppContext();

  return (
    <Container>
      <Inputs
        style={{
          width: isMobile ? "90%" : "30%",
        }}
      >
        <div style={{ width: "100%", display: "flex", gap: "16px" }}>
          <Input
            label={activeLanguage.firstName}
            value={firstName}
            onChange={setFirstName}
            type="text"
            warning={false}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const nextField = document.getElementById(
                  "lastName"
                ) as HTMLInputElement;
                if (nextField) {
                  nextField?.focus();
                }
              }
            }}
          />
          <Input
            id="lastName"
            label={activeLanguage.lastName}
            value={lastName}
            onChange={setLastName}
            type="text"
            warning={false}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const nextField = document.getElementById(
                  "email"
                ) as HTMLInputElement;
                if (nextField) {
                  nextField?.focus();
                }
              }
            }}
          />
        </div>
        <Input
          id="email"
          label={activeLanguage.email}
          value={email}
          onChange={setEmail}
          type="text"
          warning={false}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const nextField = document.getElementById(
                "pass"
              ) as HTMLInputElement;
              if (nextField) {
                nextField?.focus();
              }
            }
          }}
        />
        <TextField
          id="pass"
          label={activeLanguage.password}
          variant="outlined"
          value={password}
          type={showPassword ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const nextField = document.getElementById(
                "confirmPass"
              ) as HTMLInputElement;
              if (nextField) {
                nextField?.focus();
              }
            }
          }}
          InputProps={{
            // <-- This is where the toggle button is added.
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? (
                    <MdVisibility color={theme.secondaryText} size={22} />
                  ) : (
                    <MdVisibilityOff color={theme.secondaryText} size={22} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              height: "53px",
              background: theme.lightBackground,
              borderRadius: "10px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: "1.5px",
                borderColor: theme.line,
                borderRadius: "10px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.primary,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.primary,
              },
            },
            "& .MuiOutlinedInput-input": {
              borderRadius: "10px",
              color: theme.secondaryText,
            },
            "& label": {
              color: theme.secondaryText,
              fontSize: "14px",
              letterSpacing: "0.5px",
            },
            "& label.Mui-focused": {
              color: theme.secondaryText,
              fontSize: "14px",
              letterSpacing: "0.5px",
            },
          }}
        />
        <TextField
          id="confirmPass"
          label={activeLanguage.confirmPassword}
          variant="outlined"
          value={confirmPassword}
          type={showPassword ? "text" : "password"}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            // <-- This is where the toggle button is added.
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? (
                    <MdVisibility color={theme.secondaryText} size={22} />
                  ) : (
                    <MdVisibilityOff color={theme.secondaryText} size={22} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Call your function here
              SendEmail(); // Replace this with your function call
            }
          }}
          sx={{
            width: "100%",
            "& .MuiOutlinedInput-root": {
              height: "53px",
              background: theme.lightBackground,
              borderRadius: "10px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: "1.5px",
                borderColor: theme.line,
                borderRadius: "10px",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.primary,
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.primary,
              },
            },
            "& .MuiOutlinedInput-input": {
              borderRadius: "10px",
              color: theme.secondaryText,
            },
            "& label": {
              color: theme.secondaryText,
              fontSize: "14px",
              letterSpacing: "0.5px",
            },
            "& label.Mui-focused": {
              color: theme.secondaryText,
              fontSize: "14px",
              letterSpacing: "0.5px",
            },
          }}
        />
        <Button
          background={theme.primaryText}
          color={theme.lightBackground}
          onClick={SendEmail}
          title={
            sendingLoading ? (
              <BounceLoader color={theme.lightBackground} size={25} />
            ) : (
              activeLanguage.createAccount
            )
          }
        />
        <Link
          className="button"
          to={"/login"}
          style={{
            letterSpacing: "0.5px",
            color: theme.primary,
            fontWeight: 600,
            textDecoration: "none",
            fontSize: "14px",
            margin: 0,
          }}
        >
          {activeLanguage.login}
        </Link>
      </Inputs>
      <Verify
        active={verify}
        setActive={setVerify}
        codeInput={codeInput}
        setCodeInput={setCodeInput}
        Register={Register}
        code={code}
        registerLoading={registerLoading}
      />
      <SimpleSnackbar alert={alert} setAlert={setAlert} />
    </Container>
  );
};

export default Register;

const Container = styled.div`
  height: 90vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Inputs = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;

  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 10vh;
  }

  .button {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const SimpleSnackbar = ({ alert, setAlert }: any) => {
  return (
    <>
      {alert.active && (
        <SnackBarContainer
          onClick={() => setAlert({ active: false, type: "", text: "" })}
        >
          <Stack
            sx={{
              width: "auto",
              position: "fixed",
              bottom: "24px",
              left: "24px",
            }}
            spacing={2}
          >
            <Alert
              severity={alert.type}
              variant="filled"
              onClick={() => setAlert({ active: false, type: "", text: "" })}
            >
              {alert.text}
            </Alert>
          </Stack>
        </SnackBarContainer>
      )}
    </>
  );
};

const SnackBarContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
  z-index: 999999;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  transition: ease-in-out 200ms;
  display: flex;
  align-items: center;
  justify-content: center;
`;
