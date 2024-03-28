import Tooltip from "@mui/material/Tooltip";
import React, { useEffect, useState } from "react";
import { MdFileCopy } from "react-icons/md";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { useAppContext } from "../../../context/app";
import { useTheme } from "../../../context/theme";

interface PropsType {
  productId: string;
}

const ShareComponent: React.FC<PropsType> = ({ productId }) => {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const { theme } = useTheme();

  const { backendUrl } = useAppContext();

  const textToCopy = backendUrl + "/api/v1/" + productId;

  const handleCopyClick = () => {
    const textArea = document.createElement("textarea");
    textArea.value = textToCopy;

    // Prevent scrolling to bottom of page in MS Edge.
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        console.log("Text successfully copied to clipboard");
        setIsTooltipOpen(true);
        setTimeout(() => {
          setIsTooltipOpen(false);
        }, 2000);
      } else {
        console.error("Failed to copy text.");
      }
    } catch (err) {
      console.error("Could not copy text: ", err);
    }

    document.body.removeChild(textArea);
  };

  const [transition, setTransition] = useState(true);

  useEffect(() => {
    setTransition(false);
  }, []);

  return (
    <div
      style={{
        height: transition ? 0 : "50px",
        opacity: transition ? 0 : "1",
        transform: `scale(${transition ? 0 : "1"})`,
        transition: "ease 200ms",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: `${transition ? "0" : "10px 0 0 0"}`,
        gap: "10px",
      }}
    >
      {/* Fallback social media share buttons */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <FacebookShareButton url={textToCopy}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton url={textToCopy}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <EmailShareButton url={textToCopy}>
          <EmailIcon size={32} round />
        </EmailShareButton>
        <TelegramShareButton url={textToCopy}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        <WhatsappShareButton url={textToCopy}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
      <Tooltip title="Copied!" open={isTooltipOpen}>
        <button
          onClick={handleCopyClick}
          style={{
            padding: "4px 8px",
            borderRadius: "10px",
            background: theme.secondaryText,
            outline: "none",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "4px",
          }}
        >
          <MdFileCopy />
          Copy
        </button>
      </Tooltip>
    </div>
  );
};

export default ShareComponent;
