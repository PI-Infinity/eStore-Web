import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";
import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import styled from "styled-components";
import CreateOrder from "./createOrder";

export default function MobileCreateOrder({
  openCreateOrder,
  setOpenCreateOrder,
  setOrders,
}: any) {
  const { theme } = useTheme();

  const { storeInfo } = useAppContext();

  useEffect(() => {
    if (openCreateOrder) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openCreateOrder]);

  return (
    <Container
      style={{
        background: theme.background,
        transform: `scale(${openCreateOrder ? 1 : 0})`,
        opacity: openCreateOrder ? 1 : 0,
        borderRadius: openCreateOrder ? "0" : "500px",
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
            height: "100%",
            alignItems: "center",
          }}
        >
          <img src={storeInfo?.logo} width={50} height={40} alt="nike" />
        </div>
      </div>
      <MdClose
        onClick={() => setOpenCreateOrder(false)}
        size={32}
        color={theme.primary}
        style={{ position: "absolute", right: "8px", top: "12px" }}
      />
      <div style={{ flex: 1, paddingBottom: "88px" }}>
        <CreateOrder setOrders={setOrders} />
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
`;
