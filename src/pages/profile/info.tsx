// import { signOut } from "next-auth/react";
import React, { useEffect } from "react";
import { IoMdPerson } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import styled from "styled-components";
import Button from "../../components/button";
import { useAppContext } from "../../context/app";
import { useCurrentUserContext } from "../../context/currentUser";
import { useShippingContext } from "../../context/shipping";
import { useTheme } from "../../context/theme";
import Security from "./security";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";

interface PropsType {
  openEdit: boolean;
  setOpenEdit: (prev: boolean) => void;
}

const Info: React.FC<PropsType> = ({ setOpenEdit }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  // current user
  const { currentUser, setCurrentUser } = useCurrentUserContext();

  // order state
  const { setOrder } = useShippingContext();

  /**
   *
   * Logout function
   */
  const { setOpenBackDrop, storeInfo, activeLanguage, isMobile } =
    useAppContext();
  const Logout = async () => {
    try {
      setOpenBackDrop({ active: true }); // Assuming this sets some UI loading state

      // Directly call signOut from next-auth. You can also redirect after signing out.
      // await signOut({ redirect: false, callbackUrl: "/" });

      // Clear local storage and reset currentUser state
      localStorage.removeItem("eStore:currentUser");
      localStorage.removeItem("eStore:Order");
      setOrder({
        items: [],
        shipping: {
          cost: 0,
          currency: storeInfo?.currency,
          address: "",
          addationalInfo: "",
          phone: "",
          estimatedDelivery: "",
          paymentMethod: "",
          estimatedTax: 0,
        },
        buyer: {
          firstName: "",
          lastName: "",
          id: "",
          email: "",
        },
        promotions: [],
        comment: "",
        returnPolicy: "",
      });
      setCurrentUser(null);
      googleLogout();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Handle any errors here, such as updating UI to show an error message
    }
  };
  return (
    <Container
      theme={theme}
      style={{
        color: theme.primaryText,
        border: `1px solid ${theme.lineDark}`,
        fontWeight: "500",
      }}
    >
      <div
        style={{
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <h1
          style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: theme.primaryText,
            marginBottom: "16px",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <IoMdPerson size={24} /> {activeLanguage.personalInfo}:
        </h1>
        <MdEdit
          className="icon"
          onClick={() => setOpenEdit(true)}
          color={theme.primary}
          size={24}
          style={{ cursor: "pointer", zIndex: 1000 }}
        />
      </div>
      <div style={{ margin: "4px 8px", fontSize: "14px" }}>
        <h2>{activeLanguage.name}:</h2>
        <span
          style={{
            display: "block",
            maxWidth: "250px",
            whiteSpace: "wrap",
            wordWrap: "break-word",
          }}
        >
          {currentUser?.firstName} {currentUser?.lastName}
        </span>
      </div>
      <div style={{ margin: "4px 8px", fontSize: "14px" }}>
        <h2>{activeLanguage.email}:</h2>
        <p
          style={{
            display: "block",
            maxWidth: "250px",
            whiteSpace: "wrap",
            wordWrap: "break-word",
          }}
        >
          {currentUser?.email}
        </p>
      </div>
      <div style={{ margin: "4px 8px", fontSize: "14px" }}>
        <h2>{activeLanguage.phone}:</h2>
        <p
          style={{
            display: "block",
            maxWidth: "250px",
            whiteSpace: "wrap",
            wordWrap: "break-word",
          }}
        >
          {currentUser?.phone || "—"}
        </p>
      </div>
      <div style={{ margin: "4px 8px", fontSize: "14px" }}>
        <h2>{activeLanguage.address}:</h2>
        <p>{currentUser?.address?.address || "—"}</p>
      </div>
      <Security />
      <div style={{ width: isMobile ? "30%" : "40%", marginTop: "auto" }}>
        <Button
          title={activeLanguage.logout}
          background={theme.primaryText}
          color={theme.lightBackground}
          disabled={false}
          onClick={Logout}
        />
      </div>
    </Container>
  );
};

export default Info;

const Container = styled.div`
  width: 27.5%;
  height: 100%;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 768px) {
    width: 100%;
    padding: 16px;
  }

  & > div {
    width: 100%;
    display: flex;
    gap: 8px;

    & > p {
      z-index: 1000;
    }

    & > h2 {
      color: ${(props) => props.theme.secondaryText};
      zindex: 1000;
    }
  }

  .icon {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;
