import { IoMdArrowDropdown } from "react-icons/io";
import styled from "styled-components";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import Chats from "./chats";

export default function MobileChats({
  rooms,
  setRooms,
  activeRoom,
  setActiveRoom,
  containerRef,
  openChats,
  setOpenChats,
}: any) {
  const { theme } = useTheme();

  const { storeInfo, activeLanguage, isMobile } = useAppContext();

  return (
    <Container
      style={{
        background: theme.background,
        top: openChats ? "0" : "100vh",
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
            top: "0px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <img src={storeInfo?.logo} width={50} height={40} alt="nike" />
        </div>
      </div>
      <IoMdArrowDropdown
        onClick={() => setOpenChats(false)}
        size={32}
        color={theme.primaryText}
        style={{ position: "absolute", right: "8px", top: "12px" }}
      />

      <div
        style={{
          padding: "0 8px",
        }}
      >
        <Chats
          rooms={rooms}
          setRooms={setRooms}
          activeRoom={activeRoom}
          setActiveRoom={setActiveRoom}
          containerRef={containerRef}
        />
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 90vh;
  position: fixed;
  transition: ease-in 150ms;
  z-index: 100999;
`;
