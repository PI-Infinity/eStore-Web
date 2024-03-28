import React from "react";
import styled from "styled-components";
import Button from "./button";
import { useTheme } from "../context/theme";
import { BounceLoader } from "react-spinners";
import { useAppContext } from "../context/app";

const BackDrop: React.FC = () => {
  const { theme } = useTheme();
  const { openBackDrop } = useAppContext();
  return (
    <>
      {openBackDrop.active && (
        <Container>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <BounceLoader size={40} color={theme.primary} />
            <span style={{ color: theme.primaryText }}>
              {openBackDrop.text}
            </span>
          </div>
        </Container>
      )}
    </>
  );
};

export default BackDrop;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999999;
  -webkit-backdrop-filter: blur(100px);
  backdrop-filter: blur(100px);
  transition: ease-in-out 200ms;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;
