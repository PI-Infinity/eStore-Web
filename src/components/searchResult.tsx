import { useAppContext } from "../context/app";
import { useProductsContext } from "../context/productsContext";
// import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { MdArrowDropUp } from "react-icons/md";
import { BounceLoader } from "react-spinners";
import styled from "styled-components";
import { useSearchDesignContext } from "../context/searchDesign";
import { useTheme } from "../context/theme";

const SearchResult: React.FC = () => {
  // search design
  const { openSearch } = useSearchDesignContext();
  const { openIn } = useSearchDesignContext();
  // route pathname
  const pathname = window.location.pathname;

  return <>{openSearch && openIn === pathname && <Wrapper />}</>;
};

const Wrapper = () => {
  // theme
  const { theme } = useTheme();
  // search design
  const { setOpenSearch, setOpenIn } = useSearchDesignContext();
  // app context
  const { setPageLoading, storeInfo, isMobile, setOpenMenu } = useAppContext();

  // loading products
  const [loading, setLoading] = useState(true);

  // route pathname
  const pathname = window.location.pathname;

  // products
  const { products, searchInput, setSearchInput } = useProductsContext();
  // transition
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    setTransition(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  return (
    <Container
      style={{
        background: theme.background,
        height: isMobile
          ? transition
            ? "auto"
            : "0"
          : transition
          ? "500px"
          : "0",
        padding: transition ? "24px 0" : "0",
        boxShadow: "1px 5px 10px 0 rgba(0,0,0,0.1)",
      }}
    >
      {!isMobile && (
        <img
          src={storeInfo?.logo}
          width={70}
          alt="nike"
          style={{
            position: "absolute",
            top: "16px",
            left: "24px",
            cursor: "pointer",
            transition: "ease-in 300ms",
            opacity: transition ? 1 : 0,
            transform: `scale(${transition ? 1 : 0})`,
            zIndex: 1000,
          }}
        />
      )}
      <MdArrowDropUp
        className="button"
        onClick={() => {
          setTransition(false);
          setOpenSearch(false);
          setOpenIn([]);
        }}
        size={isMobile ? 24 : 40}
        color={theme.primaryText}
        style={{
          position: "absolute",
          top: isMobile ? "6px" : "16px",
          right: isMobile ? "8px" : "16px",
          cursor: "pointer",
          transition: "ease-in 300ms",
          opacity: transition ? 1 : 0,
          transform: `scale(${transition ? 1 : 0})`,
          zIndex: 1000,
        }}
      />
      {searchInput?.length > 0 &&
        !products?.some((i: any) => i.title === searchInput) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: isMobile ? "start" : "center",
              gap: isMobile ? "8px" : "16px",
              boxSizing: "border-box",
              padding: isMobile ? "0 0 0 32px" : "0 0 16px 0",
              overflow: "hidden",
              height: isMobile ? "100%" : "50%",
            }}
          >
            {products?.map((item: any, index: number) => {
              if (index < 6) {
                return (
                  <div
                    onClick={() => setSearchInput(item.title)}
                    key={index}
                    style={{ cursor: "pointer" }}
                  >
                    <h2
                      style={{
                        fontWeight: "bold",
                        color: theme.primaryText,
                      }}
                    >
                      {item.title}
                    </h2>
                  </div>
                );
              }
            })}
          </div>
        )}
      {transition && (
        <div
          style={{
            display: isMobile ? "grid" : "flex",
            gridTemplateColumns: isMobile ? "1fr 1fr" : "auto",
            justifyItems: "center",
            width: "100%",
            gap: isMobile ? "8px" : "16px",
            alignItems: isMobile ? "start" : "center",
            justifyContent: "center",
            flexDirection: isMobile ? "column" : "row",
            overflowX: "auto",
            whiteSpace: "nowrap",
            height: isMobile ? "70vh" : "15vw",
            marginTop: isMobile ? "8px" : "0",
          }}
        >
          {loading ? (
            <div
              style={{
                width: "100vw",
                height: "70%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <BounceLoader color={theme.primaryText} size={40} />
            </div>
          ) : products.length > 0 ? (
            products?.map((item: any, index: number) => {
              let cover = item.gallery.find((i: any) => i.cover);
              if (index < 8) {
                return (
                  <div
                    key={index}
                    style={{
                      width: isMobile ? "48vw" : "10vw",
                      boxSizing: "border-box",
                      padding: "12px 8px",
                      // border: `1px solid ${theme.lineDark}`,
                      borderRadius: "10px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "2px",
                      background: theme.background,
                    }}
                  >
                    <ImageWrapper>
                      <Link
                        to={`/products/${item._id}`}
                        onClick={() => {
                          setPageLoading(true);
                          setOpenIn(pathname);
                          setOpenMenu(false);
                        }}
                      >
                        {cover?.type.includes("video") ? (
                          <video
                            key={cover?.url}
                            controls={false}
                            autoPlay
                            loop
                            playsInline
                            muted
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "10px",
                            }}
                          >
                            <source src={cover?.url} type={cover?.type} />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={cover?.url || "/cosmetics.png"}
                            alt={item?.title || "store"}
                            style={{ objectFit: "cover" }}
                            width="100%"
                          />
                        )}
                      </Link>
                    </ImageWrapper>
                    <h2
                      style={{
                        fontWeight: "bold",
                        marginTop: "8px",
                        color: theme.primaryText,
                      }}
                    >
                      {item.title}
                    </h2>
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                      }}
                    >
                      {item.sale > 0 && (
                        <SpanText
                          $primarytext={theme.primaryText}
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            color: theme.primaryText,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                          }}
                        >
                          {storeInfo?.currency === "Dollar"
                            ? "$"
                            : storeInfo?.currency == "Euro"
                            ? "€"
                            : "₾"}
                          {item.price - (item.price / 100) * item.sale}{" "}
                        </SpanText>
                      )}
                      <SpanText
                        $primarytext={theme.primaryText}
                        style={{
                          fontSize: "14px",
                          fontWeight: "bold",
                          color:
                            item.sale > 0
                              ? theme.secondaryText
                              : theme.primaryText,
                          textDecoration:
                            item.sale > 0 ? "line-through" : "none",
                        }}
                      >
                        {storeInfo?.currency === "Dollar"
                          ? "$"
                          : storeInfo?.currency == "Euro"
                          ? "€"
                          : "₾"}
                        {item.price}
                      </SpanText>
                    </div>
                  </div>
                );
              }
            })
          ) : (
            <div
              style={{
                position: "absolute",
                top: isMobile ? "30%" : "50%",
                left: isMobile ? "42%" : "47%",
                zIndex: 10001,
                fontWeight: "bold",
                color: theme.primaryText,
              }}
            >
              Not Found!
            </div>
          )}
        </div>
      )}
    </Container>
  );
};

export default SearchResult;

const Container = styled.div`
  width: 100vw;
  overflow: hidden;
  position: absolute;
  top: 96px;
  z-index: 100001;
  transition: ease-in 300ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: 100%;
    position: relative;
    top: 8px;
  }

  .button {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const ImageWrapper = styled.div`
  width: 8vw;
  height: 8vw;
  position: relative;
  overflow: hidden;
  transition: ease-in 200ms;
  border-radius: 10px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    width: 40vw;
    height: 40vw;
  }

  &:hover {
    opacity: 0.8;
  }
`;

interface SpanTextProps {
  $primarytext: string;
}

const SpanText = styled.p<SpanTextProps>`
  font-size: 16px;
  color: ${(props) => props.$primarytext};
  font-wright: 500;
`;
