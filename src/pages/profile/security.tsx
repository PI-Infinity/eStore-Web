import { useCurrentUserContext } from "../../context/currentUser";
import { useShippingContext } from "../../context/shipping";
import { useTheme } from "../../context/theme";
import { SecurityOutlined } from "@mui/icons-material";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import axios from "axios";
// import { signOut } from "next-auth/react";
import { useState } from "react";
import {
  MdArrowDropDown,
  MdArrowDropUp,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { BounceLoader } from "react-spinners";
import styled from "styled-components";
import { useAppContext } from "../../context/app";
import { googleLogout } from "@react-oauth/google";

const Security = ({}) => {
  // theme
  const { theme } = useTheme();

  // alert message
  const {
    setOpenBackDrop,
    setAlert,
    backendUrl,
    setConfirm,
    storeInfo,
    activeLanguage,
  } = useAppContext();

  // order state
  const { setOrder } = useShippingContext();

  // current user
  const { currentUser, setCurrentUser } = useCurrentUserContext();

  // define passwords states
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Add these variables to your component to track the state
  interface StateProps {
    active: boolean;
    name: string;
  }
  const [showPassword, setShowPassword] = useState<StateProps>({
    active: false,
    name: "",
  });

  /**
   * password change function
   *  */
  // open change passwords
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const Changing = async () => {
    try {
      if (newPassword !== confirmPassword) {
        return setAlert({
          active: true,
          text: activeLanguage.newPasswordMismatch,
          type: "error",
        });
      }
      setLoading(true);
      await axios.patch(
        backendUrl + "/api/v1/users/changePassword/" + currentUser._id,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }
      );
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
      return setAlert({
        active: true,
        text: activeLanguage.passwordChangedSuccessfully,
        type: "success",
      });
    } catch (error: any) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setLoading(false);
      return setAlert({
        active: true,
        text: JSON.stringify(error.response.data.message),
        type: "error",
      });
    }
  };

  /**
   * Delete account function
   */

  // const DeleteAccount = async () => {
  //   setOpenBackDrop({ active: true }); // Assuming this starts some loading indication in the UI

  //   try {
  //     // Perform the deletion request to your backend
  //     await axios.delete(`${backendUrl}/api/v1/users/${currentUser?._id}`);

  //     // Optionally handle additional cleanup or state updates before signing the user out
  //     // ...

  //     // Sign the user out after successful account deletion
  //     // await signOut({ redirect: false, callbackUrl: "/" });

  //     // Clear any local state or storage that references the user
  //     localStorage.removeItem("eStore:currentUser"); // Ensure the key matches what you use elsewhere
  //     setCurrentUser(null);
  //     googleLogout();
  //     localStorage.removeItem("eStore:Order");
  //     setOrder({
  //       items: [],
  //       shipping: {
  //         cost: 0,
  //         currency: storeInfo?.currency,
  //         address: "",
  //         addationalInfo: "",
  //         phone: "",
  //         estimatedDelivery: "",
  //         paymentMethod: "",
  //         estimatedTax: 0,
  //       },
  //       buyer: {
  //         firstName: "",
  //         lastName: "",
  //         id: "",
  //         email: "",
  //       },
  //       promotions: [],
  //       comment: "",
  //       returnPolicy: "",
  //     });

  //     // Reset any confirmation or alert states as needed
  //     setConfirm({ active: false, agree: null, text: "", close: null });

  //     // Optionally, redirect the user or update the UI state to reflect that the account has been deleted
  //     // ...
  //   } catch (error: any) {
  //     console.error(
  //       "Error deleting account:",
  //       error.response?.data?.message || error.message
  //     );

  //     // Update UI state to stop loading indication
  //     setOpenBackDrop({ active: false });

  //     // Display an alert to the user indicating the error
  //     setAlert({
  //       active: true,
  //       text:
  //         error.response?.data?.message ||
  //         "An error occurred while deleting the account.",
  //       type: "error",
  //     });
  //   }
  // };

  return (
    <Container>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: "24px",
          cursor: "pointer",
        }}
      >
        <h1
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: theme.primaryText,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
          }}
          onClick={() => setOpen((prev) => !prev)}
          className="icon"
        >
          <SecurityOutlined sx={{ fontSize: 22 }} />
          <span>{activeLanguage.security}:</span>
          {open ? (
            <MdArrowDropDown size={24} color={theme.primaryText} />
          ) : (
            <MdArrowDropUp size={24} color={theme.primaryText} />
          )}
        </h1>
      </div>
      {open && (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              padding: "24px 0",
              color: theme.primaryText,
            }}
          >
            <>
              <InputWrapper>
                <TextField
                  label={activeLanguage.oldPassword}
                  value={oldPassword}
                  type={
                    showPassword.active && showPassword.name === "old"
                      ? "text"
                      : "password"
                  }
                  onChange={(e) => setOldPassword(e.target.value)}
                  id="outlined-basic"
                  variant="outlined"
                  InputProps={{
                    // <-- This is where the toggle button is added.
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowPassword({
                              active: !showPassword.active,
                              name: "old",
                            })
                          }
                        >
                          {showPassword.active &&
                          showPassword.name === "old" ? (
                            <MdVisibility
                              color={theme.secondaryText}
                              size={22}
                            />
                          ) : (
                            <MdVisibilityOff
                              color={theme.secondaryText}
                              size={22}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      height: "53px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.line,
                        borderRadius: "15px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.primary,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.primary,
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      borderRadius: "15px",
                      color: "#ccc",
                    },
                    "& label": {
                      color: "#888",
                      fontSize: "14px",
                    },
                    "& label.Mui-focused": {
                      color: "#ccc",
                      fontSize: "14px",
                    },
                  }}
                />
              </InputWrapper>
              <InputWrapper>
                <TextField
                  label={activeLanguage.newPassword}
                  value={newPassword}
                  type={
                    showPassword.active && showPassword.name === "new"
                      ? "text"
                      : "password"
                  }
                  onChange={(e) => setNewPassword(e.target.value)}
                  id="outlined-basic"
                  variant="outlined"
                  InputProps={{
                    // <-- This is where the toggle button is added.
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowPassword({
                              active: !showPassword.active,
                              name: "new",
                            })
                          }
                        >
                          {showPassword.active &&
                          showPassword.name === "new" ? (
                            <MdVisibility
                              color={theme.secondaryText}
                              size={22}
                            />
                          ) : (
                            <MdVisibilityOff
                              color={theme.secondaryText}
                              size={22}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      height: "53px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.line,
                        borderRadius: "15px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.primary,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.primary,
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      borderRadius: "15px",
                      color: "#ccc",
                    },
                    "& label": {
                      color: "#888",
                      fontSize: "14px",
                    },
                    "& label.Mui-focused": {
                      color: "#ccc",
                      fontSize: "14px",
                    },
                  }}
                />
              </InputWrapper>
              <InputWrapper>
                <TextField
                  label={activeLanguage.confirmNewPassword}
                  value={confirmPassword}
                  type={
                    showPassword.active && showPassword.name === "confirm"
                      ? "text"
                      : "password"
                  }
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      // Call your function here
                      Changing(); // Replace this with your function call
                    }
                  }}
                  id="outlined-basic"
                  variant="outlined"
                  InputProps={{
                    // <-- This is where the toggle button is added.
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() =>
                            setShowPassword({
                              active: !showPassword.active,
                              name: "confirm",
                            })
                          }
                        >
                          {showPassword.active &&
                          showPassword.name === "confirm" ? (
                            <MdVisibility
                              color={theme.secondaryText}
                              size={22}
                            />
                          ) : (
                            <MdVisibilityOff
                              color={theme.secondaryText}
                              size={22}
                            />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    width: "100%",
                    "& .MuiOutlinedInput-root": {
                      height: "53px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.line,
                        borderRadius: "15px",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.primary,
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: theme.primary,
                      },
                    },
                    "& .MuiOutlinedInput-input": {
                      borderRadius: "15px",
                      color: "#ccc",
                    },
                    "& label": {
                      color: "#888",
                      fontSize: "14px",
                    },
                    "& label.Mui-focused": {
                      color: "#ccc",
                      fontSize: "14px",
                    },
                  }}
                />
              </InputWrapper>
            </>

            {oldPassword?.length > 1 &&
              newPassword?.length > 1 &&
              confirmPassword?.length > 1 && (
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: loading ? "#ccc" : theme.primary,
                    color: "white",
                  }}
                  className="button"
                  sx={{
                    width: "100%",
                    borderRadius: "50px",
                    height: "40px",
                    marginTop: "16px",
                  }}
                  onClick={Changing}
                  //   {...props}
                >
                  {loading ? (
                    <BounceLoader
                      color={theme.primaryText}
                      loading={loading}
                      size={20}
                    />
                  ) : (
                    activeLanguage.save
                  )}
                </Button>
              )}
          </div>
          {/* 
          <Button
            variant="contained"
            style={{
              backgroundColor: loading ? "#ccc" : theme.primary,
              color: "white",
            }}
            className="icon"
            sx={{
              width: "100%",
              borderRadius: "50px",

              height: "40px",
            }}
            onClick={() =>
              setConfirm({
                active: true,
                text: "Are you sure to want to delete this account?",
                close: () => setConfirm(false),
                agree: () => DeleteAccount(),
              })
            }
            //   {...props}
          >
            {loading ? (
              <BounceLoader
                color={theme.primaryText}
                loading={loading}
                size={20}
              />
            ) : (
              activeLanguage.deleteAccount
            )}
          </Button> */}
        </>
      )}
    </Container>
  );
};

export default Security;

const Container = styled.div`
  width: 100%;
  z-index: 1000;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: ease-in 200ms;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  margin: 24px 0;
  box-sizing: border-box;

  .icon {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const InputWrapper = styled.div`
  font-size: 16px;
  width: 100%;
  display: flex;
  justify-content: center;
`;
