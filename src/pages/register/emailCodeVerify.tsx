import React from "react";
import { BounceLoader } from "react-spinners";
import styled from "styled-components";
import Button from "../../components/button";
import { Input } from "../../components/input";
import { useAppContext } from "../../context/app";
import { useTheme } from "../../context/theme";

interface PropsType {
  active: boolean;
  setActive: (prev: boolean) => void;
  codeInput: string;
  setCodeInput: (prev: string) => void;
  Register: () => void;
  code: string;
  registerLoading: boolean;
}

const Verify: React.FC<PropsType> = ({
  active,
  codeInput,
  setCodeInput,
  Register,
  code,
  setActive,
  registerLoading,
}) => {
  // alert message
  const { setAlert, activeLanguage } = useAppContext();

  // theme
  const { theme } = useTheme();

  return (
    <Container
      active={active ? "true" : "false"}
      style={{
        background: "rgba(1, 2, 12, 0.7)",
      }}
      onClick={() => {
        setActive(false);
        setCodeInput("");
      }}
    >
      <Inputs onClick={(e) => e.stopPropagation()}>
        <h4
          style={{
            color: "#ccc",
            letterSpacing: "0.5px",
            textAlign: "center",
            lineHeight: "24px",
          }}
        >
          The verification code has sent to your email! Please Check it!
        </h4>
        <Input
          label="Enter code"
          type="text"
          value={codeInput}
          warning={false}
          onChange={setCodeInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              code === codeInput
                ? Register()
                : setAlert({
                    active: true,
                    text: activeLanguage.wrongVerificationCode,
                    type: "error",
                  });
            }
          }}
        />
        <Button
          title={
            registerLoading ? (
              <BounceLoader color={theme.primaryText} size={25} />
            ) : (
              activeLanguage.confirm
            )
          }
          background={theme.primary}
          color={theme.primaryText}
          onClick={() => {
            code === codeInput
              ? Register()
              : setAlert({
                  active: true,
                  text: activeLanguage.wrongVerificationCode,
                  type: "error",
                });
          }}
        />
      </Inputs>
    </Container>
  );
};

export default Verify;

interface ContaierProps {
  active: string;
}

const Container = styled.div<ContaierProps>`
  height: 100vh;
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: ease-in 200ms;
  position: fixed;
  top: ${(props) => (props.active === "true" ? "0" : "100vh")};
  z-index: 100001;
  background: rgba(1, 2, 12, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const Inputs = styled.div`
  width: 40%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;

  .button {
    &:hover {
      filter: brightness(1.1);
    }
  }
`;
