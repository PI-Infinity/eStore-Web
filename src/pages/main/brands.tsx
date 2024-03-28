import { useAppContext } from "../../context/app";
import { useProductsContext } from "../../context/productsContext";
import { useTheme } from "../../context/theme";
import { Link } from "react-router-dom";
import React from "react";
import styled from "styled-components";

export default function Brands() {
  const { theme } = useTheme();

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
    brands,
    setBrand,
  } = useProductsContext();

  // app context
  const { setPageLoading } = useAppContext();
  return (
    <Container>
      <div
        style={{
          width: "100vw",
          display: "flex",
          justifyContent: "center",
          margin: "24px 0",
          boxSizing: "border-box",
          position: "relative",
        }}
      >
        <h2
          style={{
            color: theme.primaryText,
            fontWeight: "500",
            fontSize: "16px",
            letterSpacing: "0.5px",
          }}
        >
          Brands
        </h2>
        <div
          style={{
            position: "absolute",
            top: "-40px",
            marginLeft: "10vw",
            zIndex: 1,
          }}
          className="flex place-items-start before:w-full sm:before:w-[880px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[25vw] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]"
        ></div>
      </div>
      <List>
        {brands?.map((item: any, index: number) => {
          return (
            <Link
              to={"/products"}
              onClick={() => {
                setPageLoading(true);
                setSex([]);
                setPrice([0, 1000]);
                setSale([0, 100]);
                setActiveCategory("");
                setActiveSubCategory([]);
                setRating([0, 5]);
                setSize([]);
                setColor([]);
                setBrand((prev: any) => [...prev, item]);
              }}
              className="hover"
              key={index}
              style={{
                color: theme.primaryText,
                fontSize: "40px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              {item}
            </Link>
          );
        })}
      </List>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 24px;
`;

const List = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 64px;
  z-index: 10;

  .hover {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;
