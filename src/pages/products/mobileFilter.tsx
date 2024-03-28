import { useAppContext } from "../../context/app";
import { useCurrentUserContext } from "../../context/currentUser";
import { useProductsContext } from "../../context/productsContext";
import { useTheme } from "../../context/theme";
// import Logo from "../../public/logo.png";
import { useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import styled from "styled-components";
import Filter from "./filter";

export default function MobileFilter() {
  const { theme } = useTheme();

  // route pathname
  const pathname = window.location.pathname;

  const { storeInfo, activeLanguage, setPageLoading } = useAppContext();

  // current user
  const { currentUser } = useCurrentUserContext();

  // product context
  const { openFilter, setOpenFilter } = useProductsContext();

  useEffect(() => {
    if (openFilter) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openFilter]);

  return (
    <Container
      style={{
        right: 0,
        top: openFilter ? "0" : "101vh",
        backdropFilter: "blur(100px)",
        WebkitBackdropFilter: "blur(100px)",
        background: theme.background,
        paddingBottom: "24px",
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
          <img src={storeInfo?.logo} width={70} alt="nike" />
        </div>
        <IoMdArrowDropdown
          onClick={() => setOpenFilter(false)}
          size={32}
          color={theme.primaryText}
          style={{ position: "absolute", right: "8px", top: "12px" }}
        />
      </div>

      <div style={{ flex: 1, paddingBottom: "88px" }}>
        <Filter />
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
