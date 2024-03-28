import React from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { BounceLoader } from "react-spinners";
import styled from "styled-components";
import Button from "../../components/button";
import { Input } from "../../components/input";
import { useAppContext } from "../../context/app";
import { useTheme } from "../../context/theme";

interface PropsType {
  openReset: boolean;
  setOpenReset: (open: boolean) => void;
  email: string;
  setEmail: (prev: string) => void;
  SendEmail: () => void;
  loading: boolean;
}

const ResetPassword: React.FC<PropsType> = ({
  openReset,
  setOpenReset,
  email,
  setEmail,
  SendEmail,
  loading,
}) => {
  const { theme } = useTheme();
  const { activeLanguage, isMobile } = useAppContext();
  return (
    <Container openreset={openReset ? "true" : "false"}>
      <Header>
        <div></div>
        <div
          onClick={() => {
            setOpenReset(false);
          }}
          style={{
            padding: "5px",
            cursor: "pointer",
            zIndex: 1000,
          }}
        >
          <IoMdArrowDropdown size={30} color={theme.primary} />
        </div>
      </Header>
      <h3 style={{ color: "#ccc", margin: 0, padding: 0 }}>
        {activeLanguage.resetPassword}
      </h3>

      <div
        style={{
          width: isMobile ? "90%" : "40%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <p
          style={{
            fontSize: "14px",
            color: "#ccc",
            letterSpacing: "0.5px",
            textAlign: "center",
            lineHeight: "24px",
          }}
        >
          {activeLanguage.resetPasswordInstructions}
        </p>
        <Input
          label={activeLanguage.email}
          type="text"
          value={email}
          warning={false}
          onChange={setEmail}
        />

        <Button
          title={
            loading ? (
              <BounceLoader size={30} color={theme.primaryText} />
            ) : (
              activeLanguage.send
            )
          }
          onClick={SendEmail}
          background={theme.primary}
          disabled={false}
          color={theme.primaryText}
        />
      </div>
    </Container>
  );
};

export default ResetPassword;

interface ContainerProps {
  openreset: string;
}

const Container = styled.div<ContainerProps>`
  width: 100vw;
  height: 100vh;
  padding: 0 15px 50px 15px;
  z-index: 100001;
  box-sizing: border-box;
  background: rgba(1, 2, 12, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transform: translateY(
    ${(props) => (props.openreset === "true" ? 0 : "100vh")}
  );
  transition: ease-in 300ms;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  left: 0;
  gap: 15px;
`;

const Header = styled.div`
  width: 100%;
  padding: 12.5px 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  top: 15px;
  right: 15px;
`;
