import { useState } from "react";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import styled from "styled-components";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";

interface ArrowButtonProps {
  primary: string;
  primarytext: string;
}

const Gallery = ({ product }: any) => {
  //theme
  const { theme } = useTheme();

  const { isMobile } = useAppContext();

  // gallery configs
  /**
   * change image with arrows
   */

  // Set the initial currentIndex to the cover image index, or 0 if none is found
  const [currentIndex, setCurrentIndex] = useState(0);

  // define gallery length
  const galleryLength = product?.gallery?.length;

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

  const renderGallery = () => {
    const gallery = product?.gallery || [];
    const coverImage = gallery.find((img: any) => img.cover);
    const nonCoverImages = gallery.filter((img: any) => !img.cover);

    // If there's a cover image, place it at the start of the array
    if (coverImage) {
      return [coverImage, ...nonCoverImages];
    }

    return gallery; // Return the original gallery if no cover image is found
  };
  const sortedGallery = renderGallery();
  return (
    <div
      style={{
        width: isMobile ? "100%" : "550px",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          color: "red",
          fontWeight: "500",
          position: "absolute",
          top: "16px",
          right: "16px",
          zIndex: 1000,
        }}
      >
        {!product?.inStock?.some((i: any) => i.qnt > 0) && "Sold out"}
      </div>
      <ImageWrapper
        style={{
          borderRadius: isMobile ? "15px" : "0px",
          width: isMobile ? "100%" : "550px",
          height: isMobile ? "100%" : "550px",
        }}
      >
        {sortedGallery[currentIndex]?.type.includes("video") ? (
          <video
            key={sortedGallery[currentIndex].url}
            controls={false}
            autoPlay
            loop
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: isMobile ? "15px" : "20px",
            }}
          >
            <source
              src={sortedGallery[currentIndex]?.url}
              type={sortedGallery[currentIndex]?.type}
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={sortedGallery[currentIndex]?.url || "/cosmetics.png"}
            alt={product?.title || "store"}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: isMobile ? "15px" : "20px",
            }}
          />
        )}
        {galleryLength > 1 && (
          <div
            style={{
              width: isMobile ? "100%" : "550px",
              height: "90px",
              position: "absolute",
              bottom: "0px",
              boxSizing: "border-box",
              padding: "8px",
              background: "rgba(0,0,0,0.02)",
              overflowX: "auto",
              overflowY: "hidden",
              // Additional properties for better scrolling support
              whiteSpace: "nowrap", // Prevents wrapping of child elements
            }}
          >
            {sortedGallery.map((item: any, index: number) => (
              <ImgContainer
                key={index}
                color={currentIndex === index ? "0.9" : "1"}
                onMouseEnter={() => setCurrentIndex(index)}
              >
                {item.type.includes("video") ? (
                  <video
                    key={item.url}
                    controls={false}
                    autoPlay
                    loop
                    playsInline
                    muted
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "5px", // Match your NextImage styles if necessary
                    }}
                  >
                    <source src={item.url} type={item?.type} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      position: "relative",
                    }}
                  >
                    <img
                      src={item?.url || "/placeholder.png"}
                      alt={product?.title || "Product image"}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        aspectRatio: 1,
                      }} // Ensures the image covers the container
                      // sizes="(max-width: 768px) 1000%, (max-width: 1200px) 100%, 100%"
                    />
                  </div>
                )}
              </ImgContainer>
            ))}
          </div>
        )}
      </ImageWrapper>
      {galleryLength > 1 && (
        <div
          style={{
            width: isMobile ? "100%" : "550px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "absolute",
            boxSizing: "border-box",
            padding: "8px",
          }}
        >
          <ArrowButton
            onClick={(e) => handlePrev(e)}
            primary={theme.primary}
            primarytext={theme.primaryText}
          >
            <BiSolidLeftArrow
              size={isMobile ? 20 : 28}
              className="icon"
              color={"#fff"}
            />
          </ArrowButton>
          <ArrowButton
            onClick={(e) => handleNext(e)}
            primary={theme.primary}
            primarytext={theme.primaryText}
          >
            <BiSolidRightArrow
              size={isMobile ? 20 : 28}
              className="icon"
              color={"#fff"}
            />
          </ArrowButton>
        </div>
      )}
    </div>
  );
};

export default Gallery;

const ImageWrapper = styled.div`
  position: relative;
  overflow: hidden;
  transition: ease-in 200ms;
`;

const ArrowButton = styled.button<ArrowButtonProps>`
  border: none;
  cursor: pointer;
  background: rgba(0, 0, 0, 0.1);
  padding: 8px;
  border-radius: 50px;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  .icon {
    color: ${(props) => props.primarytext};
    transition: ease-in 200ms;

    &:hover {
      color: ${(props) => props.primary};
    }
  }
`;

const ImgContainer = styled.div`
  width: 70px;
  height: 70px;
  overflow: hidden;
  border-radius: 5px;
  display: inline-block;
  justify-content: center;
  align-items: center;
  margin-right: 8px;
  opacity: ${(props: any) => props.color};

  &:hover {
    opacity: 0.8;
  }
`;
