"use client";

import SearchResult from "../../components/searchResult";
import { useAppContext } from "../../context/app";
import { useSearchDesignContext } from "../..//context/searchDesign";
import { useTheme } from "../../context/theme";
import { useEffect } from "react";
import styled from "styled-components";
import CoverSlider from "./coverSlider";
import { MessageSlider } from "./messageSlider";
import ProductsList from "./newProducts";
import Categories from "./categories";
import { useProductsContext } from "../../context/productsContext";
import { useCurrentUserContext } from "../../context/currentUser";

/**
 *
 * @returns Main page of store
 */

export default function MainPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // app context
  const { setOpenBackDrop, storeInfo, isMobile, setPageLoading } =
    useAppContext();

  // current user
  const { currentUser } = useCurrentUserContext();

  // theme
  const { theme } = useTheme();

  // pathname
  const pathname = window.location.pathname;

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

  useEffect(() => {
    setOpenBackDrop({ active: false });
    setSex(["Men"]);
    setPrice([0, 1000]);
    setSale([0, 100]);
    setActiveCategory("");
    setActiveSubCategory([]);
    setBrand([]);
    setRating([0, 5]);
    setSize([]);
    setColor([]);
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  }, []);

  // main page advertisments

  let sliders = storeInfo?.advertisements?.filter(
    (i: any) => i.page === "Main" && i.active
  );

  if (sliders?.length > 0) {
    if (currentUser) {
      sliders = sliders?.filter(
        (i: any) => i.users === "Auth" || i.users === "All"
      );
    } else {
      sliders = sliders?.filter(
        (i: any) => i.users === "No Auth" || i.users === "All"
      );
    }
  }

  return (
    <Main>
      {sliders?.length > 0 && <MessageSlider sliders={sliders} />}
      <CoverSlider />
      <div
        style={{
          width: isMobile ? "100%" : "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: isMobile ? "24px" : "24px 0",
        }}
      >
        <h1
          style={{
            width: isMobile ? "70%" : "auto",
            fontSize: isMobile ? "40px" : "48px",
            fontWeight: "900",
            letterSpacing: isMobile ? "-1px" : "-2px",
            marginTop: "24px",
            color: theme.primaryText,
            textAlign: "center",
            lineHeight: isMobile ? "42px" : "auto",
          }}
        >
          {storeInfo?.description}
        </h1>
      </div>

      <ProductsList />
      <Categories />
      {/* <Brands /> */}
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  margin-bottom: 56px;
  overflow-x: hidden;

  @keyframes growWidth {
    from {
      width: 0%;
    }
    to {
      width: 100%;
    }
  }
  .loading-bar {
    animation: growWidth 0.3s ease forwards;
  }
`;
