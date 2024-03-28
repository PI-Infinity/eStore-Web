"use client";

import StarIcon from "@mui/icons-material/Star";
import { Breadcrumbs, Stack } from "@mui/material";
import Rating from "@mui/material/Rating";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import styled from "styled-components";
import { useAppContext } from "../context/app";
import { useTheme } from "../context/theme";
import { useProductsContext } from "../context/productsContext";

export const ProductCard = (props: any) => {
  const { theme } = useTheme();
  const location = useLocation();

  // smooth load
  const [loading, setLoading] = useState(true);

  /**
   * change image with arrows
   */
  // Find the index of the cover image
  const coverIndex = props.item.gallery.findIndex((img: any) => img.cover);
  const hoverIndex = props.item.gallery.findIndex((img: any) => !img.cover);

  // Set the initial currentIndex to the cover image index, or 0 if none is found
  const [currentIndex, setCurrentIndex] = useState(
    coverIndex >= 0 ? coverIndex : 0
  );
  useEffect(() => {
    const coverIndex = props.item.gallery.findIndex((img: any) => img.cover);
    setCurrentIndex(coverIndex >= 0 ? coverIndex : 0);
  }, [props.item.gallery]);

  // define gallery length
  const galleryLength = props.item.gallery.length;

  const handleNext = (e: any) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex: any) => (prevIndex + 1) % galleryLength);
  };

  const handlePrev = (e: any) => {
    e.stopPropagation();
    setCurrentIndex(
      (prevIndex: any) => (prevIndex - 1 + galleryLength) % galleryLength
    );
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  // save scroll y position for back to the same position
  const { isMobile, storeInfo, setScrollY, setPageLoading, activeLanguage } =
    useAppContext();

  // categories
  const { categories } = useProductsContext();

  // hover on image mouse enter
  const [hover, setHover] = useState(false);

  // calculate sizes
  let height;
  let width;
  if (props.page === "products") {
    if (isMobile) {
      height = "120vw";
      width = "95vw";
    } else {
      height = "30vw";
      width = "22vw";
    }
  } else {
    if (isMobile) {
      height = "88vw";
      width = "60vw";
    } else {
      height = "22vw";
      width = "15vw";
    }
  }

  return (
    <Container
      width={width}
      height={height}
      style={{
        opacity: loading ? 0 : 1,
        transition: "ease-in 300ms",
        // border: `1px solid ${theme.lineDark}`,
      }}
    >
      {!props.item?.inStock?.some((i: any) => i.qnt > 0) ? (
        <div
          style={{
            color: theme.primary,
            fontWeight: "500",
            position: "absolute",
            right: "16px",
            top: isMobile ? "8px" : "16px",
            zIndex: 1000,
            fontSize: "14px",
          }}
        >
          {activeLanguage.soldOut}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            paddingBottom: "0.5vw",
            position: "absolute",
            right: "16px",
            top: isMobile ? "8px" : "16px",
            zIndex: 1000,
          }}
        >
          <SpanText
            style={{
              color: theme.secondaryText,
              fontSize: isMobile ? "16px" : "inherit",
            }}
            $primarytext={theme.primaryText}
          >
            {props?.item?.ratings}
          </SpanText>
          <Stack spacing={1}>
            <Rating
              name="half-rating-read"
              value={parseInt(props?.item?.ratings)}
              precision={0.1}
              readOnly
              size={isMobile ? "small" : "medium"}
              emptyIcon={
                <StarIcon
                  style={{ opacity: 0.55, color: theme.secondaryText }}
                  fontSize="inherit"
                />
              }
            />
          </Stack>
        </div>
      )}
      <ImageWrapper width={width} height={height}>
        <Link
          className={hoverIndex === -1 ? "img" : ""}
          to={`/products/${props.item._id}`}
          onClick={() => {
            setScrollY(window.scrollY);
            setPageLoading(true);
          }}
          style={{ position: "absolute", width: "100%", height: "100%" }}
        >
          {(hover
            ? props.item.gallery[hoverIndex !== -1 ? hoverIndex : currentIndex]
                ?.type
            : props.item.gallery[currentIndex]?.type
          )?.startsWith("video") ? (
            <video
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              key={
                hover
                  ? props.item.gallery[
                      hoverIndex !== -1 ? hoverIndex : currentIndex
                    ]?.url
                  : props.item.gallery[currentIndex]?.url
              }
              controls={false}
              autoPlay
              loop
              muted
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            >
              <source
                src={
                  hover
                    ? props.item.gallery[
                        hoverIndex !== -1 ? hoverIndex : currentIndex
                      ]?.url
                    : props.item.gallery[currentIndex]?.url || "/cosmetics.png"
                }
                type={
                  hover
                    ? props.item.gallery[
                        hoverIndex !== -1 ? hoverIndex : currentIndex
                      ]?.type
                    : props.item.gallery[currentIndex]?.type || "video/mp4"
                }
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              src={
                hover
                  ? props.item.gallery[
                      hoverIndex !== -1 ? hoverIndex : currentIndex
                    ]?.url
                  : props.item.gallery[currentIndex]?.url || "/cosmetics.png"
              }
              alt="Cosmetics"
              style={{ objectFit: "cover", aspectRatio: 1 }}
              width="100%"
            />
          )}
        </Link>
        {galleryLength > 1 && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: width,
              position: "absolute",
              bottom: 0,
              zIndex: 1000,
              boxSizing: "border-box",
              padding: "8px",
            }}
          >
            <ArrowButton
              onClick={(e) => handlePrev(e)}
              $primary={theme.primary}
              $primarytext={theme.primaryText}
              style={{ background: "none" }}
            >
              <BiSolidLeftArrow
                color={theme.dark}
                size={isMobile ? 16 : 18}
                className="icon"
              />
            </ArrowButton>
            <ArrowButton
              onClick={(e) => handleNext(e)}
              $primary={theme.primary}
              $primarytext={theme.primaryText}
              style={{ background: "none" }}
            >
              <BiSolidRightArrow
                color={theme.dark}
                size={isMobile ? 16 : 18}
                className="icon"
              />
            </ArrowButton>
          </div>
        )}
      </ImageWrapper>

      <Info
        style={{
          width: width,
          padding: isMobile ? "8px 16px 16px 16px" : "0px 16px 16px 16px",
          gap: isMobile ? "4px" : "0",
        }}
      >
        <div
          style={{
            paddingTop: "0.5vw",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            paddingBottom: "0.5vw",
          }}
        >
          <h2
            style={{
              whiteSpace: "nowrap",
              fontSize: "16px",
              fontWeight: "bold",
              width: "100%",
              overflow: "hidden",
              color: theme.primaryText,
              marginTop: isMobile ? "0px" : "8px",
            }}
          >
            {props.item.title}
          </h2>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {props.item.sale > 0 && (
                <SpanText
                  $primarytext={theme.primaryText}
                  style={{
                    fontSize: isMobile ? "14px" : "16px",
                    fontWeight: "bold",
                    color: theme.primaryText,
                  }}
                >
                  {storeInfo?.currency === "Dollar"
                    ? "$"
                    : storeInfo?.currency == "Euro"
                    ? "€"
                    : "₾"}
                  {props.item.price -
                    (props.item.price / 100) * props.item.sale}{" "}
                </SpanText>
              )}
              <SpanText
                $primarytext={theme.primaryText}
                style={{
                  fontSize: isMobile ? "14px" : "16px",
                  fontWeight: "500",
                  color:
                    props.item.sale > 0
                      ? theme.secondaryText
                      : theme.primaryText,
                  textDecoration: props.item.sale > 0 ? "line-through" : "none",
                }}
              >
                {storeInfo?.currency === "Dollar"
                  ? "$"
                  : storeInfo?.currency == "Euro"
                  ? "€"
                  : "₾"}
                {props.item.price}
              </SpanText>
            </div>
            {/* <SpanText
              style={{
                fontSize: isMobile ? "14px" : "16px",
                fontWeight: "500",
              }}
              $primarytext={theme.secondaryText}
            >
              {props.item.brand}
            </SpanText> */}
            {props.page === "products" && (
              <Breadcrumbs
                aria-label="breadcrumb"
                style={{
                  color: theme.secondaryText,
                  letterSpacing: "0.5px",
                  fontSize: isMobile ? "14px" : "16px",
                }}
              >
                <div color="inherit">
                  {
                    categories?.find(
                      (i: any) => i.item === props?.item?.category
                    ).label
                  }
                </div>
                <div>
                  {
                    categories
                      .flatMap((cat: any) => cat.subCategories)
                      ?.find(
                        (i: any) => i.item === props?.item?.subCategories[0]
                      ).label
                  }
                </div>
              </Breadcrumbs>
            )}
          </div>
        </div>
      </Info>
    </Container>
  );
};

interface ContainerProps {
  width: string;
  height: string;
}

interface ArrowButtonProps {
  $primary: string;
  $primarytext: string;
}
interface SpanTextProps {
  $primarytext: string;
}

const Container = styled.div<ContainerProps>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: space-between;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
`;

const ImageWrapper = styled.div<ContainerProps>`
  width: ${(props) => props.width};
  height: ${(props) => props.width};
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;

  .img {
    &:hover {
      filter: brightness(0.9);
    }
  }
`;

const ArrowButton = styled.button<ArrowButtonProps>`
  border: none;
  cursor: pointer;

  .icon {
    color: ${(props) => props.$primarytext};
    transition: ease-in 200ms;
    &:hover {
      color: ${(props) => props.$primary};
    }
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
`;

const SpanText = styled.p<SpanTextProps>`
  font-size: 16px;
  color: ${(props) => props.$primarytext};
  font-wright: 500;
`;
