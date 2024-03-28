import { useTheme } from "../../../context/theme";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import styled from "styled-components";
import Orders from "./orders/orders";
import { useAppContext } from "../../../context/app";
import { MdList, MdPerson } from "react-icons/md";
import Users from "./users/users";

export default function Analytics() {
  // loading
  const [loading, setLoading] = useState(true);

  // theme
  const { theme } = useTheme();

  const { isMobile, activeLanguage } = useAppContext();

  // active stats
  const [activeStats, setActiveStats] = useState("orders");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  return (
    <Container
      style={{
        color: theme.primaryText,
        border: isMobile ? "none" : `1px solid ${theme.line}`,
        padding: isMobile ? "16px" : "8px",
      }}
    >
      {loading ? (
        <div
          style={{
            margin: "24px",
            height: "70%",
            width: "100%",
            overflow: "hidden",
          }}
        >
          <BarLoader color={theme.primaryText} height={6} />
        </div>
      ) : (
        <>
          <Content>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "150px",
                  padding: "4px",
                  textAlign: "center",
                  borderBottom: `1px solid ${
                    activeStats === "orders" ? theme.primary : theme.lineDark
                  }`,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={() => setActiveStats("orders")}
                className="icon"
              >
                <MdList /> {activeLanguage.orders}
              </div>
              <div
                style={{
                  width: "150px",
                  padding: "4px",
                  textAlign: "center",
                  borderBottom: `1px solid ${
                    activeStats === "users" ? theme.primary : theme.lineDark
                  }`,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                onClick={() => setActiveStats("users")}
                className="icon"
              >
                <MdPerson />
                {activeLanguage.visitors}
              </div>
            </div>
            {activeStats === "orders" ? <Orders /> : <Users />}
          </Content>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 85vh;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 15px;
  overflow-y: auto;
  overflow-x: hidden;

  .icon {
    cursor: pointer;
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
`;
