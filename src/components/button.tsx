import { useAppContext } from "../context/app";
import { useTheme } from "../context/theme";
import React from "react";
import styled from "styled-components";

interface PropsType {
  title: any;
  onClick: () => void;
  background: string;
  color: string;
  disabled?: boolean;
}

interface StyleProps {
  $disabledstyle: string;
}

const Button: React.FC<PropsType> = ({
  title,
  onClick,
  background,
  color,
  disabled,
}) => {
  const { theme } = useTheme();
  const { isMobile } = useAppContext();
  return (
    <Container
      $disabledstyle={disabled ? "true" : "false"}
      onClick={onClick}
      style={{
        height: isMobile ? "10vw" : "3vw",
        cursor: disabled ? "not-allowed" : "pointer",
        color: disabled ? theme.lightBackground : color,
        background: disabled ? theme.lineDark : background,
      }}
    >
      {title}
    </Container>
  );
};

export default Button;

const Container = styled.div<StyleProps>`
  border-radius: 100px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  width: 100%;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 14px;
    font-weight: 700;
  }

  &:hover {
    filter: ${(props) =>
      props.$disabledstyle === "true" ? "brightness(1)" : "brightness(0.9)"};
  }
`;
