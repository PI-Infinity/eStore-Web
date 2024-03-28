"use client";

import { ProductCard } from "../../components/productCard";
import { useAppContext } from "../../context/app";
import { useCurrentUserContext } from "../../context/currentUser";
import { useProductsContext } from "../../context/productsContext";
import { useTheme } from "../../context/theme";
import { useEffect, useState } from "react";
import { IoMdArrowDropupCircle } from "react-icons/io";
import { BarLoader, BounceLoader } from "react-spinners";
import styled from "styled-components";

/**
 *
 * @param context products list
 * @returns
 */

interface PropsTypes {
  setLoading: (isLoading: boolean) => void;
  loading: boolean;
}

const ProductsList: React.FC<PropsTypes> = ({}) => {
  // theme
  const { theme } = useTheme();

  // products context, includes filters
  const { products, containerRef, loadMore, loadProducts } =
    useProductsContext();
  const { setPageLoading, isMobile } = useAppContext();

  const { currentUser } = useCurrentUserContext();

  // go to top
  const [showTopButton, setShowTopButton] = useState(false);

  // Effect to handle window scroll
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setShowTopButton(true);
      } else {
        setShowTopButton(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Function to scroll back to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  }, [products?.length]);

  return (
    <Container ref={containerRef}>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: isMobile ? "center" : "auto",
          width: "100%",
          overflow: "hidden",
          flexWrap: "wrap",
          gap: isMobile ? "3vw" : "1vw",
        }}
      >
        {!loadProducts && products?.length > 0 ? (
          products?.map((item: any, index: number) => (
            <ProductCard item={item} key={index} page="products" />
          ))
        ) : !loadProducts && products?.length < 1 ? (
          <div
            style={{
              color: theme.secondaryText,
              margin: "16px",
              height: isMobile ? "40vh" : "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            Products not found!
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "16px",
              padding: "40px",
              height: isMobile ? "40vh" : "auto",
            }}
          >
            <BarLoader color={theme.primary} height={6} />
          </div>
        )}
      </div>
      {loadMore && (
        <div
          style={{
            width: "100%",
            height: "120px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BounceLoader size={30} color={theme.primary} />
        </div>
      )}

      <IoMdArrowDropupCircle
        color={theme.primaryText}
        onClick={scrollToTop}
        size={40}
        className="icon"
        style={{
          transform: `scale(${showTopButton ? 1 : 0})`,
          opacity: showTopButton ? 1 : 0,
          transition: "ease-in 200ms",
          position: "fixed",
          right: isMobile ? "12px" : "29px",
          bottom:
            isMobile && !currentUser?.admin?.active
              ? "70px"
              : isMobile && currentUser?.admin?.active
              ? "24px"
              : !isMobile && currentUser?.admin?.active
              ? "32px"
              : "84px",
          cursor: "pointer",
          zIndex: 1000,
          // Additional styling can be added here
        }}
      />
    </Container>
  );
};

export default ProductsList;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 69vw;
  overflow: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
  }

  .icon {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;
