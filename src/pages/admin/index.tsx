import ConfirmPopup from "../../components/confirmPopup";
import { useAdminContext } from "../../context/adminContext";
import { useAppContext } from "../../context/app";
import { useTheme } from "../../context/theme";
import { lazy, useEffect, useState } from "react";
import { MdArrowRight, MdList } from "react-icons/md";
import styled from "styled-components";
import Filter from "./filter";
import MobileFilter from "./mobileFilter";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const Admin = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.search.includes("overview")) {
      return;
    }
    const us = localStorage.getItem("eStore:currentUser");
    const user = us && JSON.parse(us);

    if (!user) {
      if (!user?.admin) {
        console.log("go");
        navigate("/");
      } else {
        navigate("/login");
      }
    }
  }, []);
  // confirm popup
  const { confirm, setPageLoading, storeInfo, activeLanguage, isMobile } =
    useAppContext();

  // admin context
  const { openedImage, setOpenedImage, setOpenFilter } = useAdminContext();

  // theme
  const { theme } = useTheme();

  // navigate
  const navigate = useNavigate();

  const query = window.location.pathname;

  const [activeTab, setActiveTab] = useState("Orders");

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 1500);
  }, [query]);

  return (
    <Container style={{ background: theme.background }}>
      {openedImage?.length > 0 && (
        <div
          onClick={() => setOpenedImage("")}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 999999,
            backdropFilter: "blur(100px)",
            WebkitBackdropFilter: "blur(100px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100vh",
            cursor: "pointer",
          }}
        >
          {
            <div
              style={{
                height: "512px",
                width: "512px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                position: "relative",
                borderRadius: "8px",
              }}
            >
              <img
                src={openedImage}
                alt="Preview"
                width={"100%"}
                height={"100%"}
                style={{
                  objectFit: "cover",
                  cursor: "pointer",
                }} // Ensures the image covers the container
              />
            </div>
          }
        </div>
      )}
      {/**Delete account confirm popup */}
      <ConfirmPopup
        text={confirm?.text}
        agree={confirm?.agree}
        close={confirm?.close}
        open={confirm.active}
      />
      {/** Header */}
      <div
        style={{
          width: "100%",
          height: "70px",
          borderBottom: `1px solid ${theme.line}`,
          boxSizing: "border-box",
          padding: isMobile ? "8px" : "16px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: theme.primaryText,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {isMobile && (
            <MdList
              color={theme.primaryText}
              size={32}
              onClick={() => setOpenFilter(true)}
              style={{ marginLeft: "8px" }}
            />
          )}
          <h1
            style={{
              fontSize: isMobile ? "18px" : "20px",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
            }}
          >
            {activeLanguage.admin}
            <MdArrowRight />
            <span style={{ color: theme.secondaryText }}>
              {activeLanguage[query.split("/")[2]]}
            </span>
          </h1>
        </div>
        <img
          onClick={() => navigate("/")}
          src={storeInfo?.logo}
          width={isMobile ? 60 : "100%"}
          alt="nike"
          style={{ maxWidth: "80px" }}
        />
      </div>
      {/** Content */}
      <div
        style={{
          display: "flex",
          gap: "24px",
          padding: isMobile ? "0px" : "24px 24px 24px 0",
        }}
      >
        {!isMobile && (
          <Filter activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        {isMobile && (
          <MobileFilter activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
        <Outlet />
      </div>
    </Container>
  );
};

const Container = styled.div`
  position: fixed;
  width: 100%;
  box-sizing: border-box;
  min-height: 100vh;
  overflow-x: hidden;
`;

export default Admin;
