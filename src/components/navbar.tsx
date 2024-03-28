"use client";

import { useAppContext } from "../context/app";
import { useCurrentUserContext } from "../context/currentUser";
import { useProductsContext } from "../context/productsContext";
import { useShippingContext } from "../context/shipping";
import { Menu } from "@mui/icons-material";
import { Badge } from "@mui/material";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import HeadRoom from "react-headroom";
import { IoBag } from "react-icons/io5";
import styled from "styled-components";
import { useSearchDesignContext } from "../context/searchDesign";
import { useTheme } from "../context/theme";
import Search from "./search";
import { styled as MUIStyled } from "@mui/material/styles";
import { CgMenuRight } from "react-icons/cg";

export default function Navbar({}) {
  // app context
  const {
    pageLoading,
    setPageLoading,
    storeInfo,
    activeLanguage,
    isMobile,
    setScrollY,
    setOpenMenu,
  } = useAppContext();
  // route pathname
  const pathname = window.location.pathname;

  // app theme
  const { theme, activeTheme } = useTheme();

  // current user
  const { currentUser } = useCurrentUserContext();

  // search animation opening
  const { openSearch, setOpenSearch, openIn, setOpenIn } =
    useSearchDesignContext();

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

  // order
  const { order } = useShippingContext();

  const CustomBadge = MUIStyled(Badge)(({}) => ({
    // Add your custom styling here
    ".MuiBadge-dot": {
      backgroundColor: theme.primary, // Custom color for the badge dot
    },
    ".MuiBadge-badge": {
      color: theme.lightBackground, // Custom color for the badge text
      fontWeight: "600",
      backgroundColor: theme.primary, // Transparent background for the badge text
    },
  }));

  // State to manage whether the loading animation has completed
  const [loadingAnimationCompleted, setLoadingAnimationCompleted] =
    useState(false);

  useEffect(() => {
    if (pageLoading) {
      setLoadingAnimationCompleted(true);
    } else {
      setTimeout(() => {
        setLoadingAnimationCompleted(false);
      }, 300);
    }
  }, [pageLoading]);

  return (
    <Container>
      <div style={{ width: "100%", display: "flex", justifyContent: "start" }}>
        {loadingAnimationCompleted && (
          <div
            style={{
              position: "fixed",
              top: 0,
              height: isMobile ? "3px" : "4px",
              borderRadius: "10px",
              width: "100%",
              background: `linear-gradient(90deg,  ${theme.primary},${theme.primary})`,
              zIndex: 100010,
            }}
            className="loading-bar"
          />
        )}
      </div>

      {!isMobile && (
        <div
          style={{
            height: "32px",
            width: "100%",
            backdropFilter: "blur(50px)",
            WebkitBackdropFilter: "blur(50px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxSizing: "border-box",
            padding: "1px 3vw 0 3vw",
            letterSpacing: "0.5px",
            background: theme.lightBackground,
          }}
        >
          {/* <div
          style={{
            marginRight: "auto",
            fontSize: "12px",
            fontWeight: "600",
            fontWeight: "600",
            color: theme.secondaryText,
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <MdLocationPin size={12} />
          Pekini ave. N24{" "}
          <div
            style={{
              height: "12px",
              width: "1px",
              background: theme.secondaryText,
              margin: "0 16px",
            }}
          />{" "}
          <MdPhone size={12} /> +995 599 10 10 10
        </div> */}
          {/* {activeTheme === "dark" && (
              <div
                style={{
                  position: "absolute",
                  top: "-50px",
                  left: "30%",
                  opacity: "0.5",
                }}
                className="flex place-items-start before:w-full sm:before:w-[880px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[25vw] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"
              ></div>
            )} */}
          <LinksContainer
            style={{
              marginLeft: "auto",
              letterSpacing: "0.5px",
            }}
          >
            <Link
              className="link"
              onClick={
                pathname !== "/findUs" ? () => setPageLoading(true) : undefined
              }
              to="/findUs"
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color:
                  pathname === "contact"
                    ? theme.primaryText
                    : theme.primaryText,
                borderBottom: `1.5px solid ${
                  pathname === "/findUs" ? theme.primary : "rgba(0,0,0,0)"
                }`,
              }}
            >
              {activeLanguage.findUs}
            </Link>
            {/* <div
                style={{
                  height: "12px",
                  width: "1px",
                  background: theme.secondaryText,
                }}
              />
              <Link
              className="link"
                to={"/help"}
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color:
                    pathname === "help"
                      ? theme.primaryText
                      : theme.secondaryText,
                  borderBottom: `1.5px solid ${
                    pathname === "/help" ? theme.primary : "rgba(0,0,0,0)"
                  }`,
                }}
              >
                Help
              </Link> */}
            <div
              style={{
                height: "12px",
                width: "1px",
                background: theme.primaryText,
              }}
            />
            <Link
              className="link"
              onClick={
                pathname !== "/about" ? () => setPageLoading(true) : undefined
              }
              to="/about"
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color:
                  pathname === "about" ? theme.primaryText : theme.primaryText,
                borderBottom: `1.5px solid ${
                  pathname === "/about" ? theme.primary : "rgba(0,0,0,0)"
                }`,
              }}
            >
              {activeLanguage.about}
            </Link>
            <div
              style={{
                height: "12px",
                width: "1px",
                background: theme.primaryText,
              }}
            />
            <Link
              className="link"
              onClick={
                pathname !== "/profile" && pathname !== "/login"
                  ? () => setPageLoading(true)
                  : undefined
              }
              to={currentUser ? "/profile" : "/login"}
              style={{
                fontSize: "12px",
                fontWeight: "600",
                color: currentUser ? theme.primary : theme.primaryText,
                borderBottom: `1.5px solid ${
                  pathname === "/profile" || pathname === "/login"
                    ? theme.primary
                    : "rgba(0,0,0,0)"
                }`,
              }}
            >
              {currentUser ? activeLanguage.profile : activeLanguage.login}
            </Link>
            {currentUser?.admin?.active && (
              <>
                <div
                  style={{
                    height: "12px",
                    width: "1px",
                    background: theme.secondaryText,
                  }}
                />

                <Link
                  className="link"
                  // secondarytext={theme.secondaryText}
                  onClick={() => setPageLoading(true)}
                  to={"/admin/orders"}
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: theme.primary,
                    borderBottom: `1.5px solid ${
                      pathname === "/admin" ? theme.primary : "rgba(0,0,0,0)"
                    }`,
                  }}
                >
                  {activeLanguage.admin}
                </Link>
              </>
            )}
          </LinksContainer>
        </div>
      )}
      <HeadRoom
        downTolerance={10}
        upTolerance={10}
        style={{ zIndex: 99999, height: "64px", overflow: "hidden" }}
      >
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 3vw",
            height: "64px",
            // borderBottom: `1px solid ${theme.lineLight}`,
            // borderTop: `1px solid ${theme.lineLight}`,
            width: "100%",
            boxSizing: "border-box",
            backdropFilter: "blur(50px)",
            zIndex: 10000,
            overflow: "hidden",
            WebkitBackdropFilter: "blur(50px)",
          }}
        >
          {/* {activeTheme === "dark" && (
                <div
                  style={{
                    position: "absolute",
                    top: "-50px",
                    left: "30%",
                    opacity: "0.5",
                  }}
                  className="flex place-items-start before:w-full sm:before:w-[880px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[25vw] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"
                ></div>
              )} */}
          {!isMobile && (
            <>
              {pathname !== "/products" &&
              pathname !== "/login" &&
              pathname !== "/register" ? (
                <LinksContainer
                  style={{
                    width: openSearch && openIn === pathname ? "0vw" : "25vw",
                    gap: "32px",
                    opacity: openSearch && openIn === pathname ? 0 : 1,
                    transform: `scale(${
                      openSearch && openIn === pathname ? 0 : 1
                    })`,
                    transition: "ease-out 300ms",
                  }}
                >
                  <Link
                    className="link"
                    onClick={() => {
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
                      fontSize: "16px",
                      fontWeight: "600",
                      color: theme.primaryText,
                    }}
                  >
                    {activeLanguage.men}
                  </Link>
                  <Link
                    className="link"
                    onClick={() => {
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
                      fontSize: "16px",
                      fontWeight: "600",
                      color: theme.primaryText,
                    }}
                  >
                    {activeLanguage.women}
                  </Link>
                  <Link
                    className="link"
                    onClick={() => {
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
                      fontSize: "16px",
                      fontWeight: "600",
                      color: theme.primaryText,
                    }}
                  >
                    {activeLanguage.kids}
                  </Link>
                  <Link
                    className="link"
                    onClick={() => {
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
                      fontSize: "16px",
                      fontWeight: "600",
                      color: theme.primaryText,
                    }}
                  >
                    {activeLanguage.accessories}
                  </Link>
                  <Link
                    className="link"
                    onClick={() => {
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
                      fontSize: "16px",
                      fontWeight: "600",
                      color: theme.primaryText,
                    }}
                  >
                    {activeLanguage.sales}
                  </Link>
                </LinksContainer>
              ) : (
                <div style={{ width: "25vw" }} />
              )}
            </>
          )}
          <Link
            className="link"
            to="/"
            style={{
              marginLeft: isMobile ? "8px" : "16px",

              width: isMobile
                ? "20vw"
                : !isMobile && openSearch && openIn === pathname
                ? "0vw"
                : "20vw",
              display: "flex",
              justifyContent: "center",
              opacity: isMobile
                ? 1
                : !isMobile && openSearch && openIn === pathname
                ? 0
                : 1,
              transform: `scale(${
                isMobile
                  ? 1
                  : !isMobile && openSearch && openIn === pathname
                  ? 0
                  : 1
              })`,
              transition: "ease-out 300ms",
            }}
            onClick={() => {
              if (pathname !== "/") {
                setPageLoading(true);
              }
              setOpenSearch(false);
              setOpenIn(null);
              setScrollY(0);
            }}
          >
            <div
              style={{
                maxWidth: "80px",
              }}
            >
              <img src={storeInfo?.logo} width="100%" alt="nike" />
            </div>
          </Link>
          {!isMobile && (
            <CartIcon
              style={{
                justifyContent: isMobile ? "center" : "flex-start",
                width: openSearch && openIn === pathname ? "92vw" : "25vw",
              }}
            >
              {!isMobile &&
                pathname !== "/products" &&
                pathname !== "/login" &&
                pathname !== "/register" && (
                  <Search setOpenSearch={setOpenSearch} />
                )}

              {pathname !== "/login" && pathname !== "/register" && (
                <div
                  style={{
                    width: pathname !== "/products" ? "auto" : "100%",
                    height: "30px",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    marginLeft: "24px",
                    position: "relative",
                    opacity: openSearch && pathname === "/" ? 0 : 1,
                    transform: `scale(${
                      openSearch && pathname === "/" ? 0 : 1
                    })`,
                    transition: "ease-out 50ms",
                  }}
                >
                  <Link
                    to={"/cart"}
                    onClick={
                      pathname !== "/cart"
                        ? () => setPageLoading(true)
                        : undefined
                    }
                  >
                    <CustomBadge
                      badgeContent={order?.items.length}
                      invisible={order?.items.length > 0 ? false : true}
                    >
                      <IoBag
                        size={24}
                        className="link"
                        color={theme.primaryText}
                        style={{
                          cursor: "pointer",
                          position: "relative",
                          bottom: "2px",
                        }}
                      />
                    </CustomBadge>
                  </Link>
                </div>
              )}
            </CartIcon>
          )}
          {isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                marginRight: "4px",
              }}
            >
              <CartIcon
                style={{
                  justifyContent: "center",
                }}
              >
                {!isMobile &&
                  pathname !== "/products" &&
                  pathname !== "/login" &&
                  pathname !== "/register" && (
                    <Search setOpenSearch={setOpenSearch} />
                  )}

                {pathname !== "/login" && pathname !== "/register" && (
                  <div
                    style={{
                      width: pathname !== "/products" ? "auto" : "100%",
                      height: "30px",
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      marginLeft: "24px",
                      position: "relative",
                      opacity: openSearch && pathname === "/" ? 0 : 1,
                      transform: `scale(${
                        openSearch && pathname === "/" ? 0 : 1
                      })`,
                      transition: "ease-out 50ms",
                    }}
                  >
                    <Link
                      to={"/cart"}
                      onClick={
                        pathname !== "/cart"
                          ? () => setPageLoading(true)
                          : undefined
                      }
                    >
                      <CustomBadge
                        badgeContent={order?.items.length}
                        invisible={order?.items.length > 0 ? false : true}
                      >
                        <IoBag
                          size={24}
                          className="link"
                          color={theme.primaryText}
                          style={{
                            cursor: "pointer",
                            position: "relative",
                            bottom: "2px",
                          }}
                        />
                      </CustomBadge>
                    </Link>
                  </div>
                )}
              </CartIcon>
              <CgMenuRight
                style={{
                  fontSize: "28px",
                  color: theme.primaryText,
                  zIndex: 10,
                }}
                size={32}
                onClick={() => setOpenMenu(true)}
              />
            </div>
          )}
        </nav>
      </HeadRoom>
    </Container>
  );
}

const Container = styled.div`
  oveflow-x: hidden;

  @keyframes growWidth {
    from {
      width: 0%;
    }
    to {
      width: 100%;
    }
  }
  .loading-bar {
    animation: growWidth 0.5s ease forwards;
  }
`;

const LinksContainer = styled.div`
  display: flex;
  align-items: center;

  gap: 16px;
  letter-spacing: 0.4px;
  color: #f1f1f1;
  font-size: 14px;

  .link {
    text-decoration: none;
    &:hover {
      filter: brightness(0.8);
    }
  }
`;

const CartIcon = styled.div`
  height: 60px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: ease-out 300ms;

  .link {
    text-decoration: none;
    &:hover {
      filter: brightness(0.8);
    }
  }
`;
