// pages/products/[id]/index.tsx
// import { GetServerSideProps } from "next";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTheme } from "../../../context/theme";
// import { FetchProduct } from "../../../fetch/product";
// Placeholder imports for Gallery, Info, and Reviews components
import { Breadcrumbs } from "@mui/material";
import axios from "axios";
import { Link } from "react-router-dom";
import ConfirmPopup from "../../../components/confirmPopup";
import { useAppContext } from "../../../context/app";
import { useCurrentUserContext } from "../../../context/currentUser";
import { useProductsContext } from "../../../context/productsContext";
import Gallery from "./gallery";
import Info from "./info";
import Reviews from "./reviews";
import { BarLoader } from "react-spinners";

interface ItemContainerProps {
  secondarytext: string;
}

const ProductPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  // product
  const { theme } = useTheme();
  const { setPageLoading, backendUrl, activeLanguage, confirm, isMobile } =
    useAppContext();
  const { currentUser } = useCurrentUserContext();

  // user actions
  const [actions, setActions] = useState(null);

  // product

  const [product, setProduct] = useState({
    _id: "",
    category: "",
    subCategories: "",
    title: "",
    description: { ka: "" },
  });

  const [loading, setLoading] = useState(true);

  const productId = window.location.pathname.split("/")[2];

  useEffect(() => {
    const GetProduct = async () => {
      try {
        const response = await axios.get(
          backendUrl + "/api/v1/products/" + productId
        );
        if (response.data.status === "success") {
          setProduct(response.data.data.product);
          setLoading(false);
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    GetProduct();
  }, [productId]);

  // check current user actions in product
  useEffect(() => {
    const CheckProduct = async () => {
      try {
        const response = await axios.get(
          backendUrl +
            "/api/v1/products/check/" +
            product?._id +
            "?user=" +
            currentUser._id
        );
        setActions(response.data.data);
      } catch (error: any) {
        console.log(error.response.data.message);
        console.log("product check error: " + error);
      }
    };
    if (currentUser && product._id?.length > 0) {
      CheckProduct();
    }
  }, [currentUser, product]);

  // product context
  const { categories } = useProductsContext();
  const {
    colors,
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
    setTimeout(() => {
      setPageLoading(false);
    }, 500);
  }, [product]);

  return (
    <Main>
      {loading ? (
        <div
          style={{
            width: "100%",
            height: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BarLoader height={6} color={theme.primary} />
        </div>
      ) : (
        <Container
          style={{
            gap: isMobile ? "8px" : "20px",
            width: isMobile ? "100vw" : "85vw",
            padding: isMobile ? "16px 8px 8px 8px" : "24px",
          }}
        >
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              justifyContent: "center",
              border: isMobile ? "none" : `1px solid ${theme.lineDark}`,
              borderRadius: "20px",
              gap: isMobile ? "16px" : "24px",
              padding: isMobile ? "0px" : "24px",
            }}
          >
            {isMobile && (
              <Breadcrumbs
                aria-label="breadcrumb"
                style={{
                  width: "100%",
                  paddingLeft: "8px",
                  color: theme.secondaryText,
                  letterSpacing: "0.5px",
                  fontSize: isMobile ? "14px" : "16px",
                }}
              >
                <Link
                  to={"/products"}
                  color="inherit"
                  style={{ textDecoration: "none", color: "inherit" }}
                  onClick={() => {
                    setPageLoading(true);
                    setSex([]);
                    setPrice([0, 1000]);
                    setSale([0, 100]);
                    setActiveCategory(product?.category);
                    setActiveSubCategory([]);
                    setBrand([]);
                    setRating([0, 5]);
                    setSize([]);
                    setColor([]);
                  }}
                >
                  {
                    categories?.find((i: any) => i?.item === product?.category)
                      ?.label
                  }
                </Link>
                <Link
                  to={"/products"}
                  color="inherit"
                  style={{ textDecoration: "none", color: "inherit" }}
                  onClick={() => {
                    setPageLoading(true);
                    setSex([]);
                    setPrice([0, 1000]);
                    setSale([0, 100]);
                    setActiveCategory(product?.category);
                    setActiveSubCategory(product?.subCategories);
                    setBrand([]);
                    setRating([0, 5]);
                    setSize([]);
                    setColor([]);
                  }}
                >
                  {product?.subCategories &&
                    categories
                      ?.flatMap((cat: any) => cat?.subCategories)
                      ?.find((i: any) => i.item === product?.subCategories[0])
                      .label}
                </Link>
                <div
                  color="text.primary"
                  style={{
                    opacity: 0.3,
                    cursor: "default",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  {product?.title}
                </div>
              </Breadcrumbs>
            )}
            <div>
              <Gallery product={product} />
            </div>
            <Info product={product} actions={actions} setActions={setActions} />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: `1px solid ${theme.lineDark}`,
              borderRadius: "20px",
              minHeight: "200px",
              boxSizing: "border-box",
              padding: isMobile ? "16px" : "24px",
              width: "100%",
            }}
          >
            <ItemContainer secondarytext={theme.primaryText}>
              <span style={{ fontWeight: 600 }}>
                {activeLanguage.description}:{" "}
              </span>
              <p
                style={{
                  fontSize: "16px",
                  color: theme.primaryText,
                  marginLeft: "16px",
                }}
              >
                {product?.description?.ka}
              </p>
            </ItemContainer>
          </div>
          <Reviews actions={actions} product={product} />
          <ConfirmPopup
            text={confirm?.text}
            agree={confirm?.agree}
            close={confirm?.close}
            open={confirm.active}
          />
        </Container>
      )}
    </Main>
  );
};

export default ProductPage;

// Styled components
const Main = styled.main`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

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

const Container = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
`;

const ItemContainer = styled.div<ItemContainerProps>`
  display: flex;
  flex-direction: column;
  gap: 8px;

  & > span {
    font-size: 16px;
    color: ${(props) => props.secondarytext};
  }
`;
