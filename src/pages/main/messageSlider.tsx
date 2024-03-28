import { useAppContext } from "../../context/app";
import { useTheme } from "../../context/theme";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";

const slideIn = keyframes`
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const SliderContainer = styled.div`
  overflow: hidden;
  width: 100%;
  position: relative;
  height: 54px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    height: 48px;
  }
`;

const Message = styled.div<{ $inProp: boolean; $visible: boolean }>`
  opacity: 0;
  position: absolute;
  width: 100%;
  display: flex;
  // flex-direction: column;
  text-align: center;
  justify-content: center;
  font-weight: 500;
  gap: 8px;

  .link {
    &:hover {
      filter: brightness(0.9);
    }
  }

  ${({ $visible }) =>
    $visible &&
    css`
      visibility: hidden;
    `}
  ${({ $inProp }) =>
    $inProp
      ? css`
          animation: ${slideIn} 0.3s ease-out forwards;
        `
      : css`
          animation: ${slideOut} 0.3s ease-out forwards;
        `};
`;

export const MessageSlider = ({ sliders }: any) => {
  // slide animation
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animateOut, setAnimateOut] = useState(false);

  // theme
  const { theme } = useTheme();

  const { language, isMobile } = useAppContext();

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setAnimateOut(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % sliders.length);
        setAnimateOut(false);
      }, 500); // Matches the animation duration
    }, 5000); // Change slide every 3 seconds

    return () => clearInterval(slideInterval);
  }, []);

  return (
    <SliderContainer
      style={{ color: theme.primaryText, background: theme.lightBackground }}
    >
      {sliders.map((slide: any, index: number) => (
        <Message
          $inProp={index === currentSlide && !animateOut}
          $visible={index !== currentSlide}
          key={slide.title}
        >
          {slide.title[language as keyof typeof slide.title]}
          <Link
            to={slide.link}
            className="link"
            style={{
              textDecoration: "none",
              cursor: "pointer",
              color: theme.primary,
              // fontSize: "14px",
            }}
          >
            {
              slide.linkButtonTitle[
                language as keyof typeof slide.linkButtonTitle
              ]
            }
          </Link>
        </Message>
      ))}
    </SliderContainer>
  );
};
