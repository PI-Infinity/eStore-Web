import React from "react";
import styled from "styled-components";
import Button from "./button";
import { useTheme } from "../context/theme";
import { useAppContext } from "../context/app";

interface PropsType {
  open: boolean;
  close: () => void;
  agree: () => void;
  text: string;
}

const ConfirmPopup: React.FC<PropsType> = ({ open, close, agree, text }) => {
  const { activeLanguage, isMobile } = useAppContext();
  const { theme } = useTheme();
  return (
    <Container
      style={{
        transform: `scale(${open ? 1 : 0})`,
        opacity: open ? 1 : 0,
        borderRadius: open ? "0" : "500px",
      }}
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: isMobile ? "90%" : "60%",
          height: isMobile ? "20vh" : "20vw",
          borderRadius: "20px",
          border: `1px solid ${theme.line}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "32px",
          background: theme.background,
          zIndex: 10000,
          marginBottom: isMobile ? "10vh" : "0",
        }}
      >
        <h2 style={{ color: theme.primaryText, textAlign: "center" }}>
          {text}
        </h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: isMobile ? "90%" : "60%",
            gap: isMobile ? "16px" : "24px",
          }}
        >
          <Button
            title={activeLanguage.no}
            color={theme.lightBackground}
            background={theme.secondaryText}
            onClick={close}
          />
          <Button
            title={activeLanguage.yes}
            color={theme.lightBackground}
            background={theme.primary}
            onClick={agree}
          />
        </div>
      </div>
    </Container>
  );
};

export default ConfirmPopup;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
  z-index: 999999;
  -webkit-backdrop-filter: blur(100px);
  backdrop-filter: blur(100px);
  transition: ease-in-out 200ms;
  display: flex;
  align-items: center;
  justify-content: center;
`;
