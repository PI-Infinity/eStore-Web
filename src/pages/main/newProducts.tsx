import React, { useEffect, useRef } from "react";
import { BounceLoader } from "react-spinners";
import { ProductCard } from "../../components/productCard";
import { useTheme } from "../../context/theme";
import { useAppContext } from "../../context/app";
import { useProductsContext } from "../../context/productsContext";
import { ArrowDropDown } from "@mui/icons-material";
import styled from "styled-components";

const ProductsList: React.FC = () => {
  const { theme } = useTheme();
  const { isMobile, activeLanguage } = useAppContext();

  const { products, setRender } = useProductsContext();

  useEffect(() => {
    setRender((prev: boolean) => !prev);
  }, []);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const scrollContainer = scrollContainerRef.current;
      const startScrollPosition =
        (scrollContainer.scrollWidth - scrollContainer.clientWidth) / 2;
      scrollContainer.scrollLeft = startScrollPosition;
    }
  }, [products]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth * 0.5; // 5% of viewport width
      scrollContainerRef.current.scrollLeft -= scrollAmount;
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = window.innerWidth * 0.5; // 5% of viewport width
      scrollContainerRef.current.scrollLeft += scrollAmount;
    }
  };

  return (
    <>
      <div
        style={{
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          margin: isMobile ? "16px 0 8px 0" : "24px 0",
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            color: theme.primaryText,
            fontWeight: "700",
            fontSize: "16px",
            letterSpacing: "0.5px",
          }}
        >
          {activeLanguage.newProducts}
        </h2>
        {/* <div
          style={{
            position: "absolute",
            marginLeft: "10vw",
            zIndex: 1,
          }}
          className="flex place-items-start before:w-full sm:before:w-[880px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[25vw] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"
        ></div> */}
      </div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        {!isMobile && (
          <ArrowDropDown
            sx={{
              fontSize: "40px",
              cursor: "pointer",
              color: theme.primary,
              transform: "rotate(90deg)",
            }}
            onClick={scrollLeft}
          />
        )}
        <Container
          ref={isMobile ? undefined : scrollContainerRef}
          style={{
            display: "flex",
            flexDirection: "row",
            width: isMobile ? "100%" : "90%",
            borderRadius: "15px",
            boxSizing: "border-box",
            padding: "15px",
            overflowY: "hidden",
            overflowX: "auto",
            gap: "15px",
            scrollBehavior: "smooth",
            // Hide scrollbars
            scrollbarWidth: "none", // For Firefox
            msOverflowStyle: "none", // For Internet Explorer and Edge
          }}
        >
          {products.map((item: any, index: number) => (
            <ProductCard item={item} key={index} />
          ))}
        </Container>
        {!isMobile && (
          <ArrowDropDown
            sx={{
              fontSize: "40px",
              cursor: "pointer",
              color: theme.primary,
              transform: "rotate(-90deg)",
            }}
            onClick={scrollRight}
          />
        )}
      </div>
    </>
  );
};

export default ProductsList;

const Container = styled.div`
  &::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;
