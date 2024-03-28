"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import { useAppContext } from "../../context/app";
import { useProductsContext } from "../../context/productsContext";
import { useTheme } from "../../context/theme";
import Search from "../../pages/products/search";
import Filter from "./filter";
import MobileFilter from "./mobileFilter";
import ProductsList from "./productsList";

export default function Products() {
  // loading
  const [loading, setLoading] = useState(true);

  // go to save scroll y position
  const { isMobile } = useAppContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Main>
      {isMobile && <MobileFilter />}

      <Container
        style={{
          padding: isMobile ? "8px 0" : "20px",
          width: isMobile ? "100%" : "auto",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: isMobile ? "0 8px" : "0",
          }}
        >
          <Search />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
            gap: "20px",
          }}
        >
          {!isMobile && <Filter />}
          <ProductsList setLoading={setLoading} loading={loading} />
        </div>
      </Container>
    </Main>
  );
}

const Main = styled.main`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .icon {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;
