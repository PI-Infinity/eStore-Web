import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/app";
import { useProductsContext } from "../../context/productsContext";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const CoverSlider = () => {
  // const router = useRouter();
  const { setPageLoading, storeInfo, isMobile } = useAppContext();

  const navigate = useNavigate();

  const {
    setSex,
    setPrice,
    setSale,
    setActiveCategory,
    setActiveSubCategory,
    setRating,
    setSize,
    setColor,
    setBrand,
  } = useProductsContext();

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    // Attempt to play the video on component mount
    const video = videoRef.current;
    if (video) {
      video?.play().catch((error) => console.error("Video play failed", error));
    }
  }, []);

  return (
    <SliderContainer
      onClick={() => {
        setPageLoading(true);
        setSex([]);
        setPrice([0, 1000]);
        setSale([0, 100]);
        setActiveCategory("");
        setActiveSubCategory([]);
        setBrand([]);
        setRating([0, 5]);
        setSize([]);
        setColor([]);
      }}
    >
      {isMobile ? (
        <ImageContainer
          style={{ width: "100vw", height: "125vw" }}
          onClick={() =>
            navigate(
              storeInfo?.content?.covers?.coverMobile?.link || "/products"
            )
          }
        >
          {storeInfo?.content?.covers.mobileCover.type === "video" ? (
            <video
              key={storeInfo?.content?.covers.mobileCover.url}
              ref={videoRef}
              controls={false}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100vw",
                height: "125vw",
                objectFit: "cover",
              }}
            >
              <source
                src={storeInfo?.content?.covers.mobileCover.url}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              className="img"
              alt="Cosmetics"
              src={storeInfo?.content?.covers?.mobileCover?.url}
              style={{
                objectFit: "cover",
                width: "100vw",
                height: "125vw",
              }} // Ensures the image covers the container
            />
          )}
        </ImageContainer>
      ) : (
        <ImageContainer
          onClick={() =>
            navigate(
              storeInfo?.content?.covers?.desktopCover?.link || "/products"
            )
          }
        >
          {storeInfo?.content?.covers.desktopCover.type === "video" ? (
            <video
              key={storeInfo?.content?.covers.desktopCover.url}
              ref={videoRef}
              controls={false}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: "100%",
                aspectRatio: isMobile ? 0.5 : 1.5,
                objectFit: "cover",
              }}
            >
              <source
                src={storeInfo?.content?.covers.desktopCover.url}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img
              className="img"
              alt="Cosmetics"
              src={storeInfo?.content?.covers?.desktopCover?.url}
              style={{
                objectFit: "cover",

                width: "100%",
                aspectRatio: isMobile ? 0.5 : 1.5,
              }} // Ensures the image covers the container
            />
          )}
        </ImageContainer>
      )}
    </SliderContainer>
  );
};

export default CoverSlider;

const SliderContainer = styled.div`
  width: 100vw;
  height: 650px;
  display: flex;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  @media (max-width: 768px) {
    flex-direction: column;
    height: 125vw;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  .img {
    transition: ease-in 300ms;
    @media (max-width: 768px) {
      width: 100%;
    }

    &:hover {
      transform: scale(1.1);
      filter: brightness(0.9);
    }
  }
`;
