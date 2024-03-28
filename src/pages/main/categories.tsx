import { useProductsContext } from "../../context/productsContext";
import { useTheme } from "../../context/theme";
import React from "react";
import styled from "styled-components";
import Shoes from "../../assets/shoes.jpg";
import Clotches from "../../assets/clotches.jpg";
import Accessories from "../../assets/accessories.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/app";
import Button from "../../components/button";

const Categories: React.FC = () => {
  const { theme } = useTheme();

  const navigate = useNavigate();

  // app context
  const { setPageLoading, activeLanguage, isMobile } = useAppContext();

  // product context
  const {
    setSex,
    setPrice,
    setSale,
    setActiveCategory,
    setActiveSubCategory,
    setRating,
    setSize,
    setColor,
    categories,
    setBrand,
  } = useProductsContext();

  return (
    <Container>
      <div
        style={{
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          margin: isMobile ? "0 0 24px 0" : "24px 0",
          boxSizing: "border-box",
          position: "relative",
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
          {activeLanguage.categories}
        </h2>
        {/* <div
          style={{
            position: "absolute",
            top: "-40px",
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
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "center",
          alignItems: "center",
          gap: "24px",
          zIndex: 2,
        }}
      >
        {categories?.map((item: any, index: number) => {
          return (
            <div
              style={{
                width: isMobile ? "90%" : "29%",
                borderRadius: "15px",
                aspectRatio: 1,
                cursor: "pointer",
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
              key={index}
            >
              <ImageWrapper>
                <div
                  // to={`/products`}
                  style={{
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                  }}
                >
                  <img
                    onClick={() => {
                      setPageLoading(true);
                      setSex([]);
                      setPrice([0, 1000]);
                      setSale([0, 100]);
                      setActiveCategory(item.item);
                      setActiveSubCategory([]);
                      setBrand([]);
                      setRating([0, 5]);
                      setSize([]);
                      setColor([]);
                    }}
                    src={
                      item.item === "Shoes"
                        ? Shoes
                        : item.item === "Clotches"
                        ? Clotches
                        : Accessories
                    }
                    alt="category"
                    className="img"
                    style={{
                      objectFit: "cover",
                      borderRadius: "15px",
                      aspectRatio: 1,
                    }}
                    width={"100%"}
                  />
                </div>
                <div
                  style={{
                    position: "absolute",
                    zIndex: 10000,
                    bottom: "45%",
                    left: isMobile ? "17%" : "25%",
                    boxSizing: "border-box",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: "250px",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      borderRadius: "50px",
                    }}
                  >
                    <Button
                      title={item.label}
                      background="transparent"
                      color={theme.primaryText}
                      disabled={false}
                      onClick={() => {
                        setPageLoading(true);
                        setSex([]);
                        setPrice([0, 1000]);
                        setSale([0, 100]);
                        setActiveCategory(item.item);
                        setActiveSubCategory([]);
                        setBrand([]);
                        setRating([0, 5]);
                        setSize([]);
                        setColor([]);
                        navigate("/products");
                        // routes.push("/products");
                      }}
                    />
                  </div>
                </div>
              </ImageWrapper>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

export default Categories;

const Container = styled.div`
  margin-top: 32px;
  width: 100%;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  .img {
    transition: ease-in 300ms;
    overflow: hidden;

    &:hover {
      transform: scale(1.2);
    }
  }
`;
