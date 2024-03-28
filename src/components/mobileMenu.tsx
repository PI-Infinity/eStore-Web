import { useAppContext } from "../context/app";
import { useTheme } from "../context/theme";
import React, { useEffect } from "react";
import { MdClose } from "react-icons/md";
import styled from "styled-components";
import { useSearchDesignContext } from "../context/searchDesign";
import Search from "./search";
// import Logo from "../public/logo.png";
import { Link } from "react-router-dom";
import SearchResult from "./searchResult";
import { IoMdArrowDropright } from "react-icons/io";
import { useProductsContext } from "../context/productsContext";
import { useCurrentUserContext } from "../context/currentUser";

export default function MobileMenu() {
  const { theme } = useTheme();

  // route pathname
  const pathname = window.location.pathname;

  const { setOpenMenu, openMenu, storeInfo, activeLanguage, setPageLoading } =
    useAppContext();

  useEffect(() => {
    if (openMenu) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "relative";
      document.body.style.right = "100px";
      document.body.style.transition = "ease-in 150ms";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.position = "relative";
      document.body.style.right = "0";
      document.body.style.transition = "ease-in 150ms";
    }
  }, [openMenu]);

  // search animation opening
  const { setOpenSearch } = useSearchDesignContext();

  // current user
  const { currentUser } = useCurrentUserContext();

  // product context
  const {
    setSex,
    setPrice,
    setSale,
    setActiveCategory,
    setActiveSubCategory,
    setBrand,
    setRating,
    setSize,
    setColor,
  } = useProductsContext();

  return (
    <Container
      style={{
        left: openMenu ? "0" : "101vw",
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
        <Link
          className="link"
          to="/"
          onClick={() => setOpenMenu(false)}
          style={{
            position: "absolute",
            left: "16px",
            top: "4px",
            display: "flex",
            justifyContent: "center",
            height: "100%",
            alignItems: "center",
          }}
        >
          <img src={storeInfo?.logo} width={70} alt="nike" />
        </Link>
        <IoMdArrowDropright
          onClick={() => setOpenMenu(false)}
          size={32}
          color={theme.primaryText}
          style={{ position: "absolute", right: "8px", top: "14px" }}
        />
      </div>
      <div style={{ width: "100%", padding: "0 8px" }}>
        {pathname !== "/products" && <Search setOpenSearch={setOpenSearch} />}
      </div>
      {pathname !== "/products" && <SearchResult />}
      {pathname !== "/products" && (
        <LinksContainer
          style={{
            width: "100%",
          }}
        >
          <Link
            className="link"
            onClick={() => {
              setOpenMenu(false);
              setPageLoading(true);
              setSex(["Men"]);
              setPrice([0, 1000]);
              setSale([0, 100]);
              setActiveCategory("");
              setBrand([]);
              setActiveSubCategory([]);
              setRating([0, 5]);
              setSize([]);
              setColor([]);
            }}
            to="/products"
            style={{
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "800",
              color: theme.primaryText,
            }}
          >
            {activeLanguage.men}
          </Link>
          <Link
            className="link"
            onClick={() => {
              setOpenMenu(false);
              setPageLoading(true);
              setSex(["Women"]);
              setPrice([0, 1000]);
              setSale([0, 100]);
              setActiveCategory("");
              setBrand([]);
              setActiveSubCategory([]);
              setRating([0, 5]);
              setSize([]);
              setColor([]);
            }}
            to="/products"
            style={{
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "800",
              color: theme.primaryText,
            }}
          >
            {activeLanguage.women}
          </Link>
          <Link
            className="link"
            onClick={() => {
              setOpenMenu(false);
              setPageLoading(true);
              setSex(["Kids"]);
              setPrice([0, 1000]);
              setSale([0, 100]);
              setActiveCategory("");
              setActiveSubCategory([]);
              setBrand([]);
              setRating([0, 5]);
              setSize([]);
              setColor([]);
            }}
            to="/products"
            style={{
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "800",
              color: theme.primaryText,
            }}
          >
            {activeLanguage.kids}
          </Link>
          <Link
            className="link"
            onClick={() => {
              setOpenMenu(false);
              setPageLoading(true);
              setPrice([0, 1000]);
              setSale([0, 100]);
              setActiveCategory("Accessories & Equipment");
              setActiveSubCategory([]);
              setBrand([]);
              setRating([0, 5]);
              setSex([]);
              setSize([]);
              setColor([]);
            }}
            to="/products"
            style={{
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "800",
              color: theme.primaryText,
            }}
          >
            {activeLanguage.accessories}
          </Link>
          <Link
            className="link"
            onClick={() => {
              setOpenMenu(false);
              setPageLoading(true);
              setPrice([0, 1000]);
              setSale([1, 100]);
              setActiveCategory("");
              setActiveSubCategory([]);
              setBrand([]);
              setRating([0, 5]);
              setSex([]);
              setSize([]);
              setColor([]);
            }}
            to="/products"
            style={{
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "800",
              color: theme.primaryText,
            }}
          >
            {activeLanguage.sales}
          </Link>
        </LinksContainer>
      )}
      <LinksContainer
        style={{
          marginLeft: "auto",
          letterSpacing: "0.5px",
          marginTop: "0",
        }}
      >
        <Link
          className="link"
          onClick={
            pathname !== "/profile" && pathname !== "/login"
              ? () => {
                  setOpenMenu(false);
                  setPageLoading(true);
                }
              : undefined
          }
          to={currentUser ? "/profile" : "/login"}
          style={{
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "800",
            color: currentUser ? theme.primary : theme.secondaryText,
          }}
        >
          {currentUser ? activeLanguage.profile : activeLanguage.login}
        </Link>
        {currentUser?.admin?.active && (
          <>
            <Link
              className="link"
              // secondarytext={theme.secondaryText}
              onClick={() => {
                setOpenMenu(false);
                setPageLoading(true);
              }}
              to={"/admin/orders"}
              style={{
                textDecoration: "none",
                fontSize: "14px",
                fontWeight: "800",
                color: theme.primary,
              }}
            >
              {activeLanguage.admin}
            </Link>
          </>
        )}
        <Link
          className="link"
          onClick={
            pathname !== "/findUs"
              ? () => {
                  setOpenMenu(false);
                  setPageLoading(true);
                }
              : undefined
          }
          to="/findUs"
          style={{
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "800",
            color:
              pathname === "contact" ? theme.primaryText : theme.secondaryText,
          }}
        >
          {activeLanguage.findUs}
        </Link>

        <Link
          className="link"
          onClick={
            pathname !== "/about"
              ? () => {
                  setOpenMenu(false);
                  setPageLoading(true);
                }
              : undefined
          }
          to="/about"
          style={{
            textDecoration: "none",
            fontSize: "14px",
            fontWeight: "800",
            color:
              pathname === "about" ? theme.primaryText : theme.secondaryText,
          }}
        >
          {activeLanguage.about}
        </Link>
      </LinksContainer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  height: 100vh;
  position: fixed;
  top: 0;
  transition: ease-in 150ms;
  z-index: 100000;
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
