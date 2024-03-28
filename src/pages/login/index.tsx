import Button from "../../components/button";
import { useAppContext } from "../../context/app";
import { useTheme } from "../../context/theme";
import {
  Alert,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import styled from "styled-components";
import ResetPassword from "./resetPassword";
import { BounceLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { Input } from "../../components/input";
import { useCurrentUserContext } from "../../context/currentUser";
import { useShippingContext } from "../../context/shipping";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  // current user
  const { setCurrentUser } = useCurrentUserContext();

  useEffect(() => {
    // Scroll to the top of the window
    window.scrollTo(0, 0);
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  }, []);

  // alert message
  const [alert, setAlert] = useState({ active: false, type: "", text: "" });

  // theme
  const { theme } = useTheme();

  // login email and password states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Add these variables to your component to track the state
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  // backend url
  const { backendUrl, activeLanguage, isMobile, setPageLoading } =
    useAppContext();

  // sending loading state
  const [sendingLoading, setSendingLoading] = useState(false);

  // order state
  const { setOrder } = useShippingContext();

  /**
   * Login function
   */
  const Login = async () => {
    if (email?.length < 1 || email?.length < 1) {
      return setAlert({
        active: true,
        text: activeLanguage.pleaseInputNecessaryFields,
        type: "warning",
      });
    }
    if (!email?.includes("@") || !email?.includes(".")) {
      return setAlert({
        active: true,
        text: activeLanguage.incorrectEmail,
        type: "warning",
      });
    }
    try {
      setSendingLoading(true);
      // post login to backend
      await axios
        .post(backendUrl + "/api/v1/users/login", {
          email: email,
          password: password,
        })
        .then(async (data) => {
          setCurrentUser(data.data.user);
          localStorage.setItem(
            "eStore:currentUser",
            JSON.stringify(data.data.user)
          );
          setOrder((prev: any) => ({
            ...prev,
            shipping: {
              ...prev.shipping,
              address: data.data.user?.address || "",
              phone: data.data.user?.phone || "",
            },
            buyer: {
              ...prev.buyer,
              firstName: data.data.user?.firstName || "",
              lastName: data.data.user?.lastName || "",
              id: data.data.user?._id || "",
              email: data.data.user?.email || "",
            },
          }));
          setSendingLoading(false);
          navigate("/");
        });
      setTimeout(() => {
        setSendingLoading(false);
      }, 1000);
    } catch (err: any) {
      console.log(err.response.data.message);
      setSendingLoading(false);
      // alert errors to be visible for users
      setAlert({
        active: true,
        text: err.response.data.message,
        type: "error",
      });
    }
  };

  /**
   * this is states for reset passwords.
   * email input and to open/close reset password popup
   */
  const [emailInput, setEmailInput] = useState("");
  const [resetPopup, setResetPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * send email to reset password
   * after send request, user gettings link to navigate to beautyverse web, where user can set new password
   */

  async function SendEmail() {
    try {
      setLoading(true);
      await axios.post(backendUrl + "/api/v1/users/forgotPassword", {
        email: emailInput,
      });
      // If the email is sent successfully, handle the response here
      setAlert({
        active: true,
        text: activeLanguage.codeSentSuccessfullyToEmail,
        type: "success",
      });
      setEmailInput("");
      setResetPopup(false);
      setLoading(false);
    } catch (error) {
      setAlert({
        active: true,
        text: "error",
        type: "error",
      });
      setLoading(false);
    }
  }

  const handleGoogleAuth = async (userEmail: any) => {
    try {
      // Use the token or profile information to register/sign in the user in your backend
      // Example:
      const response = await axios.post(
        `${backendUrl}/api/v1/users/providerauth`,
        {
          email: userEmail,
        }
      );

      if (response.data && response.data.user) {
        setCurrentUser(response.data.user);
        localStorage.setItem("currentUser", JSON.stringify(response.data.user));
        setOrder((prev: any) => ({
          ...prev,
          shipping: {
            ...prev.shipping,
            address: response.data.user?.address || "",
            phone: response.data.user?.phone || "",
          },
          buyer: {
            ...prev.buyer,
            firstName: response.data.user?.firstName || "",
            lastName: response.data.user?.lastName || "",
            id: response.data.user?._id || "",
            email: response.data.user?.email || "",
          },
        }));

        navigate("/");
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      // Handle sign-in errors here
    }
  };

  interface DecodedJwtPayload {
    email?: string; // Use '?' to indicate that the property is optional
    // Include other expected properties from the payload here
  }

  return (
    <Container>
      <ResetPassword
        openReset={resetPopup}
        setOpenReset={setResetPopup}
        email={emailInput}
        setEmail={setEmailInput}
        SendEmail={SendEmail}
        loading={loading}
      />

      <Inputs style={{ width: isMobile ? "90%" : "30%" }}>
        <Input
          label={activeLanguage.email}
          value={email}
          onChange={setEmail}
          type="text"
          warning={false}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const nextField = document.getElementById(
                "basic"
              ) as HTMLInputElement;
              if (nextField) {
                nextField?.focus();
              }
            }
          }}
        />
        <TextField
          id="basic"
          label={activeLanguage.password}
          variant="outlined"
          value={password}
          type={showPassword ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          autoFocus={false}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // Call your function here
              Login(); // Replace this with your function call
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
            background: theme.lightBackground,
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              height: "53px",
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
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <h4
            onClick={() => setResetPopup(true)}
            style={{
              letterSpacing: "0.5px",
              color: theme.secondaryText,
              textDecoration: "underline",
              fontSize: "14px",
              margin: 0,
              cursor: "pointer",
            }}
            className="hover"
          >
            {activeLanguage.forgotPassword}
          </h4>
          <div style={{ width: "100%", marginTop: "8px" }}>
            <Button
              title={
                sendingLoading ? (
                  <BounceLoader size={25} color={theme.lightBackground} />
                ) : (
                  activeLanguage.login
                )
              }
              background={theme.primaryText}
              color={theme.lightBackground}
              disabled={false}
              onClick={Login}
            />
          </div>
        </div>
        <div
          style={{
            height: isMobile ? "10vw" : "53px",
            width: "100%",
            borderRadius: "50px",
            color: theme.primaryText,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            cursor: "pointer",
          }}
          className="hover"
        >
          <GoogleLogin
            onSuccess={(credentialResponse: any) => {
              const decoded = jwtDecode<DecodedJwtPayload>(
                credentialResponse?.credential
              );
              if (decoded) {
                handleGoogleAuth(decoded?.email);
              }
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
        <Link
          to={"/register"}
          style={{
            width: "100%",
            letterSpacing: "0.5px",
            color: theme.primary,
            textDecoration: "none",
            margin: 0,
            cursor: "pointer",
            fontWeight: "600",
          }}
          className="hover"
        >
          <div
            style={{
              color: theme.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              cursor: "pointer",
            }}
            className="hover"
          >
            {activeLanguage.createAccount}
          </div>
        </Link>
      </Inputs>
      <SimpleSnackbar alert={alert} setAlert={setAlert} />
    </Container>
  );
};

export default Login;

const Container = styled.div`
  height: 90vh;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5vh;
  transition: ease-in-out 200ms;
  overflow-x: hidden;

  .hover {
    &:hover {
      filter: brightness(0.9);
    }
  }
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
