import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTheme } from "../../context/theme";
import Button from "../../components/button";
import { Input } from "../../components/input";
import { useCurrentUserContext } from "../../context/currentUser";
import MapAutoComplete from "../../components/mapAutocomplete";
import axios from "axios";
import { useAppContext } from "../../context/app";

interface PropsType {
  close: () => void;
  openEdit: boolean;
}

const EditInfo: React.FC<PropsType> = ({ openEdit, close }) => {
  const { theme } = useTheme();
  // transition
  const [transition, setTransition] = useState(false);
  useEffect(() => {
    setTransition(true);
  }, []);

  useEffect(() => {
    if (transition) {
      document.body.style.overflowY = "hidden";
    }
  }, [transition]);
  // current user
  const { currentUser, setCurrentUser } = useCurrentUserContext();

  // change fields
  const [firstName, setFirstName] = useState(currentUser?.firstName || "");
  const [lastName, setLastName] = useState(currentUser?.lastName || "");
  const [address, setAddress] = useState(currentUser?.address || {});
  const [phone, setPhone] = useState(currentUser?.phone || "");

  // app context
  const { backendUrl, setAlert, activeLanguage, isMobile } = useAppContext();

  // save changes
  const Save = async () => {
    if (firstName?.length < 1 || lastName?.length < 1) {
      return setAlert({
        active: true,
        text: activeLanguage.pleaseInputFields,
        type: "error",
      });
    }
    let updatedUser = {
      ...currentUser,
      firstName: firstName,
      lastName: lastName,
      address: address,
      phone: phone,
    };
    try {
      setCurrentUser(updatedUser);
      close();
      await axios.patch(
        backendUrl + "/api/v1/users/" + currentUser?._id,
        updatedUser
      );
    } catch (error: any) {
      console.log(error);
    }
  };
  return (
    <Container
      style={{
        transform: `scale(${transition ? 1 : 0})`,
        opacity: transition ? 1 : 0,
        borderRadius: transition ? "0" : "500px",
        color: theme.primaryText,
      }}
      onClick={() => {
        setTransition(false);
        close();
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: isMobile ? "95%" : "60vw",
          borderRadius: "20px",
          border: `1px solid ${theme.lineDark}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: isMobile ? "8px" : "32px",
          background: theme.background,
          padding: "24px",
          boxSizing: "border-box",
          marginBottom: isMobile ? "10vh" : "0",
        }}
      >
        <div
          style={{
            height: "53px",
            width: isMobile ? "85vw" : "57vw",
            display: "flex",
            alignItems: "center",
            border: `1px solid ${theme.line}`,
            borderRadius: "10px",
            paddingLeft: "16px",
            color: theme.secondaryText,
            cursor: "not-allowed",
            boxSizing: "border-box",
          }}
        >
          <h2>{currentUser?.email}</h2>
        </div>
        <div
          style={{
            width: isMobile ? "85vw" : "57vw",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Input
            label={activeLanguage.firstName}
            value={firstName}
            onChange={setFirstName}
            warning={false}
            type="text"
          />
          <Input
            label={activeLanguage.lastName}
            value={lastName}
            onChange={setLastName}
            warning={false}
            type="text"
          />
        </div>
        <MapAutoComplete setState={setAddress} />
        <div style={{ width: isMobile ? "85vw" : "57vw" }}>
          <Input
            label={activeLanguage.phone}
            value={phone}
            onChange={setPhone}
            warning={false}
            type="text"
          />
        </div>

        <Button
          title={activeLanguage.save}
          color={theme.lightBackground}
          background={theme.primary}
          onClick={Save}
        />
      </div>
    </Container>
  );
};

export default EditInfo;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000001;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  transition: ease-in-out 200ms;
  display: flex;
  align-items: center;
  justify-content: center;
`;
