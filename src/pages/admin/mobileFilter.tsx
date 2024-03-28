import { useAdminContext } from "../../context/adminContext";
import { useAppContext } from "../../context/app";
import { useTheme } from "../../context/theme";
// import Logo from "../../assets/logo.png";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { IoMdArrowDropleft } from "react-icons/io";
import styled from "styled-components";
import Filter from "./filter";

export default function MobileFilter({ activeTab, setActiveTab }: any) {
  const { theme } = useTheme();

  const { storeInfo } = useAppContext();

  const { openFilter, setOpenFilter } = useAdminContext();

  return (
    <Container
      style={{
        right: openFilter ? "0" : "101vw",
        backdropFilter: "blur(100px)",
        WebkitBackdropFilter: "blur(100px)",
        background: theme.background,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "50px",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "24px",
            top: "4px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <img src={storeInfo?.logo} width={70} alt="nike" />
        </div>
        <IoMdArrowDropleft
          onClick={() => setOpenFilter(false)}
          size={32}
          color={theme.primaryText}
          style={{ position: "absolute", right: "8px", top: "12px" }}
        />
      </div>

      <div style={{ flex: 1, marginTop: "8px", paddingBottom: "88px" }}>
        <Filter activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 100vh;
  position: fixed;
  top: 0px;
  transition: ease-in 150ms;
  z-index: 100999;
  overflow-y: auto;
`;

const LinksContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px;

  gap: 16px;
  letter-spacing: 0.4px;
  color: #f1f1f1;
  font-size: 14px;

  .link {
    &:hover {
      filter: brightness(0.8);
    }
  }
`;
